---
sidebar_position: 4
title: Idempotency
description: Cegah duplicate request dengan Idempotency-Key
---

# Idempotency

Untuk request **POST**, **PUT**, dan **PATCH**, Paymenku mendukung header `Idempotency-Key` untuk mencegah pemrosesan duplikat ketika request sama dikirim lebih dari sekali (mis. karena network retry).

---

## Cara Kerja

1. Klien mengirim request dengan header `Idempotency-Key: <unique-key>`.
2. Paymenku menyimpan response untuk key tersebut selama **24 jam**.
3. Jika key yang sama dikirim lagi dalam window 24 jam, server **tidak memproses ulang** transaksi — server me-replay response yang sama.

---

## Header

```http
Idempotency-Key: invoice-001-2026-01-15
```

| Aturan | Detail |
|--------|--------|
| Format | String unik, maks 255 karakter (rekomendasi: UUID atau `reference_id` + tanggal) |
| TTL | 24 jam sejak request pertama diterima |
| Scope | Per merchant, per endpoint |

---

## Replayed Response

Ketika response di-replay, Paymenku menambahkan header:

```http
HTTP/1.1 200 OK
Idempotency-Replayed: true
Content-Type: application/json
```

Body response **identik** dengan response asli — termasuk `trx_id` dan field lainnya.

---

## Contoh

### Request Pertama

```bash
curl -X POST https://paymenku.com/api/v1/transaction/create \
  -H "Authorization: Bearer sk_live_xxxxxxx" \
  -H "Content-Type: application/json" \
  -H "Idempotency-Key: INV-001-20260118" \
  -d '{
    "reference_id": "INV-001",
    "amount": 100000,
    "customer_name": "Budi Santoso",
    "customer_email": "budi@example.com",
    "customer_phone": "08123456789",
    "channel_code": "bca_va"
  }'
```

**Response:** `200 OK` (transaksi baru dibuat)

### Request Berulang (dalam 24 jam)

Request **persis sama** dengan `Idempotency-Key` yang sama:

```http
HTTP/1.1 200 OK
Idempotency-Replayed: true
```

Tidak membuat transaksi baru, mengembalikan response asli.

---

## Best Practices

:::tip Rekomendasi Key
Gunakan kombinasi yang **deterministic** dan **unique per logical operation**:

```
{reference_id}-{timestamp}
INV-001-20260118
order-42-retry-attempt
```

Hindari random key per attempt — itu menggagalkan tujuan idempotency.
:::

:::warning Hati-hati
- **Body harus identik** — kalau body berbeda dengan key yang sama, request bisa ditolak `409 Conflict`.
- **Jangan pakai key yang sama** untuk operasi yang memang seharusnya beda.
- TTL 24 jam — setelah lewat, key bisa dipakai ulang dan akan diproses sebagai request baru.
:::

---

## Implementasi

### PHP

```php
<?php
$idempotencyKey = 'INV-' . $orderId . '-' . date('Ymd');

$ch = curl_init('https://paymenku.com/api/v1/transaction/create');
curl_setopt_array($ch, [
    CURLOPT_POST           => true,
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_HTTPHEADER     => [
        'Authorization: Bearer ' . $apiKey,
        'Content-Type: application/json',
        'Idempotency-Key: ' . $idempotencyKey,
    ],
    CURLOPT_POSTFIELDS => json_encode($payload),
]);

$response = curl_exec($ch);
```

### Node.js

```javascript
const idempotencyKey = `INV-${orderId}-${new Date().toISOString().slice(0, 10)}`;

const res = await fetch('https://paymenku.com/api/v1/transaction/create', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${apiKey}`,
    'Content-Type': 'application/json',
    'Idempotency-Key': idempotencyKey,
  },
  body: JSON.stringify(payload),
});

if (res.headers.get('Idempotency-Replayed') === 'true') {
  console.log('Request was replayed (already processed before)');
}
```
