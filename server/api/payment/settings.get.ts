// Public endpoint — dipakai checkout.vue untuk tahu metode pembayaran yang tersedia
export default defineEventHandler(async () => {
  const rows = await prisma.storeSettings.findMany({
    where: { key: { in: ['payment_gateway_enabled', 'bank_accounts'] } }
  })
  const map: Record<string, string> = {}
  for (const row of rows) map[row.key] = row.value

  // Default true jika belum pernah diset (backward compat)
  const gatewayEnabled = 'payment_gateway_enabled' in map
    ? map.payment_gateway_enabled === 'true'
    : true
  const bankAccounts: { bank: string; accountName: string; accountNumber: string }[] = map.bank_accounts
    ? JSON.parse(map.bank_accounts)
    : []

  return { gatewayEnabled, bankAccounts }
})
