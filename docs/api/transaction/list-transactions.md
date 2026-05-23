---
sidebar_position: 2
title: List Transactions
description: List transaksi dengan pagination, filter, dan sort
---

# List Transactions

Mengambil daftar transaksi dengan dukungan pagination, filter, dan sorting.

<span class="api-method api-method--get">GET</span> `/transactions`

---

## Endpoint

```
https://paymenku.com/api/v1/transactions
```

---

## Request

### Headers

```http
Authorization: Bearer sk_live_xxxxxxx
Accept: application/json
```

### Query Parameters

| Parameter | Default | Keterangan |
|-----------|---------|------------|
| `page` | `1` | Halaman yang ingin diambil |
| `per_page` | `20` | Item per halaman (maks: 100) |
| `status` | — | Filter status: `pending`, `paid`, `expired`, `failed`, `cancelled`, `refunded` |
| `date_from` | — | Tanggal mulai (`Y-m-d` atau ISO 8601) |
| `date_to` | — | Tanggal akhir (`Y-m-d` atau ISO 8601) |
| `channel_code` | — | Filter berdasarkan channel (mis: `bca_va`) |
| `reference_id` | — | Filter berdasarkan `reference_id` |
| `sort_by` | `created_at` | Field sort: `created_at`, `amount`, `status`, `paid_at` |
| `sort_order` | `desc` | Urutan: `asc` atau `desc` |

---

## Contoh Request

### Daftar transaksi paid (default sort)

```bash
curl "https://paymenku.com/api/v1/transactions?status=paid&per_page=20" \
  -H "Authorization: Bearer sk_live_xxxxxxx"
```

### Filter berdasarkan rentang tanggal

```bash
curl "https://paymenku.com/api/v1/transactions?date_from=2026-01-01&date_to=2026-01-31" \
  -H "Authorization: Bearer sk_live_xxxxxxx"
```

### Filter berdasarkan channel & sort by amount

```bash
curl "https://paymenku.com/api/v1/transactions?channel_code=qris&sort_by=amount&sort_order=desc" \
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
      "reference_id": "INV-001",
      "amount": "104000.00",
      "total_fee": "4000.00",
      "amount_received": "100000.00",
      "status": "paid",
      "channel_code": "bca_va",
      "customer_name": "John Doe",
      "customer_email": "john@example.com",
      "paid_at": "2026-01-25T10:30:00+00:00",
      "created_at": "2026-01-25T10:00:00+00:00"
    }
  ],
  "meta": {
    "current_page": 1,
    "per_page": 20,
    "total": 145,
    "last_page": 8
  }
}
```

---

## Response Fields

### `data[]`

| Field | Type | Keterangan |
|-------|------|------------|
| `trx_id` | string | ID transaksi Paymenku |
| `reference_id` | string | ID referensi dari merchant |
| `amount` | string | Total amount (termasuk fee) |
| `total_fee` | string | Total biaya layanan |
| `amount_received` | string | Jumlah bersih yang diterima merchant |
| `status` | string | Status transaksi |
| `channel_code` | string | Kode channel pembayaran |
| `customer_name` | string | Nama pelanggan |
| `customer_email` | string | Email pelanggan |
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

:::tip Tips
Gunakan endpoint ini untuk **dashboard reporting** atau **rekonsiliasi periodik**. Untuk update status real-time, gunakan [Webhooks](/events/webhooks).
:::
