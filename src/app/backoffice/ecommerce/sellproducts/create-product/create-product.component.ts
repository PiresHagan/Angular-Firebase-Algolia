
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
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';


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
  productDetails;
  isLoading = false;
  fileList = [

  ];


  constructor(private modalService: NzModalService,
    private languageService: LanguageService,
    private categoryService: CategoryService,
    public translate: TranslateService,
    private userService: UserService,
    private activateRoute: ActivatedRoute,
    private location: Location,
    private route: Router,
    private fb: FormBuilder, private msg: NzMessageService, private storeservice: StoreSetting) {
  }

  ngOnInit(): void {

    this.languageList = this.languageService.geLanguageList();

    this.userService.getCurrentUser().then((user) => {
      this.currentUser = user;
      this.userService.getMember(user.uid).subscribe((userDetails) => {
        this.memberDetails = userDetails;
      })
      this.setForm();

      this.storeservice.getStoreById(user.uid).subscribe((storeDetails: Store) => {
        if (storeDetails && storeDetails[0])
          this.storeDetails = storeDetails[0];
        this.setfomFields();

      })
    })




  }
  setfomFields() {
    let productId = this.activateRoute.snapshot.queryParams['product'];
    if (productId)
      this.storeservice.getProduct('', productId).subscribe((productDetails: any) => {
        if (!productDetails)
          return;
        this.productDetails = productDetails;


        this.productEditForm.controls['name'].setValue(productDetails.name);
        this.productEditForm.controls['sku'].setValue(productDetails.sku);
        this.productEditForm.controls['brand'].setValue(productDetails.brand);
        this.productEditForm.controls['status'].setValue(productDetails.status);
        this.productEditForm.controls['status'].setValue(productDetails.status);
        this.productEditForm.controls['description'].setValue(productDetails.description);
        this.productEditForm.controls['quantity'].setValue(productDetails.quantity);
        this.productEditForm.controls['lang'].setValue(productDetails.lang);
        this.productEditForm.controls['summary'].setValue(productDetails.summary);
        this.productEditForm.controls['tags'].setValue(productDetails.tags);
        this.productEditForm.controls['salePrice'].setValue(productDetails.salePrice);
        this.productEditForm.controls['compareAmount'].setValue(productDetails.compareAmount);
        this.productEditForm.controls['unitPrice'].setValue(productDetails.unitPrice);
        this.fileList = productDetails.images ? productDetails.images : [];
        if (this.categoryList && this.categoryList.length == 0) {
          this.categoryService.getAll(productDetails.lang).subscribe((categoryList) => {
            this.categoryList = categoryList ? categoryList : [];
            this.productEditForm.controls['categories'].setValue(productDetails.categories);

          });
        } else {
          this.productEditForm.controls['categories'].setValue(productDetails.categories);

        }




      })

  }

  setForm() {
    let price = "^[0-9]+(\.[0-9]*){0,1}$";
    let quantity = "^[0-9]{1,15}$";
    this.productEditForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(70)]],
      sku: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(70)]],
      salePrice: [0, [Validators.required, Validators.pattern(price)]],
      compareAmount: [0, [Validators.required, Validators.pattern(price)]],
      unitPrice: [0, [Validators.required, Validators.pattern(price)]],
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

    let $message = this.translate.instant("ProductSaved");
    this.modalService.success({
      nzTitle: "<i>" + $message + "</i>",
    });
  }

  showWarning(): void {

    let $message = this.translate.instant("artError");
    this.modalService.warning({
      nzTitle: "<i>" + $message + "</i>",
    });
  }
  showError(): void {

    let $message = this.translate.instant("artError");
    this.modalService.warning({
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
    if (this.findInvalidControls().length) {
      this.showWarning();
      return;
    }
    this.isLoading = true;
    this.storeservice.addOrUpdateProduct(this.storeDetails.id, finalObhject, this.productDetails?.id).subscribe((productData) => {
      this.showSuccess();
      this.isLoading = false;
      setTimeout(() => {
        this.route.navigate(["app/shop/sellproducts/product-list"]);
      }, 1000)

    }, error => {
      this.isLoading = false;
      this.showError()
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


  findInvalidControls() {
    const invalid = [];
    const controls = this.productEditForm.controls;
    for (const name in controls) {
      if (controls[name].invalid) {
        invalid.push(name);
      }
    }
    return invalid;
  }
  handleChange(info: { file: UploadFile }): void {
    try {

      this.getBase64(info.file.originFileObj, (img: string) => {
        this.saveImageOnServer(img, info.file.name).then((imageObject) => {
          imageObject['id'] = Math.random().toString(36).substr(2, 9);
          this.fileList.push(imageObject);
        })
      })
    } catch (error) {
      this.showErrorMessage('artImageGeneralErr')
    }
  }
  showErrorMessage(message) {
    let $message = this.translate.instant(message);
    this.modalService.error({
      nzTitle: $message,
    });
  }

  beforeUpload = (file: UploadFile, _fileList: UploadFile[]) => {
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
    if (!isJpgOrPng) {
      this.showErrorMessage("artImageTypeErr");
      return false;
    }
    const isLt2M = file.size! / 1024 / 1024 < 2;
    if (!isLt2M) {
      this.showErrorMessage("artImageSizeErr");
      return false;
    }
    return true;
  };

  saveImageOnServer(base64, name) {

    return this.storeservice.addImage(base64, name)
  }
  private getBase64(img: File, callback: (img: {}) => void): void {
    const reader = new FileReader();
    reader.addEventListener("load", () => callback(reader.result));
    reader.readAsDataURL(img);
  }
  goBack() {
    this.location.back();
  }


}
