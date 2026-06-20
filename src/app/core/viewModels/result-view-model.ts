import { MessageViewModel } from './message-view-model';
export class ResultViewModel<T> {
    Message: MessageViewModel;
    List: T[];
    Result: T | undefined;
    TotalCount: number;
    // check
    constructor(init?: Partial<ResultViewModel<T>>) {
        this.Message = init?.Message || new MessageViewModel();
        this.List = init?.List || [];
        this.Result = init?.Result || undefined;
        this.TotalCount = init?.TotalCount || 0;
    }
}