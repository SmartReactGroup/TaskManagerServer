import { Component } from '@angular/core'
import { Router } from '@angular/router'


@Component({
  selector: 'app',
  template: require('./_app.html')
})
export class AppComponent {
  baseHideRoutes = ['/login', '/signup']
  hideHeaderAndFooter = false
  router: Router

  constructor(router: Router) {
    this.router = router
    this.hideHeaderAndFooter = this.baseHideRoutes.includes(this.router.url)
    this.router.events.subscribe((next) => {
      this.hideHeaderAndFooter = this.baseHideRoutes.includes(next.url)
      if (this.hideHeaderAndFooter) {
        document.body.classList.add('theme-background-color')
      } else {
        document.body.classList.remove('theme-background-color')
      }
    })
  }
}
