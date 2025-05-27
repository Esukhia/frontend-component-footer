import React from 'react';
import PropTypes from 'prop-types';
import { injectIntl, intlShape } from '@edx/frontend-platform/i18n';
import { sendTrackEvent } from '@edx/frontend-platform/analytics';
import { ensureConfig } from '@edx/frontend-platform';
import { AppContext } from '@edx/frontend-platform/react';
import messages from './Footer.messages';
import LanguageSelector from './LanguageSelector';
import './styles/FixedFooter.css';
ensureConfig(['LMS_BASE_URL', 'LOGO_TRADEMARK_URL'], 'Footer component');
const EVENT_NAMES = {
  FOOTER_LINK: 'edx.bi.footer.link'
};
class SiteFooter extends React.Component {
  constructor(props) {
    super(props);
    this.externalLinkClickHandler = this.externalLinkClickHandler.bind(this);
    this.state = {
      isLogoHovered: false
    };
  }
  externalLinkClickHandler(event) {
    const label = event.currentTarget.getAttribute('href');
    const eventName = EVENT_NAMES.FOOTER_LINK;
    const properties = {
      category: 'outbound_link',
      label
    };
    sendTrackEvent(eventName, properties);
  }
  render() {
    const {
      supportedLanguages,
      onLanguageSelected,
      logo,
      intl
    } = this.props;
    const {
      isLogoHovered
    } = this.state;
    const showLanguageSelector = supportedLanguages.length > 0 && onLanguageSelected;
    const {
      config
    } = this.context;
    return /*#__PURE__*/React.createElement("footer", {
      role: "contentinfo",
      className: "footer-fixed py-0 px-4",
      "aria-label": "Site footer"
    }, /*#__PURE__*/React.createElement("div", {
      className: "container-fluid footer-container"
    }, /*#__PURE__*/React.createElement("div", {
      className: "logo-wrapper"
    }, /*#__PURE__*/React.createElement("a", {
      className: `logo-link ${isLogoHovered ? 'logo-link-hover' : ''}`,
      href: config.LMS_BASE_URL,
      "aria-label": intl.formatMessage(messages['footer.logo.ariaLabel']),
      onMouseEnter: () => this.setState({
        isLogoHovered: true
      }),
      onMouseLeave: () => this.setState({
        isLogoHovered: false
      })
    }, /*#__PURE__*/React.createElement("img", {
      className: "logo-image",
      src: logo || config.LOGO_TRADEMARK_URL,
      alt: intl.formatMessage(messages['footer.logo.altText'])
    }), /*#__PURE__*/React.createElement("div", {
      className: `custom-tooltip ${isLogoHovered ? 'custom-tooltip-visible' : ''}`,
      role: "tooltip",
      "aria-hidden": !isLogoHovered
    }, intl.formatMessage(messages['footer.logo.hoverText'])))), /*#__PURE__*/React.createElement("div", {
      className: "flex-grow-1"
    }), showLanguageSelector && /*#__PURE__*/React.createElement("div", {
      className: "language-selector-wrapper"
    }, /*#__PURE__*/React.createElement(LanguageSelector, {
      options: supportedLanguages,
      onSubmit: onLanguageSelected
    }))));
  }
}
SiteFooter.contextType = AppContext;
SiteFooter.propTypes = {
  intl: intlShape.isRequired,
  logo: PropTypes.string,
  onLanguageSelected: PropTypes.func,
  supportedLanguages: PropTypes.arrayOf(PropTypes.shape({
    label: PropTypes.string.isRequired,
    value: PropTypes.string.isRequired
  }))
};
SiteFooter.defaultProps = {
  logo: undefined,
  onLanguageSelected: undefined,
  supportedLanguages: []
};
export default injectIntl(SiteFooter);
export { EVENT_NAMES };
//# sourceMappingURL=Footer.js.map