import { Component } from '@angular/core'

/**
 * @title Basic expansion panel
 */
@Component({
  selector: 'document',
  template: require('./document.html')
})
export class DocumentComponent {
  panelOpenState: boolean = false
}
