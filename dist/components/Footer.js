function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function _defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o); } }
function _createClass(e, r, t) { return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function _callSuper(t, o, e) { return o = _getPrototypeOf(o), _possibleConstructorReturn(t, _isNativeReflectConstruct() ? Reflect.construct(o, e || [], _getPrototypeOf(t).constructor) : o.apply(t, e)); }
function _possibleConstructorReturn(t, e) { if (e && ("object" == _typeof(e) || "function" == typeof e)) return e; if (void 0 !== e) throw new TypeError("Derived constructors may only return object or undefined"); return _assertThisInitialized(t); }
function _assertThisInitialized(e) { if (void 0 === e) throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); return e; }
function _isNativeReflectConstruct() { try { var t = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); } catch (t) {} return (_isNativeReflectConstruct = function _isNativeReflectConstruct() { return !!t; })(); }
function _getPrototypeOf(t) { return _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function (t) { return t.__proto__ || Object.getPrototypeOf(t); }, _getPrototypeOf(t); }
function _inherits(t, e) { if ("function" != typeof e && null !== e) throw new TypeError("Super expression must either be null or a function"); t.prototype = Object.create(e && e.prototype, { constructor: { value: t, writable: !0, configurable: !0 } }), Object.defineProperty(t, "prototype", { writable: !1 }), e && _setPrototypeOf(t, e); }
function _setPrototypeOf(t, e) { return _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function (t, e) { return t.__proto__ = e, t; }, _setPrototypeOf(t, e); }
import React from 'react';
import PropTypes from 'prop-types';
import { injectIntl, intlShape } from '@edx/frontend-platform/i18n';
import { sendTrackEvent } from '@edx/frontend-platform/analytics';
import { ensureConfig } from '@edx/frontend-platform';
import { AppContext } from '@edx/frontend-platform/react';
import messages from './Footer.messages';
import LanguageSelector from './LanguageSelector';
import './styles/Footer.css';
ensureConfig(['LMS_BASE_URL', 'LOGO_TRADEMARK_URL'], 'Footer component');
var EVENT_NAMES = {
  FOOTER_LINK: 'edx.bi.footer.link'
};
var SiteFooter = /*#__PURE__*/function (_React$Component) {
  function SiteFooter(props) {
    var _this;
    _classCallCheck(this, SiteFooter);
    _this = _callSuper(this, SiteFooter, [props]);
    _this.externalLinkClickHandler = _this.externalLinkClickHandler.bind(_this);
    _this.handleScroll = _this.handleScroll.bind(_this);
    // Start with footer hidden
    _this.state = {
      isLogoHovered: false,
      isAtBottom: false,
      isInitialLoad: true // Track initial page load
    };
    return _this;
  }
  _inherits(SiteFooter, _React$Component);
  return _createClass(SiteFooter, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      var _this2 = this;
      // Add scroll event listener
      window.addEventListener('scroll', this.handleScroll, {
        passive: true
      });

      // Set a timeout to mark the initial load phase as complete
      // This ensures the footer stays hidden on initial load
      setTimeout(function () {
        _this2.setState({
          isInitialLoad: false
        });
        // Only then check if we should show the footer
        _this2.handleScroll();
      }, 500);
    }
  }, {
    key: "componentWillUnmount",
    value: function componentWillUnmount() {
      window.removeEventListener('scroll', this.handleScroll);
    }
  }, {
    key: "handleScroll",
    value: function handleScroll() {
      // Check if we're at the bottom of the page
      var windowHeight = window.innerHeight;
      var documentHeight = document.documentElement.scrollHeight;
      var scrollTop = window.scrollY || document.documentElement.scrollTop;

      // Add padding to the calculation to account for the footer height
      // This prevents the stuttering effect when scrolling slowly
      var footerHeight = 80; // Same as in CSS
      var bottomThreshold = this.state.isAtBottom ? 20 + footerHeight : 20;

      // Consider "at bottom" when within threshold of the bottom
      var isAtBottom = windowHeight + scrollTop >= documentHeight - bottomThreshold;

      // Only update if the state has changed
      if (isAtBottom !== this.state.isAtBottom) {
        this.setState({
          isAtBottom: isAtBottom
        });
      }
    }
  }, {
    key: "externalLinkClickHandler",
    value: function externalLinkClickHandler(event) {
      var label = event.currentTarget.getAttribute('href');
      var eventName = EVENT_NAMES.FOOTER_LINK;
      var properties = {
        category: 'outbound_link',
        label: label
      };
      sendTrackEvent(eventName, properties);
    }
  }, {
    key: "render",
    value: function render() {
      var _this3 = this;
      var _this$props = this.props,
        supportedLanguages = _this$props.supportedLanguages,
        onLanguageSelected = _this$props.onLanguageSelected,
        logo = _this$props.logo,
        intl = _this$props.intl;
      var _this$state = this.state,
        isLogoHovered = _this$state.isLogoHovered,
        isAtBottom = _this$state.isAtBottom,
        isInitialLoad = _this$state.isInitialLoad;
      var showLanguageSelector = supportedLanguages.length > 0 && onLanguageSelected;
      var config = this.context.config;
      var footerVisibleClass = isAtBottom && !isInitialLoad ? 'footer-visible' : '';
      return /*#__PURE__*/React.createElement("footer", {
        role: "contentinfo",
        className: "footer-fixed py-0 px-4 ".concat(footerVisibleClass),
        "aria-label": "Site footer"
      }, /*#__PURE__*/React.createElement("div", {
        className: "container-fluid footer-container"
      }, /*#__PURE__*/React.createElement("div", {
        className: "logo-wrapper"
      }, /*#__PURE__*/React.createElement("a", {
        className: "logo-link ".concat(isLogoHovered ? 'logo-link-hover' : ''),
        href: config.LMS_BASE_URL,
        "aria-label": intl.formatMessage(messages['footer.logo.ariaLabel']),
        onMouseEnter: function onMouseEnter() {
          return _this3.setState({
            isLogoHovered: true
          });
        },
        onMouseLeave: function onMouseLeave() {
          return _this3.setState({
            isLogoHovered: false
          });
        }
      }, /*#__PURE__*/React.createElement("img", {
        className: "logo-image",
        src: logo || config.LOGO_TRADEMARK_URL,
        alt: intl.formatMessage(messages['footer.logo.altText'])
      }), /*#__PURE__*/React.createElement("div", {
        className: "custom-tooltip ".concat(isLogoHovered ? 'custom-tooltip-visible' : ''),
        role: "tooltip",
        "aria-hidden": !isLogoHovered
      }, intl.formatMessage(messages['footer.logo.hoverText']))), /*#__PURE__*/React.createElement("nav", {
        className: "footer-colophon"
      }, /*#__PURE__*/React.createElement("a", {
        href: "".concat(config.LMS_BASE_URL, "/about"),
        onClick: this.externalLinkClickHandler,
        className: "footer-link"
      }, intl.formatMessage(messages['footer.colophon.about'])), /*#__PURE__*/React.createElement("a", {
        href: "".concat(config.LMS_BASE_URL, "/contact"),
        onClick: this.externalLinkClickHandler,
        className: "footer-link"
      }, intl.formatMessage(messages['footer.colophon.contact'])), /*#__PURE__*/React.createElement("a", {
        href: "".concat(config.LMS_BASE_URL, "/privacy"),
        onClick: this.externalLinkClickHandler,
        className: "footer-link"
      }, intl.formatMessage(messages['footer.colophon.privacy'])))), /*#__PURE__*/React.createElement("div", {
        className: "flex-grow-1"
      }), showLanguageSelector && /*#__PURE__*/React.createElement("div", {
        className: "language-selector-wrapper"
      }, /*#__PURE__*/React.createElement(LanguageSelector, {
        options: supportedLanguages,
        onSubmit: onLanguageSelected
      }))));
    }
  }]);
}(React.Component);
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