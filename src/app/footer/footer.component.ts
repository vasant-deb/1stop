import { Component,OnInit } from '@angular/core';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent {
constructor(private authService: AuthService){}
auth=false;
ngOnInit(){
  let email = localStorage.getItem('email');
  let token = localStorage.getItem('token');
  if (email && token) {
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
