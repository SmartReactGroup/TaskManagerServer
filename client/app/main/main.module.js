import { NgModule } from '@angular/core'
import { BrowserModule } from '@angular/platform-browser'
import { FormsModule } from '@angular/forms'
import { RouterModule, Routes } from '@angular/router'
import { TooltipModule } from 'ngx-bootstrap'

import { MainComponent } from './main.component'
import { SliderComponent } from '../../components/slider/slider.component'
import { SocketService } from '../../components/socket/socket.service'
import { MaterialModule } from '../../components/material/material.module'

export const ROUTES: Routes = [{ path: 'home', component: MainComponent }]

@NgModule({
  imports: [BrowserModule, FormsModule, MaterialModule, RouterModule.forChild(ROUTES), TooltipModule.forRoot()],
  declarations: [MainComponent, SliderComponent],
  providers: [SocketService],
  exports: [MainComponent]
})
export class MainModule {}
