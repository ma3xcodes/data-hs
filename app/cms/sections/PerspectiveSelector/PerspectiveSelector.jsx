import React, {Fragment, useEffect, useRef, useState} from "react";
import {Button, Collapse, Dialog, Menu, MenuItem} from "@blueprintjs/core";
import {AnchorLink} from "@datawheel/canon-core";
import classNames from "classnames";
import PropTypes from "prop-types";
import {withNamespaces} from "react-i18next";
import ViewportList from "react-viewport-list";

import {perspectiveLevels, perspectiveLinksTo, perspectiveSublevels} from "./consts.js";

import "./PerspectiveSelector.css";
import {getEcDescriptionsData} from "../../hooks/getEcDescriptionsData.js";
import {getPerspectiveSelectorData, getPerspectiveSelectorContentData} from "../../hooks/getPerspectiveSelectorData.js";
import {MultiSelect} from "@blueprintjs/select";

const PerspectiveSelector = (props, context) => {
  const {heading, slug, t} = props;
  const {locale, onSetVariables} = context;

  const [showButton, setShowButton] = useState(false);
  const [isLoading, perspectiveSelectorContentData] = getPerspectiveSelectorContentData(locale);
  const [isLoadingData, perspectiveSelectorData] = getPerspectiveSelectorData(locale);
  const [isLoadingEcData, ecDescription] = getEcDescriptionsData(locale);
  const [isCollapseOpen, setIsCollapseOpen] = useState(true);
  const [isDescriptionCollapseOpen, setIsDescriptionCollapseOpen] = useState(false);
  const [isGlossaryDialogOpen, setIsGlossaryDialogOpen] = useState(false);
  const [selectedLevel, setSelectedLevel] = useState("");
  const [selectedGeo, setSelectedGeo] = useState([{id: 19, name: "Nuevo León"}]);
  const [selectedGeoSubLevel, setSelectedGeoSubLevel] = useState("State");
  const [selectedIndustry, setSelectedIndustry] = useState([{
    id: "5241",
    name: locale === "es" ? "Compañías de Seguros y Fianzas" : "Insurance and Surety Companies"
  }]);
  const [selectedIndustrySubLevel, setSelectedIndustrySubLevel] = useState("Industry Group");

  useEffect(() => {
    onSetVariables({
      perspectiveSelectorGeoLevel: selectedGeoSubLevel,
      perspectiveSelectorGeoMember: selectedGeo[0]
    });
  }, [selectedGeo]);

  useEffect(() => {
    onSetVariables({
      perspectiveSelectorIndustryLevel: selectedIndustrySubLevel,
      visibleAtBranchLevel: selectedIndustrySubLevel === "Industry Group",
      perspectiveSelectorIndustryMember: selectedIndustry[0]
    });
  }, [selectedIndustry]);

  useEffect(() => {
    window.addEventListener("scroll", () => {
      if (window.pageYOffset > 3000) {
        setShowButton(true);
      }
      else {
        setShowButton(false);
      }
    });
  }, []);

  const section = useRef();
  const viewPortRef = useRef();

  const filterItems = (query, item) => {
    const text = `${item.name} ${item.id}`.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    query = query.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    return text.toLowerCase().indexOf(query) >= 0;
  };

  const handleItemSelect = item => {
    if (selectedLevel === "geo") {
      if (item.id !== selectedGeo[0].id) {
        setSelectedGeo([item]);
        setIsDescriptionCollapseOpen(true);
      }
    }
    if (selectedLevel === "industry") {
      if (item.id !== selectedIndustry[0].id) {
        setSelectedIndustry([item]);
        setIsDescriptionCollapseOpen(true);
      }
    }
  };

  const itemListRenderer = ({activeItem, filteredItems, renderItem}) => {
    const activeIndex = filteredItems.indexOf(activeItem);

    if (filteredItems.length === 0) {
      return <div className="perspective-selector-no-results">
        <em>{t("CMS.CustomPerspectiveSelector.NoResults")}</em>
      </div>;
    }

    return <Menu
      ulRef={viewPortRef}
    >
      <ViewportList
        itemMinSize={30}
        items={filteredItems}
        initialIndex={activeIndex}
        viewPortRef={viewPortRef}
      >
        {(item, index) => <div
          key={item.id}
        >
          {renderItem(item, index)}
        </div>}
      </ViewportList>
    </Menu>;
  };

  const renderTag = item => item.name;
  const renderItem = (item, {modifiers, handleClick}) => {
    if (!modifiers.matchesPredicate) {
      return null;
    }
    return (
      <MenuItem
        active={modifiers.active}
        className="perspective-selector-menu-item"
        icon={selectedLevel === "geo" ? "map-marker" : "office"}
        fill
        key={`${item.id}-${item.name}`}
        label={item.id}
        onClick={handleClick}
        text={item.name}
        shouldDismissPopover={false}
      />
    );
  };

  return <Fragment>
    <div
      className={`cp-section-inner cp-default-section-inner cp-${slug}-section-inner`}
      id="perspective-selector"
      ref={section}
    >
      <div className="perspective-selector-title">{heading}</div>
      <div className={classNames("perspective-selector-header", {active: ["geo", "industry", "product"].includes(selectedLevel)})}>
        {Object.keys(perspectiveLevels).map(level => <div
          className={classNames("perspective-selector-level-selector", {active: selectedLevel === level})}
          key={`perspective-selector-${level}-level`}
          onClick={() => level === selectedLevel ? [setSelectedLevel(""), setIsCollapseOpen(false)] : [setSelectedLevel(level), setIsCollapseOpen(true)]}
        >
          <img className="perspective-selector-icon" src={selectedLevel === level ? `/icons/complexity/${level}-active.svg` : `/icons/complexity/${level}.svg`} alt={`${level}-icon`} />
          <span className={classNames("perspective-selector-label", {active: selectedLevel === level})}>{perspectiveLevels[level][locale]}</span>
        </div>)}
        <Button
          className={classNames("perspective-selector-level-selector glossary")}
          disabled={isLoadingEcData}
          onClick={() => setIsGlossaryDialogOpen(true)}
        >
          <img className="perspective-selector-icon" src="/icons/complexity/glossary.svg" alt={"glossary-icon"} />
          <span className="perspective-selector-label">{t("CMS.CustomPerspectiveSelector.Glossary")}</span>
        </Button>
      </div>
      <Dialog
        className="perspective-selector-glossary-dialog"
        canEscapeKeyClose
        canOutsideClickClose
        isOpen={isGlossaryDialogOpen}
        lazy
        title={<div className="perspective-selector-dialog-title">
          <img className="perspective-selector-icon" src="/icons/complexity/glossary.svg" alt={"glossary-icon"} />
          <span className="perspective-selector-label">{t("CMS.CustomPerspectiveSelector.Glossary")}</span>
        </div>}
        onClose={() => setIsGlossaryDialogOpen(false)}
      >
        <div className="perspective-selector-dialog-body">
          {Object.keys(ecDescription).map((descriptionLevel, descpritionIndex) => <div
            className="perspective-selector-glossary-item"
            key={`perspective-selector-glossary-level-${descpritionIndex}`}
          >
            <span className="perspective-selector-glossary-title">{descriptionLevel}</span>
            <p className="perspective-selector-glossary-description">
              {ecDescription[descriptionLevel]}
            </p>
          </div>)}
        </div>
      </Dialog>
      {!isLoading && <Collapse
        isOpen={isCollapseOpen}
      >
        {selectedLevel && selectedLevel !== "product" && !isLoadingData && <div className="perspective-selector-search-group">
          <div className="perspective-selector-search-bar-container">
            <img className="perspective-selector-search-icon" src="/icons/complexity/search.png" />
            <MultiSelect
              className="perspective-selector-search-bar"
              fill
              itemListRenderer={itemListRenderer}
              itemPredicate={filterItems}
              itemRenderer={renderItem}
              items={selectedLevel === "geo" ? perspectiveSelectorData[selectedLevel][selectedGeoSubLevel] : perspectiveSelectorData[selectedLevel][selectedIndustrySubLevel]}
              onItemSelect={handleItemSelect}
              popoverProps={{
                captureDismiss: true,
                fill: "true",
                minimal: true,
                usePortal: false
              }}
              placeholder={t("CMS.CustomPerspectiveSelector.Placeholder")}
              resetOnQuery
              resetOnSelect
              scrollToActiveItem={false}
              selectedItems={selectedLevel === "geo" ? selectedGeo : selectedIndustry}
              tagRenderer={renderTag}
            />
          </div>
          {perspectiveSublevels[selectedLevel] && <div className="perspective-selector-sublevel-selector">
            {perspectiveSublevels[selectedLevel].map((subLevel, index) => <Button
              className={classNames("perspective-selector-sublevel-selector-button", {active: selectedLevel === "geo" ? subLevel === selectedGeoSubLevel : subLevel === selectedIndustrySubLevel})}
              key={`perspective-selector-sublevel-${index}`}
              minimal
              onClick={() => selectedLevel === "geo" ? setSelectedGeoSubLevel(subLevel) : setSelectedIndustrySubLevel(subLevel)}
            >
              <span>{t(`CMS.CustomPerspectiveSelector.${subLevel}`)}</span>
            </Button>)
            }
          </div>}
        </div>}
        {selectedLevel && <Button
          className={classNames("perspective-selector-collapse-button", {closed: !isDescriptionCollapseOpen})}
          minimal
          onClick={() => setIsDescriptionCollapseOpen(!isDescriptionCollapseOpen)}
          rightIcon={isDescriptionCollapseOpen ? "chevron-up" : "chevron-down"}
        >
          <span>{t("CMS.CustomPerspectiveSelector.Exploration")}</span>
        </Button>}
        {selectedLevel && <Collapse
          isOpen={isDescriptionCollapseOpen}
        >
          <div className={"perspective-selector-collapse"}>
            {perspectiveSelectorContentData[selectedLevel].map((query, i) => <AnchorLink
              className="perspective-selector-tabs"
              key={`perspective-selector-${i}-tab`}
              to={perspectiveLinksTo[selectedLevel][i]}
            >
              <img className="perspective-selector-tab-image" src={`/icons/complexity/${selectedLevel}/${i}.svg`} />
              <span className="perspective-selector-tab-text">
                {query}
              </span>
            </AnchorLink>)}
          </div>
        </Collapse>}
      </Collapse>}

      <Button
        className={"mobile-glossary-button"}
        disabled={isLoadingEcData}
        onClick={() => setIsGlossaryDialogOpen(true)}
      >
        <img className="perspective-selector-icon" src="/icons/complexity/glossary.svg" alt={"glossary-icon"} />
        <span className="perspective-selector-label">{t("CMS.CustomPerspectiveSelector.SeeGlossary")}</span>
      </Button>
    </div>
    {showButton &&
      <AnchorLink
        className="perspective-selector-back-button"
        to={"perspective-selector"}
      >
        <Button
          icon={"arrow-up"}
          large
          minimal
        />
      </AnchorLink>
    }
  </Fragment>
  ;
};


PerspectiveSelector.contextTypes = {
  locale: PropTypes.func,
  onSetVariables: PropTypes.func
};

export default withNamespaces()(PerspectiveSelector);
