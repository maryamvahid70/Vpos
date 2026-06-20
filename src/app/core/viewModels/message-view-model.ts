import { ErrorViewModel } from "./error-view-model";

export class MessageViewModel{
    ID:number;
    Status:string;
    Title: string;
    Message: string;
    Value: string;
    Errors: ErrorViewModel[];
    Dictionary:[{Key:string,Value:string}]

    constructor(
        init?:Partial<MessageViewModel>
    ){
        this.ID = init?.ID || 0;
        this.Status = init?.Status || '';
        this.Title = init?.Title || '';
        this.Message = init?.Message || '';
        this.Value=init?.Value || '';
        this.Errors = init?.Errors || [];
        this.Dictionary = init?.Dictionary || [{Key: '', Value: ''}]
    }
}