export default defineOAuthGoogleEventHandler({
  config: {
    scope: ['email', 'profile'],
  },
  async onSuccess(event, { user }) {
    const email = user.email as string
    const name = (user.name as string) || email.split('@')[0]

    let buyer = await prisma.buyer.findUnique({ where: { email } })
    if (!buyer) {
      buyer = await prisma.buyer.create({ data: { email, name } })
    }

    // sameSite 'lax': redirect balik dari Google adalah navigasi lintas-situs.
    await setBuyerSession(event, buyer.id, 'lax')

    return sendRedirect(event, '/account')
  },
  onError(event, error) {
    console.error('[google-oauth]', error)
    return sendRedirect(event, '/login?error=google')
  },
})
