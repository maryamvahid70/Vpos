import { PageModel } from "../models/page-model";
import { ClientAccessModel } from "../models/client-access-model";
import { NavDataModel } from "../models/nav-data-model";


export class TokenHolder {
    public static token: string = '';
    public static expiration: Date = new Date();
     public static pages: PageModel[] = [];
    public static controllerActions: ClientAccessModel[] = [];
    public static userFillName: string = '';
     public static navs: NavDataModel[] = [];
}
