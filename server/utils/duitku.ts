import { createHash } from 'crypto'

export function duitkuSignature(merchantCode: string, merchantOrderId: string, amount: string, apiKey: string) {
  return createHash('md5').update(`${merchantCode}${merchantOrderId}${amount}${apiKey}`).digest('hex')
}

export function duitkuCallbackSignature(merchantCode: string, amount: string, merchantOrderId: string, apiKey: string) {
  return createHash('md5').update(`${merchantCode}${amount}${merchantOrderId}${apiKey}`).digest('hex')
}

export function getDuitkuBaseUrl(isProduction: boolean) {
  return isProduction
    ? 'https://passport.duitku.com/webapi/api/merchant'
    : 'https://sandbox.duitku.com/webapi/api/merchant'
}
