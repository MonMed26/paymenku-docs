---
sidebar_position: 2
title: E-Wallet
description: Channel pembayaran via dompet digital
---

# E-Wallet

E-Wallet adalah pembayaran via aplikasi dompet digital. Setelah create transaction, pelanggan diarahkan ke aplikasi e-wallet mereka untuk approve pembayaran.

---

## Channel Codes

| Code | Provider | Min Amount | Max Amount | Khusus |
|------|----------|------------|------------|--------|
| `dana` | DANA | Rp 1.000 | Rp 10.000.000 | — |
| `ovo` | OVO | Rp 1.000 | Rp 10.000.000 | `customer_phone` **wajib** |
| `shopeepay` | ShopeePay | Rp 1.000 | Rp 10.000.000 | — |
| `linkaja` | LinkAja | Rp 1.000 | Rp 10.000.000 | — |

:::warning OVO
Untuk channel `ovo`, parameter `customer_phone` **wajib** diisi karena OVO menggunakan nomor HP sebagai identitas pengguna.
:::

---

## Create Transaction

Gunakan endpoint [Create Transaction](/api/transaction/create-transaction) dengan `channel_code` sesuai provider.

### Request

```bash
curl -X POST https://paymenku.com/api/v1/transaction/create \
  -H "Authorization: Bearer sk_live_xxxxxxx" \
  -H "Content-Type: application/json" \
  -d '{
    "channel_code": "dana",
    "amount": 100000,
    "reference_id": "INV-001",
    "customer_name": "John Doe",
    "customer_email": "john@example.com",
    "customer_phone": "08123456789",
    "return_url": "https://toko-anda.com/success"
  }'
```

### Response

```json
{
  "status": "success",
  "data": {
    "trx_id": "IDP202602271040123456",
    "reference_id": "INV-001",
    "amount": "102200.00",
    "status": "pending",
    "pay_url": "https://paymenku.com/pay/IDP202602271040123456",
    "payment_info": {
      "transaction_status": "pending",
      "checkout_url": "https://ewallet-service.example.com/checkout/...",
      "expiration_date": "2026-01-18T03:55:10+00:00"
    }
  }
}
```

---

## Payment Info Fields

| Field | Type | Keterangan |
|-------|------|------------|
| `transaction_status` | string | Status di provider e-wallet |
| `checkout_url` | string | URL redirect ke aplikasi/web e-wallet |
| `expiration_date` | string | Waktu kadaluarsa (ISO 8601) |

---

## Flow Pembayaran

1. **Create transaction** — Anda terima `checkout_url`.
2. **Redirect pelanggan** — buka `checkout_url` di browser/in-app.
3. **Approve di app** — pelanggan approve di aplikasi e-wallet mereka.
4. **Webhook** — Paymenku kirim notifikasi `paid` ke webhook URL.
5. **Return URL** — pelanggan diarahkan kembali ke `return_url` Anda.

```
User → checkout_url → E-wallet App → Approve → Webhook → Return URL
```

---

## Karakteristik

| Aspek | Detail |
|-------|--------|
| Konfirmasi | Real-time setelah pelanggan approve |
| Expiration | Singkat (5-15 menit, tergantung provider) |
| Refund | Tersedia (sandbox-only saat ini) — lihat [Refund](/api/transaction/refund-transaction) |
| Cancel | Belum tersedia |
| Fee | Umumnya persentase (1-2%) |

:::tip
E-Wallet cocok untuk **transaksi nominal kecil-menengah** karena flow approve cepat dan UX seamless. Tapi expiration lebih singkat dari VA.
:::

---

## Catatan Khusus per Provider

### OVO

- `customer_phone` **wajib** dan harus terdaftar di OVO
- Push notification dikirim ke aplikasi OVO pelanggan
- Pelanggan harus approve dalam ~60 detik

### DANA

- Mendukung pembayaran via DANA Web (browser) atau App
- Saldo DANA pelanggan harus mencukupi

### ShopeePay

- Redirect ke aplikasi Shopee (jika install) atau web checkout
- Mendukung pembayaran via ShopeePay Later untuk merchant tertentu

### LinkAja

- Mendukung saldo regular dan saldo Syariah
