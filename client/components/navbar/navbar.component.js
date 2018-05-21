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
    this.AuthService.currentUserChanged
      .subscribe((user) => {
        this.currentUser = user
        this.reset()
      })
  }

  reset() {
    Promise.all([
      this.AuthService.isLoggedIn(),
      this.AuthService.isAdmin(),
      this.AuthService.getCurrentUser()
    ])
      .then((response) => {
        this.isLoggedIn = response[0]
        this.isAdmin = response[1]
        this.currentUser = response[2]
      })
  }

  logout() {
    return this.AuthService.logout().then(() => {
      this.Router.navigateByUrl('/home')
      this.reset()
    })
  }
}
