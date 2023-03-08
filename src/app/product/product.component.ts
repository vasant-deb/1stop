
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute,Router} from '@angular/router';

import { AuthService } from '../auth.service';
import { DomSanitizer } from '@angular/platform-browser';

import { NgxSpinnerService } from 'ngx-spinner';

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
  product: any = {};
  quan:number=0;
  pagename:string| null = null;
    constructor(private sanitizer: DomSanitizer,private spinner: NgxSpinnerService,private router: Router,private authService: AuthService,private route: ActivatedRoute) { }
  
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
            
              this.product =res.stats.product;
              this.quan=this.product.quantity;
              if(this.product.description!=null){
              this.sanitizedHtml = this.sanitizer.bypassSecurityTrustHtml(this.product.description);
              }
              console.log(this.categories);
            }
          },
          err => {
            console.log(err);
          }
        );
    }
    
    increment(quantity:number) {
      if (isNaN(this.product.quantity)) {
        this.product.quantity = 0;
      }
      this.product.quantity += 1;
      this.quan = this.product.quantity; // update the input value
    }
    
    decrement(quantity:number) {
      if (isNaN(this.product.quantity)) {
        this.product.quantity = 0;
      }
      if (this.product.quantity > 0) {
        this.product.quantity -= 1;
        this.quan = this.product.quantity; // update the input value
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
