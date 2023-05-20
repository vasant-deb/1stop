import { Component,OnInit } from '@angular/core';
import { ActivatedRoute,Router} from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { AuthService } from '../auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';

import { NgxSpinnerService } from 'ngx-spinner';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-myaccount',
  templateUrl: './myaccount.component.html',
  styleUrls: ['./myaccount.component.css']
})
export class MyaccountComponent implements OnInit {
  //address modal
  editAddressForm!: FormGroup;
  changePasswordForm!: FormGroup;

  showEditAddressModal = false;
  selectedAddress: any;
  //end address modal
  constructor(private fb: FormBuilder,private dialog: MatDialog,private snackBar: MatSnackBar,private spinner: NgxSpinnerService,private router: Router,private authService: AuthService,private route: ActivatedRoute) { }
  pagestate="Order History";
  profileview=false;
  orderview=true;
  userdetails:any;
  addaddress=false;
  addressview=false;
  orders:any[]=[];
  addresses:any[]=[];
  addAddressForm!: FormGroup;

  auth=false;
  message:string='';
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

      this.changePasswordForm = this.fb.group({
        token:[token, Validators.required],
        email: [email, Validators.required],
        password: ['', Validators.required]
      });
      
    }else{
      this.router.navigate(['']);
    }

    this.addAddressForm = this.fb.group({
      id:['', Validators.required],
      name: ['', Validators.required],
      company: ['', Validators.required],
      street1: ['', Validators.required],
      street2: [''],
      city: ['', Validators.required],
      state: ['', Validators.required],
      postalcode: ['', Validators.required],
      phone: ['', Validators.required],
      user_id:[email,Validators.required]
    });


  }
  addAddress(){
this.addaddress=true;
  }
  onAdd(): void {
   
   
    this.spinner.show();
   
      const addedAddress = this.addAddressForm.value;
      
      // Code to update the address in the database
      this.authService.addaddress({addedAddress})
      .subscribe(
        res => {
          this.spinner.hide();
          const error = res.error;
          const message=res.message;
          this.addaddress=false;
          if(error === false){
           
            this.snackBar.open(message, 'Dismiss', {
              verticalPosition: 'top',
              horizontalPosition: 'right',
              duration: 5000
            });
            this.checkauth();
         
           }else{
            this.snackBar.open(message, 'Dismiss', {
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
      // ...
    
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
              this.userdetails=res.stats;
              this.addresses=res.addresses;
              if(this.addresses){
                this.editAddressForm = this.fb.group({
                  id:['', Validators.required],
                  name: ['', Validators.required],
                  company: ['', Validators.required],
                  street1: ['', Validators.required],
                  street2: [''],
                  city: ['', Validators.required],
                  state: ['', Validators.required],
                  postalcode: ['', Validators.required],
                  phone: ['', Validators.required]
                });
              }
              
             }
            
             if(res.message!=""){
              this.message=res.message;
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
    localStorage.setItem('justSignedUp', 'true');
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
    this.pagestate='Change Password';
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
   // Method to open the edit address modal
   openEditAddressModal(address: any): void {
    this.selectedAddress = address;
    this.editAddressForm.patchValue(address);
    this.showEditAddressModal = true;
  }

  // Method to close the edit address modal
  onCancel(): void {
    this.showEditAddressModal = false;
  }
  onChange(): void {
    this.spinner.show();
    if (this.changePasswordForm.valid) {
      const change= this.changePasswordForm.value;
      this.authService.updatepassword({change})
      .subscribe(
        res => {
          this.spinner.hide();
          const error = res.error;
          const message=res.message;
          if(error === false){
           
           
            localStorage.clear();
            localStorage.setItem('justLoggedOut', 'true');

            this.router.navigate(['login']).then(() => {
              // Show the success message after the page is navigated
              this.snackBar.open('Password Changed Successfully! Login Again', 'Dismiss', {
                verticalPosition: 'top',
                horizontalPosition: 'right',
                duration: 5000
              });
            });
           }else{
            this.snackBar.open(message, 'Dismiss', {
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
  // Method to save the edited address
  onSave(): void {
    this.spinner.show();
  
      const updatedAddress = this.editAddressForm.value;
      
      // Code to update the address in the database
      this.authService.updateaddress({updatedAddress})
      .subscribe(
        res => {
          this.spinner.hide();
          const error = res.error;
          const message=res.message;
          if(error === false){
           
            this.snackBar.open(message, 'Dismiss', {
              verticalPosition: 'top',
              horizontalPosition: 'right',
              duration: 5000
            });
           this.checkauth();
           }else{
            this.snackBar.open(message, 'Dismiss', {
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
      // ...
      // Hide the modal
      this.showEditAddressModal = false;
    }
 
}
