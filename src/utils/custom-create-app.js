import { createApp } from 'vue'
import SentryReport from '@/utils/sentry'

class CustomCreateApp {
  constructor(configs) {
    this.app = createApp(configs)
    this.initSentry()
    return this.app
  }
  initSentry() {
    const sentry = new SentryReport()
    sentry.install(this.app)
    window.sentry = sentry
  }
}

export default CustomCreateApp
