import {themes as prismThemes} from 'prism-react-renderer';
import type {Config} from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

const config: Config = {
  title: 'Paymenku API Docs',
  tagline: 'Dokumentasi lengkap Payment Gateway API Paymenku.com',
  favicon: 'img/favicon.png',

  future: {
    v4: true,
  },

  url: 'https://docs.paymenku.com',
  baseUrl: '/',

  organizationName: 'paymenku',
  projectName: 'docs',

  onBrokenLinks: 'throw',

  markdown: {
    hooks: {
      onBrokenMarkdownLinks: 'warn',
    },
  },

  i18n: {
    defaultLocale: 'id',
    locales: ['id'],
  },

  presets: [
    [
      'classic',
      {
        docs: {
          sidebarPath: './sidebars.ts',
          routeBasePath: '/',
        },
        blog: false,
        theme: {
          customCss: './src/css/custom.css',
        },
      } satisfies Preset.Options,
    ],
  ],

  themeConfig: {
    image: 'img/og-image.png',
    colorMode: {
      defaultMode: 'light',
      respectPrefersColorScheme: true,
    },
    navbar: {
      title: '',
      logo: {
        alt: 'Paymenku Logo',
        src: 'img/logo.png',
      },
      items: [
        {
          type: 'docSidebar',
          sidebarId: 'apiSidebar',
          position: 'left',
          label: 'API Reference',
        },
        {
          href: 'https://paymenku.com/merchant/login',
          label: 'Dashboard',
          position: 'right',
        },
        {
          href: 'https://paymenku.com',
          label: 'Paymenku.com',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Dokumentasi',
          items: [
            {label: 'Introduction', to: '/'},
            {label: 'Quick Start', to: '/getting-started/quick-start'},
            {label: 'Authentication', to: '/getting-started/authentication'},
            {label: 'Idempotency', to: '/getting-started/idempotency'},
          ],
        },
        {
          title: 'API Reference',
          items: [
            {label: 'Create Transaction', to: '/api/transaction/create-transaction'},
            {label: 'Check Status', to: '/api/transaction/check-status'},
            {label: 'Payment Channels', to: '/api/channels/payment-channels'},
            {label: 'Fee Calculator', to: '/api/channels/fee-calculator'},
          ],
        },
        {
          title: 'Resources',
          items: [
            {label: 'Webhooks', to: '/events/webhooks'},
            {label: 'Error Codes', to: '/api/error-codes'},
            {label: 'Kontak Support', href: 'https://paymenku.com/contact'},
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} Paymenku.com — PT LIMBUNGAN MEDIA SOLUSI`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
      additionalLanguages: ['bash', 'json', 'php', 'python', 'java'],
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
