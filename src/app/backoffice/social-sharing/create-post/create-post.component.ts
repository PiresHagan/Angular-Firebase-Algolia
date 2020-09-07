import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TranslateService } from "@ngx-translate/core";
import { Article } from 'src/app/shared/interfaces/article.type';
import { AuthService } from 'src/app/shared/services/authentication.service';
import { BackofficeArticleService } from '../../shared/services/backoffice-article.service';
@Component({
  selector: 'app-create-post',
  templateUrl: './create-post.component.html',
  styleUrls: ['./create-post.component.scss']
})
export class CreatePostComponent implements OnInit {

  current = 0;
  postForm: FormGroup;
  origin: string;
  authorSlug: string;
  selectedStoryURL: string;
  index = 'First-content';
  articles: Article[];
  lastVisible: any = null;
  userDetails;
  loading: boolean = true;

  constructor(
    public authService: AuthService,
    public articleService: BackofficeArticleService,
    private fb: FormBuilder,
    public translate: TranslateService,
  ) { }

  ngOnInit(): void {
    this.postForm = this.fb.group({
      title: [null, [Validators.required, Validators.minLength(10), Validators.maxLength(70)]],
      image: [null],
      article_slug: [null, [Validators.required]],
      post_text: [null, [Validators.required, Validators.minLength(10)]]
    });

    this.authService.getAuthState().subscribe(async (user) => {
      if (!user)
        return;
      this.userDetails = await this.authService.getLoggedInUserDetails();
      if (this.userDetails) {
        this.origin = window.location.origin;
        this.authorSlug = this.userDetails.slug;
        this.articleService.getAllArticles(this.userDetails.id).subscribe((data) => {
          this.articles = data;
          this.loading = false;
        });
      }
    })
  }

  pre(): void {
    this.current -= 1;
    this.changeContent();
  }

  next(): void {
    for (const i in this.postForm.controls) {
      this.postForm.controls[i].markAsDirty();
      this.postForm.controls[i].updateValueAndValidity();
    }

    if(this.current == 0) {
      if(this.postForm.valid) { 
        this.selectedStoryURL = `${this.origin}/${this.authorSlug}/${this.postForm.value.article_slug}`;
        this.current += 1;
        this.changeContent();
      }
    } else {
      this.current += 1;
      this.changeContent();
    }
  }

  done(): void {
    console.log('done');
  }

  changeContent(): void {
    switch (this.current) {
      case 0: {
        this.index = 'First-content';
        break;
      }
      case 1: {
        this.index = 'Second-content';
        break;
      }
      case 2: {
        this.index = 'third-content';
        break;
      }
      default: {
        this.index = 'error';
      }
    }
  }

}
