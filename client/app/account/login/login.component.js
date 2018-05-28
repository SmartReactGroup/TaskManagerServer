import { Component, OnInit, OnDestroy } from '@angular/core'
import { Router } from '@angular/router'
import { AuthService } from '../../../components/auth/auth.service'

@Component({
  selector: 'login',
  template: require('./login.html')
})
export class LoginComponent implements OnInit, OnDestroy {
  user = {
    name: '',
    email: '',
    password: ''
  }
  errors = { login: undefined }
  submitted = false
  AuthService
  Router

  static parameters = [AuthService, Router]
  constructor(_AuthService_: AuthService, router: Router) {
    this.AuthService = _AuthService_
    this.Router = router
  }

  ngOnInit() {
    this._messageInterval = setInterval(() => {
      console.log(this.errors.login)
      if (this.errors.login) {
        this.errors.login = null
      }
    }, 1000)
  }

  ngOnDestroy() {
    clearInterval(this._messageInterval)
  }

  login(form) {
    if (form.invalid) return

    return this.AuthService
      .login({
        email: this.user.email,
        password: this.user.password
      })
      .then(() => {
        // Logged in, redirect to home
        this.Router.navigateByUrl('/home')
      })
      .catch((err) => {
        this.errors.login = err.json().message
      })
  }
}
