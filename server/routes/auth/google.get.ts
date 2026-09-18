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

    const maxAge = 60 * 60 * 24 * 30
    setCookie(event, 'buyer_session', buyer.id, {
      httpOnly: true,
      secure: true,
      sameSite: 'lax',
      maxAge,
      path: '/',
    })
    setCookie(event, 'buyer_auth', '1', {
      httpOnly: false,
      secure: true,
      sameSite: 'lax',
      maxAge,
      path: '/',
    })

    return sendRedirect(event, '/account')
  },
  onError(event, error) {
    console.error('[google-oauth]', error)
    return sendRedirect(event, '/login?error=google')
  },
})
