import React from 'react';
import PropTypes from 'prop-types';
import SiteFooter from './Footer';

/**
 * SiteLayout component that implements the sticky footer pattern.
 * Wrap your application content with this component to ensure the footer
 * stays at the bottom of the page regardless of content amount.
 */
const SiteLayout = ({ children, footerProps }) => (
  <div className="site-wrapper">
    <div className="site-content">
      {children}
    </div>
    <SiteFooter {...footerProps} />
  </div>
);

SiteLayout.propTypes = {
  children: PropTypes.node.isRequired,
  footerProps: PropTypes.shape({
    logo: PropTypes.string,
    onLanguageSelected: PropTypes.func,
    supportedLanguages: PropTypes.arrayOf(PropTypes.shape({
      label: PropTypes.string.isRequired,
      value: PropTypes.string.isRequired,
    })),
  }),
};

SiteLayout.defaultProps = {
  footerProps: {},
};

export default SiteLayout;
