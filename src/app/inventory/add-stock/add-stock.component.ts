import { Component, ElementRef, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTable } from '@angular/material/table';
import { PurchaseBill } from 'src/app/models/purchase-bill.model';
import { AlertDialogComponent } from 'src/app/shared/alert-dialog/alert-dialog.component';
import { InventoryService } from '../inventory.service';
import { response } from 'express';
import { Medicine } from 'src/app/models/medicine.model';
import { AuthService } from 'src/app/auth/auth.service';

@Component({
  selector: 'app-add-stock',
  templateUrl: './add-stock.component.html',
  styleUrls: ['./add-stock.component.css']
})
export class AddStockComponent {
  medicine: Medicine[] = [];
  distributor:string='';
  billNo:string='';
  purchaseDate:string='';
  discount:number=0;
  total:number = 0;
  sgst:number=0;
  cgst:number=0;
  isSaving:boolean=false;
  userId:string='';
  packOptions:string[]=['S','Ca','ML','G']
  error:boolean=true;
  maxDate: Date=new Date();
  @ViewChild('myTable') table!: ElementRef;
  constructor(private dialog:MatDialog,private inventoryService:InventoryService,private authService:AuthService){}

  ngOnInit(){
    this.userId=this.authService.userId;
  }
  addRow() {
    this.medicine.push({
      id:'',
      userId: this.userId,
      billId: '',
      name: '',
      batch: '',
      expiry: '',
      rate: 0,
      mrp:0,
      qty:0,
      pckVal:0,
      pck:'S',
      stock:0,
      cgst:0,
      sgst:0,
      disc:0,
      net:0,
    });
  }

  deleteRow(row: Medicine) {
    const index = this.medicine.indexOf(row);
    if (index >= 0) {
      this.total-=this.medicine[index].net;
      this.medicine.splice(index, 1);
      this.table.nativeElement.renderRows();
    }
  }

  calculateCost(row:Medicine){
    const index = this.medicine.indexOf(row);
    if(row.qty>0 && row.rate>0){
      let netAmount = row.qty*row.rate;
      this.medicine[index].net=Number(netAmount.toFixed(2));
    }
  }

  saveStock(){
    this.isSaving=true;
    var message = '';
    var messageType = '';
    this.total=0;
    if(this.distributor=='' || this.billNo=='' || this.purchaseDate=='' || this.discount<0){
      this.error=true;
      message = 'Enter All Required Fields';
      messageType = 'Error Occurred';
    }
    else{
      for(let item of this.medicine){
        const index=this.medicine.indexOf(item);
        this.medicine[index].billId=this.billNo;
        if(item.batch=='' || item.name=='' || item.expiry=='' || item.qty<=0 || item.rate<=0 || item.mrp<=0 || item.pckVal<=0 || item.cgst<0 || item.sgst<0){
          this.error=true;
          message = 'Enter All Medicine Data';
          messageType = 'Error Occurred';
          break;
        }
        if(!this.validateExpiry(item.expiry)){
          this.error=true;
          message = 'Invalid Expiry Date';
          messageType = 'Error Occurred';
          break;
        }
        this.medicine[index].stock=this.medicine[index].qty*((this.medicine[index].pck=='S' || this.medicine[index].pck=='Ca')?this.medicine[index].pckVal:1);
        this.total+=(this.medicine[index].net)+(this.medicine[index].net*this.medicine[index].sgst)/100+(this.medicine[index].net*this.medicine[index].cgst)/100;
      }
      this.total-=this.discount;
      this.total = Math.round(this.total);
    }
    if(this.error && messageType!=''){
      this.isSaving=false;
      this.openDialog(messageType,message);
    }
    else{
      this.error=false;
    }
    this.isSaving=false;
  }

  addStock(){
    if(!this.error){
      const purchaseBill:PurchaseBill={distributor:this.distributor,billNo:this.billNo,purchaseDate:this.purchaseDate,discount:this.discount,total:this.total-this.discount,medicines:this.medicine};

      this.inventoryService.addPurchaseBill(purchaseBill).subscribe(response=>{
        if(response.status==201){
          this.inventoryService.addStock(this.medicine).subscribe(response=>{
            if(response.status==201){
              this.openDialog('Success','Stocks added successfully');
              this.resetValues();
            }
            else{
              this.openDialog('Error Occurred','Error in adding stocks');
            }
          },error=>{
            this.openDialog('Error Occurred','Error in adding stocks');
          })
        }
        else{
          this.openDialog('Error Occurred','Error in adding bill');
        }
      },error=>{
        this.openDialog('Error Occurred','Error in adding bill');
      });
      
    }
  }

  openDialog(msgType:string,msg:string){
    this.dialog.open(AlertDialogComponent,{data:{msgType:msgType,msg:msg}});
  }

  myFilter = (d: Date | null): boolean => {
    if(d!=null){
      return d<= new Date();
    }
    return true;
  };

  validateExpiry(date:string){
    const regex = /^(0[1-9]|1[0-2])\/2[3-9]|[3-9][0-9]/;
    if (regex.test(date)) {
      return true;
    }
    return false;
  }

  resetValues(){
    this.distributor = '';
    this.billNo = '';
    this.purchaseDate = '';
    this.discount = 0;
    this.medicine = [{id:'',userId: this.userId,billId: '',name: '',batch: '',expiry: '',rate: 0,mrp:0,qty:0,pckVal:0,pck:'S',stock:0,cgst:0,sgst:0,disc:0,net:0,}];
    this.total = 0;
  }
}


