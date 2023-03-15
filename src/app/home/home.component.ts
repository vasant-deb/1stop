import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';


import { AuthService } from '../auth.service';

import { NgxSpinnerService } from 'ngx-spinner';
import { MatSnackBar } from '@angular/material/snack-bar';


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
        breakpoint: '2000', // define your own breakpoints here
        settings: {
          slidesToShow: 6
        }
      },
      {
        breakpoint: '600',
        settings: {
          slidesToShow: 4,
          slidesToScroll: 4
        }
      },
      {
        breakpoint: '400',
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1
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
  constructor(private snackBar: MatSnackBar,private spinner: NgxSpinnerService,private authService: AuthService, private router: Router) { }
  categories: any[] = [];
  latestdevices:any[]=[];
  sliders:any[]=[];
  accessories:any[]=[];
  saleproducts:any[]=[];
  cartQuantity: {[key: number]: number} = {};

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
    const token = localStorage.getItem('token');
    const email = localStorage.getItem('email');
    this.authService.getaccessories(token,email)
    .subscribe(
      res => {
        this.accessories = res?.stats;
        this.accessories.forEach(product => {
           
          this.cartQuantity[product.id] = product.quantity;
          product.prevQuantity = product.quantity;
          console.log(product.prevQuantity);
        });

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
      const quantity = parseInt(product.quantity, 10) || 0; // convert to integer and handle NaN
      product.quantity = quantity + 1;
  }
 
}

decrement(productId: number) {

  const product = this.accessories.find(p => p.id === productId);
  if (product) {
      const quantity = parseInt(product.quantity, 10) || 0; // convert to integer and handle NaN
      if (quantity > 0) {
          product.quantity = quantity - 1;
        
      }
  }
}
onAddAllToCart() {
  this.spinner.show();
  const cartItems: any[] = [];
  this.accessories.forEach(product => {
    if (product.quantity === "0" && product.prevQuantity > 0) {
      cartItems.push({
        product_id: product.id,
        quantity: product.quantity
      });
    } else if (product.quantity > 0) {
      cartItems.push({
        product_id: product.id,
        quantity: product.quantity
      });
    }
  });
  const token = localStorage.getItem('token');
  const email = localStorage.getItem('email');
  if (token && email) {
    this.authService.addTocart(cartItems, token, email).subscribe(
      res => {
        this.spinner.hide();
        var message = res.message;
        this.snackBar.open(message, 'Dismiss', {
          verticalPosition: 'top',
          horizontalPosition: 'right',
          duration: 5000
        });
        this.getaccessories();
        window.location.reload();
      },
      err => {
        console.log(err);
      }
    );
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
