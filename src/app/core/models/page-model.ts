export class PageModel {
    ID: number;
    ModuleID: number;
    ModuleTitle: string;
    ParentID?: number;
    ParentTitle: string;
    Title: string;
    Name: string;
    Path: string;
    Icon: string;
    Priority: number;
    RootPath: string;
    Breadcrumbs:string[];
    IsMenu: boolean;
    IsActive: boolean;

    constructor(
        id?: number,
        moduleID?: number,
        moduleTitle?: string,
        parentID?: number,
        parentTitle?: string,
        title?: string,
        name?: string,
        path?: string,
        icon?: string,
        priority?: number,
        rootPath?: string,
        breadcrumbs?:string[],
        isMenu?: boolean,
        isActive?: boolean
    ) {
        this.ID = id || 0;
        this.ModuleID = moduleID || 0;
        this.ModuleTitle = moduleTitle || '';
        this.ParentID = parentID || 0;
        this.ParentTitle = parentTitle || '';
        this.Title = title || '';
        this.Name = name || '';
        this.Path = path || '';
        this.Icon = icon || '';
        this.Priority = priority || 0;
        this.RootPath = rootPath || '';
        this.Breadcrumbs=breadcrumbs || [];
        this.IsMenu = isMenu || false;
        this.IsActive = isActive || true;

    }
}