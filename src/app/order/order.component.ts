// category.component.ts
import { Component, OnInit,ElementRef, ViewChild } from '@angular/core';
import { ActivatedRoute,Router} from '@angular/router';

import { AuthService } from '../auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';

import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.css']
})
export class OrderComponent implements OnInit {

  orderId: string | null = null;
  orderDetails: any;
  orderItems:any;
  auth=false;
  constructor(private snackBar: MatSnackBar,private spinner: NgxSpinnerService,private router: Router,private authService: AuthService,private route: ActivatedRoute) { }

  ngOnInit() {
  
    // Fetch order details from a service or API using this.orderId
    let email=localStorage.getItem('email');
    let token=localStorage.getItem('token');
    if(email && token){
      this.checkauth();
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
         
              this.getorderdetails();
             }
          },
          err => {
            console.log(err);
          }
        );
    }
  }
  getorderdetails(){
    this.orderId = this.route.snapshot.paramMap.get('id');
    this.authService.getOrderDetails(this.orderId)
  .subscribe(
    res => {
      if (res === null) {
        // handle null case here
      } else {
        this.orderDetails=res.stats;
        this.orderItems=res.items;
        
     
      }
    },
    err => {
      console.log(err);
    }
  );


  }
}
