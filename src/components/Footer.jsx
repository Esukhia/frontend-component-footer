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
    // Start with footer hidden
    this.state = {
      isLogoHovered: false,
      isAtBottom: false,
      isInitialLoad: true, // Track initial page load
    };
  }

  componentDidMount() {
    // Add scroll event listener
    window.addEventListener('scroll', this.handleScroll, { passive: true });

    // Set a timeout to mark the initial load phase as complete
    // This ensures the footer stays hidden on initial load
    setTimeout(() => {
      this.setState({ isInitialLoad: false });
      // Only then check if we should show the footer
      this.handleScroll();
    }, 500);
  }

  componentWillUnmount() {
    window.removeEventListener('scroll', this.handleScroll);
    // Clean up by removing the body class when component unmounts
    document.body.classList.remove('has-visible-footer');
  }

  handleScroll() {
    // Check if we're at the bottom of the page
    const windowHeight = window.innerHeight;
    const documentHeight = document.documentElement.scrollHeight;
    const scrollTop = window.scrollY || document.documentElement.scrollTop;

    // Add padding to the calculation to account for the footer height
    // This prevents the stuttering effect when scrolling slowly
    const footerHeight = 80; // Same as in CSS
    const bottomThreshold = this.state.isAtBottom ? (20 + footerHeight) : 20;

    // Consider "at bottom" when within threshold of the bottom
    const isAtBottom = (windowHeight + scrollTop) >= (documentHeight - bottomThreshold);

    // Only update if the state has changed
    if (isAtBottom !== this.state.isAtBottom) {
      this.setState({ isAtBottom });

      // Use a small delay to avoid immediate layout recalculation
      // Only manipulate the DOM class if we're past the initial load
      if (!this.state.isInitialLoad) {
        setTimeout(() => {
          // Use toggle instead of add/remove for cleaner code
          document.body.classList.toggle('has-visible-footer', isAtBottom);
        }, 10);
      }
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
    const { isLogoHovered, isAtBottom, isInitialLoad } = this.state;
    const showLanguageSelector = supportedLanguages.length > 0 && onLanguageSelected;
    const { config } = this.context;

    // Force footer to be hidden on initial load
    const footerVisibleClass = (isAtBottom && !isInitialLoad) ? 'footer-visible' : '';

    return (
      <footer
        ref={this.footerRef}
        role="contentinfo"
        className={`footer-fixed py-0 px-4 ${footerVisibleClass}`}
        aria-label="Site footer"
        style={{ display: isInitialLoad ? 'none' : 'flex' }} /* Force hide on initial load */
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
