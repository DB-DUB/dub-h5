import * as Sentry from '@sentry/vue'
import { BrowserTracing } from '@sentry/tracing'

class SentryReport {
  constructor() {
    this.sentry = Sentry
    this.dsn = process.env.SENTRY_DSN
  }

  install(app) {
    if (!this.isCanInstall() || !app) return

    this.init(app)
  }

  // the error should report if the domain is in white list
  isCanInstall() {
    const whiteDomains = [
      'www.360personaltest.net',
      'test-www.360personaltest.net'
    ]
    const host = window.location.host
    return whiteDomains.includes(host)
  }

  init(app) {
    console.log('sentry init')
    this.sentry.init({
      app,
      dsn: this.dsn,
      integrations: [
        new BrowserTracing({})
      ],
      // Set tracesSampleRate to 1.0 to capture 100%
      // of transactions for performance monitoring.
      // We recommend adjusting this value in production
      tracesSampleRate: 1.0,
      environment: process.env.ENV
    })
  }

  /**
   * report error by developer
   * @param {Error} err
   */
  captureException(err) {
    this.sentry.captureException(err)
  }
}

export default SentryReport
