---
sidebar_position: 2
title: Open Payment Transactions
description: List transaksi yang masuk via Open Payment
---

# Open Payment Transactions

Mengambil daftar transaksi yang masuk via sebuah Open Payment.

<span class="api-method api-method--get">GET</span> `/open-payment/{uuid}/transactions`

---

## Endpoint

```
https://paymenku.com/api/v1/open-payment/{uuid}/transactions
```

---

## Request

### Path Parameters

| Parameter | Type | Required | Keterangan |
|-----------|------|:--------:|------------|
| `uuid` | string | ✓ | UUID Open Payment |

### Query Parameters

| Parameter | Default | Keterangan |
|-----------|---------|------------|
| `per_page` | `20` | Item per halaman (maks: 100) |
| `sort` | `desc` | Urutan: `asc` atau `desc` (berdasarkan `paid_at`) |
| `status` | — | Filter status: `pending`, `paid`, `expired`, `failed` |

### Headers

```http
Authorization: Bearer sk_live_xxxxxxx
Accept: application/json
```

### cURL

```bash
curl "https://paymenku.com/api/v1/open-payment/550e8400-e29b-41d4-a716-446655440000/transactions?status=paid&per_page=20" \
  -H "Authorization: Bearer sk_live_xxxxxxx"
```

---

## Response `200 OK`

```json
{
  "status": "success",
  "data": [
    {
      "trx_id": "IDP202602271039768990",
      "amount": "150000.00",
      "total_fee": "4000.00",
      "amount_received": "146000.00",
      "status": "paid",
      "paid_at": "2026-01-25T10:30:00+00:00",
      "created_at": "2026-01-25T10:00:00+00:00"
    },
    {
      "trx_id": "IDP202602271040123456",
      "amount": "75000.00",
      "total_fee": "4000.00",
      "amount_received": "71000.00",
      "status": "paid",
      "paid_at": "2026-01-20T15:22:10+00:00",
      "created_at": "2026-01-20T15:00:00+00:00"
    }
  ],
  "meta": {
    "current_page": 1,
    "per_page": 20,
    "total": 12,
    "last_page": 1
  }
}
```

---

## Response Fields

### `data[]`

| Field | Type | Keterangan |
|-------|------|------------|
| `trx_id` | string | ID transaksi Paymenku |
| `amount` | string | Nominal yang dibayar pelanggan |
| `total_fee` | string | Total biaya layanan |
| `amount_received` | string | Jumlah bersih yang diterima merchant |
| `status` | string | Status transaksi |
| `paid_at` | string \| null | Waktu pembayaran |
| `created_at` | string | Waktu transaksi dibuat |

### `meta`

| Field | Type | Keterangan |
|-------|------|------------|
| `current_page` | number | Halaman saat ini |
| `per_page` | number | Item per halaman |
| `total` | number | Total transaksi yang cocok dengan filter |
| `last_page` | number | Halaman terakhir |

---

## Error Responses

### `404 Not Found`

```json
{
  "status": "error",
  "message": "Open payment not found"
}
```

---

:::tip Use Case
Endpoint ini cocok untuk:
- Riwayat top-up di profile pelanggan
- Laporan donasi periodik
- Audit pembayaran subscription
:::
