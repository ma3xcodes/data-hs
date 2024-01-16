import React, {useState} from "react";
import {connect} from "react-redux";
import {isAuthenticated} from "@datawheel/canon-core";
import {withNamespaces} from "react-i18next";

import {Explorer as TesseractExplorer} from "@datawheel/tesseract-explorer";
import {DebugView, TableView, PivotView} from "@datawheel/tesseract-explorer";

// You must import blueprint's stylesheets too
import "normalize.css/normalize.css";
import "@blueprintjs/icons/lib/css/blueprint-icons.css";
import "@blueprintjs/select/lib/css/blueprint-select.css";
import "@blueprintjs/table/lib/css/table.css";

// Tesseract Explorer's stylesheets must come after
import "@datawheel/tesseract-explorer/dist/explorer.css";

import HelmetWrapper from "../HelmetWrapper";
import Nav from "../../components/Nav";
import Footer from "../../components/Footer";
import Tour from "./Tour";
import VizbuilderView from "./VizbuilderView";

import "./Vizbuilder.css";

export const TUTORIAL_PATH = "tutorial";
const TUTORIAL_QUERY_PATH = "cube=anuies_enrollment&drilldowns%5B0%5D=Geography.State&drilldowns%5B1%5D=Year&measures%5B0%5D=Students";

const Vizbuilder = props => {

  const {base, lng: locale, route, router, t} = props;

  const [isTourOpen, _] = useState(router ?router.location.pathname.endsWith(TUTORIAL_PATH):unll);

  /*
    When tour is close, redirect to a vizbuilder page with the selected query,
  */
  const closeTour = () => {
    if (window && window.location.search !== "") {
      router.push(`/${locale}/vizbuilder${window.location.search}`);
    }
    if(window)window.location.reload();
  }

  /*
    When tour launch redirect to a url to keep the tour open.
    The query string is the current one if exists. If not is an example.
  */
  const launchTour = () => {
    if (window && window.location.search !== "") {
      router.push(`/${locale}/vizbuilder/tutorial${window.location.search}`);
    } else {
      router.push(`/${locale}/vizbuilder/tutorial?${TUTORIAL_QUERY_PATH}`);
    }
    if(window) window.location.reload()
  }

  const share = {
    title: t("Vizbuilder.Share.Title"),
    desc: t("Vizbuilder.Share.Description")
  };

  // Tesseract Explorer Translations
  const translations = {};
  translations[locale] = t("Vizbuilder.UI", {returnObjects: true});

  // Tesseract Explorer Panels
  const PANELS = {
    [t("Vizbuilder.TabTitles.data")]: TableView,
    [t("Vizbuilder.TabTitles.matrix")]: PivotView,
    [t("Vizbuilder.TabTitles.vizbuilder")]: VizbuilderView,
    [t("Vizbuilder.TabTitles.api")]: DebugView,
  };

  /* Tesseract Explorer Default language
  * NOTE: this is the "data language". The UI languages is managed by the canon lang
  */
  const localeOptions = ['en','es'];

  return <>
    <HelmetWrapper info={share} />
    <Nav
      title={`${t("Vizbuilder.NavTitle")}`}
      routePath={route.path}
      routeParams={router.params}
      changeOnScroll={false}
    />
    <div className="vizbuilder-wrapper">
      <TesseractExplorer
        src={base}
        panels={PANELS}
        title={t("Vizbuilder.Title")}
        translations={translations}
        locale={localeOptions}
        uiLocale={locale}
      />
      <Tour isTourOpen={isTourOpen} closeTour={closeTour} />
      {!isTourOpen &&
        <>
          <a id="vizbuilder-diccionario-btn" className="flying-btn" href="/files/diccionario.xlsx" download="dmx-diccionario-de-datos">
            <span className="vizbuilder-flying-btn-icon">
              <img src="/images/tour/tour-cog-icon.png" />
            </span>
            <span className="vizbuilder-flying-btn-text">
              <span className="vizbuilder-flying-btn-title">{t("Vizbuilder.DownloadDataAction")}</span>
              <span className="vizbuilder-flying-btn-subtitle">{t("Vizbuilder.DownloadDataDict")}</span>
            </span>
          </a>
          <a id="vizbuilder-tutorial-btn" className="flying-btn" onClick={() => launchTour()}>
            <span className="vizbuilder-flying-btn-icon">
              <img src="/images/tour/tour-question-icon.png" />
            </span>
            <span className="vizbuilder-flying-btn-text">
              <span className="vizbuilder-flying-btn-title">{t("Vizbuilder.Tour.launch.title")}</span>
              <span className="vizbuilder-flying-btn-subtitle">{t("Vizbuilder.Tour.launch.subtitle")}</span>
            </span>
          </a>
        </>
      }
    </div>
    <Footer />
  </>;
}

const mapStateToProps = state => ({
  base: state.env.BASE
});

const mapDispatchToProps = dispatch => ({
  isAuthenticated: () => {
    dispatch(isAuthenticated());
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(withNamespaces()(Vizbuilder));
