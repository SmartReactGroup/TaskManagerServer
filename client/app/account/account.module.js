import { NgModule } from '@angular/core'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { BrowserModule } from '@angular/platform-browser'
import { RouterModule, Routes } from '@angular/router'
import { FlexLayoutModule } from '@angular/flex-layout'

import { LoginComponent } from './login/login.component'
import { SettingsComponent } from './settings/settings.component'
import { SignupComponent } from './signup/signup.component'
import { MaterialModule } from '../../components/material/material.module'
import { Slim } from '../../assets/slim/slim.angular2'

const accountRoutes: Routes = [
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'settings',
    component: SettingsComponent
  },
  {
    path: 'signup',
    component: SignupComponent
  }
]

@NgModule({
  imports: [
    FormsModule,
    BrowserModule,
    ReactiveFormsModule,
    MaterialModule,
    FlexLayoutModule,
    RouterModule.forChild(accountRoutes)
  ],
  declarations: [
    LoginComponent,
    SignupComponent,
    SettingsComponent,
    Slim
  ]
})
export class AccountModule {}
