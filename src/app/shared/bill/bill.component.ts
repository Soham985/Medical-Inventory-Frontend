import { Component } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { AuthService } from 'src/app/auth/auth.service';
import { InventoryService } from 'src/app/inventory/inventory.service';
import { Medicine } from 'src/app/models/medicine.model';

@Component({
  selector: 'app-bill',
  templateUrl: './bill.component.html',
  styleUrls: ['./bill.component.css']
})
export class BillComponent {

  displayList:Medicine[]=[];
  displayColumns:string[]=['name','batch','expiry','mrp','qty','amt'];
  billNo!:string;
  subTotal:number=0.00;
  discount:number=0.00;
  finalAmount:number=0.00;
  billDate!:Date;
  shopName:string|null='';
  address:string|null='';
  constructor(private route:ActivatedRoute,private inventoryService:InventoryService,private authService:AuthService){}

  ngOnInit(){
    console.log("entered");
    this.route.paramMap.subscribe((param:ParamMap)=>{
      if(param.has('id')){
        const id=param.get('id');
        if(id){
          this.inventoryService.getBill(id).subscribe((response)=>{
            this.billNo = response.body.billNo? response.body.billNo:'';
            this.displayList=response.body.medicines;
            this.subTotal=response.body.total;
            this.discount=response.body.discount;
            this.finalAmount=this.subTotal-this.discount;
            this.billDate=new Date(response.body.date);
            this.shopName=this.authService.shopName;
            this.address=this.authService.address;
          })
        }
      }
    })
  }

  print(){
    window.print();
  }
}
