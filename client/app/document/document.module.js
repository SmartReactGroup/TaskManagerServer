import { NgModule } from '@angular/core'
import { BrowserModule } from '@angular/platform-browser'
import { FormsModule } from '@angular/forms'
import { RouterModule, Routes } from '@angular/router'
import { TooltipModule } from 'ngx-bootstrap'
import { DocumentComponent } from './document.component'
import { SocketService } from '../../components/socket/socket.service'

export const ROUTES: Routes = [{ path: 'document', component: DocumentComponent }]

@NgModule({
  imports: [BrowserModule, FormsModule, RouterModule.forChild(ROUTES), TooltipModule.forRoot()],
  declarations: [DocumentComponent],
  providers: [SocketService],
  exports: [DocumentComponent]
})
export class DocumentModule {}
