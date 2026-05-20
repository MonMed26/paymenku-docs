import type {SidebarsConfig} from '@docusaurus/plugin-content-docs';

const sidebars: SidebarsConfig = {
  apiSidebar: [
    'intro',
    {
      type: 'category',
      label: 'Getting Started',
      collapsed: false,
      items: [
        'getting-started/quick-start',
        'getting-started/authentication',
      ],
    },
    {
      type: 'category',
      label: 'API Reference',
      collapsed: false,
      items: [
        'api/payment-channels',
        'api/create-transaction',
        'api/check-status',
        'api/error-codes',
      ],
    },
    {
      type: 'category',
      label: 'Events & Webhooks',
      collapsed: false,
      items: [
        'events/webhooks',
      ],
    },
  ],
};

export default sidebars;
