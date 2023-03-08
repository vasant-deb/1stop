
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

  product: any = {quantity: 0};
  quantity=0;
  pagename:string| null = null;
    constructor(private sanitizer: DomSanitizer,private spinner: NgxSpinnerService,private router: Router,private authService: AuthService,private route: ActivatedRoute) { }
  
    ngOnInit() {
     
      this.slug = this.route.snapshot.paramMap.get('slug');
      // console.log('Slug parameter:', this.slug);
      if(this.slug){
      this.getcategories();
      }
    }
    getcategories() {
      this.slug = this.route.snapshot.paramMap.get('slug');
      this.spinner.show();
      this.authService.getProduct(this.slug)
        .subscribe(
          res => {
            this.spinner.hide();
            if (res === null) {
              // handle null case here
            } else {
              this.pagename = res.stats.name;
             this.quantity=0;
              this.product =res.stats;
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
    
    increment() {
      
      if (isNaN(this.product.quantity)) {
        this.product.quantity = 0;
      }
      this.product.quantity += 1;
    }
    
    decrement() {
      if (this.product.quantity > 0) {
        this.product.quantity -= 1;
      }
    }
}
