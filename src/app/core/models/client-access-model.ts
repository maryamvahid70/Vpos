export class ClientAccessModel {
    ControllerName: string;
    ActionName: string;

    constructor(controllerName?: string, actionName?: string) {
        this.ControllerName = controllerName || '';
        this.ActionName = actionName || '';
    }
}