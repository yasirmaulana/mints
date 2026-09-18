import nodemailer from 'nodemailer'

let _transporter: nodemailer.Transporter | null = null

function getTransporter() {
  if (_transporter) return _transporter
  const config = useRuntimeConfig()
  _transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
      user: config.smtpUser,
      pass: config.smtpPass,
    },
  })
  return _transporter
}

export async function sendOtpEmail(to: string, code: string, appName = 'MINTS') {
  const transporter = getTransporter()
  await transporter.sendMail({
    from: `"${appName}" <${useRuntimeConfig().smtpUser}>`,
    to,
    subject: `Kode verifikasi ${appName}: ${code}`,
    html: `
      <div style="font-family:system-ui,sans-serif;max-width:480px;margin:0 auto;padding:32px 24px">
        <h2 style="font-size:20px;font-weight:700;margin:0 0 8px">Kode Verifikasi</h2>
        <p style="color:#555;margin:0 0 24px">Masukkan kode berikut untuk masuk ke akun ${appName} kamu.</p>
        <div style="font-size:36px;font-weight:800;letter-spacing:0.2em;text-align:center;padding:24px;background:#f5f5f2;border-radius:12px;margin-bottom:24px">
          ${code}
        </div>
        <p style="color:#999;font-size:13px;margin:0">Kode berlaku 10 menit. Jangan bagikan kode ini ke siapapun.</p>
      </div>
    `,
  })
}
