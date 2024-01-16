import React, {useState, useEffect} from "react";

import {withNamespaces} from "react-i18next";
import {connect} from "react-redux";
import Loadable from "react-loadable";

import "./Tour.css";

const Reactour = Loadable({
  loader: () => import("reactour"),
  loading: () => null
});

const FirstStep = ({t}) => <div className="tour-item tour-welcome">
  <div className="tour-img">
    <img src="/images/tour/tour-start.png" />
  </div>
  <div className="tour-text">
    <h3>{t("Vizbuilder.Tour.welcome.title")}</h3>
    <p>{t("Vizbuilder.Tour.welcome.text1")}</p>
    <p>{t("Vizbuilder.Tour.welcome.text2")}</p>
  </div>
</div>;

const SlideStep = props => {
  const {title, texts} = props;
  const paragraphs = Array.isArray(texts) ? texts : [texts];
  return <div className="tour-item tour-step">
    <div className="tour-text">
      <h3>{title}</h3>
      {paragraphs.map(p =>
        <p>{p}</p>
      )}
    </div>
  </div>;
};

const LastStep = ({t}) => <div className="tour-item tour-last">
  <div className="tour-img">
    <img src="/images/tour/tour-start.png" />
  </div>
  <div className="tour-text">
    <h3>{t("Vizbuilder.Tour.last.title")}</h3>
    <p>{t("Vizbuilder.Tour.last.text")}</p>
  </div>
</div>;

const clickElement = selector => {
  var elClick = document.querySelector(selector);
  if(elClick) elClick.click();
};

const Tour = props => {

  const {isTourOpen, closeTour, t} = props;

  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    setIsOpen(isTourOpen);
  }, [isTourOpen]);

  const tourSteps = [
    {
      selector: "",
      content: <FirstStep t={t} />,
      position: "center"
    },
    {
      selector: ".cube-locale",
      content: <SlideStep title={t("Vizbuilder.Tour.dataset.title")}
        texts={[t("Vizbuilder.Tour.dataset.text1"), t("Vizbuilder.Tour.dataset.text2")]} />,
      position: "left"
    },
    {
      selector: ".query-area:nth-of-type(1)",
      content: <SlideStep title={t("Vizbuilder.Tour.metrics.title")}
        texts={t("Vizbuilder.Tour.metrics.text1")} />,
      position: "left"
    },
    {
      selector: ".query-area:nth-of-type(2)",
      content: <SlideStep title={t("Vizbuilder.Tour.columns.title")}
        texts={t("Vizbuilder.Tour.columns.text1")} />,
      position: "top"
    },
    {
      selector: ".query-area:nth-of-type(3)",
      content: <SlideStep title={t("Vizbuilder.Tour.filters.title")}
        texts={[t("Vizbuilder.Tour.filters.text1"), t("Vizbuilder.Tour.filters.text2")]} />,
      position: "left"
    },
    {
      selector: ".query-area:nth-of-type(4)",
      action: () => {
        setTimeout(() => {
          const element = document.querySelector(".query-area:nth-of-type(4)");
          //Click on query options panel only if it is closed
          if (!element.attributes.open) {
            clickElement(".query-area:nth-of-type(4) .details-title")
          }
        }, 100);
      },
      resizeObservables: [".query-area:nth-of-type(4)"],
      content: <SlideStep title={t("Vizbuilder.Tour.options.title")}
        texts={t("Vizbuilder.Tour.options.text1")} />,
      position: "left"
    },
    {
      selector: ".query-actions .bp3-button",
      content: <SlideStep title={t("Vizbuilder.Tour.execute.title")}
        texts={t("Vizbuilder.Tour.execute.text1")} />,
      position: "left"
    },
    {
      selector: ".download-area",
      content: <SlideStep title={t("Vizbuilder.Tour.download.title")}
        texts={t("Vizbuilder.Tour.download.text1")} />,
      position: "left"
    },
    {
      selector: ".explorer-column.explorer-results",
      action: () => clickElement(`div[data-tab-id='${t("Vizbuilder.TabTitles.data")}']`),
      content: <SlideStep title={t("Vizbuilder.Tour.dataTab.title")}
        texts={[t("Vizbuilder.Tour.dataTab.text1"), t("Vizbuilder.Tour.dataTab.text2")]} />,
      position: "bottom"
    },
    {
      selector: ".explorer-column.explorer-results",
      action: () => clickElement(`div[data-tab-id='${t("Vizbuilder.TabTitles.matrix")}']`),
      content: <SlideStep title={t("Vizbuilder.Tour.matrixTab.title")}
        texts={t("Vizbuilder.Tour.matrixTab.text1")} />,
      position: "bottom"
    },
    {
      selector: ".explorer-column.explorer-results",
      action: () => clickElement(`div[data-tab-id='${t("Vizbuilder.TabTitles.vizbuilder")}']`),
      content: <SlideStep title={t("Vizbuilder.Tour.vizbuilderTab.title")}
        texts={t("Vizbuilder.Tour.vizbuilderTab.text1")} />,
      position: "bottom"
    },
    {
      selector: ".explorer-column.explorer-results",
      action: () => clickElement(`div[data-tab-id='${t("Vizbuilder.TabTitles.api")}']`),
      content: <SlideStep title={t("Vizbuilder.Tour.apiTab.title")}
        texts={[t("Vizbuilder.Tour.apiTab.text1"), <a href="/files/tesseract.pdf" download="dmx-developer-guide">{t("Vizbuilder.Tour.apiTab.text2")}</a>]} />,
      position: "bottom"
    },
    {
      selector: "",
      content: <LastStep t={t} />,
      position: "center"
    }

  ];

  const canUseDOM = !!(typeof window !== "undefined" && window.document && window.document.createElement);

  return (
    <>
      {canUseDOM && <Reactour
        className={"tour-card"}
        disableInteraction={true}
        steps={tourSteps}
        isOpen={isOpen}
        startAt={0}
        onAfterOpen={() => {

        }}
        onRequestClose={closeTour}
        disableDotsNavigation={false}
        showNumber={false}
        showNavigation={true}
        showNavigationNumber={false}
        lastStepNextButton={<>{t("Vizbuilder.Tour.last.button")}<img src="/images/tour/tour-next.png" /></>}
        nextButton={<>{t("Vizbuilder.Tour.next")}<img src="/images/tour/tour-next.png" /></>}
        prevButton={<><img src="/images/tour/tour-prev.png" />{t("Vizbuilder.Tour.prev")}</>}
      />}
    </>
  );
};

export default withNamespaces()(
  connect(state => ({
    locale: state.i18n.locale
  }))(Tour)
);
