import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthModel } from './auth.model';
import { Subject } from 'rxjs';
import { Router } from '@angular/router';

const BACKEND_URL = "https://medical-inventory.onrender.com/api"+"/user";

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  token:string='';
  userId:string='';
  shopName:string|null='';
  address:string|null='';
  isAuthenticated:boolean = false;
  authStatusListner = new Subject<boolean>();

  constructor(private http:HttpClient,private router:Router) { }

  createUser(email:string,password:string,shopName:string,address:string):boolean{
    const authData: AuthModel = {email:email,password:password,shopName:shopName,address:address}
    this.http.post(BACKEND_URL+'/signup',authData).subscribe(response=>{
      console.log(response);
      return false;
    },error=>{
      console.log(error);
      this.authStatusListner.next(false);
      return true;
    });
    return false;
  }

  login(email:string,password:string){
    const authData:AuthModel = {email:email,password:password};
    this.http.post<{token:string,userId:string,shopName:string,address:string}>(BACKEND_URL+"/login",authData).subscribe((response)=>{
      //extract token
      this.token = response.token;
      if(this.token){
        this.isAuthenticated = true;
        this.userId = response.userId;
        this.shopName = response.shopName;
        this.address = response.address;
        this.saveAuthData(this.token,this.userId,this.shopName,this.address);
        this.authStatusListner.next(true);
        this.router.navigate(['/inventory/stocks'])
      }
    },(error)=>{
      this.authStatusListner.next(false);
      return true;
    });
    return false;
  }

  logout(){
    this.token = '';
    this.isAuthenticated = false;
    this.userId = '';
    this.authStatusListner.next(false);
    this.clearAuthData();
    this.router.navigate(['']);
  }

  saveAuthData(token:string,userId:string,shopName:string,address:string){
    localStorage.setItem('token',token);
    localStorage.setItem('userId',userId);
    localStorage.setItem('shopName',shopName);
    localStorage.setItem('address',address);
  }

  clearAuthData(){
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
  }

  autoAuthLogin(){
    const authInformation=this.getAuthData();
    if(!authInformation){
      return;
    }
    
    this.token=authInformation!.token;
    this.isAuthenticated = true;
    this.userId = authInformation.userId;
    this.shopName = authInformation.shopName;
    console.log(this.shopName);
    this.address = authInformation.address;
    this.authStatusListner.next(true);
    this.router.navigate(['/inventory/stocks']);
  }

  private getAuthData(){
    const token = localStorage.getItem('token');
    const userId = localStorage.getItem('userId');
    const shopName = localStorage.getItem('shopName');
    const address = localStorage.getItem('address');
    if(!token || !userId){
      return null;
    }
    return{
      token:token,
      userId:userId,
      shopName: shopName,
      address: address
    }
  }
}


