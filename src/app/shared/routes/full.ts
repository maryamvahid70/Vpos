import { Routes } from "@angular/router";

export const full: Routes = [
  { path: 'spec-pages', loadChildren: () => import('../../modules/spec/spec.module').then(m => m.SpecPagesModule) }
]