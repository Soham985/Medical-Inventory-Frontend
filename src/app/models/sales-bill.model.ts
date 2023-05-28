import { Medicine } from "./medicine.model";

export interface SalesBill{
    billNo?:string,
    patient:string,
    doctor:string,
    date:string,
    discount:number,
    total:number,
    medicines:Medicine[]
}