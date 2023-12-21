import React from "react";
import {Link} from "react-router";
import {withNamespaces} from "react-i18next";
import {Icon, InputGroup} from "@blueprintjs/core";
import {Toaster, Intent, Position} from "@blueprintjs/core";
import axios from "axios";

import {FOOTER_GOB_NAV, FOOTER_NAV, GOB_SOCIAL_MEDIA, LOGOS_FOOTER, SOCIAL_MEDIA} from "helpers/consts.js";

import "./Footer.css";

class Footer extends React.Component {
  state = {
    email: ""
  };

  refHandlers = {
    toaster: ref => this.toaster = ref
  };

  addToast = toast => {
    toast.timeout = 5000;
    if (!toast.intent) {
      toast.className = "toast-success";
      toast.intent = Intent.SUCCESS;
    }
    this.toaster.show(toast);
  }

  handleUser = evt => {
    const {email} = this.state;

    const formData = new FormData();

    formData.append("entry.1182831599", email); // Email
    // Reset input content
    evt.target.reset();
    evt.preventDefault();

    const CORS_PROXY = "https://cors-anywhere.herokuapp.com/";
    const GOOGLE_FORM_ACTION_URL =
      "https://docs.google.com/forms/d/e/1FAIpQLSexPJnu7z2NEesS2o4dwpFHp8BAxjtCeWbU0FKvyOXw91y0ag/formResponse";

    axios
      .post(CORS_PROXY + GOOGLE_FORM_ACTION_URL, formData)
      .then(() => {
        this.addToast({
          message: "Gracias por suscribirte en DataMéxico."
        });
      })
      .catch(() => {
        this.addToast({
          intent: Intent.DANGER,
          message: "Algo sucedió mal. Intente nuevamente"
        });
      });
  };

  render() {
    const {t, lng} = this.props;

    const NAV = FOOTER_NAV.map(column => {
      column.url = column.url.includes(":lng") ? column.url.replace(":lng", lng) : column.url;

      return column;
    });

    return <footer className="footer">
      <div className="site-footer">
        <div className="columns">
          <div className="column footer-social">
            <img className="footer-logo-page" src={"/icons/homepage/svg/logo-dmx-vertical.svg"} alt={"DataMÉXICO"} />
            <div className="footer-social-media">
              {SOCIAL_MEDIA.map(d =>
                <div key={d.title}>
                  <a href={d.url} target="_blank" rel="noopener noreferrer" alt={d.title}>
                    <img className="footer-social-media-logo" src={`/icons/social_media/${d.src}`} />
                  </a>
                </div>
              )}
            </div>
          </div>
          <div className="column footer-links">
            {NAV.map(d =>
              <div className="footer-link" key={d.title}>
                <Link to={d.url}>
                  <span>{t(d.title)}</span>
                </Link>
              </div>)}
          </div>
          {/* <div className="column footer-logos">
            <div className="footer-logos-inner">
              <span className="footer-logo-title">{t("Footer.SupportMessage")}</span>
              <div className="footer-logos-container">
                {LOGOS_FOOTER.map(logo =>
                  <a className="footer-logo-link" href={logo.url} key={logo.title} target="_blank" rel="noopener noreferrer">
                    <img className="footer-logo-img" src={`/icons/${logo.src}`} alt={logo.title} />
                  </a>
                )}
              </div>
            </div>
                </div>*/}
          <div className="column footer-contact">
            <div className="footer-contact-container">
              <h3 className="u-font-sm">{t("Footer.MailTitle")}</h3>
              <h4 className="footer-subscribe">{t("Footer.MailSubscribe")}</h4>
              <form action="" onSubmit={this.handleUser}>
                <InputGroup
                  leftIcon="envelope"
                  className="footer-email"
                  type="email"
                  placeholder={t("Footer.Mail")}
                  onChange={evt => this.setState({email: evt.target.value})}
                  rightElement={<button className="submit-button"><Icon icon="arrow-right" /></button>}
                />
              </form>
            </div>
          </div>

          <Toaster position={Position.BOTTOM} ref={this.refHandlers.toaster}>
          </Toaster>
        </div>
      </div>
      {/*<div className="gob-footer">
        <div className="column-container">
          <div className="column">
            <img className="footer-gob-logo" src={"/icons/homepage/svg/logo-gob-mx.svg"} />
          </div>

          {FOOTER_GOB_NAV.length &&
            <div className="gob-footer-links-column column" key={FOOTER_GOB_NAV[0].title}>
              <span>{t(FOOTER_GOB_NAV[0].title)}</span>
              {FOOTER_GOB_NAV[0].desc && <span className="gob-footer-description">{t(FOOTER_GOB_NAV[0].desc)}</span>}
              {FOOTER_GOB_NAV[0].desc && <a href="https://www.gob.mx/que-es-gobmx" target="_blank" rel="noopener noreferrer" className="gob-footer-descriptin-link">{t("Footer.Gob.Read more")}</a>}
              <div className="gob-footer-links-urls">
                {FOOTER_GOB_NAV[0].items.map(link =>
                  <a key={link.title} href={link.url}>{t(link.title)}</a>
                )}
              </div>
            </div>
          }
        </div>

        <div className="column-container">
          {FOOTER_GOB_NAV.length &&
            <div className="gob-footer-links-column column" key={FOOTER_GOB_NAV[1].title}>
              <span>{t(FOOTER_GOB_NAV[1].title)}</span>
              {FOOTER_GOB_NAV[1].desc && <span className="gob-footer-description">{t(FOOTER_GOB_NAV[1].desc)}</span>}
              {FOOTER_GOB_NAV[1].desc && <a href="https://www.gob.mx/que-es-gobmx" target="_blank" rel="noopener noreferrer" className="gob-footer-descriptin-link">{t("Footer.Gob.Read more")}</a>}
              <div className="gob-footer-links-urls">
                {FOOTER_GOB_NAV[1].items.map(link =>
                  <a key={link.title} href={link.url}>{t(link.title)}</a>
                )}
              </div>
            </div>
          }

          <div className="gob-footer-social column">
            <span>{t("Footer.Gob.Contact us")}</span>
            <span className="gob-footer-description">{t("Footer.Gob.Contact message")}
              <br />
              <a href="mailto:datamexico@economia.gob.mx">datamexico@economia.gob.mx</a>
            </span>
            <span>{t("Footer.Gob.Follow us")}</span>
            <div className="gob-footer-social-media">
              {GOB_SOCIAL_MEDIA.map(logo =>
                <a className="footer-logo-link" href={logo.url} key={logo.title} target="_blank" rel="noopener noreferrer">
                  <img className="footer-logo-img" src={`/icons/social_media/${logo.src}`} alt={logo.title} />
                </a>)}
            </div>
          </div>
        </div>
      </div>
      <div className="gob-footer-banner" />*/}
    </footer>;
  }
}

export default withNamespaces()(Footer);
