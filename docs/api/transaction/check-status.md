---
sidebar_position: 3
title: Check Status
description: Mengecek status transaksi
---

# Check Transaction Status

Mengecek status transaksi secara manual berdasarkan `trx_id` atau `reference_id`.

<span class="api-method api-method--get">GET</span> `/check-status/{order_id}`

---

## Endpoint

```
https://paymenku.com/api/v1/check-status/{order_id}
```

---

## Request

### Path Parameters

| Parameter | Type | Required | Keterangan |
|-----------|------|:--------:|------------|
| `order_id` | string | ✓ | `trx_id` dari Paymenku **atau** `reference_id` dari sistem Anda |

### Headers

```http
Authorization: Bearer sk_live_xxxxxxx
Content-Type: application/json
Accept: application/json
```

### cURL

Menggunakan `trx_id`:

```bash
curl -X GET https://paymenku.com/api/v1/check-status/IDP202602271039768990 \
  -H "Authorization: Bearer sk_live_xxxxxxx" \
  -H "Accept: application/json"
```

Atau menggunakan `reference_id`:

```bash
curl -X GET https://paymenku.com/api/v1/check-status/INV-001 \
  -H "Authorization: Bearer sk_live_xxxxxxx" \
  -H "Accept: application/json"
```

---

## Response `200 OK`

```json
{
  "status": "success",
  "data": {
    "trx_id": "IDP202602271039768990",
    "reference_id": "INV-001",
    "amount": "104000.00",
    "total_fee": "4000.00",
    "amount_received": "100000.00",
    "status": "paid",
    "is_sandbox": false,
    "customer_name": "John Doe",
    "customer_email": "john@example.com",
    "payment_channel": {
      "code": "bca_va",
      "name": "BCA Virtual Account",
      "type": "va"
    },
    "pay_url": "https://paymenku.com/pay/IDP202602271039768990",
    "paid_at": "2026-01-25T10:30:00+00:00",
    "created_at": "2026-01-25T10:00:00+00:00",
    "updated_at": "2026-01-25T10:30:00+00:00"
  }
}
```

---

## Response Fields

| Field | Type | Keterangan |
|-------|------|------------|
| `trx_id` | string | ID transaksi Paymenku |
| `reference_id` | string | ID referensi dari merchant |
| `amount` | string | Total amount (termasuk fee) |
| `total_fee` | string | Total biaya layanan |
| `amount_received` | string | Jumlah bersih yang diterima merchant |
| `status` | string | Status transaksi saat ini |
| `is_sandbox` | boolean | `true` jika transaksi sandbox |
| `customer_name` | string | Nama pelanggan |
| `customer_email` | string | Email pelanggan |
| `payment_channel` | object | Detail channel pembayaran |
| `payment_channel.code` | string | Kode channel |
| `payment_channel.name` | string | Nama channel |
| `payment_channel.type` | string | Tipe channel (`va`, `ewallet`, `qris`) |
| `pay_url` | string | URL halaman pembayaran |
| `paid_at` | string \| null | Waktu pembayaran (null jika belum bayar) |
| `created_at` | string | Waktu transaksi dibuat |
| `updated_at` | string | Waktu terakhir diupdate |

---

## Transaction Status

| Status | Keterangan |
|--------|------------|
| `pending` | Menunggu pembayaran dari pelanggan |
| `paid` | Pembayaran berhasil diterima |
| `failed` | Pembayaran gagal |
| `expired` | Transaksi melewati batas waktu pembayaran |
| `cancelled` | Transaksi dibatalkan via [Cancel Transaction](/api/transaction/cancel-transaction) |
| `refunded` | Dana dikembalikan via [Refund Transaction](/api/transaction/refund-transaction) |

---

## Error Responses

### `404 Not Found`

```json
{
  "status": "error",
  "message": "Transaction not found"
}
```

### `401 Unauthorized`

```json
{
  "status": "error",
  "message": "Unauthorized"
}
```

:::tip
Gunakan endpoint ini untuk **reconciliation** atau ketika webhook tidak diterima. Untuk monitoring real-time, gunakan [Webhooks](/events/webhooks).
:::
