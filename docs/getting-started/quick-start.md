---
sidebar_position: 1
title: Quick Start
---

# Quick Start

Panduan cepat untuk mulai menerima pembayaran dengan Paymenku API dalam 5 menit.

---

## 1. Dapatkan API Key

Login ke [dashboard merchant](https://paymenku.com/merchant/login), buka **Settings > API Keys**, dan copy API Key Anda.

| Environment | Prefix | Kegunaan |
|-------------|--------|----------|
| Sandbox | `sk_test_` | Testing & development |
| Production | `sk_live_` | Transaksi nyata |

---

## 2. Buat Transaksi Pertama

```bash
curl -X POST https://paymenku.com/api/v1/transaction/create \
  -H "Authorization: Bearer sk_test_xxxxxxx" \
  -H "Content-Type: application/json" \
  -d '{
    "reference_id": "ORDER-001",
    "amount": 50000,
    "customer_name": "Budi Santoso",
    "customer_email": "budi@example.com",
    "customer_phone": "08123456789",
    "channel_code": "qris"
  }'
```

---

## 3. Terima Response

```json
{
  "status": "success",
  "data": {
    "trx_id": "IDP202602271040123456",
    "amount": "50350.00",
    "status": "pending",
    "pay_url": "https://paymenku.com/pay/IDP202602271040123456",
    "payment_info": {
      "qr_url": "https://paymenku.com/api/qr/...",
      "qr_string": "00020101021226680016...",
      "expiration_date": "2026-01-19T03:42:39Z"
    }
  }
}
```

Redirect pelanggan ke `pay_url` atau tampilkan QR code dari `qr_url`.

---

## 4. Terima Webhook

Setelah pelanggan membayar, Paymenku mengirim notifikasi ke webhook URL Anda:

```json
{
  "event": "payment.status_updated",
  "trx_id": "IDP202602271040123456",
  "reference_id": "ORDER-001",
  "status": "paid",
  "amount": "50350.00",
  "amount_received": "50000.00",
  "paid_at": "2026-01-18T03:33:18.000000Z"
}
```

---

## 5. Verifikasi Pembayaran

Anda juga bisa cek status secara manual:

```bash
curl -X GET https://paymenku.com/api/v1/check-status/ORDER-001 \
  -H "Authorization: Bearer sk_test_xxxxxxx"
```

---

## Contoh Integrasi (PHP)

```php
<?php
$apiKey = 'sk_test_xxxxxxx';

$payload = [
    'reference_id'   => 'INV-' . time(),
    'amount'         => 100000,
    'customer_name'  => 'Budi Santoso',
    'customer_email' => 'budi@example.com',
    'customer_phone' => '08123456789',
    'channel_code'   => 'dana',
    'return_url'     => 'https://toko-anda.com/success',
];

$ch = curl_init('https://paymenku.com/api/v1/transaction/create');
curl_setopt_array($ch, [
    CURLOPT_POST           => true,
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_HTTPHEADER     => [
        'Authorization: Bearer ' . $apiKey,
        'Content-Type: application/json',
        'Accept: application/json',
    ],
    CURLOPT_POSTFIELDS => json_encode($payload),
]);

$response = curl_exec($ch);
$data = json_decode($response, true);
curl_close($ch);

if ($data['status'] === 'success') {
    // Redirect ke halaman pembayaran
    header('Location: ' . $data['data']['pay_url']);
    exit;
}
```

## Contoh Integrasi (Node.js)

```javascript
const response = await fetch('https://paymenku.com/api/v1/transaction/create', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer sk_test_xxxxxxx',
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  body: JSON.stringify({
    reference_id: `INV-${Date.now()}`,
    amount: 100000,
    customer_name: 'Budi Santoso',
    customer_email: 'budi@example.com',
    customer_phone: '08123456789',
    channel_code: 'dana',
    return_url: 'https://toko-anda.com/success',
  }),
});

const data = await response.json();

if (data.status === 'success') {
  // Redirect ke halaman pembayaran
  console.log('Pay URL:', data.data.pay_url);
}
```

---

## Langkah Selanjutnya

- [Authentication](/getting-started/authentication) — Detail autentikasi API
- [Payment Channels](/api/payment-channels) — Lihat semua metode pembayaran
- [Create Transaction](/api/create-transaction) — Referensi lengkap endpoint
- [Webhooks](/events/webhooks) — Setup notifikasi pembayaran
