import { createHash, createHmac } from 'crypto'

export function duitkuSignature(merchantCode: string, merchantOrderId: string, amount: string, apiKey: string) {
  return createHash('md5').update(`${merchantCode}${merchantOrderId}${amount}${apiKey}`).digest('hex')
}

// Endpoint getpaymentmethod pakai skema signature berbeda dari /v2/inquiry: HMAC-SHA256
// (bukan MD5), dan apiKey dipakai sebagai key HMAC, bukan digabung ke pesan.
export function duitkuFeeSignature(merchantCode: string, amount: number, datetime: string, apiKey: string) {
  return createHmac('sha256', apiKey).update(`${merchantCode}${amount}${datetime}`).digest('hex')
}

export function duitkuDatetimeNow() {
  const d = new Date()
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`
}

export function duitkuCallbackSignature(merchantCode: string, amount: string, merchantOrderId: string, apiKey: string) {
  return createHash('md5').update(`${merchantCode}${amount}${merchantOrderId}${apiKey}`).digest('hex')
}

export function getDuitkuBaseUrl(isProduction: boolean) {
  return isProduction
    ? 'https://passport.duitku.com/webapi/api/merchant'
    : 'https://sandbox.duitku.com/webapi/api/merchant'
}
