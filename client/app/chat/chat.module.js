import { NgModule } from '@angular/core'
import { BrowserModule } from '@angular/platform-browser'
import { FormsModule } from '@angular/forms'
import { RouterModule, Routes } from '@angular/router'
import { TooltipModule } from 'ngx-bootstrap'

import { SocketService } from '../../components/socket/socket.service'
import { ChatService } from './chat.service'
import { ChatComponent } from './chat.component'
import { MaterialModule } from '../../components/material/material.module'

export const ROUTES: Routes = [{ path: 'chat', component: ChatComponent }]

@NgModule({
  imports: [
    BrowserModule,
    FormsModule,
    MaterialModule,
    RouterModule.forChild(ROUTES),
    TooltipModule.forRoot()
  ],
  declarations: [ChatComponent],
  providers: [SocketService, ChatService],
  exports: [ChatComponent]
})
export class ChatModule {}
