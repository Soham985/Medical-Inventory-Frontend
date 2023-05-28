import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HeaderComponent } from './header/header.component';
import { AngularMaterialModule } from './angular-material.module';
import { FormsModule } from '@angular/forms';
import { AuthComponent } from './auth/auth.component';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { InventoryListComponent } from './inventory/inventory-list/inventory-list.component';
import { InventoryComponent } from './inventory/inventory.component';
import { AddStockComponent } from './inventory/add-stock/add-stock.component';
import { AlertDialogComponent } from './shared/alert-dialog/alert-dialog.component';
import { AuthInterceptor } from './auth/auth-interceptor';
import { BillingComponent } from './inventory/billing/billing.component';
import { BillComponent } from './shared/bill/bill.component';
import { PurchaseComponent } from './inventory/purchase/purchase.component';
import { SalesComponent } from './inventory/sales/sales.component';
import { PurchaseBillComponent } from './shared/purchase-bill/purchase-bill.component';
@NgModule({
  declarations: [
    AppComponent,
    AuthComponent,
    HeaderComponent,
    InventoryListComponent,
    InventoryComponent,
    AddStockComponent,
    AlertDialogComponent,
    BillingComponent,
    BillComponent,
    PurchaseComponent,
    SalesComponent,
    PurchaseBillComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    AngularMaterialModule,
    FormsModule,
    HttpClientModule
  ],
  providers: [{provide: HTTP_INTERCEPTORS,useClass:AuthInterceptor,multi:true}],
  bootstrap: [AppComponent]
})
export class AppModule { }
