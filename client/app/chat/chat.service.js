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
export class ChatService {
  AuthHttp
}
