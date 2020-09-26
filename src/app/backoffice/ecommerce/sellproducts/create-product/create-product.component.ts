
import { Component } from '@angular/core';
import { NzModalService } from 'ng-zorro-antd';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NzMessageService } from 'ng-zorro-antd/message';
import { UploadFile } from 'ng-zorro-antd/upload';
import { StoreSetting } from 'src/app/backoffice/shared/services/store-setting.service';

@Component({
  templateUrl: './create-product.component.html',
})

export class CreateProductComponent {

  isEdit: boolean = false;
  productEditForm: FormGroup;
  previewImage: string = '';
  previewVisible: boolean = false;
  categoryList = [];

  fileList = [
    {
      uid: -1,
      name: 'product-1.jpg',
      status: 'done',
      url: 'assets/images/others/product-1.jpg'
    },
    {
      uid: 0,
      name: 'product-2.jpg',
      status: 'done',
      url: 'assets/images/others/product-2.jpg'
    },
    {
      uid: 1,
      name: 'product-3.jpg',
      status: 'done',
      url: 'assets/images/others/product-3.jpg'
    }
  ];


  constructor(private modalService: NzModalService, private fb: FormBuilder, private msg: NzMessageService, private storeservice: StoreSetting) {
  }

  ngOnInit(): void {
    let price = "^[0-9]+(\.[0-9]*){0,1}$";
    let quantity = "^[0-9]{1,15}$";
    this.productEditForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(70)]],
      sku: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(70)]],
      price: this.fb.group({
        salePrice: [0, [Validators.required, Validators.pattern(price)]],
        compareAmount: [0, [Validators.required, Validators.pattern(price)]],
        unitPrice: [0, [Validators.required, Validators.pattern(price)]],
      }),
      category: ['', [Validators.required]],
      brand: ['', [Validators.required]],
      status: ['', [Validators.required]],
      size: [],
      colors: [],
      material: [],
      description: ['', [Validators.required]],
      quantity: [0, [Validators.required, Validators.pattern(quantity)]],
      tags: [],
      summary: ['', [Validators.required, Validators.minLength(20), Validators.maxLength(160)]],

    });
  }
  numberOnly(event): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;

  }

  submitForm(): void {
    for (const i in this.productEditForm.controls) {
      this.productEditForm.controls[i].markAsDirty();
      this.productEditForm.controls[i].updateValueAndValidity();
    }
    let finalObhject = this.productEditForm.getRawValue(); // {name: '', description: ''}
    this.storeservice.addProduct(finalObhject).subscribe((productData) => {
      this.modalService.success({
        nzTitle: '<i>Product Added Successfully </i>',
      });
    })

  }

  edit() {
    this.isEdit = true;
  }

  editClose() {
    this.isEdit = false;
  }

  save() {
    this.modalService.confirm({
      nzTitle: '<i>Do you want your changes?</i>',
      nzOnOk: () => this.submitForm()
    });
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
