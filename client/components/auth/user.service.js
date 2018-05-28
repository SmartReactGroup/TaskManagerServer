// @flow
import { Injectable } from '@angular/core'
import { AuthHttp } from 'angular2-jwt'
import { Observable } from 'rxjs/Rx'
import 'rxjs/add/operator/map'
import 'rxjs/add/operator/catch'
import 'rxjs/add/operator/toPromise'

type UserType = {
  // TODO: use Mongoose model
  id?: string,
  _id?: string,
  name?: string,
  email?: string
}

function handleError(err) {
  return Observable.throw(err.json() || 'Server error')
}

@Injectable()
export class UserService {
  AuthHttp

  static parameters = [AuthHttp]
  constructor(authHttp: AuthHttp) {
    this.AuthHttp = authHttp
  }

  query(): Observable<UserType[]> {
    return this.AuthHttp
      .get('/api/users/')
      .map((res) => res.json())
      .catch(handleError)
  }

  get(user = { id: 'me' }): Observable<UserType> {
    return this.AuthHttp
      .get(`/api/users/${user.id || user._id}`)
      .map((res) => res.json())
      .catch(handleError)
  }

  create(user: UserType) {
    return this.AuthHttp
      .post('/api/users/', user)
      .map((res) => res.json())
      .catch(handleError)
  }

  changePassword(user, oldPassword, newPassword) {
    return this.AuthHttp
      .put(`/api/users/${user.id || user._id}/password`, { oldPassword, newPassword })
      .map((res) => res.json())
      .catch((err) => handleError(err))
  }

  updateUserInfo(id, newUser) {
    return this.AuthHttp
      .put(`/api/users/${id}`, newUser)
      .map((res) => res.json())
      .catch((err) => handleError(err))
  }

  changeProfileImage(id, formdata) {
    return this.AuthHttp
      .post(`/api/users/${id}/avatar`, formdata)
      .map((res) => res.json())
      .catch((err) => handleError(err))
  }

  remove(user) {
    return this.AuthHttp
      .delete(`/api/users/${user.id || user._id}`).map(() => user)
      .catch(handleError)
  }
}
