import { Component, OnInit, ViewChild } from '@angular/core';
import { InventoryService } from '../inventory.service';
import { Medicine } from 'src/app/models/medicine.model';
import { MatTable } from '@angular/material/table';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs/internal/Observable';
import { MatDialog } from '@angular/material/dialog';
import { AlertDialogComponent } from 'src/app/shared/alert-dialog/alert-dialog.component';
import { SalesBill } from 'src/app/models/sales-bill.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-billing',
  templateUrl: './billing.component.html',
  styleUrls: ['./billing.component.css']
})
export class BillingComponent implements OnInit{

  isLoading:boolean = false;
  patientName:string = '';
  doctorName:string = '';
  date:string = '';
  discount:number = 0;
  medicineList:Medicine[]=[];
  tableData:any[]=[]
  total:number = 0;
  @ViewChild(MatTable) table!: MatTable<Medicine>;
  filteredOptions: Medicine[]=[];
  billSaved:boolean = false;
  billId:string='';

  constructor(private dialog:MatDialog,private inventoryService:InventoryService,private router:Router){}

  ngOnInit(){
    this.isLoading=true
    this.billSaved=false;
    this.inventoryService.getStocks().subscribe(response=>{
      this.medicineList=response.medicine;
    })
    this.isLoading=false;
    this.addRow();
  }

  addRow() {
    this.tableData.push({
      name: '',
      batch: '',
      expiry: '',
      mrp:0,
      stock:0,
      qty:0,
      net:0,
      pck:'',
      pckVal:0
    });
    setTimeout(()=>{
      this.table.renderRows();
    },1000);
    
  }

  deleteRow(row: Medicine) {
    const index = this.tableData.indexOf(row);
    if (index >= 0) {
      this.total-=this.tableData[index].net;
      this.tableData.splice(index, 1);
      this.table.renderRows();
    }
  }

  calculateCost(product:any){
    console.log(product);
    const index = this.tableData.indexOf(product);
    if(product.qty>0){
      if(this.tableData[index].pck=='S' || this.tableData[index].pck=='Ca'){
        this.tableData[index].net=(product.mrp/product.pckVal)*product.qty;
      }
      else{
        this.tableData[index].net=product.qty*product.mrp;
      }
      this.table.renderRows();
    }
  }

  searchMedicine(event:Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.filteredOptions = this.medicineList.filter(med=>med.name.toLowerCase().includes(filterValue.toLowerCase()));
  }

  setMedicineValue(row:Medicine,med:Medicine){
    row.batch=med.batch;
    row.expiry=med.expiry;
    row.mrp=med.mrp;
    row.stock=med.stock; 
    row.pck=med.pck;
    row.pckVal=med.pckVal;
  }

  saveBill(){
    this.isLoading=true;
    var missing = false;
    var message = '';
    var messageType = '';
    if(this.patientName=='' || this.doctorName=='' || this.date==''){
      missing=true;
    }
    else{
      this.total=0;
      for(let item of this.tableData){
        if(item.batch=='' || item.name=='' || item.expiry=='' || item.qty==0 || item.mrp==0){
          missing=true;
          break;
        }
        this.total+=item.net;
      }
      this.total=Number(this.total.toFixed(2));
    }
    if(missing){
      this.isLoading=false;
      messageType = 'Error Occurred';
      message = 'Enter all fields';
      this.dialog.open(AlertDialogComponent,{data:{msgType:'An Error Occurred',msg:'Enter all the required fields'}});
    }
    else{
      const salesBill:SalesBill={patient:this.patientName,doctor:this.doctorName,date:this.date,discount:this.discount,medicines:this.tableData,total:this.total};
      this.inventoryService.addSalesBill(salesBill).subscribe(response=>{
        if(response.status==201){
          this.dialog.open(AlertDialogComponent,{data:{msgType:'Success Occurred',msg:'Bill created successfully'}});
          this.billSaved=true;
          this.billId=response.id;
          for(let item of this.tableData){
            const newStock=item.stock-item.qty
            this.inventoryService.updateStock(item.name,item.batch,newStock).subscribe();
          }
        }
        else{
          this.dialog.open(AlertDialogComponent,{data:{msgType:'Error Occurred',msg:'Bill not created'}});
        }
      });
      this.isLoading=false;
    }
  }

  printBill(){
    
    if(this.billSaved){
      this.router.navigate(['/bill',this.billId])
    }
    else{
      this.dialog.open(AlertDialogComponent,{data:{msgType:'An Error Occurred',msg:'Please save the bill first'}});
    }
    
  }
}
