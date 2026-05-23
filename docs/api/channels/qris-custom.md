---
sidebar_position: 4
title: QRIS Custom
description: Pakai QRIS milik merchant sendiri (qris_own)
---

# QRIS Custom

**QRIS Custom** memungkinkan merchant memakai QRIS yang **sudah dimiliki/dibuat sendiri** (mis. QRIS statis yang sudah didaftarkan via PJP/aggregator lain) sambil tetap memanfaatkan fitur Paymenku — pencatatan transaksi, webhook notifikasi, rekonsiliasi, dan dashboard.

Cara pakainya **persis sama** dengan [QRIS biasa](/api/channels/qris) — perbedaannya hanya di `channel_code`.

| QRIS Reguler | QRIS Custom |
|--------------|-------------|
| `channel_code: "qris"` | `channel_code: "qris_own"` |
| QR di-generate Paymenku | QR pakai milik merchant |
| Fee mengikuti tarif Paymenku | Fee mengikuti pengaturan merchant di dashboard |

---

## Channel Code

| Code | Provider | Min Amount | Max Amount |
|------|----------|------------|------------|
| `qris_own` | QRIS Custom (milik merchant) | Rp 1.000 | Rp 10.000.000 |

:::info[Prasyarat]
Sebelum pakai `qris_own`, merchant harus:
1. Punya QRIS aktif (NMID terdaftar) dari penyedia manapun.
2. Upload / register QRIS string di dashboard merchant: **Settings → QRIS Custom**.
3. Tunggu verifikasi singkat oleh tim Paymenku.

Jika QRIS Custom belum di-setup, request akan ditolak dengan `422 QRIS Custom is not configured for this merchant.`
:::

---

## Create Transaction

Gunakan endpoint [Create Transaction](/api/transaction/create-transaction) dengan `channel_code: "qris_own"`.

### Request

```bash
curl -X POST https://paymenku.com/api/v1/transaction/create \
  -H "Authorization: Bearer sk_live_xxxxxxx" \
  -H "Content-Type: application/json" \
  -d '{
    "channel_code": "qris_own",
    "amount": 100000,
    "reference_id": "INV-CUSTOM-001",
    "customer_name": "John Doe",
    "customer_email": "john@example.com",
    "return_url": "https://toko-anda.com/success"
  }'
```

### Response

```json
{
  "status": "success",
  "data": {
    "trx_id": "IDP202602271050987654",
    "reference_id": "INV-CUSTOM-001",
    "amount": "100000.00",
    "status": "pending",
    "pay_url": "https://paymenku.com/pay/IDP202602271050987654",
    "payment_info": {
      "qr_url": "https://paymenku.com/api/qr/IDP202602271050987654",
      "qr_string": "00020101021126570011ID.CO.QRIS...",
      "merchant_name": "TOKO ANDA",
      "nmid": "ID1024123456789",
      "expiration_date": "2026-01-19T03:42:39Z"
    }
  }
}
```

---

## Payment Info Fields

| Field | Type | Keterangan |
|-------|------|------------|
| `qr_url` | string | URL gambar QR code (PNG) — bisa langsung di-`<img>` |
| `qr_string` | string | QRIS string milik merchant (sudah di-inject nominal) |
| `merchant_name` | string | Nama merchant sesuai NMID terdaftar |
| `nmid` | string | National Merchant ID dari QRIS merchant |
| `expiration_date` | string | Waktu kadaluarsa (ISO 8601) |

---

## Cara Tampilkan QR

Sama persis dengan [QRIS reguler](/api/channels/qris#cara-tampilkan-qr):

### Opsi 1: Pakai `qr_url`

```html
<img src="https://paymenku.com/api/qr/IDP202602271050987654" alt="QRIS" />
```

### Opsi 2: Generate sendiri dari `qr_string`

```javascript
import QRCode from 'qrcode.react';

<QRCode value={data.payment_info.qr_string} size={256} />
```

---

## Flow Pembayaran

```
Merchant → QR (qris_own) → Customer scan → Transfer ke rekening merchant → Webhook → Display success
```

1. **Create transaction** dengan `channel_code: "qris_own"`.
2. **Tampilkan QR** ke pelanggan.
3. **Pelanggan scan** dan transfer langsung ke rekening yang terdaftar di QRIS merchant.
4. **Webhook** — Paymenku kirim notifikasi `paid` setelah dana masuk dan terverifikasi.
5. **Rekonsiliasi** otomatis dicatat di dashboard.

---

## Karakteristik

| Aspek | Detail |
|-------|--------|
| Settlement | Langsung ke rekening yang terdaftar di QRIS merchant |
| Konfirmasi | Real-time setelah pembayaran terdeteksi |
| Expiration | Default ~24 jam (bisa di-config di dashboard) |
| Refund | Tidak tersedia — refund harus dilakukan manual oleh merchant |
| Cancel | Tersedia (lihat [Cancel Transaction](/api/transaction/cancel-transaction)) |
| Fee | Sesuai pengaturan merchant — bisa lebih murah dari QRIS reguler |
| Universal | Bisa dibayar dari semua aplikasi pendukung QRIS |

---

## Perbedaan vs QRIS Reguler

| Aspek | `qris` (reguler) | `qris_own` (custom) |
|-------|------------------|---------------------|
| QR yang dipakai | Generate Paymenku | Milik merchant |
| Settlement | Saldo Paymenku → withdraw | Langsung ke rekening merchant |
| NMID | NMID Paymenku | NMID merchant sendiri |
| Setup awal | Tidak perlu | Perlu upload QRIS di dashboard |
| Fee | Tarif standar Paymenku | Sesuai negotiation merchant |
| Refund via API | Belum tersedia | Belum tersedia |

---

## Error Responses

### `422 Unprocessable Entity`

QRIS Custom belum di-setup:

```json
{
  "status": "error",
  "message": "QRIS Custom is not configured for this merchant."
}
```

QRIS string milik merchant invalid / expired:

```json
{
  "status": "error",
  "message": "Merchant QRIS is invalid or has been revoked."
}
```

### `400 Bad Request`

```json
{
  "status": "error",
  "message": "The channel_code is invalid."
}
```

---

:::tip[Kapan pakai QRIS Custom?]
Pakai `qris_own` jika:
- Anda sudah punya QRIS terdaftar dari PJP lain dan **mau settlement langsung** ke rekening sendiri.
- Anda butuh **fee yang lebih kompetitif** dari rate standar Paymenku.
- Anda mau brand merchant **muncul di aplikasi pembayar** (nama di NMID Anda, bukan Paymenku).

Pakai `qris` reguler jika:
- Belum punya QRIS sendiri dan ingin setup cepat tanpa register NMID.
- Ingin Paymenku menangani settlement & rekonsiliasi penuh.
:::
