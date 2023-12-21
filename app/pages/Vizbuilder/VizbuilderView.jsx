import React, {useMemo} from "react";
import {withNamespaces} from "react-i18next";
import {connect} from "react-redux";
import Vizbuilder from "@datawheel/tesseract-vizbuilder";

import {vizbuilderD3Config} from "../../d3plus";

import "@datawheel/tesseract-vizbuilder/dist/vizbuilder.css";


const getTopoJson = (baseUrl, lng = "en") => {
  const output = [
    {
      id: "Country",
      name: lng === "en" ? "Country" : "País",
      topojson: `${baseUrl}/topojson/Country.json`,
      topojsonId: d => d.id.toLowerCase(), // Lowercase to match data id
      topojsonFilter: d => ["ATA"].indexOf(d.id) === -1, // Exclude Antartica
      projection: "geoMiller", // Change projection to Miller
      tiles: false
    },
    {
      id: "State",
      name: lng === "en" ? "State" : "Entidad Federativa",
      topojson: `${baseUrl}/topojson/Entities.json`,
      topojsonId: d => d.properties.ent_id,
      tiles: false
    },
    {
      id: "Metro Area",
      name: lng === "en" ? "Metropolitan Area" : "Zona Metropolitana",
      topojson: `${baseUrl}/topojson/MetroAreas.json`,
      topojsonId: d => d.properties.zm_id,
      tiles: true
    },
    {
      id: "Municipality",
      name: lng === "en" ? "Municipality" : "Municipio",
      topojson: `${baseUrl}/topojson/Municipalities.json`,
      topojsonId: d => d.properties.mun_id,
      tiles: false
    },
    {
      id: "Self Represented City",
      name: lng === "en" ? "Self Represented City" : "Ciudad Auto Representada",
      topojson: `${baseUrl}/topojson/SelfCities.json`,
      topojsonId: d => d.properties.self_city_id,
      tiles: false
    }
  ];
  return output.reduce((acc, item) => ({...acc, [item.id]: item}), {});
};

const FORMATTERS = {
  Dollars: value => `USD $${value}`
};

const VizbuilderView = props => {
  const {baseUrl, lng: locale, t} = props;

  const [translations, topoJsonConfig] = useMemo(() => {
    // Tesseract Explorer Translations
    const translations = {};
    translations[locale] =  t("Vizbuilder.VizbuilderView", {
      returnObjects: true,
      interpolation: {suffix: "{{{{", prefix: "}}}}"} // override interpolation so normal {{variables}} are kept intact
    });
    return [translations, getTopoJson(baseUrl, locale)];
  }, [locale]);

  return <Vizbuilder
    // The following three parameters are given by Tesseract Explorer, so bypass them
    cube={props.cube}
    result={props.result}
    params={props.params}
    // translation props
    defaultLocale={locale}
    translations={translations}
    // props needed for Vizbuilder charts
    allowedChartTypes={["barchart", "barchartyear", "lineplot", "stacked", "treemap", "geomap", "donut"]}
    downloadFormats={["svg", "png"]}
    formatters={FORMATTERS}
    showConfidenceInt={false}
    topojsonConfig={topoJsonConfig}
    userConfig={vizbuilderD3Config}
  />;
};

export default withNamespaces()(
  connect(state => ({
    baseUrl: state.env.CANON_API
  }))(VizbuilderView)
);
