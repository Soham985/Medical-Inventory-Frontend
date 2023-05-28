import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthComponent } from './auth/auth.component';
import { InventoryListComponent } from './inventory/inventory-list/inventory-list.component';
import { AuthGuard } from './auth/auth.guard';
import { InventoryComponent } from './inventory/inventory.component';
import { AddStockComponent } from './inventory/add-stock/add-stock.component';
import { BillingComponent } from './inventory/billing/billing.component';
import { BillComponent } from './shared/bill/bill.component';
import { PurchaseComponent } from './inventory/purchase/purchase.component';
import { SalesComponent } from './inventory/sales/sales.component';

const routes: Routes = [
  {path:'',component:AuthComponent},
  {path:'inventory',component:InventoryComponent,canActivate:[AuthGuard],children:[
    {path:'add-stock',component:AddStockComponent},
    {path:'stocks',component:InventoryListComponent},
    {path:'billing',component:BillingComponent},
    {path:'purchase',component:PurchaseComponent},
    {path:'sales',component:SalesComponent}
  ]},
  {path:'bill/:id',component:BillComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
