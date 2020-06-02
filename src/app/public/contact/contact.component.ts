import { Component, OnInit } from '@angular/core';
import { Title, Meta } from '@angular/platform-browser';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss']
})
export class ContactComponent implements OnInit {

  constructor(
    private titleService: Title,
    private metaTagService: Meta
  ) { }

  ngOnInit(): void {
    this.titleService.setTitle("Contact Us");
    this.metaTagService.updateTag({
      name: 'Contact Information', 
      content: "Contact Information. Talk to My Trending Stories. Connect with us. Get in touch"
    });
  }

}
