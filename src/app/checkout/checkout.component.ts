import { Component, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute,Router} from '@angular/router';

import { AuthService } from '../auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent {
  @ViewChild('myTextarea') myTextarea!:ElementRef;

  constructor(private fb: FormBuilder,private snackBar: MatSnackBar,private spinner: NgxSpinnerService,private router: Router,private authService: AuthService,private route: ActivatedRoute) { }
  modalshow=false;
  subtotal :number=0.00;
   tax :number=0.00;
  total :number=0.00;
  shippingId:number=0;
  billingId:number=0;
billings:any;
  error=false;
  billingview=false;
  shippingview=true;
  shipping:any;
  confirmview=false;
  pagename:string='Shipping';
  shipType:string='';
  auth=false;
  statsData :any;
  shiptax:string='TBD Later';
  editAddressForm!: FormGroup;
  addresses:any[]=[];
  ngOnInit(){
    let email=localStorage.getItem('email');
    let token=localStorage.getItem('token');
    localStorage.setItem('shippingId', "0");
    localStorage.setItem('billingId', "0");

    if(email && token){
      this.checkauth();
      this.cartitems();
      this.getaddress();
    }else{
      this.router.navigate(['']);
    }
    var check=localStorage.getItem('justSignedUp') ;
    this.router.events.subscribe(event => {
      if (check === 'true') {
        // Reload the page only if the user has just signed up
        localStorage.removeItem('justSignedUp');
        location.reload();
      }
    });

    this.editAddressForm = this.fb.group({
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
        }
      },
      err => {
        console.log(err);
      }
    );
    }
  billing(pagename:string){
    var currentpage=pagename;
    if(currentpage=="Shipping"){
    const shippingId = localStorage.getItem('shippingId');
    const shippingType = localStorage.getItem('shippingType');
    if(shippingId !="0" && shippingType !="" && shippingType !=undefined && shippingId !=undefined){
      this.shippingview=false;
      this.billingview=true;
      this.confirmview=false;
      this.pagename='Billing';
      window.scrollTo(0, 0);
    }else if(shippingType =="Pickup In Person"){
      this.shippingview=false;
      this.billingview=true;
      this.confirmview=false;
      this.pagename='Billing';
      window.scrollTo(0, 0);

    }else{
    this.error=true;
    this.snackBar.open('Select Shipping Type or Shipping Address', 'Dismiss', {
      verticalPosition: 'top',
      horizontalPosition: 'right',
      duration: 10000
    });
    }
  }
  else if(currentpage=="Billing"){
    let billingId = localStorage.getItem('billingId');
    const shippingType = localStorage.getItem('shippingType');
    if(billingId !="0" && billingId !=undefined){
      this.shippingview=false;
      this.billingview=false;
       this.confirmview=true;
       this.pagename='Confirm';
       //confirm view
       this.spinner.show();
       let shippingId = localStorage.getItem('shippingId');
       if(shippingType=="Pickup In Person"){
        shippingId=localStorage.getItem('billingId');
        if(shippingId!=null){
        localStorage.setItem('shippingId', shippingId);
      }
      }
       const billingId = localStorage.getItem('billingId');
       //get value of textarea name 'notes'
       const notesValue = this.myTextarea.nativeElement.value;
       localStorage.setItem('notes', String(notesValue));
       if (shippingId && billingId) {
         this.authService.checkconfirm({ shippingId, billingId })
           .subscribe(
             res => {
               const error = res.error;
               this.statsData =res.stats;
               this.shipping=this.statsData.shipping;
               this.billings=this.statsData.billing;
               this.spinner.hide();
             },
             err => {
               console.log(err);
             }
           );
       }
       //end
       window.scrollTo(0, 0);
    }else{
      this.error=true;
      window.scrollTo(0, 0);
      this.snackBar.open('Select Billing Address', 'Dismiss', {
        verticalPosition: 'top',
        horizontalPosition: 'right',
        duration: 10000
      });
    }
  }
  else{
    this.error=true;
  }
  }




  orderplace(){
    this.spinner.show();
    let email = localStorage.getItem('email');
    let token = localStorage.getItem('token');
    const shippingId = localStorage.getItem('shippingId');
    const billingId = localStorage.getItem('billingId');
    const shippingType = localStorage.getItem('shippingType');
    let notes=localStorage.getItem('notes');
    if(!notes){
       notes='';
    }
    if (shippingId && billingId && email && token && shippingType) {
      this.authService.checkout({ shippingId, billingId,email,token,notes,shippingType })
      .subscribe(
        res => {
          const error = res.error;
          const message=res.message;
          this.snackBar.open(message, 'Dismiss', {
            verticalPosition: 'top',
            horizontalPosition: 'right',
            duration: 10000
          });
         if(error===false){
          localStorage.setItem('justSignedUp','true') ;

          this.router.navigate(['myaccount']);
         }
         this.spinner.hide();
        },
        err => {
          console.log(err);
        }
      );

    }else{
      this.snackBar.open('Something Went Wrong! Please Try Again Later', 'Dismiss', {
        verticalPosition: 'top',
        horizontalPosition: 'right',
        duration: 10000
      });
    }
    
  }
  getaddress(){
    const token = localStorage.getItem('token');
    const email = localStorage.getItem('email');
    
    this.authService.getAddress(token,email)
    .subscribe(
      res => {
        if (res === null) {
          // handle null case here
        } else {
          this.addresses = res.stats;   
        }
      },
      err => {
        console.log(err);
      }
    );
  }
  close(){
    this.modalshow=false;
  }
  createnew(){
    this.modalshow=true;
  }
  shippingaddress(addressId:number){
    if (addressId) {
      localStorage.setItem('shippingId', String(addressId));
      this.shippingId=addressId;
    }
  }
  billingaddress(addressId:number){
    if (addressId) {
      localStorage.setItem('billingId', String(addressId));
      this.billingId=addressId;
    }
  }
  shippingType(shippingtype:string){
    if (shippingtype) {
      localStorage.setItem('shippingType',shippingtype);
      this.shipType=shippingtype;
      if(shippingtype=='Standard Shipping'){
        this.shiptax='TBD Later';
      }else{
        this.shiptax='0.00';
      }
    }
  }

  onSave(): void {
   
    this.modalshow=false;
    this.spinner.show();
   
      const addedAddress = this.editAddressForm.value;
      
      // Code to update the address in the database
      this.authService.addaddress({addedAddress})
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
            window.location.reload();
         
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



}
