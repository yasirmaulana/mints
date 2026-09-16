export default defineNuxtConfig({
  compatibilityDate: '2026-08-23',
  modules: ['@nuxt/ui'],

  tailwindcss: {
    cssPath: '~/assets/css/main.css',
    configPath: '~/tailwind.config.ts',
  },
  devtools: { enabled: false },

  css: ['~/assets/css/main.css'],

  app: {
    head: {
      link: [
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
        { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Geist:wght@300;400;500;600;700;800&family=Inter+Tight:ital,wght@0,400;0,500;0,600;0,700;0,800;0,900;1,400&display=swap' }
      ]
    }
  },

  runtimeConfig: {
    fonnteToken: process.env.WHATSAPP_API_TOKEN_FONNTE,
    fonnteUrl: process.env.WHATSAPP_API_URL,
    fonnteApiKey: process.env.FONNTE_API_KEY || process.env.WHATSAPP_API_TOKEN_FONNTE || '',
    adminUsername: process.env.ADMIN_USERNAME || '',
    adminPassword: process.env.ADMIN_PASSWORD || '',
    sessionSecret: process.env.SESSION_SECRET || '',
    s3AccessKey: process.env.S3_ACCESS_KEY || '',
    s3SecretKey: process.env.S3_SECRET_KEY || '',
    s3Bucket: process.env.S3_BUCKET || 'flashsale-bucket-ktc6wa',
    s3Endpoint: process.env.S3_ENDPOINT || 'https://kencana.basic.box.cloudeka.id',
    s3Region: process.env.S3_REGION || 'kencana',
    // Raja Ongkir
    rajaOngkirKey: process.env.RAJA_ONGKIR_KEY || '',
    rajaOngkirOriginCityId: process.env.RAJA_ONGKIR_ORIGIN_CITY_ID || '501', // default: Surabaya
    // Duitku
    duitkuMerchantCode: process.env.DUITKU_MERCHANT_CODE || '',
    duitkuApiKey: process.env.DUITKU_API_KEY || '',
    duitkuIsProduction: process.env.DUITKU_IS_PRODUCTION || 'false',
    duitkuCallbackUrl: process.env.DUITKU_CALLBACK_URL || '',
    duitkuReturnUrl: process.env.DUITKU_RETURN_URL || '',
    appUrl: process.env.APP_URL || 'https://mints.id',
    // Cloudflare Turnstile
    turnstileSecretKey: process.env.TURNSTILE_SECRET_KEY || '',
    public: {
      turnstileSiteKey: process.env.NUXT_PUBLIC_TURNSTILE_SITE_KEY || '',
      freeShippingMin: process.env.FREE_SHIPPING_MIN || '500000'
    }
  },

  nitro: {
    preset: 'vercel',
    experimental: {
      wasm: false
    }
  }
})
