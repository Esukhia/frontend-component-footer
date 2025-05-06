import React from 'react';
import PropTypes from 'prop-types';
import { injectIntl, intlShape } from '@edx/frontend-platform/i18n';
import { sendTrackEvent } from '@edx/frontend-platform/analytics';
import { ensureConfig } from '@edx/frontend-platform';
import { AppContext } from '@edx/frontend-platform/react';

import messages from './Footer.messages';
import LanguageSelector from './LanguageSelector';

ensureConfig([
  'LMS_BASE_URL',
  'LOGO_TRADEMARK_URL',
], 'Footer component');

const EVENT_NAMES = {
  FOOTER_LINK: 'edx.bi.footer.link',
};

// CSS for logo hover effect
const logoStyles = {
  logoLink: {
    position: 'relative',
    display: 'block',
    transition: 'transform 0.2s ease-in-out',
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
    whiteSpace: 'nowrap',
  },
  logoLinkHover: {
    transform: 'scale(1.05)',
  },
  logoHoverTextVisible: {
    opacity: 1,
    visibility: 'visible',
  }
};

class SiteFooter extends React.Component {
  constructor(props) {
    super(props);
    this.externalLinkClickHandler = this.externalLinkClickHandler.bind(this);
    this.state = {
      isLogoHovered: false,
    };
  }

  externalLinkClickHandler(event) {
    const label = event.currentTarget.getAttribute('href');
    const eventName = EVENT_NAMES.FOOTER_LINK;
    const properties = {
      category: 'outbound_link',
      label,
    };
    sendTrackEvent(eventName, properties);
  }

  render() {
    const {
      supportedLanguages,
      onLanguageSelected,
      logo,
      intl,
    } = this.props;
    const { isLogoHovered } = this.state;
    const showLanguageSelector = supportedLanguages.length > 0 && onLanguageSelected;
    const { config } = this.context;

    return (
      <footer
        role="contentinfo"
        className="footer d-flex border-top py-3 px-4"
      >
        <div className="container-fluid d-flex">
          <a
            style={{
              ...logoStyles.logoLink,
              ...(isLogoHovered ? logoStyles.logoLinkHover : {}),
            }}
            className="d-block"
            href={config.LMS_BASE_URL}
            aria-label={intl.formatMessage(messages['footer.logo.ariaLabel'])}
            title={intl.formatMessage(messages['footer.logo.hoverText'])}
            onMouseEnter={() => this.setState({ isLogoHovered: true })}
            onMouseLeave={() => this.setState({ isLogoHovered: false })}
          >
            <img
              style={{ maxHeight: 45 }}
              src={logo || config.LOGO_TRADEMARK_URL}
              alt={intl.formatMessage(messages['footer.logo.altText'])}
            />
            <span style={{
              ...logoStyles.logoHoverText,
              ...(isLogoHovered ? logoStyles.logoHoverTextVisible : {}),
            }}>
              {intl.formatMessage(messages['footer.logo.hoverText'])}
            </span>
          </a>
          <div className="flex-grow-1" />
          {showLanguageSelector && (
            <LanguageSelector
              options={supportedLanguages}
              onSubmit={onLanguageSelected}
            />
          )}
        </div>
      </footer>
    );
  }
}

SiteFooter.contextType = AppContext;

SiteFooter.propTypes = {
  intl: intlShape.isRequired,
  logo: PropTypes.string,
  onLanguageSelected: PropTypes.func,
  supportedLanguages: PropTypes.arrayOf(PropTypes.shape({
    label: PropTypes.string.isRequired,
    value: PropTypes.string.isRequired,
  })),
};

SiteFooter.defaultProps = {
  logo: undefined,
  onLanguageSelected: undefined,
  supportedLanguages: [],
};

export default injectIntl(SiteFooter);
export { EVENT_NAMES };
