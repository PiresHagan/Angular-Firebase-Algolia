import { Component, OnInit } from '@angular/core';
import { Article } from 'src/app/shared/interfaces/article.type';
import { CategoryService } from 'src/app/shared/services/category.service';
import { Category } from 'src/app/shared/interfaces/category.type';
import { FormBuilder, Validators } from '@angular/forms';
import { TranslateService, LangChangeEvent } from "@ngx-translate/core";
import { AuthService } from 'src/app/shared/services/authentication.service';
import { UserService } from 'src/app/shared/services/user.service';
import { NzModalService, UploadFile } from 'ng-zorro-antd';
import { Router, ActivatedRoute } from '@angular/router';
import { DRAFT } from 'src/app/shared/constants/status-constants';
import { LanguageService } from 'src/app/shared/services/language.service';
import { Location } from '@angular/common';
import { BackofficeArticleService } from 'src/app/backoffice/shared/services/backoffice-article.service';
import { AUDIO, VIDEO, TEXT } from 'src/app/shared/constants/article-constants';
import { DomSanitizer } from '@angular/platform-browser';
import { CompanyService } from 'src/app/backoffice/shared/services/company.service';
import { CharityService } from 'src/app/backoffice/shared/services/charity.service';
import { AUTHOR, STAFF, MEMBER, COMPANY, CHARITY } from 'src/app/shared/constants/member-constant';

@Component({
  selector: 'app-article-content',
  templateUrl: './article-content.component.html',
  styleUrls: ['./article-content.component.scss']
})
export class ArticleContentComponent implements OnInit {

