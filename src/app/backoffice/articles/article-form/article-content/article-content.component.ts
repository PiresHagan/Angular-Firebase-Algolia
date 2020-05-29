import { Component, OnInit } from '@angular/core';
import { Article } from 'src/app/shared/interfaces/article.type';
import { CategoryService } from 'src/app/shared/services/category.service';
import { Category } from 'src/app/shared/interfaces/category.type';
import { FormBuilder, Validators } from '@angular/forms';
import { TranslateService, LangChangeEvent } from "@ngx-translate/core";
import { AuthService } from 'src/app/shared/services/authentication.service';
import { UserService } from 'src/app/shared/services/user.service';
import { ArticleService } from 'src/app/shared/services/article.service';
import { NzModalService } from 'ng-zorro-antd';
import { Router, ActivatedRoute } from '@angular/router';
import { DRAFT } from 'src/app/shared/constants/status-constants';

@Component({
  selector: 'app-article-content',
  templateUrl: './article-content.component.html',
  styleUrls: ['./article-content.component.scss']
})
export class ArticleContentComponent implements OnInit {

  tagList: [] = [];
  tagValue = [];
  article: Article = {};
  categoryList: Category[];
  articleForm: any;
  contentValidation: boolean = false;
  isLoggedInUser: boolean = false;
  userDetails;
  articleId: string;
  isFormSaving: boolean = false;
  loading: boolean = true;

  editorConfig = {
    toolbar: [
      ['bold', 'italic', 'underline', 'strike'],
      ['blockquote', 'code-block'],
      [{ 'header': 2 }, { 'header': 3 }],
      [{ 'list': 'ordered' }, { 'list': 'bullet' }],
      [{ 'size': ['small', false, 'large', 'huge'] }],
      [{ 'align': [] }],
      ['link', 'image', 'video']
    ]
  };

  constructor(
    private categoryService: CategoryService,
    private fb: FormBuilder,
    public translate: TranslateService,
    public authService: AuthService,
    public userService: UserService,
    public articleService: ArticleService,
    private modalService: NzModalService,
    private router: Router,
    private route: ActivatedRoute
  ) {

    this.articleForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(100)]],
      excerpt: ['', [Validators.minLength(10), Validators.maxLength(100)]],
      content: ['', [Validators.required, Validators.minLength(10)]],
      category: ['', [Validators.required]]
      // tags: [[]]
    });
  }

  async ngOnInit() {
    this.authService.getAuthState().subscribe(async (user) => {
      if (!user)
        return;
      this.userDetails = await this.authService.getLoggedInUserDetails();
      let articleId = this.route.snapshot.queryParams["article"];
      if (articleId) {
        try {
          this.article = await this.articleService.getArticleById(articleId, this.userDetails.uid);

        } catch (error) {
          this.article = null;
        }
      }
      this.categoryService.getAll().subscribe((categoryList) => {
        this.categoryList = categoryList;
        if (this.article && (this.article['id'] || this.article['ud'])) {
          this.setFormDetails();
        }
        this.loading = false;
      });

    })


  }
  submitArticle() {
    for (const i in this.articleForm.controls) {
      this.articleForm.controls[i].markAsDirty();
      this.articleForm.controls[i].updateValueAndValidity();
    }
    if (this.findInvalidControls().length == 0) {
      this.isFormSaving = true;
      const articleData = {
        category: this.getFilteredCategory(this.articleForm.get('category').value),
        content: this.articleForm.get('content').value,
        title: this.articleForm.get('title').value,
        slug: this.getSlug(this.articleForm.get('title').value.trim()),
        excerpt: this.articleForm.get('excerpt').value,
        // tags: this.articleForm.get('tags').value,
        author: this.getUserDetails(),
        summary: this.articleForm.get('title').value,
        status: this.article && this.article.status ? this.article.status : DRAFT,
        lang: this.userDetails.lang ? this.userDetails.lang : '',
        author_id: this.userDetails.uid

      }
      if (this.article && this.article.id) {
        this.articleService.updateArticleImage(this.article.id, articleData).then(() => {
          this.resetAndNavigate();
        })
      } else {
        this.articleService.createArticle(articleData).then((article) => {
          this.resetAndNavigate(article);
        }).catch(() => {
          this.showError();
        })
      }

    }
    console.log(this.articleForm)
  }
  resetAndNavigate(article = null) {
    this.articleId = article ? article.id : this.article.id;
    this.isFormSaving = false;
    this.router.navigate(['app/article/compose/image', this.articleId]);
    this.articleForm.reset();
  }

  findInvalidControls() {
    const invalid = [];
    const controls = this.articleForm.controls;
    for (const name in controls) {
      if (name == "content" && controls[name].invalid) {
        this.contentValidation = true;
      }
      if (controls[name].invalid) {
        invalid.push(name);
      }
    }

    return invalid;
  }
  getSlug(title: string) {
    return title.replace(/ /g, '-')?.toLowerCase();
  }

  getFilteredCategory(category) {
    return {
      slug: category.slug,
      title: category.title,
      id: category.uid,
      lang: category.lang ? category.lang : ''
    }
  }
  async setUserDetails() {

    this.authService.getAuthState().subscribe(user => {
      if (user && !user.isAnonymous) {
        this.isLoggedInUser = true;
      } else {
        this.userDetails = null;
        this.isLoggedInUser = false;
      }
    });
    this.userService.getCurrentUser().then((user) => {
      this.userService.get(user.uid).subscribe((userDetails) => {
        this.userDetails = userDetails;
      })
    })
  }
  getUserDetails() {
    return {
      slug: this.userDetails.slug ? this.userDetails.slug : '',
      fullname: this.userDetails.displayName,
      avatar: this.userDetails.photoURL,
      id: this.userDetails.uid
    }
  }
  showSuccess(): void {

    let $message = this.translate.instant("artSave");
    this.translate.onLangChange.subscribe((event: LangChangeEvent) => {
      $message = this.translate.instant("artSave");
    })
    this.modalService.success({
      nzTitle: "<i>" + $message + "</i>",
    });
  }
  showError(): void {

    let $message = this.translate.instant("artError");
    this.translate.onLangChange.subscribe((event: LangChangeEvent) => {
      $message = this.translate.instant("artError");
    })
    this.modalService.success({
      nzTitle: "<i>" + $message + "</i>",
    });
  }

  setArticleForm() {
    debugger;

  }
  setFormDetails() {
    this.articleForm.setValue({
      title: this.article.title,
      excerpt: this.article.excerpt,
      content: this.article.content,
      category: this.getSelectedCategory(this.article.category['id'])
    });
  }
  getSelectedCategory(categoryId) {
    return this.categoryList.find(element => element.uid == categoryId || element.id == categoryId);

  }




}
