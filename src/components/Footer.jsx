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
    this.throttledScrollHandler = this.throttledScrollHandler.bind(this);
    this.handleTouchStart = this.handleTouchStart.bind(this);
    this.handleTouchMove = this.handleTouchMove.bind(this);
    this.handleTouchEnd = this.handleTouchEnd.bind(this);
    this.scrollThrottleTimer = null;
    this.state = {
      isLogoHovered: false,
      isOverscrolling: false,
      isVisible: false,
    };
  }

  componentDidMount() {
    // Use a throttled scroll handler to prevent stuttering
    window.addEventListener('scroll', this.throttledScrollHandler, { passive: true });

    // Add touch event listeners for mobile
    document.addEventListener('touchstart', this.handleTouchStart, { passive: true });
    document.addEventListener('touchmove', this.handleTouchMove, { passive: true });
    document.addEventListener('touchend', this.handleTouchEnd, { passive: true });

    // Initial check for scroll position - use a small delay to ensure DOM is ready
    setTimeout(() => this.handleScroll(), 100);
  }
  
  // Throttle scroll events to improve performance
  throttledScrollHandler() {
    if (!this.scrollThrottleTimer) {
      this.scrollThrottleTimer = setTimeout(() => {
        this.handleScroll();
        this.scrollThrottleTimer = null;
      }, 10); // Small delay to smooth out multiple scroll events
    }
  }

  componentWillUnmount() {
    window.removeEventListener('scroll', this.throttledScrollHandler);

    document.removeEventListener('touchstart', this.handleTouchStart);
    document.removeEventListener('touchmove', this.handleTouchMove);
    document.removeEventListener('touchend', this.handleTouchEnd);

    // Clean up body class when component unmounts
    document.body.classList.remove('has-visible-footer');

    // Clear any pending timeouts
    clearTimeout(this.overscrollTimeout);
    clearTimeout(this.scrollThrottleTimer);
  }

  handleScroll() {
    // Calculate how close to the bottom the user is
    const scrollPosition = window.innerHeight + window.scrollY;
    const docHeight = Math.max(
      document.body.scrollHeight,
      document.body.offsetHeight,
      document.documentElement.clientHeight,
      document.documentElement.scrollHeight,
      document.documentElement.offsetHeight
    );
    
    // Only show footer when truly at the end (within 20px)
    const bottomThreshold = docHeight - 20; // Show only when at the very end
    const isAtVeryBottom = scrollPosition >= docHeight - 5;

    // Update visibility based on scroll position
    const isNearBottom = scrollPosition >= bottomThreshold;
    
    // Handle visibility changes
    if (this.state.isVisible !== isNearBottom) {
      // Update body class first for smoother transition
      if (isNearBottom) {
        document.body.classList.add('has-visible-footer');
      } else {
        document.body.classList.remove('has-visible-footer');
      }
      
      // Then update component state
      this.setState({ isVisible: isNearBottom });
    }

    // Handle overscroll effect separately
    if (isAtVeryBottom && !this.state.isOverscrolling) {
      this.setState({ isOverscrolling: true });
      
      // Reset after animation completes
      clearTimeout(this.overscrollTimeout);
      this.overscrollTimeout = setTimeout(() => {
        this.setState({ isOverscrolling: false });
      }, 100); // Even faster reset time
    }
  }

  handleTouchStart(e) {
    this.touchStartY = e.touches[0].clientY;
    this.isScrollingAtBottom = (window.innerHeight + window.scrollY) >= document.body.offsetHeight - 5;
  }

  handleTouchMove(e) {
    if (!this.touchStartY) { return; }

    const touchY = e.touches[0].clientY;
    const diff = touchY - this.touchStartY;

    // If scrolled to bottom and trying to scroll further down
    if (this.isScrollingAtBottom && diff > 10) {
      this.setState({ isOverscrolling: true });
    }
  }

  handleTouchEnd() {
    if (this.state.isOverscrolling) {
      setTimeout(() => {
        this.setState({ isOverscrolling: false });
      }, 200);
    }
    this.touchStartY = null;
    this.isScrollingAtBottom = false;
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
    const { isLogoHovered, isOverscrolling, isVisible } = this.state;
    const showLanguageSelector = supportedLanguages.length > 0 && onLanguageSelected;
    const { config } = this.context;

    return (
      <footer
        role="contentinfo"
        className={`footer-fixed py-0 px-4 ${isVisible ? 'visible' : ''} ${isOverscrolling ? 'overscroll' : ''}`}
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
