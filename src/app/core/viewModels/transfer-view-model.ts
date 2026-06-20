export class TransferViewModel {
    ApiKey: string;
    FromPocketNumber: string;
    ToPocketNumber: string;
    TerminalNumber: string;
    Amount: string;
    RefNumber: string;
    Value1: string;
    Value2: string;
    Value3: string;
    Value4: string;
    IsTransferConfirmed: boolean;
    OTP: string;
    Content: string;
    SendTime: string;

    constructor(init?: Partial<TransferViewModel>) {
        this.ApiKey = init?.ApiKey || '';
        this.FromPocketNumber = init?.FromPocketNumber || '';
        this.ToPocketNumber = init?.ToPocketNumber || "";
        this.TerminalNumber = init?.TerminalNumber || "";
        this.Amount = init?.Amount || "";
        this.RefNumber = init?.RefNumber || '';
        this.Value1 = init?.Value1 || '';
        this.Value2 = init?.Value1 || '';
        this.Value3 = init?.Value1 || '';
        this.Value4 = init?.Value1 || '';
        this.IsTransferConfirmed = init?.IsTransferConfirmed || false;
        this.OTP = init?.OTP || '';
        this.Content = init?.Content || '';
        this.SendTime = init?.SendTime || "";
    }
}