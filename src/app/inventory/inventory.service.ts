import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { PurchaseBill } from '../models/purchase-bill.model';
import { Medicine } from '../models/medicine.model';
import { AuthService } from '../auth/auth.service';
import { map } from 'rxjs/operators';
import { SalesBill } from '../models/sales-bill.model';


const BACKEND_URL = "https://medical-inventory.onrender.com/api"+"/inventory";

@Injectable({
  providedIn: 'root'
})
export class InventoryService {

  constructor(private http:HttpClient,private authService:AuthService) { }

  addStock(medicine:Medicine[]){
    return this.http.post<{message:string,status:number}>(BACKEND_URL+"/stocks",medicine);
  }

  addPurchaseBill(purchaseBill:PurchaseBill){
    const bill = {"userId":this.authService.userId,...purchaseBill};
    return this.http.post<{message:string,status:number}>(BACKEND_URL+"/purchaseBill",bill);
  }

  getStocks(){
    return this.http.get<{status:number,body:Medicine[]}>(BACKEND_URL+"/stocks").pipe(map(data=>{
      return {
        status:data.status,
        medicine:data.body.map((med:any)=>{
          return{
            id:med._id,
            userId:med.userId,
            billId:med.billId,
            name:med.name,
            batch:med.batch,
            expiry:med.expiry,
            rate:med.rate,
            mrp:med.mrp,
            qty:med.qty,
            pckVal:med.pckVal,
            pck:med.pck,
            stock:med.stock,
            disc:med.disc,
            cgst:med.cgst,
            sgst:med.sgst,
            net:med.net
          }
        })
      }
    }));
  }

  addSalesBill(salesBill:SalesBill){
    const bill = {"userId":this.authService.userId,...salesBill};
    return this.http.post<{message:string,id:string,status:number}>(BACKEND_URL+"/salesBill",bill);
  }

  getBill(id:string){
    return this.http.get<{body:SalesBill,status:number}>(BACKEND_URL+"/salesBill/"+id);
  }

  getPurchaseBill(distributorName:string,startDate:Date|null,endDate:Date|null){
    const query=`?distributorName=${distributorName}&startDate=${startDate}&endDate=${endDate}`;
    return this.http.get<{status:number,body:PurchaseBill[]}>(BACKEND_URL+"/purchaseBill"+query);
  }

  updateStock(name:string,batch:string,stock:number){
    const body={'name':name,'batch':batch,'stock':stock};
    return this.http.put<{status:Number,message:string}>(BACKEND_URL+"/stocks",body);
  }

  getSalesBill(billNo:string,patientName:string,startDate:Date|null,endDate:Date|null){
    const query=`?billNo=${billNo}&patientName=${patientName}&startDate=${startDate}&endDate=${endDate}`;
    return this.http.get<{status:number,body:SalesBill[]}>(BACKEND_URL+"/salesBill"+query);
  }

  deletePurchaseBill(billNo:string){
    return this.http.delete<{status:number,message:string}>(BACKEND_URL+"/purchaseBill/"+billNo);
  }

  deleteStock(id:string){
    return this.http.delete<{status:number,message:string}>(BACKEND_URL+"/stocks/"+id);
  }

  deleteSalesBill(id:string|undefined){
    return this.http.delete<{status:number,message:string}>(BACKEND_URL+"/salesBill/"+id);
  }
}
