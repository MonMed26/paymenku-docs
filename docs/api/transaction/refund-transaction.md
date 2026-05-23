---
sidebar_position: 5
title: Refund Transaction
description: Refund transaksi yang sudah paid
---

# Refund Transaction

Refund transaksi yang sudah berstatus `paid`. Dana akan otomatis didebit dari saldo merchant dan dikembalikan ke pelanggan.

<span class="api-method api-method--post">POST</span> `/transaction/refund`

:::warning[Keterbatasan]
Saat ini fitur refund hanya support:
- Channel **E-Wallet**
- Mode **sandbox**

Refund untuk Virtual Account dan QRIS belum tersedia.
:::

---

## Endpoint

```
https://paymenku.com/api/v1/transaction/refund
```

---

## Request

### Headers

```http
Authorization: Bearer sk_test_xxxxxxx
Content-Type: application/json
Accept: application/json
```

### Body Parameters

| Parameter | Type | Required | Keterangan |
|-----------|------|:--------:|------------|
| `trx_id` | string | ✓ | Transaction ID yang akan di-refund |
| `refund_amount` | number | ✓ | Jumlah refund (≤ amount asli, partial refund didukung) |
| `reason` | string | — | Alasan refund (maks 255 karakter) |

### cURL

**Full refund:**

```bash
curl -X POST https://paymenku.com/api/v1/transaction/refund \
  -H "Authorization: Bearer sk_test_xxxxxxx" \
  -H "Content-Type: application/json" \
  -d '{
    "trx_id": "IDP202602271039768990",
    "refund_amount": 100000,
    "reason": "Customer requested cancellation"
  }'
```

**Partial refund:**

```bash
curl -X POST https://paymenku.com/api/v1/transaction/refund \
  -H "Authorization: Bearer sk_test_xxxxxxx" \
  -H "Content-Type: application/json" \
  -d '{
    "trx_id": "IDP202602271039768990",
    "refund_amount": 50000,
    "reason": "Partial refund for damaged item"
  }'
```

---

## Response `200 OK`

```json
{
  "status": "success",
  "data": {
    "trx_id": "IDP202602271039768990",
    "reference_id": "INV-001",
    "original_amount": "100000.00",
    "refund_amount": "100000.00",
    "status": "refunded",
    "reason": "Customer requested cancellation",
    "refunded_at": "2026-01-25T12:00:00+00:00"
  }
}
```

---

## Response Fields

| Field | Type | Keterangan |
|-------|------|------------|
| `trx_id` | string | ID transaksi yang di-refund |
| `reference_id` | string | ID referensi dari merchant |
| `original_amount` | string | Amount transaksi asli |
| `refund_amount` | string | Jumlah yang di-refund |
| `status` | string | `refunded` (full) atau `partially_refunded` (partial) |
| `reason` | string \| null | Alasan refund |
| `refunded_at` | string | Waktu refund (ISO 8601) |

---

## Error Responses

### `422 Unprocessable Entity`

Saldo merchant tidak cukup:

```json
{
  "status": "error",
  "message": "Insufficient merchant balance for refund."
}
```

`refund_amount` lebih besar dari amount asli:

```json
{
  "status": "error",
  "message": "Refund amount cannot exceed original transaction amount."
}
```

Status transaksi belum `paid`:

```json
{
  "status": "error",
  "message": "Only paid transactions can be refunded."
}
```

### `400 Bad Request`

Channel tidak support refund:

```json
{
  "status": "error",
  "message": "Refund is not supported for this payment channel."
}
```

---

:::info[Aturan Refund]
- Saldo merchant harus **cukup** untuk menutupi `refund_amount`.
- **Fee tidak dikembalikan** — yang di-refund hanya nominal transaksi, bukan biaya layanan.
- Webhook `payment.status_updated` akan terkirim dengan `status: "refunded"`.
- Refund **tidak bisa dibatalkan**. Pastikan jumlah dan alasan sudah benar.
:::
