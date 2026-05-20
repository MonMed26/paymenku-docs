---
sidebar_position: 1
title: Payment Channels
description: Mengambil daftar metode pembayaran yang aktif
---

# Get Payment Channels

Mengambil daftar semua metode pembayaran yang aktif beserta informasi biaya layanannya.

<span class="api-method api-method--get">GET</span> `/payment-channels`

---

## Request

### Headers

```http
Authorization: Bearer sk_live_xxxxxxx
Content-Type: application/json
Accept: application/json
```

### cURL

```bash
curl -X GET https://paymenku.com/api/v1/payment-channels \
  -H "Authorization: Bearer sk_live_xxxxxxx" \
  -H "Content-Type: application/json" \
  -H "Accept: application/json"
```

---

## Response `200 OK`

```json
{
  "status": "success",
  "data": {
    "va": [
      {
        "code": "bca_va",
        "name": "BCA Virtual Account",
        "type": "va",
        "type_label": "Virtual Account",
        "icon": "https://paymenku.com/storage/channel-icons/bca_va.png",
        "description": "Virtual Account BCA",
        "fee": {
          "flat": 4000,
          "percent": 1,
          "display": "Rp 4.000 + 1.00%"
        }
      }
    ],
    "ewallet": [
      {
        "code": "dana",
        "name": "Dana",
        "type": "ewallet",
        "type_label": "E-Wallet",
        "icon": "https://paymenku.com/storage/channel-icons/dana.png",
        "description": "Dana",
        "fee": {
          "flat": 200,
          "percent": 2,
          "display": "2.00%"
        }
      }
    ],
    "qris": [
      {
        "code": "qris",
        "name": "QRIS",
        "type": "qris",
        "type_label": "QRIS",
        "icon": "https://paymenku.com/storage/channel-icons/qris.png",
        "description": "QRIS",
        "fee": {
          "flat": 200,
          "percent": 0.7,
          "display": "0.70%"
        }
      }
    ]
  }
}
```

---

## Response Fields

Data dikelompokkan berdasarkan tipe channel (`va`, `ewallet`, `qris`). Setiap item memiliki field:

| Field | Type | Keterangan |
|-------|------|------------|
| `code` | string | Kode unik channel — gunakan sebagai `channel_code` saat [create transaction](/api/create-transaction) |
| `name` | string | Nama tampilan channel |
| `type` | string | Tipe: `va`, `ewallet`, `qris` |
| `type_label` | string | Label tipe yang bisa ditampilkan ke user |
| `icon` | string | URL icon/logo channel |
| `description` | string | Deskripsi singkat |
| `fee.flat` | number | Biaya tetap dalam Rupiah |
| `fee.percent` | number | Biaya persentase dari amount |
| `fee.display` | string | Format tampilan biaya yang sudah diformat |

---

## Channel Codes

Berikut daftar `channel_code` yang tersedia:

### Virtual Account

| Code | Bank |
|------|------|
| `bca_va` | BCA |
| `bni_va` | BNI |
| `bri_va` | BRI |
| `mandiri_va` | Mandiri |
| `permata_va` | Permata |
| `cimb_va` | CIMB Niaga |

### E-Wallet

| Code | Provider |
|------|----------|
| `dana` | DANA |
| `ovo` | OVO |
| `shopeepay` | ShopeePay |
| `linkaja` | LinkAja |

### QRIS

| Code | Provider |
|------|----------|
| `qris` | QRIS (Universal) |

:::info
Ketersediaan channel dapat berubah. Selalu gunakan endpoint ini untuk mendapatkan daftar terbaru channel yang aktif untuk akun Anda.
:::
