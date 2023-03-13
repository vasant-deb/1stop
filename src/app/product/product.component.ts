
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute,Router} from '@angular/router';

import { AuthService } from '../auth.service';
import { DomSanitizer } from '@angular/platform-browser';

import { NgxSpinnerService } from 'ngx-spinner';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css']
})
export class ProductComponent {
  slug: string | null = null;
  categories:any[]=[];
  products:any[]=[];
  sanitizedHtml: any;
  auth=false;
  cartQuantity: {[key: number]: number} = {};
message:String='';
  product: any = {};
  quan:number=0;
  pagename:string| null = null;
    constructor(private snackBar: MatSnackBar,private sanitizer: DomSanitizer,private spinner: NgxSpinnerService,private router: Router,private authService: AuthService,private route: ActivatedRoute) { }
  
    ngOnInit() {
     
      this.slug = this.route.snapshot.paramMap.get('slug');
      // console.log('Slug parameter:', this.slug);
      if(this.slug){
      this.getcategories();
      }
      let email=localStorage.getItem('email');
    let token=localStorage.getItem('token');
    if(email && token){
      this.checkauth();
    }
    }

getcategories() {
  this.slug = this.route.snapshot.paramMap.get('slug');
  this.spinner.show();
  const token = localStorage.getItem('token');

  this.authService.getProduct(this.slug,token)
    .subscribe(
      res => {
        this.spinner.hide();
        if (res === null) {
          // handle null case here
        } else {
          this.pagename = res.stats.product.name;
          this.product = res.stats.product;
          this.quan = this.product.quantity;
          this.cartQuantity[this.product.id] = this.product.quantity;
          this.product.prevQuantity = this.product.quantity;

          if(this.product.description!=null){
            this.sanitizedHtml = this.sanitizer.bypassSecurityTrustHtml(this.product.description);
          }

          // populate the products array with the fetched product data
          this.products = [this.product];
        }
      },
      err => {
        console.log(err);
      }
    );
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
               }else{
                this.message=res.message;
               }
            },
            err => {
              console.log(err);
            }
          );
      }
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
