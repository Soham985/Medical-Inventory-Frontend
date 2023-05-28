import { AfterViewInit, Component, ElementRef, Inject, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Medicine } from 'src/app/models/medicine.model';

@Component({
  selector: 'app-purchase-bill',
  templateUrl: './purchase-bill.component.html',
  styleUrls: ['./purchase-bill.component.css']
})
export class PurchaseBillComponent implements AfterViewInit {
  columnsToDisplay:string[]=['name','batch','expiry', 'rate','mrp','qty', 'pck','cgst','sgst','disc','net'];
  @ViewChild('container') container!: ElementRef;

  constructor(@Inject(MAT_DIALOG_DATA) public data:{medicineList:Medicine[]}){
  }

  ngAfterViewInit(){
    this.container.nativeElement.scrollTop=0;
  }

}
