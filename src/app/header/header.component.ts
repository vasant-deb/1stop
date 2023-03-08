import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';


import { AuthService } from '../auth.service';
import { SharedService } from '../shared.service';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
 
 
  constructor(private spinner: NgxSpinnerService,private router: Router,private sharedService: SharedService,private authService: AuthService) { }
  firstname: string = '';
  lastname: string = '';
  countcart: number = 0;
  total: number = 0.00; // initializes the variable to 0.00
  auth=false;
  cart: any[] = [];
  devices:any[]=[];
  menus:any[]=[];
  category: any; // add this line to define the category property
  subcategory: any; // add this line to define the category property
  subsubcategory:any;

  ngOnInit() {
   this.device();
   this.menu();
    let email=localStorage.getItem('email');
    let token=localStorage.getItem('token');
    if(email && token){
      this.checkauth();
      this.spinner.show();
    this.sharedService.setValue({email: email, token: token})
      .then(res => {
        debugger;
        this.firstname = res?.firstname;
        this.lastname = res?.lastname;
        this.countcart = res?.countcart;
        this.total = res?.total;
        this.cart = res?.cart;
        console.log(res?.countcart);
        this.spinner.hide();
      });
    } 
  }

  checkauth(){
    let email = localStorage.getItem('email');
    let token = localStorage.getItem('token');
    if (email && token) {
      this.authService.checkauths({ email, token })
        .subscribe(
          res => {
            const error = res.error;
            if(error === false){
              this.auth = true;
             }
          },
          err => {
            console.log(err);
          }
        );
    }
  }

  device(){
    this.spinner.show();
    this.authService.getdevices()
    .subscribe(
      res => {
        this.devices = res?.stats;
        this.spinner.hide();
     //   this.spinner.hide();
      },
      err => {
        console.log(err);
      }
    );
  }
  menu(){
    this.spinner.show();
    this.authService.getmenus()
    .subscribe(
      res => {
        this.spinner.hide();
        this.menus = res?.stats;
        
     //   this.spinner.hide();
      },
      err => {
        console.log(err);
      }
    );
  }
  home() {
    this.router.navigate(['']);
  }
  myaccount() {
    this.router.navigate(['myaccount']);
  }
  logout() {
 
    localStorage.clear();
    localStorage.setItem('justLoggedOut', 'true');

    this.router.navigate(['']);
  }
}
