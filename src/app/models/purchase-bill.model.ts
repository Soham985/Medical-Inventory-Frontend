import { Medicine } from "./medicine.model";

export interface PurchaseBill{
    distributor:string,
    billNo:string,
    purchaseDate:string,
    discount:number,
    total:number,
    medicines:Medicine[]
}