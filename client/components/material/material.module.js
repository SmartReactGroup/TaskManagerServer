import { NgModule } from '@angular/core'
import {
  MatButtonModule,
  MatCheckboxModule,
  MatListModule,
  MatExpansionModule,
  MatIconModule,
  MatMenuModule,
  MatInputModule,
  MatTooltipModule,
  MatGridListModule,
  MatToolbarModule,
} from '@angular/material'

@NgModule({
  imports: [
    MatButtonModule,
    MatCheckboxModule,
    MatExpansionModule,
    MatListModule,
    MatIconModule,
    MatMenuModule,
    MatInputModule,
    MatTooltipModule,
    MatGridListModule,
    MatToolbarModule,
  ],
  exports: [
    MatButtonModule,
    MatCheckboxModule,
    MatExpansionModule,
    MatListModule,
    MatIconModule,
    MatMenuModule,
    MatInputModule,
    MatTooltipModule,
    MatGridListModule,
    MatToolbarModule,
  ]
})
export class MaterialModule {}
