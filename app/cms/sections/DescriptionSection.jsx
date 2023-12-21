import React, {useEffect, useState} from "react";
import classNames from "classnames";
import PropTypes from "prop-types";
import {getEcDescriptionsData} from "../hooks/getEcDescriptionsData";

import "./DescriptionSection.css";

const DescriptionSection = (props, context) => {
  const {contents, slug, heading, hideOptions, title, loading, filters, resetButton, stats, sources, visualizations, vizHeadingLevel} = props;
  let {paragraphs} = props;

  // Removes first element of paragraphs
  if (paragraphs && Array.isArray(paragraphs)) paragraphs = paragraphs.slice(1);

  const defaultLevel = {
    "es": "Introducción",
    "en": "Introduction"
  }

  const [isLoading, ecDescription] = getEcDescriptionsData(context.locale);
  const [selectedLevel, setSelectedLevel] = useState(defaultLevel[context.locale]);
  const section = React.createRef();

  return (
    <div
      className={`cp-section-inner cp-default-section-inner cp-${slug}-section-inner ${loading ? "is-loading" : ""} cp-custom-description-section`}
      ref={section}
    >
      {/* sidebar */}
      <div className="cp-section-content cp-default-section-caption">
        {heading}
        {!isLoading && <div className="dmx-description-section-side-bar">
          {Object.keys(ecDescription).map(d => <span className={classNames("dmx-description-section-level", {"active": d === selectedLevel})} onClick={() => setSelectedLevel(d)}>- {d}</span>)}
        </div>}
      </div>
      <div className="cp-default-section-figure cp-custom-description-section-figure">
        {!isLoading && ecDescription[selectedLevel].map(text => <p>{text}</p>)}
      </div>
    </div>
  );
}

DescriptionSection.contextTypes = {
  locale: PropTypes.func
};

export default DescriptionSection;
