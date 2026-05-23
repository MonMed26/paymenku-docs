---
slug: /
sidebar_position: 1
title: Introduction
---

# Paymenku.com API

Selamat datang di dokumentasi resmi API Paymenku.com — payment gateway modern untuk bisnis di Indonesia.

API kami dirancang berdasarkan prinsip **REST**, menggunakan **HTTPS** pada semua request, dan mengembalikan response dalam format **JSON**.

---

## Fitur Utama

| Fitur | Keterangan |
|-------|------------|
| Virtual Account | BCA, BNI, BRI, Mandiri, Permata, CIMB |
| E-Wallet | DANA, OVO, ShopeePay, LinkAja |
| QRIS | Pembayaran via scan QR universal |
| Open Payment | VA reusable untuk top-up & donasi |
| Refund & Cancel | Pembatalan dan refund transaksi |
| Webhook | Notifikasi real-time saat status berubah (HMAC-SHA256) |
| Idempotency | Cegah duplicate request dengan `Idempotency-Key` |
| Sandbox | Environment testing tanpa transaksi nyata |

---

## Base URL

```
https://paymenku.com/api/v1
```

Semua endpoint API menggunakan base URL di atas, baik untuk mode **live** maupun **sandbox**. Perbedaannya hanya pada API Key yang digunakan.

---

## Format Response

Semua response menggunakan format JSON yang konsisten:

**Success:**
```json
{
  "status": "success",
  "data": { ... }
}
```

**Error:**
```json
{
  "status": "error",
  "message": "Deskripsi error"
}
```

---

## HTTP Status Codes

| Code | Keterangan |
|------|------------|
| `200` | Request berhasil |
| `400` | Bad Request — parameter tidak valid |
| `401` | Unauthorized — API Key tidak valid atau tidak ada |
| `404` | Not Found — resource tidak ditemukan |
| `422` | Unprocessable Entity — validasi gagal |
| `429` | Too Many Requests — rate limit terlampaui |
| `500` | Internal Server Error |

---

## Alur Integrasi

```
1. Daftar Merchant → 2. Dapatkan API Key → 3. Integrasi API → 4. Test Sandbox → 5. Go Live
```

1. **Daftar** akun merchant di [paymenku.com/merchant/register](https://paymenku.com/merchant/register)
2. **Dapatkan API Key** dari menu Settings > API Keys di dashboard
3. **Integrasi** endpoint Create Transaction ke sistem Anda
4. **Test** menggunakan API Key sandbox (`sk_test_...`)
5. **Go Live** dengan mengganti ke API Key production (`sk_live_...`)

---

## Butuh Bantuan?

- Dokumentasi: [docs.paymenku.com](https://docs.paymenku.com)
- Dashboard: [paymenku.com/merchant/login](https://paymenku.com/merchant/login)
- Email: support@paymenku.com
- Website: [paymenku.com/contact](https://paymenku.com/contact)
