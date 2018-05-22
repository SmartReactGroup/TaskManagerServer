import { Component } from '@angular/core'
import { AuthService } from '../../../components/auth/auth.service'

import { FormControl, FormGroupDirective, NgForm, Validators } from '@angular/forms'
import { ErrorStateMatcher } from '@angular/material/core'

/** Error when invalid control is dirty, touched, or submitted. */
export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted))
  }
}

// @flow
type User = {
  oldPassword: string,
  newPassword: string,
  confirmPassword: string
}

@Component({
  selector: 'settings',
  template: require('./settings.html')
})
export class SettingsComponent {
  user: User = {
    oldPassword: '',
    newPassword: '',
    confirmPassword: ''
  }
  errors = { other: undefined }
  message = ''
  submitted = false
  // match = true
  AuthService
  emailFormControl = new FormControl('', [
    Validators.required,
    Validators.email,
  ])
  matcher = new MyErrorStateMatcher()

  static parameters = [AuthService]
  constructor(_AuthService_: AuthService) {
    this.AuthService = _AuthService_
  }

  changePassword(form) {
    this.submitted = true
    if (!form.valid) return

    if (this.user.confirmPassword !== this.user.newPassword) {
      form.form.controls.confirmPassword.valid = 'false'
      return
    }

    return this.AuthService
      .changePassword(this.user.oldPassword, this.user.newPassword)
      .then(() => {
        this.message = 'Password successfully changed.'
      })
      .catch((err) => {
        console.log(err)
        this.errors.other = err.message
      })
  }

  updateUserInfo() {
    return this.AuthService
      .changePassword(this.user.oldPassword, this.user.newPassword)
      .then(() => {
        this.message = 'Password successfully changed.'
      })
      .catch(() => {
        // form.password.$setValidity('mongoose', false);
        this.errors.other = 'Incorrect password'
        this.message = ''
      })
  }
}
