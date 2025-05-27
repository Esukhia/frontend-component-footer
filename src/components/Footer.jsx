import React from 'react';
import PropTypes from 'prop-types';
import { injectIntl, intlShape } from '@edx/frontend-platform/i18n';
import { sendTrackEvent } from '@edx/frontend-platform/analytics';
import { ensureConfig } from '@edx/frontend-platform';
import { AppContext } from '@edx/frontend-platform/react';

import messages from './Footer.messages';
import LanguageSelector from './LanguageSelector';
import './styles/FixedFooter.css';

ensureConfig([
  'LMS_BASE_URL',
  'LOGO_TRADEMARK_URL',
], 'Footer component');

const EVENT_NAMES = {
  FOOTER_LINK: 'edx.bi.footer.link',
};

class SiteFooter extends React.Component {
  constructor(props) {
    super(props);
    this.externalLinkClickHandler = this.externalLinkClickHandler.bind(this);
    this.handleScroll = this.handleScroll.bind(this);
    this.state = {
      isLogoHovered: false,
      isAtBottom: false,
    };
  }

  componentDidMount() {
    // First set initial state to ensure footer is hidden
    this.setState({ isAtBottom: false });

    // Add scroll event listener
    window.addEventListener('scroll', this.handleScroll, { passive: true });

    // Wait for page to be fully loaded before checking scroll position
    if (document.readyState === 'complete') {
      this.handleScroll();
    } else {
      window.addEventListener('load', this.handleScroll, { once: true });
    }
  }

  componentWillUnmount() {
    window.removeEventListener('scroll', this.handleScroll);
  }

  handleScroll() {
    // Check if we're at the bottom of the page
    const windowHeight = window.innerHeight;
    const documentHeight = document.documentElement.scrollHeight;
    const scrollTop = window.scrollY || document.documentElement.scrollTop;

    // Consider "at bottom" when within 20px of the bottom or at the bottom
    const isAtBottom = (windowHeight + scrollTop) >= (documentHeight - 20);

    if (isAtBottom !== this.state.isAtBottom) {
      this.setState({ isAtBottom });
    }
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
    const { isLogoHovered, isAtBottom } = this.state;
    const showLanguageSelector = supportedLanguages.length > 0 && onLanguageSelected;
    const { config } = this.context;

    return (
      <footer
        role="contentinfo"
        className={`footer-fixed py-0 px-4 ${isAtBottom ? 'footer-visible' : ''}`}
        aria-label="Site footer"
      >
        <div className="container-fluid footer-container">
          <div className="logo-wrapper">
            <a
              className={`logo-link ${isLogoHovered ? 'logo-link-hover' : ''}`}
              href={config.LMS_BASE_URL}
              aria-label={intl.formatMessage(messages['footer.logo.ariaLabel'])}
              onMouseEnter={() => this.setState({ isLogoHovered: true })}
              onMouseLeave={() => this.setState({ isLogoHovered: false })}
            >
              <img
                className="logo-image"
                src={logo || config.LOGO_TRADEMARK_URL}
                alt={intl.formatMessage(messages['footer.logo.altText'])}
              />
              <div
                className={`custom-tooltip ${isLogoHovered ? 'custom-tooltip-visible' : ''}`}
                role="tooltip"
                aria-hidden={!isLogoHovered}
              >
                {intl.formatMessage(messages['footer.logo.hoverText'])}
              </div>
            </a>
          </div>

          <div className="flex-grow-1" />

          {showLanguageSelector && (
            <div className="language-selector-wrapper">
              <LanguageSelector
                options={supportedLanguages}
                onSubmit={onLanguageSelected}
              />
            </div>
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
