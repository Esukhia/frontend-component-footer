/* eslint-disable react/prop-types */
import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';
import { IntlProvider } from '@edx/frontend-platform/i18n';
import { AppContext } from '@edx/frontend-platform/react';

import Footer, { EVENT_NAMES } from './Footer';
import { sendTrackEvent } from '@edx/frontend-platform/analytics';

jest.mock('@edx/frontend-platform/analytics', () => ({
  sendTrackEvent: jest.fn(),
}));

describe('Footer', () => {
  const supportedLanguages = [
    { label: 'English', value: 'en' },
    { label: 'Español', value: 'es-419' },
  ];

  const config = {
    LMS_BASE_URL: 'http://localhost:18000',
    LOGO_TRADEMARK_URL: 'https://edx-cdn.org/v3/default/logo-trademark.svg',
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the footer with a logo', () => {
    render(
      <IntlProvider locale="en">
        <AppContext.Provider value={{ config }}>
          <Footer />
        </AppContext.Provider>
      </IntlProvider>,
    );

    expect(screen.getByRole('contentinfo')).toBeInTheDocument();
    expect(screen.getByAltText('edX Home Page')).toBeInTheDocument();
    // Check for fixed footer class
    expect(screen.getByRole('contentinfo')).toHaveClass('footer-fixed');
    // Check for fixed height
    expect(screen.getByRole('contentinfo')).toHaveStyle('height: 80px');
  });

  it('renders the footer with a language selector', () => {
    const onLanguageSelected = jest.fn();

    render(
      <IntlProvider locale="en">
        <AppContext.Provider value={{ config }}>
          <Footer
            onLanguageSelected={onLanguageSelected}
            supportedLanguages={supportedLanguages}
          />
        </AppContext.Provider>
      </IntlProvider>,
    );

    expect(screen.getByLabelText('Choose Language')).toBeInTheDocument();
    expect(screen.getByTestId('site-footer-submit-btn')).toBeInTheDocument();
  });

  it('renders the footer without a language selector when supportedLanguages is empty', () => {
    const onLanguageSelected = jest.fn();

    render(
      <IntlProvider locale="en">
        <AppContext.Provider value={{ config }}>
          <Footer
            onLanguageSelected={onLanguageSelected}
            supportedLanguages={[]}
          />
        </AppContext.Provider>
      </IntlProvider>,
    );

    expect(screen.queryByLabelText('Choose Language')).not.toBeInTheDocument();
    expect(screen.queryByTestId('site-footer-submit-btn')).not.toBeInTheDocument();
  });

  it('renders the footer without a language selector when onLanguageSelected is null', () => {
    render(
      <IntlProvider locale="en">
        <AppContext.Provider value={{ config }}>
          <Footer
            supportedLanguages={supportedLanguages}
          />
        </AppContext.Provider>
      </IntlProvider>,
    );

    expect(screen.queryByLabelText('Choose Language')).not.toBeInTheDocument();
    expect(screen.queryByTestId('site-footer-submit-btn')).not.toBeInTheDocument();
  });

  it('shows custom tooltip on logo hover', () => {
    render(
      <IntlProvider locale="en">
        <AppContext.Provider value={{ config }}>
          <Footer />
        </AppContext.Provider>
      </IntlProvider>,
    );

    const logo = screen.getByRole('link', { name: 'edX Home Page' });
    const tooltip = screen.getByRole('tooltip');
    
    // Tooltip should be hidden by default
    expect(tooltip).toHaveAttribute('aria-hidden', 'true');
    expect(tooltip).not.toHaveClass('custom-tooltip-visible');
    
    // Hover over logo
    userEvent.hover(logo);
    
    // Tooltip should be visible
    expect(tooltip).toHaveAttribute('aria-hidden', 'false');
    expect(tooltip).toHaveClass('custom-tooltip-visible');
  });

  it('sends tracking event when logo is clicked', () => {
    render(
      <IntlProvider locale="en">
        <AppContext.Provider value={{ config }}>
          <Footer />
        </AppContext.Provider>
      </IntlProvider>,
    );

    const logo = screen.getByRole('link', { name: 'edX Home Page' });
    userEvent.click(logo);

    expect(sendTrackEvent).toHaveBeenCalledWith(EVENT_NAMES.FOOTER_LINK, {
      category: 'outbound_link',
      label: 'http://localhost:18000',
    });
  });
});
