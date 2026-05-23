---
sidebar_position: 1
title: List Payment Channels
description: Mengambil daftar channel pembayaran yang aktif
---

# List Payment Channels

Mengambil daftar semua channel pembayaran yang aktif untuk akun merchant Anda, beserta informasi biaya dan batas nominalnya.

<span class="api-method api-method--get">GET</span> `/payment-channels`

---

## Endpoint

```
https://paymenku.com/api/v1/payment-channels
```

---

## Request

### Headers

```http
Authorization: Bearer sk_live_xxxxxxx
Accept: application/json
```

### cURL

```bash
curl -X GET https://paymenku.com/api/v1/payment-channels \
  -H "Authorization: Bearer sk_live_xxxxxxx" \
  -H "Accept: application/json"
```

---

## Response `200 OK`

```json
{
  "status": "success",
  "data": [
    {
      "code": "bca_va",
      "name": "BCA Virtual Account",
      "type": "va",
      "group": "Virtual Account",
      "fee_mode": "merchant",
      "fee_flat": 4000,
      "fee_percent": 0,
      "min_amount": 10000,
      "max_amount": 50000000
    },
    {
      "code": "dana",
      "name": "DANA",
      "type": "ewallet",
      "group": "E-Wallet",
      "fee_mode": "merchant",
      "fee_flat": 200,
      "fee_percent": 2,
      "min_amount": 1000,
      "max_amount": 10000000
    },
    {
      "code": "qris",
      "name": "QRIS",
      "type": "qris",
      "group": "QRIS",
      "fee_mode": "merchant",
      "fee_flat": 200,
      "fee_percent": 0.7,
      "min_amount": 1000,
      "max_amount": 10000000
    }
  ]
}
```

---

## Response Fields

| Field | Type | Keterangan |
|-------|------|------------|
| `code` | string | Kode unik channel — gunakan sebagai `channel_code` saat [create transaction](/api/transaction/create-transaction) |
| `name` | string | Nama tampilan channel |
| `type` | string | Tipe: `va`, `ewallet`, `qris` |
| `group` | string | Group label yang bisa ditampilkan ke user |
| `fee_mode` | string | `merchant` (fee ditanggung merchant) atau `customer` (ditanggung pelanggan) |
| `fee_flat` | number | Biaya tetap dalam Rupiah |
| `fee_percent` | number | Biaya persentase dari amount |
| `min_amount` | number | Nominal transaksi minimum |
| `max_amount` | number | Nominal transaksi maksimum |

---

## Detail per Tipe Channel

Lihat halaman terpisah untuk daftar lengkap kode channel per tipe:

- [Virtual Account](/api/channels/virtual-account) — BCA, BNI, BRI, Mandiri, Permata, CIMB
- [E-Wallet](/api/channels/ewallet) — DANA, OVO, ShopeePay, LinkAja
- [QRIS](/api/channels/qris) — QRIS Universal
- [QRIS Custom](/api/channels/qris-custom) — Pakai QRIS milik merchant sendiri (`qris_own`)

:::info
Ketersediaan channel dapat berubah. Selalu gunakan endpoint ini untuk mendapatkan daftar terbaru channel yang aktif untuk akun Anda.
:::
