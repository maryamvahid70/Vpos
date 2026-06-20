import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GatewayRoutingModule } from './gateway-routing.module';
import { PaymentComponent } from './payment/payment.component';
import { SharedModule } from '../../shared/shared.module';
import { FormsModule } from '@angular/forms';
import { NgbAccordionModule, NgbModalModule, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { TerminalVerificationComponent } from './terminal-verification/terminal-verification.component';
import { InvoiceComponent } from './invoice/invoice.component';


@NgModule({
  declarations: [
    PaymentComponent,
    TerminalVerificationComponent,
    InvoiceComponent
  ],
  imports: [
    CommonModule,
    GatewayRoutingModule,
    SharedModule,
    FormsModule,
    NgbAccordionModule,
    NgbModalModule, 
    NgbModule
  ]
})
export class GatewayModule { }
