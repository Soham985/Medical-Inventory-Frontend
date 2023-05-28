import { Component, OnInit, ViewChild } from '@angular/core';
import { InventoryService } from '../inventory.service';
import { PurchaseBill } from 'src/app/models/purchase-bill.model';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { PurchaseBillComponent } from 'src/app/shared/purchase-bill/purchase-bill.component';

@Component({
  selector: 'app-purchase',
  templateUrl: './purchase.component.html',
  styleUrls: ['./purchase.component.css']
})
export class PurchaseComponent implements OnInit{

  isLoading:boolean = false;
  purchaseBillList:PurchaseBill[]=[];
  displayList!:MatTableDataSource<PurchaseBill>;
  displayColumns:string[]=['billNo', 'distributor', 'date', 'discount', 'total','action'];
  distributorName:string='';
  startDate: Date|null=null;
  endDate: Date|null=null;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  
  constructor(private inventoryService:InventoryService,private dialog:MatDialog){}

  ngOnInit(){
    this.searchBills();
  }

  searchBills(){
    this.isLoading=true;
    this.inventoryService.getPurchaseBill(this.distributorName,this.startDate,this.endDate).subscribe(response=>{
      this.purchaseBillList=response.body;
      console.log(response);
      if(this.purchaseBillList.length>0){
        this.displayList=new MatTableDataSource(this.purchaseBillList);
        this.displayList.paginator = this.paginator;
      }
    })
    this.isLoading=false;
  }

  deleteRow(row: PurchaseBill) {
    this.isLoading=true;
    this.inventoryService.deletePurchaseBill(row.billNo).subscribe(response=>{
      this.purchaseBillList=this.purchaseBillList.filter((bill)=>bill.billNo!=row.billNo);
      this.displayList=new MatTableDataSource(this.purchaseBillList);
      this.displayList.paginator = this.paginator;
    })
    this.isLoading=false;
  }

  openBill(row:PurchaseBill){
    this.dialog.open(PurchaseBillComponent,{data:{medicineList:row.medicines}});
  }
}
