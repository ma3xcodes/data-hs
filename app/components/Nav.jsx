import React, {useEffect, useRef, useState} from "react";
import axios from "axios";
import classnames from "classnames";
import {InputGroup, Menu, MenuDivider, MenuItem, Popover, PopoverInteractionKind, PopoverPosition} from "@blueprintjs/core";
import {withNamespaces} from "react-i18next";
import SVG from "react-inlinesvg";
import Observer from "@researchgate/react-intersection-observer";

import NavMenu from "./NavMenu";
import SearchResult from "./SearchResult";

import {HOME_GOB_LINKS} from "helpers/consts.js";
import "./Nav.css";

const pathParser = (params, path) => {
  let newPath = path.replace(/\(|\)/g, "");
  Object.entries(params).forEach(d => {
    newPath = newPath.replace(d[0], d[1]);
  });
  return newPath;
};

const Nav = props => {
  const [isOpen, setIsOpen] = useState(false);
  const [isOpenSearchResults, setIsOpenSearchResults] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [results, setResults] = useState([]);
  const [resultsFilter, setResultsFilter] = useState([]);
  const [scrolled, setScrolled] = useState(false);

  // Intersection observer
  const observerDefaults = {
    threshold: [0, 1]
  };

  const cancelContainer = useRef(null);

  const handleHeaderChange = ({intersectionRatio}) => {
    setScrolled(intersectionRatio === 0);
  };

  const handleSearch = e => {
    const query = e.target.value;
    const canceler = cancelContainer.current;

    if (canceler) {
      canceler();
      cancelContainer.current = null;
    }

    if (query.length > 1) {
      return axios.get("https://www.economia.gob.mx/datamexico/api/search", {
        cancelToken: new axios.CancelToken(canceler => {
          // An executor function receives a cancel function as a parameter
          cancelContainer.current = canceler;
        }),
        params: {
          q: query,
          locale: props.lng
        }
      })
        .then(resp => {
          const data = resp.data.results;
          const results = data.map(d => ({id: d.slug, name: d.name, slug: d.profile, level: d.hierarchy}));
          setResults(results);
          setResultsFilter(results);
          setIsOpenSearchResults(true);
        })
        .catch(error => {
          error.message && console.error("Search result error:", error);
        });
    }

    const resultsFilter = query.length > 0
      ? results.filter(d => d.name.toLowerCase().indexOf(query.toLowerCase()) >= 0)
      : [];

    const isOpen = query.length > 2;
    setResultsFilter(resultsFilter);
    setIsOpenSearchResults(isOpen);

    return true;
  };


  const useOutsideClick = (ref, callback) => {
    const handleClick = e => {
      if (ref.current && !ref.current.contains(e.target)) {
        callback();
      }
    };

    useEffect(() => {
      document.addEventListener("click", handleClick);
      document.addEventListener("keydown", handleClick);

      return () => {
        document.removeEventListener("click", handleClick);
        document.addEventListener("keydown", handleClick);
      };
    });
  };

  const ref = useRef(null);

  useOutsideClick(ref, () => {
    if (isSearchOpen) {
      setIsSearchOpen(!isSearchOpen);
      setResults([]);
      setResultsFilter([]);
    }
  });


  const {hierarchy, lng, logo, routeParams, routePath, slug, t, title, changeOnScroll} = props;

  const isProfile = routePath.includes("profile");

  const ecProfileTitle = {
    en: "Economic Complexity Explorer",
    es: "Explorador de Complejidad Económica"
  };

  let params;
  if (routeParams && typeof routeParams === "object") {
    params = Object.entries(routeParams).reduce((obj, d) => {
      const key = `:${d[0]}`;
      const value = d[1];
      obj[key] = value;
      return obj;
    }, {});
  }

  const withBackground = scrolled && changeOnScroll || !changeOnScroll;

  return <>
    <Observer {...observerDefaults} disabled={!changeOnScroll} onChange={handleHeaderChange}>
      <span id="header-anchor"></span>
    </Observer>
    {/* <div className="gob-nav">
      <div className="gob-nav-left">
        <a href="https://www.gob.mx/" target="_blank" rel="noreferrer">
          <img className="gob-nav-logo" src={"/icons/homepage/svg/logo-gob-mx.svg"} />
        </a>
      </div>
      <div className="gob-nav-right">
        {HOME_GOB_LINKS.map((item, id) => <Popover
          className="gob-nav-popover"
          interactionKind={PopoverInteractionKind.HOVER}
          isOpen={undefined}
          key={item.name}
          minimal
          hoverOpenDelay={10}
          hoverCloseDelay={10}
          position={PopoverPosition.BOTTOM}
          usePortal={false}
        >
          <span className="gob-nav-link-title">{t(item.name)}</span>
          <div className="gob-nav-link-container">
            <Menu
              key={`menu-${id}`}
            >
              <MenuDivider
                title={t(item.desc)}
              />
              <MenuDivider />
              {item.links.map(link => <MenuItem
                className="gob-nav-link"
                key={link.name}
                href={link.link}
                target={"_blank"}
                text={t(link.name)}
              />)}
              {id === 1 && <>
                <MenuDivider />
                <MenuItem
                  className="gob-nav-link"
                  href={"https://www.gob.mx/gobierno"}
                  target={"_blank"}
                  text={t("Homepage.See more")}
                />
              </>}
            </Menu>
          </div>
        </Popover>
        )}
      </div>
    </div>*/}
    <div className={`${withBackground ? "background" : ""} ${!isProfile && withBackground ? "shadow" : ""} nav container`} style={{top: 0}}>
      <NavMenu
        isOpen={isOpen}
        run={isOpen => setIsOpen(isOpen)}
        dialogClassName={isOpen ? "slide-enter" : "slide-exit"}
      />
      <div className="nav-left">
        <button className="nav-button" onClick={() => setIsOpen(!isOpen)}>
          <SVG src="/icons/homepage/svg/burger.svg" width={35} />
        </button>
        <a href="/">
          <img className="nav-logo" src={"/icons/homepage/svg/logo-dmx-vertical1.svg"} />
        </a>
      </div>
      <div className={classnames("nav-center", {"active-searchbar": isSearchOpen})}>
        {scrolled && <SVG className="nav-profile-icon" src={`/icons/dimensions/${slug}.svg`} height={20} />}
        <span className="nav-subtitle">{title && scrolled ? title === "1" ? ecProfileTitle[lng] : title : ""}</span>
        <span className="nav-subtitle-sep">{hierarchy && scrolled && "|"}</span>
        <span className="nav-hierarchy">{hierarchy && scrolled ? t(hierarchy) : ""}</span>
      </div>
      <div className="nav-right">
        <a className="nav-vizbuilder" href={`/${lng}/vizbuilder`}>
          <SVG src="/icons/homepage/svg/viz-builder.svg" width={35} />
          <span>Vizbuilder</span>
        </a>
        <ul className="langs">
          <li><a className={lng === "es" ? "active" : ""} data-refresh="true" href={pathParser({...params, ":lang": "es"}, routePath)}>ES</a></li>
          |
          <li><a className={lng === "en" ? "active" : ""} data-refresh="true" href={pathParser({...params, ":lang": "en"}, routePath)}>EN</a></li>
        </ul>
        <div className={classnames("search-button", "search-nav", {active: isSearchOpen})} ref={ref}>
          <SVG src="/icons/homepage/svg/search.svg" onClick={() => setIsSearchOpen(!isSearchOpen)} />
          <InputGroup
            placeholder={t("Search profiles")}
            className={classnames({active: isSearchOpen})}
            autoFocus={true}
            onChange={handleSearch}
          />
          <ul className={classnames("results", {active: isSearchOpen})}>
            {resultsFilter.map((d, i) => <SearchResult
              key={`search_result_${d.id}_${i}`}
              id={d.id}
              slug={d.slug}
              title={d.name}
              level={d.level}
            />)}
          </ul>
        </div>
      </div>
    </div>
  </>;
};

Nav.defaultProps = {
  logo: true,
  title: false,
  changeOnScroll: false
};

export default withNamespaces()(Nav);
