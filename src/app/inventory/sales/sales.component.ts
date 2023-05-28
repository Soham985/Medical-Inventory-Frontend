import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { SalesBill } from 'src/app/models/sales-bill.model';
import { InventoryService } from '../inventory.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sales',
  templateUrl: './sales.component.html',
  styleUrls: ['./sales.component.css']
})
export class SalesComponent implements OnInit{
  isLoading:boolean = false;
  billNo:string='';
  patientName:string='';
  startDate: Date|null=null;
  endDate: Date|null=null;
  salesBillList:SalesBill[]=[];
  displayList!:MatTableDataSource<SalesBill>;
  displayColumns:string[]=['billNo', 'patient', 'doctor','date', 'total','actions'];

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  
  constructor(private inventoryService:InventoryService,private router: Router){}

  ngOnInit(){
    this.searchBills();
  }

  searchBills(){
    this.isLoading=true;
    this.inventoryService.getSalesBill(this.billNo,this.patientName,this.startDate,this.endDate).subscribe(response=>{
      this.salesBillList=response.body;
      this.displayList=new MatTableDataSource(this.salesBillList);
      this.displayList.paginator=this.paginator;
    })
    this.isLoading=false;
  }

  deleteRow(row: SalesBill) {
    this.isLoading=true;
    console.log(row);
    this.inventoryService.deleteSalesBill(row.billNo).subscribe(response=>{
      if(response){
        this.salesBillList=this.salesBillList.filter((bill)=>bill.billNo!=row.billNo);
        this.displayList=new MatTableDataSource(this.salesBillList);
        this.displayList.paginator = this.paginator;
      }
    })
    this.isLoading=false;
  }

  openBill(billId: string){
    this.router.navigate(['/bill',billId])
  }
}
