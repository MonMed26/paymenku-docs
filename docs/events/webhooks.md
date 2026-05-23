---
sidebar_position: 1
title: Webhooks
description: Notifikasi real-time untuk perubahan status pembayaran
---

# Webhooks

Paymenku mengirimkan notifikasi **HTTP POST** ke URL callback Anda setiap kali status pembayaran berubah.

---

## Setup

1. Login ke [Dashboard Merchant](https://paymenku.com/merchant/login)
2. Buka **Settings** → **Webhook**
3. Masukkan URL endpoint webhook Anda
4. Simpan dan copy **Webhook Secret** untuk verifikasi signature

:::info
URL webhook harus menggunakan **HTTPS** dan dapat diakses secara publik.
:::

---

## Event Types

| Event | Trigger |
|-------|---------|
| `payment.status_updated` | Status pembayaran berubah (pending → paid/failed/expired) |

---

## Payload

Setiap webhook dikirim sebagai HTTP POST dengan body JSON:

```json
{
  "event": "payment.status_updated",
  "trx_id": "IDP202602271039768990",
  "reference_id": "INV-001",
  "status": "paid",
  "amount": "101000.00",
  "total_fee": "1000.00",
  "amount_received": "100000.00",
  "payment_channel": "dana",
  "customer_name": "John Doe",
  "customer_email": "john@example.com",
  "paid_at": "2026-01-18T03:33:18.000000Z",
  "created_at": "2026-01-18T03:33:18.000000Z",
  "is_sandbox": false
}
```

### Payload Fields

| Field | Type | Keterangan |
|-------|------|------------|
| `event` | string | Nama event yang terjadi |
| `trx_id` | string | ID transaksi Paymenku |
| `reference_id` | string | ID referensi dari merchant |
| `status` | string | Status baru: `paid`, `failed`, `expired`, `cancelled`, `refunded` |
| `amount` | string | Total amount (termasuk fee) |
| `total_fee` | string | Total biaya layanan |
| `amount_received` | string | Jumlah bersih yang diterima merchant |
| `payment_channel` | string | Kode channel pembayaran |
| `customer_name` | string | Nama pelanggan |
| `customer_email` | string | Email pelanggan |
| `paid_at` | string \| null | Waktu pembayaran |
| `created_at` | string | Waktu transaksi dibuat |
| `is_sandbox` | boolean | `true` jika transaksi sandbox |

---

## Signature Verification

Setiap webhook disertai header untuk verifikasi keaslian:

| Header | Keterangan |
|--------|------------|
| `X-PaymenKu-Signature` | HMAC-SHA256 signature |
| `X-PaymenKu-Timestamp` | Unix timestamp saat dikirim |

### Formula

```
signature = HMAC-SHA256(timestamp + "." + raw_body, webhook_secret)
```

:::danger[Penting]
**Selalu verifikasi signature** sebelum memproses webhook. Tanpa verifikasi, endpoint Anda rentan terhadap request palsu.
:::

---

## Contoh Implementasi

### PHP

```php
<?php
// Terima webhook
$payload = file_get_contents('php://input');
$timestamp = $_SERVER['HTTP_X_PAYMENKU_TIMESTAMP'] ?? '';
$signature = $_SERVER['HTTP_X_PAYMENKU_SIGNATURE'] ?? '';
$webhookSecret = getenv('PAYMENKU_WEBHOOK_SECRET');

// Verifikasi signature
$computedSignature = hash_hmac('sha256', $timestamp . '.' . $payload, $webhookSecret);

if (!hash_equals($computedSignature, $signature)) {
    http_response_code(401);
    echo json_encode(['error' => 'Invalid signature']);
    exit;
}

// Proses webhook
$data = json_decode($payload, true);

switch ($data['status']) {
    case 'paid':
        // Update order status di database
        // Kirim email konfirmasi ke pelanggan
        updateOrderStatus($data['reference_id'], 'paid');
        break;
    case 'failed':
        updateOrderStatus($data['reference_id'], 'failed');
        break;
    case 'expired':
        updateOrderStatus($data['reference_id'], 'expired');
        break;
    case 'cancelled':
        updateOrderStatus($data['reference_id'], 'cancelled');
        break;
    case 'refunded':
        updateOrderStatus($data['reference_id'], 'refunded');
        // Trigger pengembalian barang / pembatalan layanan
        break;
}

// Response 200 OK
http_response_code(200);
echo json_encode(['received' => true]);
```

### Node.js (Express)

```javascript
const crypto = require('crypto');
const express = require('express');
const app = express();

app.post('/webhook/paymenku', express.raw({ type: 'application/json' }), (req, res) => {
  const payload = req.body.toString();
  const timestamp = req.headers['x-paymenku-timestamp'];
  const signature = req.headers['x-paymenku-signature'];
  const webhookSecret = process.env.PAYMENKU_WEBHOOK_SECRET;

  // Verifikasi signature
  const computedSignature = crypto
    .createHmac('sha256', webhookSecret)
    .update(`${timestamp}.${payload}`)
    .digest('hex');

  if (!crypto.timingSafeEqual(
    Buffer.from(computedSignature),
    Buffer.from(signature)
  )) {
    return res.status(401).json({ error: 'Invalid signature' });
  }

  // Proses webhook
  const data = JSON.parse(payload);
  
  switch (data.status) {
    case 'paid':
      // Update order di database
      console.log(`Order ${data.reference_id} paid!`);
      break;
    case 'failed':
      console.log(`Order ${data.reference_id} failed`);
      break;
    case 'expired':
      console.log(`Order ${data.reference_id} expired`);
      break;
    case 'cancelled':
      console.log(`Order ${data.reference_id} cancelled`);
      break;
    case 'refunded':
      console.log(`Order ${data.reference_id} refunded`);
      break;
  }

  res.status(200).json({ received: true });
});
```

### Python (Flask)

```python
import hmac
import hashlib
import json
from flask import Flask, request, jsonify
import os

app = Flask(__name__)

@app.route('/webhook/paymenku', methods=['POST'])
def handle_webhook():
    payload = request.get_data(as_text=True)
    timestamp = request.headers.get('X-PaymenKu-Timestamp', '')
    signature = request.headers.get('X-PaymenKu-Signature', '')
    webhook_secret = os.environ['PAYMENKU_WEBHOOK_SECRET']

    # Verifikasi signature
    computed = hmac.new(
        webhook_secret.encode(),
        f"{timestamp}.{payload}".encode(),
        hashlib.sha256
    ).hexdigest()

    if not hmac.compare_digest(computed, signature):
        return jsonify({'error': 'Invalid signature'}), 401

    # Proses webhook
    data = json.loads(payload)
    
    if data['status'] == 'paid':
        # Update order status
        print(f"Order {data['reference_id']} paid!")

    return jsonify({'received': True}), 200
```

---

## Auto-Retry

Jika webhook gagal (response non-2xx atau timeout), Paymenku akan retry otomatis:

| Attempt | Delay | Total Waktu |
|---------|-------|-------------|
| 1 | Langsung | 0 |
| 2 | 15 detik | 15 detik |
| 3 | 1 menit | ~1 menit |
| 4 | 5 menit | ~6 menit |
| 5 | 30 menit | ~36 menit |

Setelah 5 attempt gagal, webhook ditandai sebagai **failed** dan tidak akan di-retry lagi.

---

## Requirements

:::warning[Persyaratan Server]
- Response **HTTP 2xx** dalam waktu **15 detik**
- Endpoint harus **idempotent** — webhook yang sama bisa dikirim lebih dari sekali
- Gunakan `trx_id` atau `reference_id` untuk deduplikasi
:::

---

## Testing Webhook

Untuk testing di development:

1. Gunakan tool seperti [ngrok](https://ngrok.com) untuk expose localhost
2. Set webhook URL ke URL ngrok di dashboard
3. Buat transaksi sandbox dan bayar melalui simulator

```bash
# Expose localhost:3000
ngrok http 3000
# Gunakan URL https://xxxx.ngrok.io/webhook/paymenku di dashboard
```