  tagList: [] = [];
  tagValue = [];
  article: Article = null;
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
  radioValue = 'text';
  allowedArticleVideo = ['mimetypes:video/x-ms-asf', 'video/x-flv', 'video/mp4', 'application/x-mpegURL', 'video/MP2T', 'video/3gpp', 'video/quicktime', 'video/x-msvideo', 'video/x-ms-wmv', 'video/avi'];
  allowedArticleAudio = ['audio/mpeg'];
  articleFile;
  videoFile;
  audioFile;
  fileURL: string;
  videofileURL: string;
  audioFileUrl: string;
  VIDEO = VIDEO;
  AUDIO = AUDIO;
  TEXT = TEXT;
  authorList;

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
    public articleService: BackofficeArticleService,
    private modalService: NzModalService,
    private router: Router,
    private route: ActivatedRoute,
    private languageService: LanguageService,
    private location: Location,
    private modal: NzModalService,
    private sanitizer: DomSanitizer,
    private charityService: CharityService,
    private companyService: CompanyService
  ) {

    this.articleForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(70)]],
      excerpt: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(160)]],
      content: ['', [Validators.minLength(10)]],
      category: ['', [Validators.required]],
      lang: ['', [Validators.required]],
      topics: [''],
      type: ['text'],
      author: ['', [Validators.required]]
    });
  }
  isValidVideo(mimeType) {
    return this.allowedArticleVideo.indexOf(mimeType) > -1;
  }
  isValidAudio(mimeType) {
    return this.allowedArticleAudio.indexOf(mimeType) > -1;
  }
  isValidSize(fileSize, requiredSize) {
    return fileSize! / 1024 / 1024 < requiredSize
  }
  showMessage(msg, type, extras = '') {
    if (type == 'error') {
      this.modalService.error({
        nzTitle: this.translate.instant("CampERROR"),
        nzContent: this.translate.instant(msg) + extras
      })
    } else if (type == 'warning') {
      this.modalService.warning({
        nzTitle: this.translate.instant("CampWarning"),
        nzContent: this.translate.instant(msg) + extras
      })

    } else if (type == 'success') {
      this.modalService.warning({
        nzTitle: this.translate.instant("CampSuccess"),
        nzContent: this.translate.instant(msg) + extras
      })

    }
  }

  beforeUpload = (file: UploadFile, _fileList: UploadFile[]) => {

    const isValidFile = this.articleType == AUDIO ? this.isValidAudio(file.type) : this.isValidVideo(file.type);
    if (!isValidFile) {
      this.showMessage('InvalidFormat', 'error');
      return false;
    }

    const validSize = this.articleType == AUDIO ? this.isValidSize(file.size, 100) : this.isValidSize(file.size, 100);
    if (!validSize) {
      this.showMessage('InvalidSize', 'error', this.articleType == AUDIO ? '100MB' : '100MB');
      return false;
    }
    this.articleFile = file;

    return false;
  };

  saveVideo() {

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
          this.article = await this.articleService.getArticleById(articleId, null, this.userDetails.type);
          if (this.article && (this.article['id'])) {
            this.categoryService.getAll(this.article.lang).subscribe((categoryList) => {
              this.categoryList = categoryList ? categoryList : [];
              this.categoryService.getTopicList(this.article.category.id, this.article.lang).subscribe((topicListData) => {
                this.topicList = topicListData ? topicListData : [];
                this.setFormDetails();
                this.getCompanyAndCharity(this.article.author, articleId);
              })
              this.loading = false;
            });
          }
        } catch (error) {
          this.article = null;
        }
      } else {
        this.getCompanyAndCharity(this.userDetails);
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
        content: this.articleType == 'text' ? this.articleForm.get('content').value : '',
        title: this.articleForm.get('title').value,
        slug: this.getSlug(this.articleForm.get('title').value.trim()),
        excerpt: this.articleForm.get('excerpt').value,
        author: this.getUserDetails(this.articleForm.get('author').value),
        summary: this.articleForm.get('title').value,
        status: this.article && this.article.status ? this.article.status : DRAFT,
        lang: this.articleForm.get('lang').value ? this.articleForm.get('lang').value : this.userDetails.lang,
        topics: this.getTopicFilter(this.articleForm.get('topics').value),
        topic_list: this.getTopicSlug(this.articleForm.get('topics').value),
        type: this.articleForm.get('type').value,
        article_file: this.article ? this.article.article_file : {},
        created_at: this.article && this.article.id && this.article.created_at ? this.article.created_at : new Date().toISOString()
      }
      if (this.articleFile) {
        this.articleService.uploadArticleFile(this.articleFile).then(data => {
          articleData['article_file'] = data;
          this.addOrUpdateArticle(articleData);
        })
      } else {
        if (this.articleType == "text")
          articleData['article_file'] = null;
        this.addOrUpdateArticle(articleData);
      }

    }
    console.log(this.articleForm)
  }
  resetAndNavigate(article = null) {
    this.articleId = article ? article.articleId : this.article.id;
    this.isFormSaving = false;
    this.router.navigate(['app/article/compose/image', this.articleId]);
    this.articleForm.reset();
  }

  findInvalidControls() {
    const invalid = [];
    const controls = this.articleForm.controls;
    for (const name in controls) {

      if (controls[name].invalid) {
        invalid.push(name);
      }
    }
    this.contentValidation = false;
    if ((this.articleType == 'text' || this.articleType == undefined) && !this.articleForm.controls['content'].value) {
      this.contentValidation = true;
      invalid.push('content');
    }
    if (this.articleType == 'audio') {
      if (!this.articleFile && !this.article) {
        this.contentValidation = true;
        invalid.push('audio');
      } else if (!this.articleFile && this.article && !this.article.article_file) {
        this.contentValidation = true;
        invalid.push('audio');
      } else if (!this.articleFile && this.article && this.article.article_file && this.article.type !== 'audio') {
        this.contentValidation = true;
        invalid.push('audio');
      }
    } else if (this.articleType == 'video') {
      if (!this.articleFile && !this.article) {
        this.contentValidation = true;
        invalid.push('video');
      } else if (!this.articleFile && this.article && !this.article.article_file) {
        this.contentValidation = true;
        invalid.push('video');
      } else if (!this.articleFile && this.article && this.article.article_file && this.article.type !== 'video') {
        this.contentValidation = true;
        invalid.push('video');
      }
    }
    return invalid;
  }
  getSlug(title: string) {
    if (this.article && this.article.slug && this.article.title && title == this.article.title.trim()) {
      return this.article.slug;
    }
    return this.slugify(title) + '-' + this.makeid();
  }

  slugify(string) {
    return string
      .toString()
      .trim()
      .toLowerCase()
      .replace(/[^a-zA-Z ]/g, "")
      .replace(/\s+/g, "-")
      .replace(/[^\w\-]+/g, "")
      .replace(/\-\-+/g, "-")
      .replace(/^-+/, "")
      .replace(/-+$/, "");
  }
  makeid(length = 6) {
    var result = '';
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result.toLowerCase();
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

  getUserDetails(userDetails) {
    if (!userDetails)
      userDetails = this.userDetails;
    return {
      slug: userDetails.slug ? userDetails.slug : '',
      fullname: userDetails.fullname || userDetails.name,
      avatar: {
        url: userDetails.avatar?.url || userDetails.logo?.url,
        alt: userDetails.avatar?.alt || userDetails.logo?.alt
      },
      type: userDetails.type ? userDetails.type : AUTHOR,
      id: userDetails.id
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
    this.isFormSaving = false;
    let $message = this.translate.instant("artError");
    this.translate.onLangChange.subscribe((event: LangChangeEvent) => {
      $message = this.translate.instant("artError");
    })
    this.modalService.error({
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
      type: this.article.type ? this.article.type : 'text',
      author: this.article.author ? this.article.author : null
    });
    this.audioFile = this.article.type === "audio" ? this.article.article_file : '';
    this.videoFile = this.article.type === "video" ? this.article.article_file : '';
    const format = this.article.type === "audio" ? 'mp3' : 'mp4';
    this.videofileURL = this.article.type === "video" && `https://player.cloudinary.com/embed/?cloud_name=mytrendingstories&public_id=${this.article.article_file.cloudinary_id}&fluid=true&controls=true&source_types%5B0%5D=${format}`
    this.audioFileUrl = this.article.type === "audio" && `https://player.cloudinary.com/embed/?cloud_name=mytrendingstories&public_id=${this.article.article_file.cloudinary_id}&fluid=true&controls=true&source_types%5B0%5D=${format}`
  }
  getSelectedCategory(categoryId) {
    return this.categoryList.find(element => element.uid == categoryId || element.id == categoryId);

  }
  transform(url) {
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
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
  getCompanyAndCharity(articleAuthor, articleId = null) {

    this.authorList = {
      charities: [],
      companies: [],
      currentUser: null
    }
    if (this.userDetails.type == STAFF && articleId) {
      if (!articleAuthor.type || articleAuthor.type === MEMBER) {
        this.userService.getMember(articleAuthor.id).subscribe((userDetails) => {
          this.authorList.currentUser = userDetails;
          this.setAuthorDropdown();
        })
      } else if (articleAuthor.type === COMPANY) {
        this.companyService.getCompanyById(articleAuthor.id).subscribe((copanyData) => {
          this.authorList.companies.push(copanyData);
          this.setAuthorDropdown();
        })
      } else if (articleAuthor.type === CHARITY) {
        this.charityService.getCharityById(articleAuthor.id).subscribe((charityData) => {
          this.authorList.charities.push(charityData);
          this.setAuthorDropdown();
        })
      }

    } else {
      this.userService.getMember(this.userDetails.id).subscribe((userDetails) => {
        this.authorList.currentUser = userDetails;
        this.setAuthorDropdown();
      })
      this.charityService.getAllCharities(this.userDetails.id, 1000).subscribe((charityData) => {
        this.authorList.charities = charityData.charityList;
        this.setAuthorDropdown();

      })

      this.companyService.getAllCompanies(this.userDetails.id, 1000).subscribe((companyData) => {
        this.authorList.companies = companyData.companyList;
        this.setAuthorDropdown();
      })
    }




  }
  setAuthorDropdown() {
    let selectedUser = null;;
    if (this.article && this.article.author) {
      if (this.authorList.currentUser && this.authorList.currentUser.id === this.article.author.id) {
        selectedUser = this.authorList.currentUser;
      }
      if (this.authorList.charities && this.authorList.charities.length) {
        selectedUser = this.getRecordFromId(this.authorList.charities, this.article.author.id) || null;
      }
      if (this.authorList.companies && this.authorList.companies.length) {
        selectedUser = this.getRecordFromId(this.authorList.companies, this.article.author.id) || null;
      }
      if (selectedUser)
        this.articleForm.controls['author'].setValue(selectedUser);
    }
  }

  getRecordFromId(list, id) {
    for (let index = 0; index < list.length; index++) {
      const element = list[index];
      if (element.id == id) {
        return element;
      }

    }
    return null;
  }

  goBack() {
    this.location.back();
  }
  removeFile() {
    this.articleFile = null;
    this.contentValidation = false;

  }
  addOrUpdateArticle(articleData) {
    if (this.article && this.article.id)
      this.articleService.updateArticle(this.article.id, articleData).then(() => {
        this.resetAndNavigate();
      }).catch(() => {
        this.showError();
      })
    else
      this.articleService.createArticle(articleData).then((article: any) => {
        this.resetAndNavigate(article);
      }).catch(() => {
        this.showError();
      })
  }

  get articleType() { return this.articleForm.get('type').value; }



}
