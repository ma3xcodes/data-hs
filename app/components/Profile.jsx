import React, {Component} from "react";
import {connect} from "react-redux";
import {fetchData} from "@datawheel/canon-core";
import PropTypes from "prop-types";
import ProfileRenderer from "./ProfileRenderer";
import {NonIdealState} from "@blueprintjs/core";
import "@datawheel/canon-cms/src/components/Profile.css";

const urlApi = "https://f79e-104-28-204-192.ngrok-free.app/"

class Profile extends Component {
  getChildContext() {
    const {router, searchProps, location} = this.props;
    const {query} = location;
    const print = query.print === "true";
    return {
      print,
      router,
      searchProps
    };
  }

  render() {
    const {profile, formatters, locale, router} = this.props;

    if (profile.error) {
      const {error, errorCode} = profile;
      const errorMessages = {
        404: "Page Not Found"
      };
      return (
        <NonIdealState
          className="cp-error"
          icon="error"
          title={errorMessages[errorCode] || `Error: ${errorCode}`}
          description={error}
        />
      );
    }

    return (
      <ProfileRenderer
        profile={profile}
        formatters={formatters}
        locale={locale}
        router={router}
      />
    );
  }
}

Profile.defaultProps = {
  searchProps: {}
};

Profile.need = [
  fetchData("profile", urlApi+"/api/profile/?slug=<slug>&id=<id>&slug2=<slug2>&id2=<id2>&slug3=<slug3>&id3=<id3>&locale=<i18n.locale>"),
  fetchData("formatters", urlApi+"/api/formatters")
];

Profile.childContextTypes = {
  print: PropTypes.bool,
  router: PropTypes.object,
  searchProps: PropTypes.object
};

export default connect(state => ({
  formatters: state.data.formatters,
  locale: state.i18n.locale,
  profile: state.data.profile
}))(Profile);
