import { Component,OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { Router, NavigationEnd } from '@angular/router';
import { AuthService } from '../auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  showSignup = false;
  angForm!: FormGroup;
  submitted = false;

  constructor(private spinner: NgxSpinnerService,private snackBar: MatSnackBar,private fb: FormBuilder,private authService: AuthService, private router: Router) {
    this.createForm();
  }
  ngOnInit(): void {

    var check=localStorage.getItem('justSignedUp') ;
    this.router.events.subscribe(event => {
      if (check === 'true') {
        // Reload the page only if the user has just signed up
        localStorage.removeItem('justSignedUp');
        window.location.reload();
      }
    });
    var check=localStorage.getItem('justLoggedOut') ;
    this.router.events.subscribe(event => {
      if (check === 'true') {
        // Reload the page only if the user has just signed up
        localStorage.removeItem('justLoggedOut');
        window.location.reload();
      }
    });

    let email=localStorage.getItem('email');
    let token=localStorage.getItem('token');
    if(email && token){
      this.checkauth();
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
              localStorage.setItem('justSignedUp', 'true');

              this.router.navigate(['/myaccount']);
            }
            if(res.message=="Wait for Admin To Get You Verified"){
              localStorage.setItem('justSignedUp', 'true');

              this.router.navigate(['/myaccount']);
            }
             
          },
          err => {
            console.log(err);
          }
        );
    }
  }
  createForm() {
    this.angForm = this.fb.group({
      firstName: ['', Validators.required],
      middleName: [''],
      lastName: [''],
      referredBy: [''],
      docType: ['', Validators.required],
      addressName: ['', Validators.required],
      company: ['', Validators.required],
      address: ['', Validators.required],
      address2: [''],
      city: ['', Validators.required],
      zipcode: ['', Validators.required],
      state: ['', Validators.required],
      phone: ['', Validators.required],
      gst: [''],
      email: ['', Validators.required],
      password: ['', Validators.required],
      confirmPassword: ['', Validators.required]
    }, { validator: this.confirmPasswordValidator() });
  }
  
  get f() { return this.angForm.controls; }
  
  confirmPasswordValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const password = control.get('password');
      const confirmPassword = control.get('confirmPassword');
  
      if (password && confirmPassword && password.value !== confirmPassword.value) {
        return { confirmPasswordValidator: true };
      } else {
        return null;
      }
    };
  }
  
  get confirmPassword(): AbstractControl | null {
    return this.angForm.get('confirmPassword') ?? null;
  }
  
  // /form: NgForm
 
  signup() {
    this.spinner.show();

    this.submitted = true;
    if (this.angForm.invalid) {
      return;
    }

    this.authService.signup(this.angForm.value).subscribe(
      res => {
        const token = res.token;
        const email = res.email;
        localStorage.setItem('token', token);
        localStorage.setItem('email', email);
        localStorage.setItem('justSignedUp', 'true');
        this.spinner.hide();
        // Navigate to myaccount page
        this.router.navigate(['/myaccount']).then(() => {
          // Show the success message after the page is navigated
          this.snackBar.open('Registration Successful', 'Dismiss', {
            verticalPosition: 'top',
            horizontalPosition: 'right',
            duration: 5000
          });
        });
    
      },
      err => {
        // If signup fails, log the error
        console.log(err);
      }
    );
  }

  getlogin(){
    this.showSignup=false;
  }
  getregisterform(){
    this.showSignup=true;
  }

  login(value: { email: string, password: string }) {
    this.spinner.show();
    this.authService.login(value)
      .subscribe(
        res => {
          const error = res.error;
          const token = res.token;
          const email = res.email;
          const message = res.message;
          if(error===false){
          localStorage.setItem('token', token);
          localStorage.setItem('email', email);
        
          localStorage.setItem('justSignedUp', 'true');
         
          this.router.navigate(['/myaccount']).then(() => {
            // Show the success message after the page is navigated
            this.snackBar.open(message, 'Dismiss', {
              verticalPosition: 'top',
              horizontalPosition: 'right',
              duration: 5000
            });
            this.spinner.hide();
          });
        }else{
         
          this.snackBar.open(message, 'Dismiss', {
            verticalPosition: 'top',
            horizontalPosition: 'right',
            duration: 5000
          });
          this.spinner.hide();
        }
        },
        err => {
          console.log(err);
        }
      );
  }
}
