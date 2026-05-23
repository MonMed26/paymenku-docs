---
sidebar_position: 5
title: Payment Instruction
description: Ambil panduan cara bayar per channel
---

# Payment Instruction

Mengambil panduan cara bayar (ATM, Mobile Banking, Internet Banking, atau langkah aplikasi e-wallet) untuk channel tertentu. Cocok ditampilkan di halaman pembayaran.

<span class="api-method api-method--get">GET</span> `/payment/instruction`

---

## Endpoint

```
https://paymenku.com/api/v1/payment/instruction
```

---

## Request

### Headers

```http
Authorization: Bearer sk_live_xxxxxxx
Accept: application/json
```

### Query Parameters

| Parameter | Type | Required | Keterangan |
|-----------|------|:--------:|------------|
| `code` | string | ✓ | Channel code (mis: `bca_va`, `dana`) |
| `pay_code` | string | — | Nomor VA / kode bayar untuk auto-fill di instruksi |
| `amount` | number | — | Nominal — jika diisi akan ditampilkan di instruksi |
| `allow_html` | enum | — | `0` plain text, `1` HTML formatted (default: `1`) |

### cURL

```bash
curl "https://paymenku.com/api/v1/payment/instruction?code=bca_va&pay_code=381659999814525&amount=104000" \
  -H "Authorization: Bearer sk_live_xxxxxxx"
```

---

## Response `200 OK`

```json
{
  "status": "success",
  "data": {
    "code": "bca_va",
    "name": "BCA Virtual Account",
    "instructions": [
      {
        "title": "ATM BCA",
        "steps": [
          "Masukkan kartu ATM dan PIN",
          "Pilih menu <b>Transaksi Lainnya</b>",
          "Pilih <b>Transfer</b> → <b>Ke Rek BCA Virtual Account</b>",
          "Masukkan nomor Virtual Account: <b>381659999814525</b>",
          "Konfirmasi nominal: <b>Rp 104.000</b>",
          "Selesaikan transaksi dan simpan struk"
        ]
      },
      {
        "title": "BCA Mobile (m-BCA)",
        "steps": [
          "Buka aplikasi BCA Mobile",
          "Pilih <b>m-BCA</b> → <b>m-Transfer</b>",
          "Pilih <b>BCA Virtual Account</b>",
          "Masukkan nomor: <b>381659999814525</b>",
          "Konfirmasi dan masukkan PIN m-BCA"
        ]
      },
      {
        "title": "KlikBCA Internet Banking",
        "steps": [
          "Login ke <b>https://klikbca.com</b>",
          "Pilih <b>Transfer Dana</b> → <b>Ke BCA Virtual Account</b>",
          "Masukkan nomor: <b>381659999814525</b>",
          "Otorisasi dengan KeyBCA"
        ]
      }
    ]
  }
}
```

---

## Response Fields

| Field | Type | Keterangan |
|-------|------|------------|
| `code` | string | Channel code |
| `name` | string | Nama channel |
| `instructions[]` | array | Daftar metode pembayaran (ATM, mobile, internet banking, dll) |
| `instructions[].title` | string | Nama metode (mis: `"ATM BCA"`) |
| `instructions[].steps[]` | array of string | Langkah-langkah berurutan |

:::info[HTML vs Plain Text]
Saat `allow_html=1` (default), `steps` mungkin berisi tag HTML (`<b>`, `<i>`, `<br>`) untuk formatting. Saat `allow_html=0`, semua tag di-strip menjadi plain text.
:::

---

## Use Case

### Tampilkan instruksi di halaman bayar

```javascript
const res = await fetch(
  `https://paymenku.com/api/v1/payment/instruction?code=bca_va&pay_code=${vaNumber}&amount=${amount}`,
  { headers: { 'Authorization': `Bearer ${apiKey}` } }
);
const { data } = await res.json();

const html = data.instructions.map(method => `
  <details>
    <summary><strong>${method.title}</strong></summary>
    <ol>
      ${method.steps.map(s => `<li>${s}</li>`).join('')}
    </ol>
  </details>
`).join('');

document.getElementById('instructions').innerHTML = html;
```

---

## Error Responses

### `400 Bad Request`

```json
{
  "status": "error",
  "message": "The code field is required."
}
```

### `404 Not Found`

```json
{
  "status": "error",
  "message": "No instruction available for this channel."
}
```

---

:::tip
Cache instruction per channel di klien — datanya jarang berubah dan ini menghemat round-trip ke server.
:::
