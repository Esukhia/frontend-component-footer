const _excluded = ["containerClassName"];
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function _objectWithoutProperties(e, t) { if (null == e) return {}; var o, r, i = _objectWithoutPropertiesLoose(e, t); if (Object.getOwnPropertySymbols) { var n = Object.getOwnPropertySymbols(e); for (r = 0; r < n.length; r++) o = n[r], -1 === t.indexOf(o) && {}.propertyIsEnumerable.call(e, o) && (i[o] = e[o]); } return i; }
function _objectWithoutPropertiesLoose(r, e) { if (null == r) return {}; var t = {}; for (var n in r) if ({}.hasOwnProperty.call(r, n)) { if (-1 !== e.indexOf(n)) continue; t[n] = r[n]; } return t; }
import React, { useContext, useState } from 'react';
import isEmpty from 'lodash/isEmpty';
import { useIntl, FormattedMessage } from '@edx/frontend-platform/i18n';
import { ensureConfig } from '@edx/frontend-platform';
import { AppContext } from '@edx/frontend-platform/react';
import { ActionRow, Button, Container, Hyperlink, TransitionReplace } from '@openedx/paragon';
import { ExpandLess, ExpandMore, Help } from '@openedx/paragon/icons';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import messages from './messages';
import StudioFooterLogoSlot from '../../plugin-slots/StudioFooterLogoSlot';
ensureConfig(['LMS_BASE_URL', 'MARKETING_SITE_BASE_URL', 'TERMS_OF_SERVICE_URL', 'PRIVACY_POLICY_URL', 'SUPPORT_EMAIL', 'SITE_NAME', 'STUDIO_BASE_URL', 'ENABLE_ACCESSIBILITY_PAGE'], 'Studio Footer component');
const StudioFooter = _ref => {
  let {
    containerProps
  } = _ref;
  const intl = useIntl();
  const [isOpen, setIsOpen] = useState(false);
  const {
    config
  } = useContext(AppContext);
  const _ref2 = containerProps || {},
    {
      containerClassName
    } = _ref2,
    restContainerProps = _objectWithoutProperties(_ref2, _excluded);
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    className: "m-0 mt-6 row align-items-center justify-content-center"
  }, /*#__PURE__*/React.createElement("div", {
    className: "col border-top mr-2"
  }), /*#__PURE__*/React.createElement(Button, {
    "data-testid": "helpToggleButton",
    variant: "outline-primary",
    onClick: () => setIsOpen(!isOpen),
    iconBefore: Help,
    iconAfter: isOpen ? ExpandLess : ExpandMore,
    size: "sm"
  }, isOpen ? intl.formatMessage(messages.closeHelpButtonLabel) : intl.formatMessage(messages.openHelpButtonLabel)), /*#__PURE__*/React.createElement("div", {
    className: "col border-top ml-2"
  })), /*#__PURE__*/React.createElement(Container, _extends({
    size: "xl",
    className: classNames('px-4', containerClassName)
  }, restContainerProps), /*#__PURE__*/React.createElement(TransitionReplace, null, isOpen ? /*#__PURE__*/React.createElement(ActionRow, {
    key: "help-link-button-row",
    className: "py-4",
    "data-testid": "helpButtonRow"
  }, /*#__PURE__*/React.createElement(ActionRow.Spacer, null), /*#__PURE__*/React.createElement(Button, {
    as: "a",
    href: "https://docs.openedx.org/",
    size: "sm"
  }, /*#__PURE__*/React.createElement(FormattedMessage, messages.edxDocumentationButtonLabel)), /*#__PURE__*/React.createElement(Button, {
    as: "a",
    href: "https://openedx.org/",
    size: "sm",
    "data-testid": "openEdXPortalButton"
  }, /*#__PURE__*/React.createElement(FormattedMessage, messages.openEdxPortalButtonLabel)), /*#__PURE__*/React.createElement(Button, {
    as: "a",
    href: "https://www.edx.org/course/edx101-overview-of-creating-an-edx-course#.VO4eaLPF-n1",
    size: "sm"
  }, /*#__PURE__*/React.createElement(FormattedMessage, messages.edx101ButtonLabel)), /*#__PURE__*/React.createElement(Button, {
    as: "a",
    href: "https://www.edx.org/course/studiox-creating-a-course-with-edx-studio",
    size: "sm"
  }, /*#__PURE__*/React.createElement(FormattedMessage, messages.studioXButtonLabel)), !isEmpty(config.SUPPORT_EMAIL) && /*#__PURE__*/React.createElement(Button, {
    as: "a",
    href: `mailto:${config.SUPPORT_EMAIL}`,
    size: "sm",
    "data-testid": "contactUsButton"
  }, /*#__PURE__*/React.createElement(FormattedMessage, messages.contactUsButtonLabel)), /*#__PURE__*/React.createElement(ActionRow.Spacer, null)) : null), /*#__PURE__*/React.createElement(ActionRow, {
    className: "pt-3 m-0 x-small"
  }, "\xA9 ", new Date().getFullYear(), " ", /*#__PURE__*/React.createElement(Hyperlink, {
    destination: config.MARKETING_SITE_BASE_URL,
    target: "_blank",
    className: "ml-2"
  }, config.SITE_NAME), /*#__PURE__*/React.createElement(ActionRow.Spacer, null), !isEmpty(config.TERMS_OF_SERVICE_URL) && /*#__PURE__*/React.createElement(Hyperlink, {
    destination: config.TERMS_OF_SERVICE_URL,
    "data-testid": "termsOfService"
  }, intl.formatMessage(messages.termsOfServiceLinkLabel)), !isEmpty(config.PRIVACY_POLICY_URL) && /*#__PURE__*/React.createElement(Hyperlink, {
    destination: config.PRIVACY_POLICY_URL,
    "data-testid": "privacyPolicy"
  }, intl.formatMessage(messages.privacyPolicyLinkLabel)), config.ENABLE_ACCESSIBILITY_PAGE === 'true' && /*#__PURE__*/React.createElement(Hyperlink, {
    destination: `${config.STUDIO_BASE_URL}/accessibility`,
    "data-testid": "accessibilityRequest"
  }, intl.formatMessage(messages.accessibilityRequestLinkLabel)), /*#__PURE__*/React.createElement(Hyperlink, {
    destination: config.LMS_BASE_URL
  }, "LMS")), /*#__PURE__*/React.createElement(ActionRow, {
    className: "mt-3 pb-4 x-small justify-content-center"
  }, /*#__PURE__*/React.createElement(StudioFooterLogoSlot, null))));
};
StudioFooter.propTypes = {
  containerProps: PropTypes.shape(Container.propTypes)
};
StudioFooter.defaultProps = {
  containerProps: {}
};
export default StudioFooter;
//# sourceMappingURL=StudioFooter.js.map