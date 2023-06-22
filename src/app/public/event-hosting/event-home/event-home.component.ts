import { Component, OnInit } from '@angular/core';
import { EventHostConstant } from 'src/app/shared/constants/event-host-constants';


@Component({
  selector: 'app-event-home',
  templateUrl: './event-home.component.html',
  styleUrls: ['./event-home.component.scss']
})
export class EventHomeComponent implements OnInit {
  background_url = 'assets/images/events/'+EventHostConstant.ImageBackgroung+EventHostConstant.IMAGE_EXTENSION;

  constructor() { }

  ngOnInit(): void {
  }
  getImageUrl() {
    return 'assets/images/events/'+name+EventHostConstant.IMAGE_EXTENSION;
  }
}
