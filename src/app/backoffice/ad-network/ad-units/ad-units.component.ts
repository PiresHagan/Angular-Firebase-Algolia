import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
@Component({
  selector: 'app-ad-units',
  templateUrl: './ad-units.component.html',
  styleUrls: ['./ad-units.component.scss']
})
export class AdUnitsComponent implements OnInit {

  constructor(private router: Router) { }
  adSizeOptions = [
    {
      label: "160 x 600 - (Wide Skyscraper)", 
      value: "160 x 600 - (Wide Skyscraper)"
    },
    {
      label: "300 x 50 - (Smartphone Banner)", 
      value: "300 x 50 - (Smartphone Banner)"
    },
    {
      label: "300 x 250 - (Medium Rectangle)", 
      value: "300 x 250 - (Medium Rectangle)"
    },
    {
      label: "300 x 600 - (Half Page Ad)", 
      value: "300 x 600 - (Half Page Ad)"
    },
    {
      label: "320 x 50 - (Smartphone Banner)", 
      value: "320 x 50 - (Smartphone Banner)"
    },{
      label: "728 x 90 - (Leaderboard)", 
      value: "728 x 90 - (Leaderboard)"
    },{
      label: "970 x 90 - (Super Leaderboard)", 
      value: "970 x 90 - (Super Leaderboard)"
    },{
      label: "970 x 250 - (Billboard)", 
      value: "970 x 250 - (Billboard)"
    }
  ];
  ngOnInit(): void {
  }
  isVisible = false;
  isVisible1 = false;
  isOkLoading = false;
  isOkLoading1 = false;

  showModal(): void {
    this.isVisible = true;
  }
  showModal1(): void {
    this.isVisible1 = true;
  }
  handleOk(): void {
    this.isOkLoading = true;
    setTimeout(() => {
      this.router.navigate(["auth/login"]);
      this.isOkLoading = false;
    }, 2000);
  }
  handleOk1(): void {
    this.isOkLoading1 = true;
    setTimeout(() => {
      this.router.navigate(["auth/login"]);
      this.isOkLoading = false;
    }, 2000);
  }

  handleCancel(): void {
    this.isVisible = false;
  }
  handleCancel1(): void {
    this.isVisible1 = false;
  }
}
