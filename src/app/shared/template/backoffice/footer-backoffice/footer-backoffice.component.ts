

import { Component } from '@angular/core';

@Component({
  selector: 'app-footer-backoffice',
  templateUrl: './footer-backoffice.component.html'
})

export class FooterBackofficeComponent {
  currentYear: number = new Date().getFullYear();
}
