import { Component } from '@angular/core'
import { Router } from '@angular/router'
import { AuthService } from '../auth/auth.service'

@Component({
  selector: 'navbar',
  template: require('./navbar.html')
})
export class NavbarComponent {
  isCollapsed = true
  menu = [
    {
      title: 'API Documentation',
      link: '/document'
    }
  ]
  config = {
    logo: {
      src: '/assets/images/svg/github-logo.svg',
      width: 18,
      height: 18
    },
    avatar: {
      width: 32,
      height: 32
    }
  }
  Router
  isAdmin
  isLoggedIn
  currentUser = {}
  AuthService

  static parameters = [AuthService, Router]
  constructor(authService: AuthService, router: Router) {
    this.AuthService = authService
    this.Router = router
    this.reset()
    this.AuthService.currentUserChanged.subscribe((user) => {
      this.currentUser = user
      this.reset()
    })
  }

  // ngOnInit() {
  //   this.reset()
  //   this.AuthService.currentUserChanged.subscribe((user) => {
  //     this.currentUser = user
  //     this.reset()
  //   })
  // }

  reset() {
    this.isLoggedIn = this.AuthService.isLoggedInSync()
    this.isAdmin = this.AuthService.isAdminSync()
    this.AuthService.getCurrentUser().then((user) => {
      this.currentUser = user
    })
  }

  logout() {
    return this.AuthService.logout().then(() => {
      this.Router.navigateByUrl('/home')
      this.reset()
    })
  }
}
