// category.component.ts
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute,Router} from '@angular/router';

import { AuthService } from '../auth.service';

import { NgxSpinnerService } from 'ngx-spinner';
@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.css']
})
export class CategoryComponent implements OnInit {
  slug: string | null = null;
categories:any[]=[];
products:any[]=[];
auth=false;
pagename:string| null = null;
  constructor(private spinner: NgxSpinnerService,private router: Router,private authService: AuthService,private route: ActivatedRoute) { }

  ngOnInit() {
 
    this.slug = this.route.snapshot.paramMap.get('slug');
  
    if(this.slug){
    this.getcategories();
    }
    let email=localStorage.getItem('email');
    let token=localStorage.getItem('token');
    if(email && token){
      this.checkauth();
    }
    
  }
  getcategories(){
    this.spinner.show();

    const token = localStorage.getItem('token');

    this.slug = this.route.snapshot.paramMap.get('slug');
   
    this.authService.getCategory(this.slug,token)
    .subscribe(
      res => {
        this.spinner.hide();

        if (res === null) {
          // handle null case here
        } else {
          
          this.pagename=res.stats.name;
          if (Array.isArray(res.stats.subcategories)) {
          this.categories = res.stats.subcategories;
          }
          if(Array.isArray(res.prod)){
            this.products = res.prod;
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

}
