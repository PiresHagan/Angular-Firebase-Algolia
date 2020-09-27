
import { Component } from '@angular/core';
import { NzModalService } from 'ng-zorro-antd';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NzMessageService } from 'ng-zorro-antd/message';
import { UploadFile } from 'ng-zorro-antd/upload';
import { StoreSetting } from 'src/app/backoffice/shared/services/store-setting.service';
import { LanguageService } from 'src/app/shared/services/language.service';
import { CategoryService } from 'src/app/shared/services/category.service';
import { TranslateService, LangChangeEvent } from '@ngx-translate/core';

import { Store } from 'src/app/shared/interfaces/ecommerce/store';
import { UserService } from 'src/app/shared/services/user.service';

@Component({
  templateUrl: './create-product.component.html',
  styleUrls: ['./create-product.component.scss']
})

export class CreateProductComponent {

  isEdit: boolean = false;
  productEditForm: FormGroup;
  previewImage: string = '';
  previewVisible: boolean = false;
  categoryList = [];
  languageList = [];
  storeDetails: Store = null;
  currentUser;
  memberDetails;

  fileList = [

  ];


  constructor(private modalService: NzModalService,
    private languageService: LanguageService,
    private categoryService: CategoryService,
    public translate: TranslateService,
    private userService: UserService,
    private fb: FormBuilder, private msg: NzMessageService, private storeservice: StoreSetting) {
  }

  ngOnInit(): void {

    this.languageList = this.languageService.geLanguageList();

    this.userService.getCurrentUser().then((user) => {
      this.currentUser = user;
      this.userService.getMember(user.id).subscribe((userDetails) => {
        this.memberDetails = userDetails;
      })
      this.setForm();

      this.storeservice.getStoreById(user.uid).subscribe((storeDetails: Store) => {
        if (storeDetails && storeDetails[0])
          this.storeDetails = storeDetails;

      })
    })




  }

  setForm() {
    let price = "^[0-9]+(\.[0-9]*){0,1}$";
    let quantity = "^[0-9]{1,15}$";
    this.productEditForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(70)]],
      sku: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(70)]],
      price: this.fb.group({
        salePrice: [0, [Validators.required, Validators.pattern(price)]],
        compareAmount: [0, [Validators.required, Validators.pattern(price)]],
        unitPrice: [0, [Validators.required, Validators.pattern(price)]],
      }),
      categories: [null, [Validators.required]],
      brand: ['', [Validators.required]],
      status: ['', [Validators.required]],
      // size: [],
      // colors: [],
      // material: [],
      description: ['', [Validators.required]],
      quantity: [1, [Validators.required, Validators.pattern(quantity)]],
      tags: [],
      summary: ['', [Validators.required, Validators.maxLength(160)]],
      lang: ['', [Validators.required]]

    });
  }

  numberOnly(event): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;

  }
  languageSelected(language: string) {
    if (!language)
      return

    this.categoryService.getAll(language).subscribe((categoryList) => {
      this.productEditForm.controls['categories'].setValue(null);
      this.categoryList = categoryList ? categoryList : [];

    })
  }

  showSuccess(): void {

    let $message = this.translate.instant("profileSaveMessage");
    this.modalService.success({
      nzTitle: "<i>" + $message + "</i>",
    });
  }


  submitForm(): void {
    for (const i in this.productEditForm.controls) {
      this.productEditForm.controls[i].markAsDirty();
      this.productEditForm.controls[i].updateValueAndValidity();
    }
    let finalObhject = this.productEditForm.getRawValue(); // {name: '', description: ''}
    finalObhject['images'] = this.fileList;
    finalObhject['created_by'] = {
      avatar: this.memberDetails.avatar ? this.memberDetails.avatar : '',
      slug: this.memberDetails.slug,
      name: this.memberDetails.fullname,
      id: this.memberDetails.id,

    }
    this.storeservice.addProduct(this.storeDetails.id, finalObhject).subscribe((productData) => {
      this.showSuccess();
    })

  }

  edit() {
    this.isEdit = true;
  }

  editClose() {
    this.isEdit = false;
  }

  save() {
    this.submitForm()
  }

  handlePreview = (file: UploadFile) => {
    this.previewImage = file.url || file.thumbUrl;
    this.previewVisible = true;
  }

  editorConfig = {
    toolbar: [
      ['bold', 'italic', 'underline', 'strike'],
      ['blockquote', 'code-block'],
      [{ 'header': 1 }, { 'header': 2 }],
      [{ 'list': 'ordered' }, { 'list': 'bullet' }],
      [{ 'size': ['small', false, 'large', 'huge'] }],
      [{ 'align': [] }],
      ['link', 'image']
    ]
  };

  getBase64(file: File): Promise<string | ArrayBuffer | null> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = error => reject(error);
    });
  }
}
