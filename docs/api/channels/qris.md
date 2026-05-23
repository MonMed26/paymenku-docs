---
sidebar_position: 3
title: QRIS
description: Channel pembayaran via QRIS universal
---

# QRIS

QRIS (Quick Response Code Indonesian Standard) adalah standar QR pembayaran nasional Indonesia. Satu QR bisa di-scan dari berbagai aplikasi: m-banking, DANA, OVO, ShopeePay, GoPay, dan lainnya.

---

## Channel Codes

| Code | Provider | Min Amount | Max Amount |
|------|----------|------------|------------|
| `qris` | QRIS Universal | Rp 1.000 | Rp 10.000.000 |

---

## Create Transaction

Gunakan endpoint [Create Transaction](/api/transaction/create-transaction) dengan `channel_code: "qris"`.

### Request

```bash
curl -X POST https://paymenku.com/api/v1/transaction/create \
  -H "Authorization: Bearer sk_live_xxxxxxx" \
  -H "Content-Type: application/json" \
  -d '{
    "channel_code": "qris",
    "amount": 100000,
    "reference_id": "INV-002",
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
    "trx_id": "IDP202602271042567890",
    "reference_id": "INV-002",
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

## Payment Info Fields

| Field | Type | Keterangan |
|-------|------|------------|
| `qr_url` | string | URL gambar QR code (PNG) — bisa langsung di-`<img>` |
| `qr_string` | string | Raw QRIS string (EMVCo format) untuk generate QR sendiri |
| `expiration_date` | string | Waktu kadaluarsa (ISO 8601) |

---

## Cara Tampilkan QR

### Opsi 1: Langsung pakai `qr_url`

Cara paling cepat — embed URL gambar:

```html
<img src="https://paymenku.com/api/qr/IDP202602271042567890" alt="QRIS" />
```

### Opsi 2: Generate QR dari `qr_string`

Untuk kontrol penuh ukuran/style, generate sendiri di klien:

```javascript
// React + qrcode.react
import QRCode from 'qrcode.react';

<QRCode value={data.payment_info.qr_string} size={256} />
```

```php
// PHP + endroid/qr-code
use Endroid\QrCode\Builder\Builder;

$qr = Builder::create()
    ->data($data['payment_info']['qr_string'])
    ->size(300)
    ->build();

header('Content-Type: image/png');
echo $qr->getString();
```

### Opsi 3: Redirect ke `pay_url`

Tampilkan halaman pembayaran Paymenku langsung:

```javascript
window.location.href = data.pay_url;
```

---

## Flow Pembayaran

1. **Create transaction** — Anda terima `qr_url` / `qr_string`.
2. **Tampilkan QR** ke pelanggan (di kasir, web, atau app).
3. **Pelanggan scan** dengan aplikasi pembayaran (m-banking, e-wallet, dll).
4. **Webhook** — Paymenku kirim notifikasi `paid` ke webhook URL.
5. **Display success** — update UI / kirim struk.

```
Merchant → QR → Customer scan → Approve di app → Webhook → Display success
```

---

## Karakteristik

| Aspek | Detail |
|-------|--------|
| Konfirmasi | Real-time setelah pelanggan approve di aplikasi |
| Expiration | Default ~24 jam |
| Refund | Belum tersedia |
| Cancel | Tersedia (sandbox-only) — lihat [Cancel Transaction](/api/transaction/cancel-transaction) |
| Fee | Umumnya 0.7% (sesuai regulasi BI) |
| Universal | Bisa dibayar dari semua aplikasi pendukung QRIS |

:::tip
QRIS sangat cocok untuk **POS offline** atau **e-commerce dengan UX cepat**. Pelanggan tidak perlu pilih bank/wallet — cukup scan dengan aplikasi favoritnya.
:::

:::info Polling Status
Karena QRIS tidak punya callback dari aplikasi pembayar, **selalu** andalkan webhook untuk konfirmasi. Jika perlu konfirmasi cepat di UI, polling [Check Status](/api/transaction/check-status) tiap 3-5 detik adalah pola yang umum.
:::
