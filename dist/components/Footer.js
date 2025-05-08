function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
import React from 'react';
import PropTypes from 'prop-types';
import { injectIntl, intlShape } from '@edx/frontend-platform/i18n';
import { sendTrackEvent } from '@edx/frontend-platform/analytics';
import { ensureConfig } from '@edx/frontend-platform';
import { AppContext } from '@edx/frontend-platform/react';
import messages from './Footer.messages';
import LanguageSelector from './LanguageSelector';
ensureConfig(['LMS_BASE_URL', 'LOGO_TRADEMARK_URL'], 'Footer component');
const EVENT_NAMES = {
  FOOTER_LINK: 'edx.bi.footer.link'
};

// CSS for logo hover effect
const logoStyles = {
  logoLink: {
    position: 'relative',
    display: 'block',
    transition: 'transform 0.2s ease-in-out'
  },
  logoHoverText: {
    position: 'absolute',
    top: '-25px',
    left: '50%',
    transform: 'translateX(-50%)',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    color: 'white',
    padding: '4px 8px',
    borderRadius: '4px',
    fontSize: '12px',
    opacity: 0,
    visibility: 'hidden',
    transition: 'opacity 0.3s, visibility 0.3s',
    whiteSpace: 'nowrap'
  },
  logoLinkHover: {
    transform: 'scale(1.05)'
  },
  logoHoverTextVisible: {
    opacity: 1,
    visibility: 'visible'
  }
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
      className: "footer d-flex border-top py-3 px-4"
    }, /*#__PURE__*/React.createElement("div", {
      className: "container-fluid d-flex"
    }, /*#__PURE__*/React.createElement("a", {
      style: _objectSpread(_objectSpread({}, logoStyles.logoLink), isLogoHovered ? logoStyles.logoLinkHover : {}),
      className: "d-block",
      href: config.LMS_BASE_URL,
      "aria-label": intl.formatMessage(messages['footer.logo.ariaLabel']),
      title: intl.formatMessage(messages['footer.logo.hoverText']),
      onMouseEnter: () => this.setState({
        isLogoHovered: true
      }),
      onMouseLeave: () => this.setState({
        isLogoHovered: false
      })
    }, /*#__PURE__*/React.createElement("img", {
      style: {
        maxHeight: 45
      },
      src: logo || config.LOGO_TRADEMARK_URL,
      alt: intl.formatMessage(messages['footer.logo.altText'])
    }), /*#__PURE__*/React.createElement("span", {
      style: _objectSpread(_objectSpread({}, logoStyles.logoHoverText), isLogoHovered ? logoStyles.logoHoverTextVisible : {})
    }, intl.formatMessage(messages['footer.logo.hoverText']))), /*#__PURE__*/React.createElement("div", {
      className: "flex-grow-1"
    }), showLanguageSelector && /*#__PURE__*/React.createElement(LanguageSelector, {
      options: supportedLanguages,
      onSubmit: onLanguageSelected
    })));
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