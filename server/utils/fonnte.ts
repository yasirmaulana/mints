const DEFAULT_SINGLE = `Halo {{name}},

Terima kasih telah memesan produk *{{product}}* seharga *Rp {{price}}* dalam program Flash Sale!

Silakan lakukan pembayaran ke rekening berikut:
{{bank_info}}

Setelah transfer, kirimkan bukti pembayaran ke admin. Terima kasih!`

async function getTemplate(key: string, fallback: string): Promise<string> {
  const row = await prisma.waTemplate.findUnique({ where: { key } })
  return row?.template ?? fallback
}

export async function resolveBankInfo(paymentUrl?: string | null): Promise<string> {
  const rows = await prisma.storeSettings.findMany({
    where: { key: { in: ['payment_gateway_enabled', 'bank_accounts'] } }
  })
  const map: Record<string, string> = {}
  for (const r of rows) map[r.key] = r.value

  const lines: string[] = []

  // Gateway — tampilkan link bayar jika sudah ada
  const gatewayEnabled = 'payment_gateway_enabled' in map ? map.payment_gateway_enabled === 'true' : true
  if (gatewayEnabled && paymentUrl) {
    lines.push(`💳 *Bayar via Payment Gateway:*\n${paymentUrl}`)
  }

  // Bank manual
  const banks: { bank: string; accountName: string; accountNumber: string }[] =
    map.bank_accounts ? JSON.parse(map.bank_accounts) : []
  if (banks.length) {
    const bankLines = banks
      .map(b => `🏦 ${b.bank}\nNo. Rekening: *${b.accountNumber}*\na.n. ${b.accountName}`)
      .join('\n\n')
    lines.push(lines.length ? `Atau transfer manual:\n${bankLines}` : bankLines)
  }

  return lines.length ? lines.join('\n\n') : useRuntimeConfig().bankInfo || 'Hubungi admin untuk info pembayaran.'
}

export async function sendPaymentNotice(
  targetPhone: string,
  buyerName: string,
  productTitle: string,
  price: number,
  paymentUrl?: string | null
) {
  const config = useRuntimeConfig()
  const template = await getTemplate('single', DEFAULT_SINGLE)
  const bankInfo = await resolveBankInfo(paymentUrl)

  const message = template
    .replace(/{{name}}/g, buyerName)
    .replace(/{{product}}/g, productTitle)
    .replace(/{{price}}/g, price.toLocaleString('id-ID'))
    .replace(/{{bank_info}}/g, bankInfo)

  return await $fetch(config.fonnteUrl || 'https://api.fonnte.com/send', {
    method: 'POST',
    headers: { Authorization: config.fonnteToken },
    body: { target: targetPhone, message }
  })
}

export async function getBulkTemplate(): Promise<string> {
  const DEFAULT_BULK = `Halo {{name}},

Terima kasih telah memesan dalam program Flash Sale!

Berikut pesanan Anda:
{{items}}

*Total: Rp {{total}}*

Silakan lakukan pembayaran ke rekening berikut:
{{bank_info}}

Setelah transfer, kirimkan bukti pembayaran ke admin. Terima kasih!`

  return getTemplate('bulk', DEFAULT_BULK)
}
