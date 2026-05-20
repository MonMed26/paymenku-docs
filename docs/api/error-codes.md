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
| `The amount must be at least 10000.` | Amount di bawah minimum Rp 10.000 |
| `The channel_code field is required.` | Parameter `channel_code` tidak disertakan |
| `The channel_code is invalid.` | Channel code tidak dikenali atau tidak aktif |
| `The customer_email must be a valid email.` | Format email tidak valid |
| `The reference_id field is required.` | Parameter `reference_id` tidak disertakan |

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

---

### `422` Unprocessable Entity

Validasi gagal meskipun format request benar.

| Message | Penyebab |
|---------|----------|
| `The reference_id has already been taken.` | `reference_id` sudah pernah digunakan |
| `Channel is currently unavailable.` | Channel sedang maintenance atau nonaktif |
| `Insufficient balance for fee calculation.` | Amount terlalu kecil setelah dikurangi fee |

---

### `429` Too Many Requests

Rate limit terlampaui.

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
