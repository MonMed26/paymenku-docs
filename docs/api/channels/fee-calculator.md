---
sidebar_position: 4
title: Fee Calculator
description: Hitung fee per channel sebelum buat transaksi
---

# Fee Calculator

Menghitung biaya layanan per channel **sebelum** membuat transaksi. Berguna untuk preview total bayar di sisi UI atau untuk decision-making channel mana yang dipakai.

<span class="api-method api-method--get">GET</span> `/merchant/fee-calculator`

---

## Endpoint

```
https://paymenku.com/api/v1/merchant/fee-calculator
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
| `amount` | number | ✓ | Nominal transaksi (min: 1) |
| `code` | string | — | Filter ke satu channel saja (mis: `bca_va`) |

### cURL

**Hitung untuk semua channel:**

```bash
curl "https://paymenku.com/api/v1/merchant/fee-calculator?amount=100000" \
  -H "Authorization: Bearer sk_live_xxxxxxx"
```

**Hitung untuk satu channel:**

```bash
curl "https://paymenku.com/api/v1/merchant/fee-calculator?amount=100000&code=bca_va" \
  -H "Authorization: Bearer sk_live_xxxxxxx"
```

---

## Response `200 OK`

### Semua channel (tanpa filter `code`)

```json
{
  "status": "success",
  "data": [
    {
      "code": "bca_va",
      "name": "BCA Virtual Account",
      "type": "va",
      "amount": 100000,
      "fee_flat": 4000,
      "fee_percent": 0,
      "total_fee": 4000,
      "total_amount": 104000,
      "amount_received": 100000
    },
    {
      "code": "qris",
      "name": "QRIS",
      "type": "qris",
      "amount": 100000,
      "fee_flat": 200,
      "fee_percent": 0.7,
      "total_fee": 900,
      "total_amount": 100900,
      "amount_received": 100000
    }
  ]
}
```

### Filter satu channel (dengan `code`)

```json
{
  "status": "success",
  "data": {
    "code": "bca_va",
    "name": "BCA Virtual Account",
    "type": "va",
    "amount": 100000,
    "fee_flat": 4000,
    "fee_percent": 0,
    "total_fee": 4000,
    "total_amount": 104000,
    "amount_received": 100000
  }
}
```

---

## Response Fields

| Field | Type | Keterangan |
|-------|------|------------|
| `code` | string | Kode channel |
| `name` | string | Nama channel |
| `type` | string | Tipe: `va`, `ewallet`, `qris` |
| `amount` | number | Amount yang di-input |
| `fee_flat` | number | Komponen biaya tetap (Rp) |
| `fee_percent` | number | Komponen biaya persentase (%) |
| `total_fee` | number | Total fee = `fee_flat + (amount × fee_percent / 100)` |
| `total_amount` | number | Total yang harus dibayar pelanggan = `amount + total_fee` |
| `amount_received` | number | Jumlah yang diterima merchant |

---

## Use Case

### 1. Preview di UI Checkout

Tampilkan rincian fee sebelum pelanggan klik "Bayar":

```javascript
const res = await fetch(
  `https://paymenku.com/api/v1/merchant/fee-calculator?amount=${amount}&code=${selectedChannel}`,
  { headers: { 'Authorization': `Bearer ${apiKey}` } }
);
const { data } = await res.json();

document.getElementById('subtotal').textContent = `Rp ${data.amount.toLocaleString()}`;
document.getElementById('fee').textContent = `Rp ${data.total_fee.toLocaleString()}`;
document.getElementById('total').textContent = `Rp ${data.total_amount.toLocaleString()}`;
```

### 2. Channel Picker dengan Fee Comparison

Tampilkan semua channel sekaligus untuk membantu pelanggan pilih yang termurah:

```javascript
const res = await fetch(
  `https://paymenku.com/api/v1/merchant/fee-calculator?amount=${amount}`,
  { headers: { 'Authorization': `Bearer ${apiKey}` } }
);
const { data: channels } = await res.json();

// Sort termurah ke termahal
channels.sort((a, b) => a.total_fee - b.total_fee);
```

---

:::tip
Cache response Fee Calculator di sisi klien selama beberapa menit — fee jarang berubah dan ini menghemat rate limit.
:::
