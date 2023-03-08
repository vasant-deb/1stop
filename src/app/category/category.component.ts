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
pagename:string| null = null;
  constructor(private spinner: NgxSpinnerService,private router: Router,private authService: AuthService,private route: ActivatedRoute) { }

  ngOnInit() {
 
    this.slug = this.route.snapshot.paramMap.get('slug');
  
    if(this.slug){
    this.getcategories();
    }
  }
  getcategories(){
    this.spinner.show();

    this.slug = this.route.snapshot.paramMap.get('slug');
   
    this.authService.getCategory(this.slug)
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
}
