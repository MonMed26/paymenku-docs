---
sidebar_position: 2
title: Authentication
---

# Authentication

Semua request ke Paymenku API memerlukan autentikasi menggunakan **Bearer Token** melalui HTTP header.

---

## Headers Wajib

Setiap request harus menyertakan header berikut:

```http
Authorization: Bearer sk_live_xxxxxxx
Content-Type: application/json
Accept: application/json
```

---

## API Key

API Key adalah kredensial rahasia yang mengidentifikasi merchant Anda. Paymenku menyediakan dua jenis key:

| Tipe | Prefix | Kegunaan |
|------|--------|----------|
| **Production** | `sk_live_` | Transaksi nyata, dana masuk ke saldo |
| **Sandbox** | `sk_test_` | Testing, tidak ada dana yang berpindah |

### Mendapatkan API Key

1. Login ke [Dashboard Merchant](https://paymenku.com/merchant/login)
2. Navigasi ke **Settings** → **API Keys**
3. Copy API Key yang tersedia

---

## Keamanan

:::danger Penting
- **Jangan pernah** expose API Key di client-side (frontend, mobile app, atau repository publik)
- Simpan API Key di environment variable atau secret manager
- Gunakan HTTPS untuk semua komunikasi
- Rotasi API Key secara berkala jika dicurigai bocor
:::

### Best Practices

```bash
# Simpan di environment variable
export PAYMENKU_API_KEY="sk_live_xxxxxxx"
```

```php
// PHP - baca dari environment
$apiKey = getenv('PAYMENKU_API_KEY');
```

```javascript
// Node.js - baca dari environment
const apiKey = process.env.PAYMENKU_API_KEY;
```

---

## Contoh Request

```bash
curl -X GET https://paymenku.com/api/v1/payment-channels \
  -H "Authorization: Bearer sk_live_xxxxxxx" \
  -H "Content-Type: application/json" \
  -H "Accept: application/json"
```

---

## Error Autentikasi

Jika API Key tidak valid, expired, atau tidak disertakan:

**Response `401 Unauthorized`:**

```json
{
  "status": "error",
  "message": "Unauthorized"
}
```

**Penyebab umum:**
- API Key salah atau typo
- Menggunakan key sandbox di mode live (atau sebaliknya)
- API Key sudah di-revoke dari dashboard
- Header `Authorization` tidak disertakan

---

## Rate Limiting

API Paymenku menerapkan rate limiting untuk menjaga stabilitas:

| Tier | Limit |
|------|-------|
| Default | 60 requests/menit |
| High Volume | Hubungi support untuk peningkatan |

Jika melebihi limit, Anda akan menerima response `429 Too Many Requests`.
