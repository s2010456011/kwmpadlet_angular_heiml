import { Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Router} from "@angular/router";
import {AuthenticationService} from "../shared/authentication.service";
import {ToastrService} from "ngx-toastr";

interface Response{
  access_token: string;
}

@Component({
  selector: 'bs-login',
  templateUrl: './login.component.html',
  styles: [
  ]
})
export class LoginComponent implements OnInit{
  loginForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthenticationService,
    private toastr:ToastrService

  ) {

    this.loginForm = this.fb.group({});
  }

  ngOnInit():void {
    this.loginForm = this.fb.group({
      email:["", [Validators.required, Validators.email]],
      password:["", [Validators.required]],
    });
  }

 login(){
   const val = this.loginForm.value;
  if (val.email && val.password){
    this.authService.login(val.email, val.password).subscribe((res: any) => {
      console.log(res);
      this.authService.setSessionStorage((res as Response).access_token);
      this.router.navigateByUrl("/");
      this.toastr.success("Erfolgreich angemeldet", "Willkommen");
    })
  };

}

isLoggedIn(){
  return this.authService.isLoggedIn();
}

logout(){
  this.authService.logout();
  this.toastr.success("Erfolgreich abgemeldet", "Auf Wiedersehen!");
}


}
