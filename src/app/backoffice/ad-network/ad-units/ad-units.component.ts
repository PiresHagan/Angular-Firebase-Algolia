import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
@Component({
  selector: 'app-ad-units',
  templateUrl: './ad-units.component.html',
  styleUrls: ['./ad-units.component.scss']
})
export class AdUnitsComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit(): void {
  }
  isVisible = false;
  isOkLoading = false;

  showModal(): void {
    this.isVisible = true;
  }

  handleOk(): void {
    this.isOkLoading = true;
    setTimeout(() => {
      this.router.navigate(["auth/login"]);
      this.isOkLoading = false;
    }, 2000);
  }

  handleCancel(): void {
    this.isVisible = false;
  }
}
