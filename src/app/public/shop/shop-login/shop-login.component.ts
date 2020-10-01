import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-shop-login',
  templateUrl: './shop-login.component.html',
  styleUrls: ['./shop-login.component.scss']
})
export class ShopLoginComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }
  ShowSignIn(){
    document.getElementById('hide-signup').style.display = 'none';
    document.getElementById('hide-signin').style.display = 'block';
  }
  ShowSignUp(){
    document.getElementById('hide-signin').style.display = 'none';
    document.getElementById('hide-signup').style.display = 'block';
  }
}
