---
sidebar_position: 1
title: Show Open Payment
description: Detail Open Payment (VA reusable dengan nominal bebas)
---

# Show Open Payment

Mengambil detail Open Payment — sebuah Virtual Account **reusable** dengan nominal bebas yang bisa dipakai berulang kali oleh pelanggan untuk top-up atau pembayaran rutin.

<span class="api-method api-method--get">GET</span> `/open-payment/{uuid}`

:::info[Tentang Open Payment]
**Open Payment** adalah VA yang tidak perlu di-create per transaksi. Satu VA bisa menerima banyak pembayaran dengan nominal yang berbeda-beda dari pelanggan yang sama.

Cocok untuk:
- Top-up saldo aplikasi
- Donation / fundraising
- Subscription yang nominal bayarnya bisa berubah
- Penagihan internal
:::

---

## Endpoint

```
https://paymenku.com/api/v1/open-payment/{uuid}
```

---

## Request

### Path Parameters

| Parameter | Type | Required | Keterangan |
|-----------|------|:--------:|------------|
| `uuid` | string | ✓ | UUID Open Payment yang ingin dilihat |

### Headers

```http
Authorization: Bearer sk_live_xxxxxxx
Accept: application/json
```

### cURL

```bash
curl "https://paymenku.com/api/v1/open-payment/550e8400-e29b-41d4-a716-446655440000" \
  -H "Authorization: Bearer sk_live_xxxxxxx"
```

---

## Response `200 OK`

```json
{
  "status": "success",
  "data": {
    "uuid": "550e8400-e29b-41d4-a716-446655440000",
    "name": "Top-Up Saldo Budi",
    "channel_code": "bca_va",
    "channel_name": "BCA Virtual Account",
    "va_number": "381659999814525",
    "customer_name": "Budi Santoso",
    "customer_email": "budi@example.com",
    "is_active": true,
    "total_received": "1500000.00",
    "transaction_count": 12,
    "created_at": "2026-01-01T00:00:00+00:00",
    "updated_at": "2026-01-25T10:30:00+00:00"
  }
}
```

---

## Response Fields

| Field | Type | Keterangan |
|-------|------|------------|
| `uuid` | string | UUID Open Payment |
| `name` | string | Label internal Open Payment |
| `channel_code` | string | Kode channel (sementara hanya VA) |
| `channel_name` | string | Nama channel |
| `va_number` | string | Nomor VA reusable |
| `customer_name` | string | Nama pelanggan terkait |
| `customer_email` | string | Email pelanggan |
| `is_active` | boolean | `true` jika masih aktif |
| `total_received` | string | Akumulasi total pembayaran yang diterima |
| `transaction_count` | number | Jumlah transaksi yang sudah masuk |
| `created_at` | string | Waktu Open Payment dibuat |
| `updated_at` | string | Waktu update terakhir |

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

## Catatan

:::warning[Endpoint Create di-Disable]
Endpoint **`POST /open-payment/create`** sementara di-disable dan akan mengembalikan `503 Service Unavailable`.

Fitur ini menunggu integrasi Static VA aktif kembali. Update akan diumumkan via dashboard merchant.

Untuk sementara, Open Payment harus dibuat manual via dashboard di **Settings → Open Payment**.
:::

:::tip
Untuk melihat daftar transaksi yang masuk via Open Payment, gunakan [Open Payment Transactions](/api/open-payment/open-payment-transactions).
:::
