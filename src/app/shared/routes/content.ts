import { Routes } from "@angular/router";

export const content: Routes = [
    { path: 'gateway', loadChildren: () => import('../../modules/gateway/gateway.module').then(m => m.GatewayModule) }
]