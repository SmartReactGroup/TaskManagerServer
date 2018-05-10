import { Component } from '@angular/core'
import { PanelComponent } from '../../components/panel/panel.component'
/**
 * @title Basic expansion panel
 */
@Component({
  selector: 'document',
  template: require('./document.html'),
  directives: [PanelComponent]
})
export class DocumentComponent {
  panelOpenState: boolean = false
}
