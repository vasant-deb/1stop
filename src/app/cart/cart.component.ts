import { Component,OnInit } from '@angular/core';
import { ActivatedRoute,Router} from '@angular/router';

import { AuthService } from '../auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';

import { NgxSpinnerService } from 'ngx-spinner';
@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent {


  constructor(private snackBar: MatSnackBar,private spinner: NgxSpinnerService,private router: Router,private authService: AuthService,private route: ActivatedRoute) { }

  subtotal :number=0.00;
   tax :number=0.00;
  total :number=0.00;
  auth=false;
  products:any[]=[];
cartQuantity: {[key: number]: number} = {};

  ngOnInit(){
    let email=localStorage.getItem('email');
    let token=localStorage.getItem('token');
    if(email && token){
      this.checkauth();
      this.cartitems();
    }else{
      this.router.navigate(['']);

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
  cartitems(){
  const token = localStorage.getItem('token');
  const email = localStorage.getItem('email');
  
  this.authService.getCartItems(token,email)
  .subscribe(
    res => {
      if (res === null) {
        // handle null case here
      } else {
        this.subtotal = res.stats.subtotal.toFixed(2);
        this.tax = res.stats.tax.toFixed(2);
        this.total = res.stats.total.toFixed(2);
         
          if(Array.isArray(res.stats.products)){
            this.products = res.stats.products;
            
          this.products.forEach(product => {
           
            this.cartQuantity[product.id] = product.quantity;
            product.prevQuantity = product.quantity;
            console.log(res);
          });
        }
      
     
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
          this.cartitems();
          window.location.reload();
        },
        err => {
          console.log(err);
        }
      );
    }
  }
  deleteProduct(cartId: number) {
    this.spinner.show();
    this.products = this.products.filter(product => product.cart_id !== cartId);
 
    if (cartId) {
      this.authService.deletecart({cartId})
        .subscribe(
          res => {
            const error = res.error;
            if(error===false){
            this.snackBar.open('Cart Item Deleted', 'Dismiss', {
              verticalPosition: 'top',
              horizontalPosition: 'right',
              duration: 5000
            });
            this.cartitems();
            this.spinner.hide();
          }else{
              this.snackBar.open('Failed ! Invalid Id', 'Dismiss', {
              verticalPosition: 'top',
              horizontalPosition: 'right',
              duration: 5000
            });
          }
          },
          err => {
            console.log(err);
          }
        );
    }
  }
  checkout(){
    if(this.total > 0){
    this.router.navigate(['checkout']);
  }else{
    this.snackBar.open('Add Products TO Proceed Further', 'Dismiss', {
      verticalPosition: 'top',
      horizontalPosition: 'right',
      duration: 5000
    });
  }
  }

}
