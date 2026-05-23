---
sidebar_position: 3
title: Rate Limiting
description: Limit request per menit dan cara handle 429
---

# Rate Limiting

API Paymenku menerapkan rate limiting untuk menjaga stabilitas dan mencegah penyalahgunaan.

---

## Default Limit

| Tier | Limit |
|------|-------|
| Default | **60 request / menit** per merchant |
| High Volume | Hubungi support untuk peningkatan |

---

## Response Headers

Setiap response API menyertakan informasi rate limit:

```http
X-RateLimit-Limit: 60
X-RateLimit-Remaining: 58
X-RateLimit-Reset: 1735689600
```

| Header | Keterangan |
|--------|------------|
| `X-RateLimit-Limit` | Total request yang diizinkan dalam window saat ini |
| `X-RateLimit-Remaining` | Sisa request yang masih bisa dipakai |
| `X-RateLimit-Reset` | Unix timestamp kapan limit di-reset |

---

## Saat Limit Terlampaui

Jika melebihi limit, API akan mengembalikan **`429 Too Many Requests`** dengan header tambahan:

```http
HTTP/1.1 429 Too Many Requests
Retry-After: 45
Content-Type: application/json
```

```json
{
  "status": "error",
  "message": "Too many requests. Please try again later."
}
```

| Header | Keterangan |
|--------|------------|
| `Retry-After` | Detik yang harus ditunggu sebelum request berikutnya |

---

## Best Practices

:::tip[Strategi Retry]
1. **Hormati `Retry-After`** — tunggu sesuai instruksi server
2. **Exponential backoff** — gandakan delay setiap retry gagal
3. **Cache response** — kurangi panggilan untuk data yang jarang berubah (mis. `payment-channels`)
4. **Throttle di sisi klien** — antri request ketika `X-RateLimit-Remaining` rendah
:::

---

## Contoh Implementasi

### PHP

```php
<?php
function callPaymenkuApi(string $url, array $options, int $maxRetry = 3) {
    for ($attempt = 0; $attempt < $maxRetry; $attempt++) {
        $ch = curl_init($url);
        curl_setopt_array($ch, $options);
        $response = curl_exec($ch);
        $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        $headers  = curl_getinfo($ch, CURLINFO_HEADER_OUT);
        curl_close($ch);

        if ($httpCode === 429) {
            // Ambil Retry-After dari response header
            preg_match('/Retry-After:\s*(\d+)/i', $headers, $m);
            $wait = isset($m[1]) ? (int) $m[1] : (2 ** $attempt);
            sleep($wait);
            continue;
        }

        return json_decode($response, true);
    }

    throw new RuntimeException('Rate limit exceeded after retries.');
}
```

### Node.js

```javascript
async function callPaymenkuApi(url, options, maxRetry = 3) {
  for (let attempt = 0; attempt < maxRetry; attempt++) {
    const res = await fetch(url, options);

    if (res.status === 429) {
      const retryAfter = Number(res.headers.get('Retry-After')) || 2 ** attempt;
      await new Promise(r => setTimeout(r, retryAfter * 1000));
      continue;
    }

    return res.json();
  }

  throw new Error('Rate limit exceeded after retries');
}
```
