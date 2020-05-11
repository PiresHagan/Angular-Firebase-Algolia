import { Component, OnInit } from '@angular/core';
import { NzButtonModule } from 'ng-zorro-antd/button';

@Component({
  selector: 'app-faq',
  templateUrl: './faq.component.html',
  styleUrls: ['./faq.component.scss']
})
export class FaqComponent implements OnInit {
  constructor() { }

  ngOnInit(): void {
  }
  panels = [
    {
      active: true,
      name: 'This is panel header 1',
      image:'./assets/images/faq/faq-1.png',

    },
    {
      active: false,
      name: 'This is panel header 2',
      image:'./assets/images/faq/faq-1.png',
    },
    {
      active: false,
      name: 'This is panel header 3',
      image:''
    }
  ];
}
