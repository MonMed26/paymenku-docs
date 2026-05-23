---
sidebar_position: 4
title: Cancel Transaction
description: Membatalkan transaksi yang masih pending
---

# Cancel Transaction

Membatalkan transaksi yang masih dalam status `pending`. Setelah cancel, transaksi tidak bisa dibayar lagi.

<span class="api-method api-method--post">POST</span> `/transaction/cancel`

:::warning[Keterbatasan]
Saat ini fitur cancel hanya support:
- Channel **QRIS**
- Mode **sandbox**
:::

---

## Endpoint

```
https://paymenku.com/api/v1/transaction/cancel
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
| `trx_id` | string | ✓ | Transaction ID yang akan di-cancel |

### cURL

```bash
curl -X POST https://paymenku.com/api/v1/transaction/cancel \
  -H "Authorization: Bearer sk_test_xxxxxxx" \
  -H "Content-Type: application/json" \
  -d '{"trx_id": "IDP202602271039768990"}'
```

---

## Response `200 OK`

```json
{
  "status": "success",
  "data": {
    "trx_id": "IDP202602271039768990",
    "reference_id": "INV-001",
    "status": "cancelled",
    "cancelled_at": "2026-01-25T11:00:00+00:00"
  }
}
```

---

## Response Fields

| Field | Type | Keterangan |
|-------|------|------------|
| `trx_id` | string | ID transaksi yang di-cancel |
| `reference_id` | string | ID referensi dari merchant |
| `status` | string | Selalu `cancelled` setelah berhasil |
| `cancelled_at` | string | Waktu cancel (ISO 8601) |

---

## Error Responses

### `422 Unprocessable Entity`

Transaksi tidak bisa di-cancel karena status sudah berubah:

```json
{
  "status": "error",
  "message": "Transaction cannot be cancelled. Current status: paid"
}
```

### `400 Bad Request`

Channel tidak support cancel:

```json
{
  "status": "error",
  "message": "Cancel is not supported for this payment channel."
}
```

### `404 Not Found`

```json
{
  "status": "error",
  "message": "Transaction not found"
}
```

---

:::info[Aturan Cancel]
- Hanya transaksi dengan status `pending` yang bisa di-cancel.
- Setelah cancel, status berubah menjadi `cancelled` dan **tidak bisa di-revert**.
- Webhook `payment.status_updated` akan terkirim dengan `status: "cancelled"`.
:::
