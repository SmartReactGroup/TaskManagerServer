import './app.styl'
import './polyfills'

import { enableProdMode } from '@angular/core'
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic'

// depending on the env mode, enable prod mode or add debugging modules
if (process.env.NODE_ENV === 'production') {
  enableProdMode()
}

import { AppModule } from './app.module'

export function main() {
  return platformBrowserDynamic().bootstrapModule(AppModule)
}

function hideLoader() {
  setTimeout(() => {
    document.querySelector('.loading').classList.add('hide')
  }, 1000)
}

if (document.readyState === 'complete') {
  main()
  hideLoader()
} else {
  document.addEventListener('DOMContentLoaded', () => {
    main()
    hideLoader()
  })
}
