import { NgModule } from '@angular/core'
import { BrowserModule } from '@angular/platform-browser'
import { FormsModule } from '@angular/forms'
import { RouterModule, Routes } from '@angular/router'
import { TooltipModule } from 'ngx-bootstrap'

import { SocketService } from '../../components/socket/socket.service'
import { DocumentComponent } from './document.component'
import { PanelComponent } from '../../components/panel/panel.component'
import { MaterialModule } from '../../components/material/material.module'

export const ROUTES: Routes = [{ path: 'document', component: DocumentComponent }]

@NgModule({
  imports: [
    BrowserModule,
    FormsModule,
    MaterialModule,
    RouterModule.forChild(ROUTES),
    TooltipModule.forRoot()
  ],
  declarations: [DocumentComponent, PanelComponent],
  providers: [SocketService],
  exports: [DocumentComponent]
})
export class DocumentModule {}
