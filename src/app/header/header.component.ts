import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit{

  appHeader:String|null='';

  constructor(private authService:AuthService){}

  ngOnInit(){
    this.appHeader=this.authService.shopName;
    console.log(this.appHeader);
  }
  logout(){
    this.authService.logout();
  }
}
