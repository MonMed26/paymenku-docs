---
sidebar_position: 1
title: Virtual Account
description: Channel pembayaran via Virtual Account bank
---

# Virtual Account

Virtual Account (VA) adalah nomor rekening virtual unik yang di-generate per transaksi. Pelanggan transfer ke nomor VA tersebut dari ATM, mobile banking, atau internet banking.

---

## Channel Codes

| Code | Bank | Min Amount | Max Amount |
|------|------|------------|------------|
| `bca_va` | BCA | Rp 10.000 | Rp 50.000.000 |
| `bni_va` | BNI | Rp 10.000 | Rp 50.000.000 |
| `bri_va` | BRI | Rp 10.000 | Rp 50.000.000 |
| `mandiri_va` | Mandiri | Rp 10.000 | Rp 50.000.000 |
| `permata_va` | Permata | Rp 10.000 | Rp 50.000.000 |
| `cimb_va` | CIMB Niaga | Rp 10.000 | Rp 50.000.000 |

:::info
Daftar kode dan limit di atas hanya referensi. Selalu cek [GET /payment-channels](/api/channels/payment-channels) untuk daftar terbaru sesuai akun Anda.
:::

---

## Create Transaction

Gunakan endpoint [Create Transaction](/api/transaction/create-transaction) dengan `channel_code` sesuai bank yang diinginkan.

### Request

```bash
curl -X POST https://paymenku.com/api/v1/transaction/create \
  -H "Authorization: Bearer sk_live_xxxxxxx" \
  -H "Content-Type: application/json" \
  -d '{
    "channel_code": "bca_va",
    "amount": 100000,
    "reference_id": "INV-001",
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
    "trx_id": "IDP202602271039768990",
    "reference_id": "INV-001",
    "amount": "104000.00",
    "status": "pending",
    "pay_url": "https://paymenku.com/pay/IDP202602271039768990",
    "payment_info": {
      "bank": "BCA",
      "va_number": "381659999814525",
      "expiration_date": "2026-01-19T03:43:30.000Z"
    }
  }
}
```

---

## Payment Info Fields

| Field | Type | Keterangan |
|-------|------|------------|
| `bank` | string | Nama bank (mis: `BCA`, `BNI`) |
| `va_number` | string | Nomor Virtual Account untuk transfer |
| `expiration_date` | string | Waktu kadaluarsa (ISO 8601) |

---

## Cara Bayar

Tampilkan `va_number` ke pelanggan, lalu mereka bayar via:

- **ATM** — pilih menu Transfer → Virtual Account → masukkan nomor
- **Mobile Banking** — pilih Transfer → Virtual Account
- **Internet Banking** — menu Transfer ke Virtual Account
- **m-Banking pihak ketiga** (LinkAja, OVO untuk top-up VA tertentu)

Untuk panduan lengkap step-by-step, gunakan endpoint [Payment Instruction](/api/channels/payment-instruction).

---

## Karakteristik

| Aspek | Detail |
|-------|--------|
| Konfirmasi | Real-time setelah transfer berhasil |
| Expiration | Default 24 jam (bisa berbeda per bank) |
| Refund | Belum tersedia untuk VA |
| Cancel | Belum tersedia untuk VA |
| Webhook | Dikirim saat status berubah ke `paid` atau `expired` |

:::tip
VA cocok untuk **transaksi nominal besar** karena limit-nya tinggi dan biayanya flat (tidak persentase di kebanyakan bank).
:::
