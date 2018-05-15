import { NgModule } from '@angular/core'
import {
  MatButtonModule,
  MatCheckboxModule,
  MatListModule,
  MatExpansionModule,
  MatIconModule,
} from '@angular/material'

@NgModule({
  imports: [
    MatButtonModule,
    MatCheckboxModule,
    MatExpansionModule,
    MatListModule,
    MatIconModule,
  ],
  exports: [
    MatButtonModule,
    MatCheckboxModule,
    MatExpansionModule,
    MatListModule,
    MatIconModule,
  ]
})
export class MaterialModule {}
