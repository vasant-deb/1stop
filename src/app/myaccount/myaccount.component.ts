import { Component,OnInit } from '@angular/core';
import { ActivatedRoute,Router} from '@angular/router';

import { AuthService } from '../auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';

import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-myaccount',
  templateUrl: './myaccount.component.html',
  styleUrls: ['./myaccount.component.css']
})
export class MyaccountComponent implements OnInit {
  constructor(private snackBar: MatSnackBar,private spinner: NgxSpinnerService,private router: Router,private authService: AuthService,private route: ActivatedRoute) { }
  pagestate="Order History";
  profileview=false;
  orderview=true;
  addressview=false;
  orders:any[]=[];
  auth=false;
  changepasswordview=false;
  ngOnInit(): void {

    var check=localStorage.getItem('justSignedUp') ;
    this.router.events.subscribe(event => {
      if (check === 'true') {
        // Reload the page only if the user has just signed up
        localStorage.removeItem('justSignedUp');
        location.reload();
      }
    });
    let email=localStorage.getItem('email');
    let token=localStorage.getItem('token');
    if(email && token){
      this.checkauth();
      this.orderhistory();
      
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
  orderhistory(){
    let email = localStorage.getItem('email');
    let token = localStorage.getItem('token');
    if (email && token) {
      this.authService.getorderhistory({ email, token })
        .subscribe(
          res => {
            const error = res.error;
            if(error === false){
              this.orders=res.stats;
             }
          },
          err => {
            console.log(err);
          }
        );
    }
  }
  viewOrder(orderId: number) {
    debugger;
    this.router.navigate(['/order', orderId]);
  }
  profile(){
    this.pagestate='Profile';
    this.profileview=true;
    this.orderview=false;
    this.addressview=false;
    this.changepasswordview=false;
  }
  order(){
    this.pagestate='Order History';
    this.orderview=true;
    this.profileview=false;
    this.addressview=false;
    this.changepasswordview=false;
  }
  myaddress(){
    this.pagestate='My Address';
    this.addressview=true;
    this.profileview=false;
    this.orderview=false;
    this.changepasswordview=false;
  }
  changepassword(){
    this.pagestate='Change Address';
    this.changepasswordview=true;
    this.addressview=false;
    this.profileview=false;
    this.orderview=false;
    
  }
  logout() {
 
    localStorage.clear();
    localStorage.setItem('justLoggedOut', 'true');

    this.router.navigate(['']);
  }
}
