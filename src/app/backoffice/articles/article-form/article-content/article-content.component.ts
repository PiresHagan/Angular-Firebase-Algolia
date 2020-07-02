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
import { LanguageService } from 'src/app/shared/services/language.service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-article-content',
  templateUrl: './article-content.component.html',
  styleUrls: ['./article-content.component.scss']
})
export class ArticleContentComponent implements OnInit {

  tagList: [] = [];
  tagValue = [];
  article: Article = {};
  categoryList: Category[] = [];
  articleForm: any;
  contentValidation: boolean = false;
  isLoggedInUser: boolean = false;
  userDetails;
  articleId: string;
  isFormSaving: boolean = false;
  loading: boolean = true;
  languageList;
  topicList = [];

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
    private route: ActivatedRoute,
    private languageService: LanguageService,
    private location: Location
  ) {

    this.articleForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(70)]],
      excerpt: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(160)]],
      content: ['', [Validators.required, Validators.minLength(10)]],
      category: ['', [Validators.required]],
      lang: ['', [Validators.required]],
      topics: ['']
    });
  }

  async ngOnInit() {

    this.authService.getAuthState().subscribe(async (user) => {
      if (!user)
        return;
      this.userDetails = await this.authService.getLoggedInUserDetails();
      this.languageList = this.languageService.geLanguageList();

      let articleId = this.route.snapshot.queryParams["article"];

      if (articleId) {
        try {
          this.article = await this.articleService.getArticleById(articleId, this.userDetails.id, this.userDetails.type);
          if (this.article && (this.article['id'])) {
            this.categoryService.getAll(this.article.lang).subscribe((categoryList) => {
              this.categoryList = categoryList ? categoryList : [];
              this.categoryService.getTopicList(this.article.category.id, this.article.lang).subscribe((topicListData) => {
                this.topicList = topicListData ? topicListData : [];
                this.setFormDetails();
              })
              this.loading = false;
            });
          }
        } catch (error) {
          this.article = null;
        }
      } else {
        this.loading = false;
      }


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
        author: this.article.author ? this.article.author : this.getUserDetails(),
        summary: this.articleForm.get('title').value,
        status: this.article && this.article.status ? this.article.status : DRAFT,
        lang: this.articleForm.get('lang').value ? this.articleForm.get('lang').value : this.userDetails.lang,
        topics: this.getTopicFilter(this.articleForm.get('topics').value),
        topic_list: this.getTopicSlug(this.articleForm.get('topics').value),
        created_at: this.article && this.article.id && this.article.created_at ? this.article.created_at : new Date().toISOString()
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
    if (!category)
      return category;
    return {
      slug: category.slug,
      title: category.title,
      id: category.uid,
      lang: category.lang ? category.lang : ''
    }
  }

  getTopicFilter(topicListData) {
    let finalTopicData = []
    if (topicListData) {
      for (let index = 0; index < topicListData.length; index++) {
        const topic = topicListData[index];
        finalTopicData.push({
          slug: topic.slug,
          title: topic.title,
          id: topic.uid,
          lang: topic.lang ? topic.lang : ''
        })
      }
    }
    return finalTopicData;

  }
  getTopicSlug(topicListData) {
    let finalTopicData = []
    if (topicListData) {
      for (let index = 0; index < topicListData.length; index++) {
        const topic = topicListData[index];
        finalTopicData.push(topic.slug)
      }
    }
    return finalTopicData;

  }

  getUserDetails() {
    return {
      slug: this.userDetails.slug ? this.userDetails.slug : '',
      fullname: this.userDetails.fullname,
      avatar: {
        url: this.userDetails.avatar?.url ? this.userDetails.avatar?.url : '',
        alt: this.userDetails.avatar?.alt ? this.userDetails.avatar?.alt : ''
      },
      id: this.userDetails.id
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

  setFormDetails() {
    this.articleForm.setValue({
      title: this.article.title,
      excerpt: this.article.excerpt,
      content: this.article.content,
      lang: this.article.lang,
      category: this.getSelectedCategory(this.article.category['id']),
      topics: this.getSelectedTopic(this.article.topics),
    });
  }
  getSelectedCategory(categoryId) {
    return this.categoryList.find(element => element.uid == categoryId || element.id == categoryId);

  }
  getSelectedTopic(savedTopicData) {

    var availableTopcic = [];
    for (let index = 0; index < savedTopicData.length; index++) {
      const receivedData = savedTopicData[index];
      availableTopcic.push(this.topicList.find(element => element.uid == receivedData.topicId || element.id == receivedData.id));

    }
    return availableTopcic

  }
  languageSelected(language: string) {
    if (!language)
      return
    this.articleForm.controls['category'].setValue(null);
    this.articleForm.controls['topics'].setValue(null);
    this.categoryService.getAll(language).subscribe((categoryList) => {
      this.categoryList = categoryList ? categoryList : [];

    })
  }
  categorySelected(category) {
    if (!category)
      return
    this.articleForm.controls['topics'].setValue(null);
    this.categoryService.getTopicList(category.id, this.articleForm.get('lang').value).subscribe((topicData) => {
      this.topicList = topicData ? topicData : [];

    })
  }
  goBack() {
    this.location.back();
  }





}
