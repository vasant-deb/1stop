import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';


import { AuthService } from '../auth.service';

import { NgxSpinnerService } from 'ngx-spinner';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit{
 
  latestdevicesOptions = {
    autoplay: true,
    autoplaySpeed: 3000,
    dots: false,
    responsive: [
      {
        breakpoint: 400,
        settings: {
          slidesToShow: 1
        }
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 4
        }
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 5
        }
      },
      {
        breakpoint: 992,
        settings: {
          slidesToShow: 5
        }
      },
      {
        breakpoint: 1200,
        settings: {
          slidesToShow: 6
        }
      },
      {
        breakpoint: 1400,
        settings: {
          slidesToShow: 6
        }
      },
      {
        breakpoint: 1600,
        settings: {
          slidesToShow: 6
        }
      }
    ]
  };
  bannerOptions = {
    autoplay: true,
    autoplaySpeed: 3000,
    dots: true,
    responsive: [
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 1
        }
      },
      {
        breakpoint: 992,
        settings: {
          slidesToShow: 1
        }
      }
    ]
  };
  auth=false;
  constructor(private spinner: NgxSpinnerService,private authService: AuthService, private router: Router) { }
  categories: any[] = [];
  latestdevices:any[]=[];
  sliders:any[]=[];
  accessories:any[]=[];
  saleproducts:any[]=[];
ngOnInit(): void {
  let email=localStorage.getItem('email');
  let token=localStorage.getItem('token');
  if(email && token){
    this.checkauth();
  }
 
  var check=localStorage.getItem('justLoggedOut') ;
    this.router.events.subscribe(event => {
      if (check === 'true') {
        // Reload the page only if the user has just signed up
        localStorage.removeItem('justLoggedOut');
        location.reload();
      }
    });

  this.spinner.show();
  this.getlatestdevices();
  this.getsliders();
 
  this.getaccessories();
 // this.getsaleproducts();
  this.spinner.hide();
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

getsliders(){
    
    this.authService.getslides()
        .subscribe(
          res => {
            this.sliders = res?.stats;
        //    this.spinner.hide();
          },
          err => {
            console.log(err);
          }
        );
  }
  getlatestdevices(){
    
    this.authService.getlatestdevices()
        .subscribe(
          res => {
            this.latestdevices = res?.stats;
        //    this.spinner.hide();
          },
          err => {
            console.log(err);
          }
        );

  }
  
  getaccessories(){
 
    this.authService.getaccessories()
    .subscribe(
      res => {
        this.accessories = res?.stats;
        
     //   this.spinner.hide();
      },
      err => {
        console.log(err);
      }
    );
  }
  increment(productId: number) {
    const product = this.accessories.find(p => p.id === productId);
    if (product) {
      if (isNaN(product.quantity)) {
        product.quantity = 0;
      }
      product.quantity += 1;
    }
  }
  
  decrement(productId: number) {
    const product = this.accessories.find(p => p.id === productId);
    if (product && product.quantity > 0) {
      product.quantity -= 1;
    }
  }

  getsaleproducts(){
    this.authService.saleproducts()
    .subscribe(
      res => {
        this.saleproducts = res?.stats;
     //   this.spinner.hide();
      },
      err => {
        console.log(err);
      }
    );
  }
}
