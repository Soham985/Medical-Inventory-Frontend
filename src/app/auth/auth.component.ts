import {  Component} from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from './auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css']
})
export class AuthComponent{
  isLoading:boolean = false;
  currentState:string = 'Login';
  registerError:boolean = false;
  loginError:boolean|void = false;
  constructor(private authService:AuthService){}

  changeAuth(){
    this.registerError = false;
    this.loginError = false;
    this.currentState = (this.currentState=='Login')?'Signup':'Login';
  }
  
  onSubmit(form:NgForm){
   if(form.invalid){
    return;
   }

    this.registerError = false;
    this.loginError = false;

   if(this.currentState=='Login'){
    this.loginError=this.authService.login(form.value.email,form.value.password);
   }
   else{
    this.registerError=this.authService.createUser(form.value.email,form.value.password,form.value.shopName,form.value.address);
    if(!this.registerError){
        this.changeAuth();
    }
   }

   form.resetForm();
   
  }
}
