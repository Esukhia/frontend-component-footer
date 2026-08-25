import React from 'react';
import PropTypes from 'prop-types';
import { injectIntl, intlShape } from '@edx/frontend-platform/i18n';
import { sendTrackEvent } from '@edx/frontend-platform/analytics';
import { ensureConfig } from '@edx/frontend-platform';
import { AppContext } from '@edx/frontend-platform/react';

import messages from './Footer.messages';
import LanguageSelector from './LanguageSelector';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faApple,
  faFacebook,
  faGooglePlay,
  faInstagram,
  faXTwitter,
  faYoutube,
} from '@fortawesome/free-brands-svg-icons';

ensureConfig([
  'LMS_BASE_URL',
  'LOGO_TRADEMARK_URL',
  'SITE_NAME',
  'CATALOG_MICROFRONTEND_URL',
], 'Footer component');

const EVENT_NAMES = {
  FOOTER_LINK: 'edx.bi.footer.link',
};

// Placeholder until final destination URLs are provided.
const PLACEHOLDER_URL = '#';
const GOOGLE_PLAY_URL = 'https://play.google.com/store/apps/details?id=org.sherab.app';
const APP_STORE_URL = 'https://apps.apple.com/us/app/sherab/id6747565399';

class SiteFooter extends React.Component {
  constructor(props) {
    super(props);
    this.externalLinkClickHandler = this.externalLinkClickHandler.bind(this);
    this.handleNarrowChange = this.handleNarrowChange.bind(this);
    this.narrowQuery = null;
    this.state = {
      isLogoHovered: false,
      isNarrow: false, // Below the mobile breakpoint the link columns collapse
      openColumns: {}, // Which columns are expanded while narrow
    };
  }

  componentDidMount() {
    // Track the mobile breakpoint so link columns can act as accordions.
    if (typeof window !== 'undefined' && window.matchMedia) {
      this.narrowQuery = window.matchMedia('(max-width: 600px)');
      this.setState({ isNarrow: this.narrowQuery.matches });
      this.narrowQuery.addEventListener('change', this.handleNarrowChange);
    }
  }

  componentWillUnmount() {
    if (this.narrowQuery) {
      this.narrowQuery.removeEventListener('change', this.handleNarrowChange);
    }
  }

  handleNarrowChange(event) {
    this.setState({ isNarrow: event.matches });
  }

  isColumnOpen(columnId) {
    // Above the breakpoint every column is always open.
    return !this.state.isNarrow || !!this.state.openColumns[columnId];
  }

  toggleColumn(columnId) {
    if (!this.state.isNarrow) { return; }
    this.setState((prev) => ({
      openColumns: { ...prev.openColumns, [columnId]: !prev.openColumns[columnId] },
    }));
  }

  renderColumnTitle(columnId, messageKey) {
    const { intl } = this.props;
    const open = this.isColumnOpen(columnId);
    return (
      <button
        type="button"
        className="ft-col-title"
        aria-expanded={open}
        aria-controls={`ft-col-${columnId}`}
        onClick={() => this.toggleColumn(columnId)}
      >
        {intl.formatMessage(messages[messageKey])}
        <svg
          className="ft-col-chev"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          aria-hidden="true"
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>
    );
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
        className="site-footer"
        aria-label="Site footer"
      >
        <div className="footer-container">
          <div className="ft-grid">
            <div className="ft-brand">
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
                <span className="ft-brand-name">
                  {config.SITE_NAME}
                </span>
                <div
                  className={`custom-tooltip ${isLogoHovered ? 'custom-tooltip-visible' : ''}`}
                  role="tooltip"
                  aria-hidden={!isLogoHovered}
                >
                  {intl.formatMessage(messages['footer.logo.hoverText'])}
                </div>
              </a>
              <p className="ft-tagline">
                {intl.formatMessage(messages['footer.brand.tagline'])}
              </p>
            </div>

            <div className={`ft-col ${this.isColumnOpen('company') ? 'is-open' : ''}`}>
              {this.renderColumnTitle('company', 'footer.column.company')}
              <nav className="ft-col-body" id="ft-col-company">
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

            <div className={`ft-col ${this.isColumnOpen('learn') ? 'is-open' : ''}`}>
              {this.renderColumnTitle('learn', 'footer.column.learn')}
              <nav className="ft-col-body" id="ft-col-learn">
                <a
                  href={`${config.LMS_BASE_URL}/courses`}
                  onClick={this.externalLinkClickHandler}
                  className="footer-link"
                > 
  {intl.formatMessage(messages['footer.learn.exploreCourses'])}
</a>
                <a
                  href={`${(config.CATALOG_MICROFRONTEND_URL || '').replace(/\/$/, '')}/#partner-carousel-title`}
                  className="footer-link"
                >
                  {intl.formatMessage(messages['footer.learn.schoolsPartners'])}
                </a>
                <a href={PLACEHOLDER_URL} className="footer-link">
                  {intl.formatMessage(messages['footer.learn.becomePartner'])}
                </a>
              </nav>
            </div>

            <div className={`ft-col ft-col-app ${this.isColumnOpen('app') ? 'is-open' : ''}`}>
              {this.renderColumnTitle('app', 'footer.column.app')}
              <div className="ft-col-body footer-badges" id="ft-col-app">
                <a className="ft-store" href={GOOGLE_PLAY_URL} rel="noopener">
                  <FontAwesomeIcon icon={faGooglePlay} className="ft-store-icon" />
                  <span className="ft-store-text">
                    <span className="ft-store-prefix">
                      {intl.formatMessage(messages['footer.app.googlePlay.prefix'])}
                    </span>
                    <span className="ft-store-name">
                      {intl.formatMessage(messages['footer.app.googlePlay.name'])}
                    </span>
                  </span>
                </a>
                <a className="ft-store" href={APP_STORE_URL} rel="noopener">
                  <FontAwesomeIcon icon={faApple} className="ft-store-icon" />
                  <span className="ft-store-text">
                    <span className="ft-store-prefix">
                      {intl.formatMessage(messages['footer.app.appStore.prefix'])}
                    </span>
                    <span className="ft-store-name">
                      {intl.formatMessage(messages['footer.app.appStore.name'])}
                    </span>
                  </span>
                </a>
              </div>
            </div>
          </div>

          <div className="ft-bottom">
            <div className="ft-copy">
              {intl.formatMessage(messages['footer.copyright'], {
                year: new Date().getFullYear(),
                siteName: config.SITE_NAME,
              })}
            </div>

            <div className="footer-social-icons">
              <a href="https://www.facebook.com/profile.php?id=61580184195837" className="social-icon" aria-label="Facebook">
                <FontAwesomeIcon icon={faFacebook} />
              </a>
              <a href="https://www.instagram.com/webuddhist_academy/" className="social-icon" aria-label="Instagram">
                <FontAwesomeIcon icon={faInstagram} />
              </a>
              <a href="https://x.com/WB_Academy_" className="social-icon" aria-label="X">
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
