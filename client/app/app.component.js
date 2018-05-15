import { Component } from '@angular/core'

@Component({
  selector: 'app',
  template: `<navbar></navbar>
    <div class="main">
      <router-outlet></router-outlet>
    </div>
    <footer></footer>`
})
export class AppComponent {}
