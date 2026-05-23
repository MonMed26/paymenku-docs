import type {SidebarsConfig} from '@docusaurus/plugin-content-docs';

const sidebars: SidebarsConfig = {
  apiSidebar: [
    'intro',
    {
      type: 'category',
      label: 'Getting Started',
      items: [
        'getting-started/quick-start',
        'getting-started/authentication',
        'getting-started/rate-limiting',
        'getting-started/idempotency',
      ],
    },
    {
      type: 'category',
      label: 'Transaction',
      items: [
        'api/transaction/create-transaction',
        'api/transaction/list-transactions',
        'api/transaction/check-status',
        'api/transaction/cancel-transaction',
        'api/transaction/refund-transaction',
      ],
    },
    {
      type: 'category',
      label: 'Channel & Fee',
      items: [
        'api/channels/payment-channels',
        {
          type: 'category',
          label: 'Metode Pembayaran',
          items: [
            'api/channels/virtual-account',
            'api/channels/ewallet',
            'api/channels/qris',
          ],
        },
        'api/channels/fee-calculator',
        'api/channels/payment-instruction',
      ],
    },
    {
      type: 'category',
      label: 'Open Payment',
      items: [
        'api/open-payment/show-open-payment',
        'api/open-payment/open-payment-transactions',
      ],
    },
    {
      type: 'category',
      label: 'Webhook',
      items: [
        'events/webhooks',
      ],
    },
    'api/error-codes',
  ],
};

export default sidebars;
