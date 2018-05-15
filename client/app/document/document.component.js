import { Component, OnInit, OnDestroy } from '@angular/core'
import { DocumentService } from './document.service'

/**
 * @title Basic expansion panel
 */
@Component({
  selector: 'document',
  template: require('./document.html')
})
export class DocumentComponent implements OnInit, OnDestroy {
  panelOpenState: boolean = false

  static parameters = [DocumentService]

  constructor(documentService: DocumentService) {
    this.documentService = documentService
  }

  ngOnInit() {
    this.getDocs()
  }

  getDocs() {
    return this.documentService
      .getAll()
      .subscribe((res) => {
        this.docs = res
      }, (err) => console.log(err))
  }
}
