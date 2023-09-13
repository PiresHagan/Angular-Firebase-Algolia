import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { LanguageService } from 'src/app/shared/services/language.service';
import { SeoService } from 'src/app/shared/services/seo/seo.service';

@Component({
  selector: 'app-jobCandidateDetail',
  templateUrl: './jobCandidateDetail.component.html',
  styleUrls: ['./jobCandidateDetail.component.scss']
})
export class jobCandidateDetailComponent implements OnInit {

  private jobCandidateDetailDocument = "jobCandidateDetail";

  constructor(
    public translate: TranslateService,
    private seoService: SeoService,
    private language: LanguageService
  ) { }

  ngOnInit(): void {
    this.seoService.updateTagsWithData(this.jobCandidateDetailDocument);
  }
}
