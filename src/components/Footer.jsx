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
    this.handleTouchStart = this.handleTouchStart.bind(this);
    this.handleTouchMove = this.handleTouchMove.bind(this);
    this.handleTouchEnd = this.handleTouchEnd.bind(this);
    this.footerRef = React.createRef();
    this.state = {
      isLogoHovered: false,
      isOverscrolling: false,
    };
  }

  componentDidMount() {
    window.addEventListener('scroll', this.handleScroll, { passive: true });
    // Add touch event listeners for mobile
    document.addEventListener('touchstart', this.handleTouchStart, { passive: true });
    document.addEventListener('touchmove', this.handleTouchMove, { passive: true });
    document.addEventListener('touchend', this.handleTouchEnd, { passive: true });
  }

  componentWillUnmount() {
    window.removeEventListener('scroll', this.handleScroll);
    document.removeEventListener('touchstart', this.handleTouchStart);
    document.removeEventListener('touchmove', this.handleTouchMove);
    document.removeEventListener('touchend', this.handleTouchEnd);
  }

  handleScroll() {
    // Check if at bottom of page
    if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight) {
      // User is at the bottom of the page
      this.setState({ isOverscrolling: true });

      // Reset after animation completes
      clearTimeout(this.overscrollTimeout);
      this.overscrollTimeout = setTimeout(() => {
        this.setState({ isOverscrolling: false });
      }, 200);
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
    const { isLogoHovered, isOverscrolling } = this.state;
    const showLanguageSelector = supportedLanguages.length > 0 && onLanguageSelected;
    const { config } = this.context;

    return (
      <footer
        role="contentinfo"
        className={`footer-fixed py-0 px-4 ${isOverscrolling ? 'overscroll' : ''}`}
        aria-label="Site footer"
        ref={this.footerRef}
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
