import { Component, OnInit, ViewChild } from '@angular/core';
import { InventoryService } from '../inventory.service';
import { Medicine } from 'src/app/models/medicine.model';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';


@Component({
  selector: 'app-inventory-list',
  templateUrl: './inventory-list.component.html',
  styleUrls: ['./inventory-list.component.css']
})
export class InventoryListComponent implements OnInit{

  isLoading:boolean = false;
  medicineList:Medicine[]=[];
  displayList!:MatTableDataSource<Medicine>;
  displayColumns:string[]=['name', 'batch', 'expiry', 'rate', 'mrp', 'stock', 'pck'];
  currentIndex:number = 0;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort, {static: false}) set content(sort: MatSort) {
    this.displayList.sort = sort;
    this.displayList.paginator=this.paginator;
  }

  constructor(private inventoryService:InventoryService){}

  ngOnInit(){
    this.isLoading = true;
    this.inventoryService.getStocks().subscribe(response=>{
      this.medicineList=response.medicine;
      if(this.medicineList.length>0){
        this.displayList=new MatTableDataSource(this.medicineList);
        this.displayList.paginator = this.paginator;
        this.isLoading=false;
      }
    });
    this.isLoading=false;
  }

  deleteRow(id:string){
    this.isLoading=true;
    this.inventoryService.deleteStock(id).subscribe(response=>{
      console.log(response);
      this.medicineList=this.medicineList.filter((med)=>med.id!=id);
      this.displayList=new MatTableDataSource(this.medicineList);
      this.displayList.paginator = this.paginator;
      this.isLoading=false;
    });
    this.isLoading=false;
  }


  searchMedicide(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.displayList.filter = filterValue.trim().toLowerCase();

    if (this.displayList.paginator) {
      this.displayList.paginator.firstPage();
    }
  }

  sortExpiry(sort:Sort){
    if(!sort.active || sort.direction===''){
      this.displayList=new MatTableDataSource(this.medicineList);
    }
    else{
      this.displayList = new MatTableDataSource(this.medicineList.sort((a:Medicine,b:Medicine)=>{
        const isAsc = sort.direction === 'asc';
        if(sort.active=='expiry'){
          return this.compareDate(a.expiry,b.expiry,isAsc);
        }
        return this.compareQty(a.stock,b.stock,isAsc);
      }));
    }
    
    this.displayList.paginator = this.paginator;
  }

  compareDate(a:string,b:string,isAsc:boolean){
    const exp1=Number(`${a.split('/')[1]}${a.split('/')[0]}`)
    const exp2=Number(`${b.split('/')[1]}${b.split('/')[0]}`)
    return (exp1 < exp2 ? -1 : 1) * (isAsc ? 1 : -1);
  }

  compareQty(a:number,b:number,isAsc:boolean){
    return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
  }

}
