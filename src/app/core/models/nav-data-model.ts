import { Menu } from "../../shared/services/nav.service";

export class NavDataModel implements Menu {
    title: string;
    path: string;
    icon: string;
    type: string;
    active: boolean;
    children: NavDataModel[];
    Menusub: boolean;
    showChildren: boolean;

    constructor(init?: Partial<NavDataModel>) {
        this.title = init?.title || '';
        this.path = init?.path || '';
        this.icon = init?.icon || '';
        this.type = init?.type || '';
        this.active = init?.active || false;
        this.children = init?.children || [];
        this.Menusub = init?.Menusub || false;
        this.showChildren = init?.showChildren || false;
    }
}