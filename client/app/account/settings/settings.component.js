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
    confirmPassword: '',
    username: ''
  }
  oldPassword = ''
  newPassword = ''
  confirmPassword = ''
  errors = { other: undefined }
  message = ''
  submitted = false
  AuthService
  UserService

  static parameters = [AuthService]
  constructor(_AuthService: AuthService) {
    this.AuthService = _AuthService
  }

  slimOptions = {
    ratio: '1:1',
    download: true,
    // uploadBase64: true,
    // initialImage: '/assets/images/user/avatar.svg',
    service: this.slimService.bind(this),
    didInit: this.slimInit.bind(this)
  }

  // called when slim has initialized
  slimInit(data, slim) {
    // slim instance reference
    // console.log(slim)

    // current slim data object and slim reference
    // console.log(data)
  }

  // called when upload button is pressed or automatically if push is enabled
  slimService(formdata, progress, success, failure, slim) {
    // form data to post to server
    // set serviceFormat to "file" to receive an array of files
    // console.log(formdata)

    this.AuthService
      .changeProfileImage(formdata)
      .then(() => success())
      .catch(() => failure())

    // call these methods to handle upload state
    // console.log(progress, success, failure)

    // reference to Slim instance
    // console.log(slim)
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
    this.AuthService
      .updateUserInfo({ name: this.user.username })
      .then((res) => {
        this.user.username = res.name
      })
      .catch((err) => {
        this.errors.other = err
      })
  }
}
