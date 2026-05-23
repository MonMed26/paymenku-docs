---
sidebar_position: 4
title: Error Codes
description: Daftar lengkap error codes API Paymenku
---

# Error Codes

Referensi lengkap error yang mungkin dikembalikan oleh API Paymenku.

---

## Format Error Response

Semua error mengikuti format yang konsisten:

```json
{
  "status": "error",
  "message": "Deskripsi error yang terjadi"
}
```

---

## HTTP Status Codes

### `400` Bad Request

Request tidak valid karena parameter yang salah.

| Message | Penyebab |
|---------|----------|
| `The amount field is required.` | Parameter `amount` tidak disertakan |
| `The amount must be at least 1000.` | Amount di bawah minimum |
| `The channel_code field is required.` | Parameter `channel_code` tidak disertakan |
| `The channel_code is invalid.` | Channel code tidak dikenali atau tidak aktif |
| `The customer_email must be a valid email.` | Format email tidak valid |
| `The reference_id field is required.` | Parameter `reference_id` tidak disertakan |
| `The customer_phone field is required for OVO.` | OVO butuh `customer_phone` |
| `Cancel is not supported for this payment channel.` | Channel tidak support cancel |
| `Refund is not supported for this payment channel.` | Channel tidak support refund |

---

### `401` Unauthorized

Masalah autentikasi.

| Message | Penyebab |
|---------|----------|
| `Unauthorized` | API Key tidak valid, expired, atau tidak disertakan |

---

### `404` Not Found

Resource tidak ditemukan.

| Message | Penyebab |
|---------|----------|
| `Transaction not found` | `trx_id` atau `reference_id` tidak ditemukan |
| `Open payment not found` | UUID Open Payment tidak ditemukan |
| `No instruction available for this channel.` | Channel tidak punya payment instruction |

---

### `409` Conflict

Konflik data — biasanya terkait idempotency.

| Message | Penyebab |
|---------|----------|
| `Idempotency-Key already used with different request body.` | Key sama tapi payload berbeda — lihat [Idempotency](/getting-started/idempotency) |

---

### `422` Unprocessable Entity

Validasi gagal meskipun format request benar.

| Message | Penyebab |
|---------|----------|
| `The reference_id has already been taken.` | `reference_id` sudah pernah digunakan |
| `Channel is currently unavailable.` | Channel sedang maintenance atau nonaktif |
| `Insufficient balance for fee calculation.` | Amount terlalu kecil setelah dikurangi fee |
| `Transaction cannot be cancelled. Current status: paid` | Hanya transaksi `pending` yang bisa di-cancel |
| `Only paid transactions can be refunded.` | Refund hanya untuk transaksi `paid` |
| `Refund amount cannot exceed original transaction amount.` | `refund_amount` > amount asli |
| `Insufficient merchant balance for refund.` | Saldo merchant tidak cukup untuk refund |

---

### `429` Too Many Requests

Rate limit terlampaui — lihat [Rate Limiting](/getting-started/rate-limiting).

| Message | Penyebab |
|---------|----------|
| `Too many requests. Please try again later.` | Melebihi 60 request/menit |

---

### `500` Internal Server Error

Kesalahan di sisi server.

| Message | Penyebab |
|---------|----------|
| `Internal server error` | Terjadi kesalahan internal — coba lagi atau hubungi support |

---

### `503` Service Unavailable

Endpoint sedang tidak tersedia.

| Message | Penyebab |
|---------|----------|
| `Service temporarily unavailable.` | Maintenance atau provider down |
| `Open payment creation is currently disabled.` | Endpoint `POST /open-payment/create` sementara di-disable |

---

## Handling Errors

### PHP

```php
<?php
$response = json_decode($httpResponse, true);

if ($response['status'] === 'error') {
    // Log error
    error_log('Paymenku Error: ' . $response['message']);
    
    // Handle berdasarkan HTTP status code
    switch ($httpStatusCode) {
        case 401:
            // API Key bermasalah
            break;
        case 422:
            // Validasi gagal - cek message
            break;
        case 429:
            // Rate limited - tunggu dan retry
            sleep(60);
            break;
        case 500:
            // Server error - retry dengan exponential backoff
            break;
    }
}
```

### Node.js

```javascript
try {
  const response = await fetch(url, options);
  const data = await response.json();

  if (data.status === 'error') {
    switch (response.status) {
      case 401:
        throw new Error('Invalid API Key');
      case 422:
        throw new Error(`Validation: ${data.message}`);
      case 429:
        // Retry after delay
        await new Promise(r => setTimeout(r, 60000));
        break;
      case 500:
        // Retry with backoff
        break;
    }
  }
} catch (error) {
  console.error('Paymenku API Error:', error.message);
}
```

---

## Tips

:::tip Best Practices
1. **Selalu handle error** — jangan asumsikan request selalu berhasil
2. **Implementasi retry** — untuk error 500 dan 429, gunakan exponential backoff
3. **Log semua error** — simpan response lengkap untuk debugging
4. **Validasi di sisi Anda** — validasi input sebelum mengirim ke API untuk mengurangi error 400/422
:::
