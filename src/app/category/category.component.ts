// category.component.ts
import { Component, OnInit,ElementRef, ViewChild } from '@angular/core';
import { ActivatedRoute,Router} from '@angular/router';

import { AuthService } from '../auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';

import { NgxSpinnerService } from 'ngx-spinner';
@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.css']
})
export class CategoryComponent {

slug: string | null = null;
categories:any[]=[];
products:any[]=[];
cartQuantity: {[key: number]: number} = {};

auth=false;
pagename:string| null = null;
  constructor(private snackBar: MatSnackBar,private spinner: NgxSpinnerService,private router: Router,private authService: AuthService,private route: ActivatedRoute) { }

  ngOnInit() {
    this.spinner.show();
    this.slug = this.route.snapshot.paramMap.get('slug');
  
    if(this.slug){
    this.getcategories();
    }
    let email=localStorage.getItem('email');
    let token=localStorage.getItem('token');
    if(email && token){
      this.checkauth();
    }
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
increment(productId: number) {
 
    const product = this.products.find(p => p.id === productId);
    if (product) {
        const quantity = parseInt(product.quantity, 10) || 0; // convert to integer and handle NaN
        product.quantity = quantity + 1;
    }
   
}

decrement(productId: number) {
 
    const product = this.products.find(p => p.id === productId);
    if (product) {
        const quantity = parseInt(product.quantity, 10) || 0; // convert to integer and handle NaN
        if (quantity > 0) {
            product.quantity = quantity - 1;
          
        }
    }
}
getcategories(){
 

  const token = localStorage.getItem('token');
  const email = localStorage.getItem('email');
  this.slug = this.route.snapshot.paramMap.get('slug');
 
  this.authService.getCategory(this.slug,token,email)
  .subscribe(
    res => {
     

      if (res === null) {
        // handle null case here
      } else {
        
        this.pagename=res.stats.name;
        if (Array.isArray(res.stats.subcategories)) {
        this.categories = res.stats.subcategories;
        }
        if(Array.isArray(res.prod)){
          this.products = res.prod;
          this.products.forEach(product => {
           
            this.cartQuantity[product.id] = product.quantity;
            product.prevQuantity = product.quantity;
            console.log(product.prevQuantity);
          });

        }
     
      }
    },
    err => {
      console.log(err);
    }
  );
}

onAddAllToCart() {
  this.spinner.show();
  const cartItems: any[] = [];
  this.products.forEach(product => {
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
        this.getcategories();
        window.location.reload();
      },
      err => {
        console.log(err);
      }
    );
  }
}



}


