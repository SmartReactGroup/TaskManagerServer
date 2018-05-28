/*
 * Slim v4.16.4 - Image Cropping Made Easy
 * Copyright (c) 2018 Rik Schennink - http://slimimagecropper.com
 */
const SlimLib = require('./slim.commonjs')

// Angular core
import { ViewChild, NgModule, Component, Input, ElementRef, OnInit } from '@angular/core'

@Component({
  selector: 'slim',
  template: '<div #root><ng-content></ng-content></div>'
})

@NgModule({
  declarations: [Slim],
  exports: [Slim]
})

export class Slim implements OnInit {
  @ViewChild('root')
  element: ElementRef

  @Input()
  options: any

  ngOnInit() {
    if (this.options.initialImage) {
      const img = document.createElement('img')
      img.setAttribute('alt', '')
      img.src = this.options.initialImage
      this.element.nativeElement.appendChild(img)
    }
    SlimLib.create(this.element.nativeElement, this.options)
  }
}
