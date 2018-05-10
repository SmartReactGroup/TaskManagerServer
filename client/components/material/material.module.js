import { NgModule } from '@angular/core'
import { MatButtonModule, MatCheckboxModule } from '@angular/material'
import { MatExpansionModule } from '@angular/material/expansion'

@NgModule({
  imports: [MatButtonModule, MatCheckboxModule, MatExpansionModule],
  exports: [MatButtonModule, MatCheckboxModule, MatExpansionModule]
})
export class MaterialModule {}
