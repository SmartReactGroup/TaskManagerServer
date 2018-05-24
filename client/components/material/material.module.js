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
  ]
})
export class MaterialModule {}
