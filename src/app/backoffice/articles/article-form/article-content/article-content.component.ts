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
import { Router } from '@angular/router';

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
    private router: Router
  ) {
    this.setUserDetails()

    this.articleForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(100)]],
      excerpt: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(100)]],
      content: ['', [Validators.required, Validators.minLength(10)]],
      category: ['', [Validators.required]],
      tags: [[]]
    });
  }

  ngOnInit() {


    this.categoryService.getAll().subscribe((categoryList) => {
      this.categoryList = categoryList;
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
        tags: this.articleForm.get('tags').value,
        author: this.getUserDetails(),
        summary: this.articleForm.get('title').value,
        is_published: false

      }
      this.articleService.createArticle(articleData).then((article) => {
        this.articleId = article.id
        //this.showSuccess();
        this.isFormSaving = false;
        this.router.navigate(['app/article/compose/image', this.articleId]);

        this.articleForm.reset();
      }).catch(() => {
        this.showError();
      })
    }

    console.log(this.articleForm)
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
      uid: category.uid,
    }
  }
  setUserDetails() {
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
      fullName: this.userDetails.displayName,
      photoURL: this.userDetails.photoURL,
      uid: this.userDetails.uid
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



}
