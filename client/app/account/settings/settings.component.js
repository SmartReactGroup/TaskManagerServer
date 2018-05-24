import { Component } from '@angular/core'
import { AuthService } from '../../../components/auth/auth.service'

@Component({
  selector: 'settings',
  template: require('./settings.html')
})
export class SettingsComponent {
  user = {
    oldPassword: '',
    newPassword: '',
    confirmPassword: ''
  }
  oldPassword = ''
  newPassword = ''
  confirmPassword = ''
  errors = { other: undefined }
  message = ''
  submitted = false
  AuthService


  static parameters = [AuthService]
  constructor(_AuthService_: AuthService) {
    this.AuthService = _AuthService_
  }

  changePassword(form) {
    this.submitted = true
    if (!form.valid) return
    return this.AuthService
      .changePassword(this.user.oldPassword, this.user.newPassword)
      .then(() => {
        this.message = 'Password successfully changed.'
      })
      .catch((err) => {
        this.errors.other = err.message
      })
  }

  checkConfirmPassword() {
    if (this.user.confirmPassword !== this.user.newPassword) {
      this.errors.other = 'Confirm password doesn\'t match new password'
    } else {
      this.errors.other = ''
    }
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
