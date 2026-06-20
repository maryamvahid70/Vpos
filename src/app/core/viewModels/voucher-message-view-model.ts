import { ErrorViewModel } from "./error-view-model";

export class VoucherMessageViewModel {
    ID: number;
    Status: string;
    Title: string;
    Message: string;
    Value: string;
    Errors: ErrorViewModel[];
    FromPocketNumber: string;
    ToPocketNumber: string;
    VoucherNumber: string;
    VoucherDate: string;
    VoucherTime: string;
    IdentifierNumber: string;
    Amount: number;
    TerminalID: number;
    TerminalNumber: string;
    ChannelTypeID: number;
    ChannelTypeTitle: string;
    TransactionTypeID: number;
    TransactionTypeTitle: string;
    CurrencyTypeID: number;
    CurrencyTypeTitle: string;
    RefNumber: string;

    constructor(init?: Partial<VoucherMessageViewModel>) {
        this.ID = init?.ID || 0;
        this.Status = init?.Status || '';
        this.Title = init?.Title || '';
        this.Message = init?.Message || '';
        this.Value = init?.Value || '';
        this.Errors = init?.Errors || [];
        this.FromPocketNumber = init?.FromPocketNumber || '';
        this.ToPocketNumber = init?.ToPocketNumber || '';
        this.VoucherNumber = init?.VoucherNumber || '';
        this.VoucherDate = init?.VoucherDate || '';
        this.VoucherTime = init?.VoucherTime || '';
        this.IdentifierNumber = init?.IdentifierNumber || '';
        this.Amount = init?.Amount || 0;
        this.TerminalID = init?.TerminalID || 0;
        this.TerminalNumber = init?.TerminalNumber || '';
        this.ChannelTypeID = init?.ChannelTypeID || 0;
        this.ChannelTypeTitle = init?.ChannelTypeTitle || '';
        this.TransactionTypeID = init?.TransactionTypeID || 0;
        this.TransactionTypeTitle = init?.TransactionTypeTitle || '';
        this.CurrencyTypeID = init?.CurrencyTypeID || 0;
        this.CurrencyTypeTitle = init?.CurrencyTypeTitle || '';
        this.RefNumber = init?.RefNumber || '';
    }
}