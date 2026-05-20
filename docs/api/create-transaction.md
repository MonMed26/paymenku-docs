---
sidebar_position: 2
title: Create Transaction
description: Membuat transaksi pembayaran baru
---

# Create Transaction

Membuat transaksi pembayaran baru. Response bervariasi tergantung `channel_code` yang dipilih.

<span class="api-method api-method--post">POST</span> `/transaction/create`

---

## Request

### Headers

```http
Authorization: Bearer sk_live_xxxxxxx
Content-Type: application/json
Accept: application/json
```

### Body Parameters

| Parameter | Type | Required | Keterangan |
|-----------|------|:--------:|------------|
| `reference_id` | string | ✓ | ID referensi unik dari sistem Anda (maks 50 karakter) |
| `amount` | integer | ✓ | Jumlah pembayaran dalam Rupiah (min: 10000) |
| `customer_name` | string | ✓ | Nama pelanggan |
| `customer_email` | string | ✓ | Email pelanggan (format valid) |
| `customer_phone` | string | ✓ | Nomor telepon pelanggan |
| `channel_code` | string | ✓ | Kode channel dari [Payment Channels](/api/payment-channels) |
| `return_url` | string | — | URL redirect setelah pembayaran selesai |

---

## Contoh per Channel

### E-Wallet (DANA)

**Request:**

```bash
curl -X POST https://paymenku.com/api/v1/transaction/create \
  -H "Authorization: Bearer sk_live_xxxxxxx" \
  -H "Content-Type: application/json" \
  -d '{
    "reference_id": "INV-001",
    "amount": 100000,
    "customer_name": "John Doe",
    "customer_email": "john@example.com",
    "customer_phone": "08123456789",
    "channel_code": "dana",
    "return_url": "https://toko-anda.com/success"
  }'
```

**Response `200 OK`:**

```json
{
  "status": "success",
  "data": {
    "trx_id": "IDP202602271040123456",
    "amount": "100000.00",
    "status": "pending",
    "pay_url": "https://paymenku.com/pay/IDP202602271040123456",
    "payment_info": {
      "transaction_status": "pending",
      "checkout_url": "https://ewallet-service.example.com/checkout/...",
      "expiration_date": "2026-01-18T03:55:10+00:00"
    }
  }
}
```

---

### QRIS

**Request:**

```bash
curl -X POST https://paymenku.com/api/v1/transaction/create \
  -H "Authorization: Bearer sk_live_xxxxxxx" \
  -H "Content-Type: application/json" \
  -d '{
    "reference_id": "INV-002",
    "amount": 100000,
    "customer_name": "John Doe",
    "customer_email": "john@example.com",
    "customer_phone": "08123456789",
    "channel_code": "qris",
    "return_url": "https://toko-anda.com/success"
  }'
```

**Response `200 OK`:**

```json
{
  "status": "success",
  "data": {
    "trx_id": "IDP202602271042567890",
    "amount": "100700.00",
    "status": "pending",
    "pay_url": "https://paymenku.com/pay/IDP202602271042567890",
    "payment_info": {
      "qr_url": "https://paymenku.com/api/qr/IDP202602271042567890",
      "qr_string": "00020101021226680016COM.NOBUBANK...",
      "expiration_date": "2026-01-19T03:42:39Z"
    }
  }
}
```

---

### Virtual Account (BCA)

**Request:**

```bash
curl -X POST https://paymenku.com/api/v1/transaction/create \
  -H "Authorization: Bearer sk_live_xxxxxxx" \
  -H "Content-Type: application/json" \
  -d '{
    "reference_id": "INV-003",
    "amount": 100000,
    "customer_name": "John Doe",
    "customer_email": "john@example.com",
    "customer_phone": "08123456789",
    "channel_code": "bca_va",
    "return_url": "https://toko-anda.com/success"
  }'
```

**Response `200 OK`:**

```json
{
  "status": "success",
  "data": {
    "trx_id": "IDP202602271039768990",
    "amount": "104000.00",
    "status": "pending",
    "pay_url": "https://paymenku.com/pay/IDP202602271039768990",
    "payment_info": {
      "bank": "BCA",
      "va_number": "381659999814525",
      "expiration_date": "2026-01-19T03:43:30.000Z"
    }
  }
}
```

---

## Response Fields

| Field | Type | Keterangan |
|-------|------|------------|
| `trx_id` | string | ID transaksi unik dari Paymenku |
| `amount` | string | Total yang harus dibayar (termasuk fee) |
| `status` | string | Status awal: selalu `pending` |
| `pay_url` | string | URL halaman pembayaran Paymenku |
| `payment_info` | object | Detail pembayaran (bervariasi per channel) |

### Payment Info — Virtual Account

| Field | Type | Keterangan |
|-------|------|------------|
| `bank` | string | Nama bank |
| `va_number` | string | Nomor Virtual Account untuk transfer |
| `expiration_date` | string | Waktu kadaluarsa (ISO 8601) |

### Payment Info — E-Wallet

| Field | Type | Keterangan |
|-------|------|------------|
| `transaction_status` | string | Status di provider e-wallet |
| `checkout_url` | string | URL redirect ke aplikasi e-wallet |
| `expiration_date` | string | Waktu kadaluarsa (ISO 8601) |

### Payment Info — QRIS

| Field | Type | Keterangan |
|-------|------|------------|
| `qr_url` | string | URL gambar QR code (PNG) |
| `qr_string` | string | Raw QRIS string untuk generate QR sendiri |
| `expiration_date` | string | Waktu kadaluarsa (ISO 8601) |

---

## Catatan Penting

:::warning Perhatian
- `amount` di response sudah **termasuk fee**. Ini adalah jumlah yang harus dibayar pelanggan.
- `reference_id` harus **unik** per transaksi. Duplikasi akan menghasilkan error.
- Transaksi yang tidak dibayar akan otomatis **expired** setelah waktu yang ditentukan.
:::

---

## Error Response

Lihat [Error Codes](/api/error-codes) untuk daftar lengkap error yang mungkin terjadi.

```json
{
  "status": "error",
  "message": "The reference_id has already been taken."
}
```
