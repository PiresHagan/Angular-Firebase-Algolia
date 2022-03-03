import { Location } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { CompanyService } from "./company.service";

@Component({
  selector: "app-company",
  templateUrl: "./company.component.html",
  styleUrls: ["./company.component.scss"],
})
export class CompanyComponent implements OnInit {
  isSaving: boolean;
  companyForm: FormGroup;
  constructor(
    private fb: FormBuilder,
    private location: Location,
    private router: Router,
    private companyService: CompanyService
  ) {
    this.companyForm = this.initForm();
  }

  ngOnInit(): void {}

  initForm(): FormGroup {
    this.companyForm = this.fb.group({
      url: ["", Validators.required],
      phone: ["", [Validators.required, Validators.pattern("^[0-9]*$")]],
      hyperlinks: [true, Validators.required],
      mtsIcon: [true],
    });
    return this.companyForm;
  }

  get f() {
    return this.companyForm.controls;
  }

  submit(): void {
    console.warn(this.companyForm.value);

    this.validateFields();
    if (!this.companyForm.valid) return;
    this.createCompany();
  }

  navigateImportContacts() {
    this.router.navigate(["/auth/import-contact"]);
  }

  goBack(): void {
    this.location.back();
  }

  validateFields() {
    for (const i in this.companyForm.controls) {
      this.companyForm.controls[i].markAsDirty();
      this.companyForm.controls[i].updateValueAndValidity();
    }
  }

  getCompany() {
    this.companyService.getUserCompany().subscribe(
      (res) => {
        console.warn(res);
      },
      (error) => {
        console.error(error);
      }
    );
  }

  createCompany() {
    this.isSaving = true;
    this.companyService.createCompany(this.companyForm.value).subscribe(
      (res) => {
        console.warn(res);
        this.isSaving = false;
        this.navigateImportContacts();
      },
      (error) => {
        console.error(error);
        this.isSaving = false;
      }
    );
  }
}
