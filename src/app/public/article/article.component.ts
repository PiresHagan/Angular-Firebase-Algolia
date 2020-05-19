import { Component, OnInit, ElementRef, ViewChild, Output, EventEmitter, Input  } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ArticleService } from 'src/app/shared/services/article.service';
import { Article } from 'src/app/shared/interfaces/article.type';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ThemeConstantService } from 'src/app/shared/services/theme-constant.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-article',
  templateUrl: './article.component.html',
  styleUrls: ['./article.component.scss']
})
export class ArticleComponent implements OnInit {
  @Output() change = new EventEmitter();
  @Input() lang: string;

  article: Article;
  articleLikes: number;
  slug: string;
  articleComments: any;
  commentForm: FormGroup;
  isFormSaving: boolean = false;
  @ViewChild('commentSection') private myScrollContainer: ElementRef;

  constructor(
    private articleService: ArticleService,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    public translate: TranslateService,
    private themeService: ThemeConstantService
  ) {
    translate.addLangs(['en', 'nl']);
    translate.setDefaultLang('en');
   }
   switchLang(lang: string) {
    this.translate.use(lang);
  }


  ngOnInit(): void {
    this.themeService.selectedLang.subscribe(lang => this.switchLang(lang));

    this.route.paramMap.subscribe(params => {
      console.log('Category Slug', params.get('slug'));

      this.setCommentForm();

      const slug = params.get('slug');

      this.articleService.getArtical(slug).subscribe(artical => {
        this.article = artical[0];
        const articleId = this.article.id;
        this.articleService.getArticalLikes(articleId).subscribe(likes => {
          this.articleLikes = likes;
        })
        this.getArticleComments(articleId);
      });

    });
  }
  getArticleComments(articleId) {
    this.articleService.getArticaleComments(articleId).subscribe((commentList) => {
      this.articleComments = commentList


    })
  }

  setCommentForm() {

    this.commentForm = this.fb.group(
      {
        userName: [null, [Validators.required, Validators.minLength(3), , Validators.maxLength(50)]],
        message: [null, [Validators.required, Validators.minLength(3), , Validators.maxLength(400)]]
      }
    )
  }
  saveComments() {

    for (const i in this.commentForm.controls) {
      this.commentForm.controls[i].markAsDirty();
      this.commentForm.controls[i].updateValueAndValidity();
    }
    if (!this.findInvalidControls().length) {
      this.isFormSaving = true;
      const commentData = {
        username: this.commentForm.get('userName').value,
        published_on: new Date().toString(),
        message: this.commentForm.get('message').value,
        article: this.article.id

      };
      const fields = {
        fields: commentData
      }

      this.articleService.createComment(fields).then(() => {
        this.isFormSaving = false;
        this.scrollToTop();
        this.commentForm.get('userName').setValue(null);
        this.commentForm.get('message').setValue(null);
        this.commentForm.controls['message'].setErrors(null);
        this.commentForm.controls['userName'].setErrors(null);

      }).catch(() => {
        this.isFormSaving = false;
      })
    }
  }
  public findInvalidControls() {
    const invalid = [];
    const controls = this.commentForm.controls;
    for (const name in controls) {
      if (controls[name].invalid) {
        invalid.push(name);
      }
    }
    return invalid;
  }
  scrollToTop(): void {
    try {
      // this.myScrollContainer.nativeElement.scrollTop = 0;
      this.myScrollContainer.nativeElement.scrollIntoView({ behavior: 'smooth' })
    } catch (err) { }
  }

}
