// @flow
import { Injectable } from '@angular/core'
import { Response } from '@angular/http'
import { AuthHttp } from 'angular2-jwt'
import { Observable } from 'rxjs/Rx'
import 'rxjs/add/operator/map'
import 'rxjs/add/operator/catch'
import 'rxjs/add/operator/toPromise'

type DocType = {
  // TODO: use Mongoose model
  url?: String
  // method?: String,
  // params?: [Object],
  // description?: String,
  // response?: String,
  // example?: Object
}

function handleError(err) {
  return Observable.throw(err.json() || 'Server error')
}

@Injectable()
export class DocumentService {
  basicUrl = '/api/docs'
  AuthHttp

  static parameters = [AuthHttp]
  constructor(authHttp: AuthHttp) {
    this.AuthHttp = authHttp
  }

  query(): Observable<DocType[]> {
    return this.AuthHttp
      .get(this.basicUrl)
      .map((res: Response) => res.json())
      .catch(handleError)
  }
  getAll(): Observable<DocType[]> {
    return this.AuthHttp
      .get(this.basicUrl)
      .map((res: Response) => res.json())
      .catch(handleError)
  }
  // create(user: DocType) {
  //   return this.AuthHttp
  //     .post('/api/users/', user)
  //     .map((res: Response) => res.json())
  //     .catch(handleError)
  // }
  // changePassword(user, oldPassword, newPassword) {
  //   return this.AuthHttp
  //     .put(`/api/users/${user.id || user._id}/password`, { oldPassword, newPassword })
  //     .map((res: Response) => {
  //       console.log(res)
  //       return res.json()
  //     })
  //     .catch((err) => handleError(err))
  // }
  // updateUserInfo(user) {
  //   return this.AuthHttp
  //     .put(`/api/users/${user.id || user._id}`, user)
  //     .map((res: Response) => {
  //       console.log(res)
  //       return res.json()
  //     })
  //     .catch((err) => handleError(err))
  // }
  // remove(user) {
  //   return this.AuthHttp
  //     .delete(`/api/users/${user.id || user._id}`).map(() => user)
  //     .catch(handleError)
  // }
}
