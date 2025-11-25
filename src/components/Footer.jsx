import React from 'react';
import PropTypes from 'prop-types';
import { injectIntl, intlShape } from '@edx/frontend-platform/i18n';
import { sendTrackEvent } from '@edx/frontend-platform/analytics';
import { ensureConfig } from '@edx/frontend-platform';
import { AppContext } from '@edx/frontend-platform/react';

import googlePlayBadge from '../assets/googleplay.png';
import appStoreBadge from '../assets/appstore.png';

import messages from './Footer.messages';
import LanguageSelector from './LanguageSelector';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faFacebook,
  faInstagram,
  faXTwitter,
  faYoutube,
} from '@fortawesome/free-brands-svg-icons';
import './styles/Footer.css';

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
  }

  handleScroll() {
    // Check if we're at the bottom of the page
    const windowHeight = window.innerHeight;
    const documentHeight = document.documentElement.scrollHeight;
    const scrollTop = window.scrollY || document.documentElement.scrollTop;

    // Add padding to the calculation to account for the footer height
    // This prevents the stuttering effect when scrolling slowly
    // Using a smaller threshold when footer is visible to make it hide quicker when scrolling up
    const bottomThreshold = this.state.isAtBottom ? 30 : 20;

    // Consider "at bottom" when within threshold of the bottom
    const isAtBottom = (windowHeight + scrollTop) >= (documentHeight - bottomThreshold);

    // Only update if the state has changed
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
    const { isLogoHovered, isAtBottom, isInitialLoad } = this.state;
    const showLanguageSelector = supportedLanguages.length > 0 && onLanguageSelected;
    const { config } = this.context;

    const studioUrl = config.STUDIO_BASE_URL
      || config.STUDIO_URL
      || (config.LMS_BASE_URL ? `https://studio.${new URL(config.LMS_BASE_URL).host}` : undefined);

    const footerVisibleClass = isAtBottom && !isInitialLoad ? 'footer-visible' : '';

    return (
      <footer
        role="contentinfo"
        className={`footer-fixed px-4 ${footerVisibleClass}`}
        aria-label="Site footer"
      >
        <div className="container-fluid footer-container">
          <div className="footer-top">
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
              <nav className="footer-colophon">
                <a
                  href={`${config.LMS_BASE_URL}/about`}
                  onClick={this.externalLinkClickHandler}
                  className="footer-link"
                >
                  {intl.formatMessage(messages['footer.colophon.about'])}
                </a>
                <a
                  href={`${config.LMS_BASE_URL}/contact`}
                  onClick={this.externalLinkClickHandler}
                  className="footer-link"
                >
                  {intl.formatMessage(messages['footer.colophon.contact'])}
                </a>
                <a
                  href={`${config.LMS_BASE_URL}/privacy`}
                  onClick={this.externalLinkClickHandler}
                  className="footer-link"
                >
                  {intl.formatMessage(messages['footer.colophon.privacy'])}
                </a>
              </nav>
            </div>

            <div className="footer-app-downloads">
              <div className="footer-app-label">DOWNLOAD OUR APP</div>
              <div className="footer-badges">
                <a
                  className="footer-store-badge play"
                  href="https://play.google.com/store/apps/details?id=org.sherab.app"
                  aria-label="Get it on Google Play"
                  rel="noopener"
                >
                  <img src={googlePlayBadge} alt="Get it on Google Play" loading="lazy" decoding="async" />
                </a>
                <a
                  className="footer-store-badge appstore"
                  href="https://apps.apple.com/us/app/sherab/id6747565399"
                  aria-label="Download on the App Store"
                  rel="noopener"
                >
                  <img src={appStoreBadge} alt="Download on the App Store" loading="lazy" decoding="async" />
                </a>
              </div>
            </div>
          </div>

          <div className="footer-bottom">
            <div className="footer-provider-link">
              <a href={studioUrl || `${config.LMS_BASE_URL}/course-provider`}>
                {intl.formatMessage(messages['footer.becomeCourseProvider'])} &gt;
              </a>
            </div>

            <div className="footer-copyright">
              {intl.formatMessage(messages['footer.copyright'])}
            </div>

            <div className="footer-social-icons">
              <a href="https://www.facebook.com/profile.php?id=61580184195837" className="social-icon" aria-label="Facebook">
                <FontAwesomeIcon icon={faFacebook} />
              </a>
              <a href="https://www.instagram.com/sherab.elearning/" className="social-icon" aria-label="Instagram">
                <FontAwesomeIcon icon={faInstagram} />
              </a>
              <a href="https://x.com/Sherab_edu" className="social-icon" aria-label="X">
                <FontAwesomeIcon icon={faXTwitter} />
              </a>
              <a href="https://www.youtube.com/@SherabLMS" className="social-icon" aria-label="YouTube">
                <FontAwesomeIcon icon={faYoutube} />
              </a>
            </div>
          </div>

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
