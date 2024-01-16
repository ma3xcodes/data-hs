import React from "react";
import HelmetWrapper from "../HelmetWrapper";
import PropTypes from "prop-types";
import libs from "@datawheel/canon-cms/src/utils/libs";
import CMSProfile from "../../components/Profile";
import {connect} from "react-redux";
import {fetchData} from "@datawheel/canon-core";
import {withNamespaces} from "react-i18next";
import Observer from "@researchgate/react-intersection-observer";

import Error from "../Error/Error";
import Footer from "../../components/Footer";
import Nav from "../../components/Nav";

import {spanishLabels} from "helpers/spanishLabels";

import "./Profile.css";

class Profile extends React.Component {

  getChildContext() {
    const {formatters, locale, profile, router} = this.props;
    
    const {variables} = profile;
    return {
      formatters: formatters.reduce((acc, d) => {
        const f = Function("n", "libs", "formatters", d.logic);
        const fName = d.name.replace(/^\w/g, chr => chr.toLowerCase());
        acc[fName] = n => f(n, libs, acc);
        return acc;
      }, {}),
      router,
      variables,
      locale
    };
  }

  render() {
    const {profile, t, baseUrl, router} = this.props;
    //console.log('profile', profile);
    //console.log('t', t);
    //console.log('baseUrl ', baseUrl );
    //console.log('router', router);

    const {variables} = profile;
    const {props} = this

    let desc = "", slug = "", title = "";
    if (profile && profile.errorCode && profile.errorCode === 404) return <Error />;

    if (profile.meta) {
      slug = profile.meta.map(d => d.slug).join("_");
    }

    switch (slug) {
      case "occupation":
        title = t("Profile.Occupation Title", {name: variables.name});
        desc = t("Profile.Occupation Description", {name: variables.name});
        break;
      case "geo":
        title = t("Profile.Geo Title", {name: variables.name});
        desc = t("Profile.Geo Description", {name: variables.name});
        break;
      case "country":
        title = t("Profile.Country Title", {name: variables.name});
        desc = t("Profile.Country Description", {name: variables.name});
        break;
      case "product":
        title = t("Profile.Product Title", {name: variables.name});
        desc = t("Profile.Product Description", {name: variables.name});
        break;
      case "industry":
        title = t("Profile.Industry Title", {name: variables.name});
        desc = t("Profile.Industry Description", {name: variables.name});
        break;
      case "institution":
        title = t("Profile.Institution Title", {name: variables.name});
        desc = t("Profile.Institution Description", {name: variables.name});
        break;
      case "economic_complexity":
        title = t("Profile.Economic Complexity Title");
        desc = t("Profile.Economic Complexity Description");
        break;
      default:
        break;
    }

    const share = {
      title,
      desc,
      img: `${baseUrl}/api/image?slug=${slug}&id=${variables ? variables.id : ""}&size=thumb`
    };

    const searchProps = {
      placeholder: t("Profile.Search Placeholder"),
      subtitleFormat: d => spanishLabels[d.memberHierarchy]
    };

    const {params} = router;

    return <div id="Profile" className={`cp-profile-${params.slug}`}>
      <HelmetWrapper info={share} />

      <Nav
        title={`${variables ? variables.name : ""}`}
        hierarchy={`${variables ? variables.hierarchy : ""}`}
        slug={`${slug}`}
        routePath={this.props.route.path}
        routeParams={params}
        changeOnScroll={true}
      />

      <CMSProfile {...this.props} searchProps={searchProps} />

      <Footer />
    </div>;
  }
}

Profile.need = [
  fetchData("profile", "https://www.economia.gob.mx/datamexico/api/profile/?slug=<slug>&id=<id>&slug2=<slug2>&id2=<id2>&slug3=<slug3>&id3=<id3>&locale=<i18n.locale>"),
  fetchData("formatters", "https://www.economia.gob.mx/datamexico/api/formatters")
];

Profile.childContextTypes = {
  formatters: PropTypes.object,
  locale: PropTypes.string,
  router: PropTypes.object,
  variables: PropTypes.object
};

export default withNamespaces()(
  connect(state => ({
    baseUrl: state.env.CANON_API,
    formatters: state.data.formatters,
    locale: state.i18n.locale,
    profile: state.data.profile
  }))(Profile)
);
