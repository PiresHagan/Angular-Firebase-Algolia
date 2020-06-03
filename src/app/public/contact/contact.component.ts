import { Component, OnInit } from '@angular/core';
import { Title, Meta } from '@angular/platform-browser';
import { ThemeConstantService } from 'src/app/shared/services/theme-constant.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss']
})
export class ContactComponent implements OnInit {

  constructor(
    private titleService: Title,
    private metaTagService: Meta,
    public translate: TranslateService
  ) { }

  ngOnInit(): void {
    this.titleService.setTitle("Contact Us");
    this.metaTagService.updateTag({
      name: 'Contact Information', 
      content: "Contact Information. Talk to My Trending Stories. Connect with us. Get in touch"
    });
  }

}
