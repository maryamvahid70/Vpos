export class VoucherSummaryViewModel {
    ID: number;
    FromUserID: number;
    FromNID: number;
    FromFullName: string;
    ToUserID: number;
    ToNID: number;
    ToFullName: string;
    TransactionTypeID: number;
    TransactionTypeTitle: string;
    CreditTypeID: number;
    CreditTypeTitle: string;
    ChannelTypeID: number;
    ChannelTypeTitle: string;
    ChargeTypeID: number;
    ChargeTypeTitle: string;
    TerminalNumber: string;
    TerminalTypeTitle: string;
    VoucherNumber: string;
    VoucherTime: string;
    VoucherDate: string;
    RefNumber: string;
    Amount: number;
    Description: string;
    Content: string;
    CurrencyTypeID: number;
    CurrencyTypeTitle: string;
    Valur: string; //  والور
    IdentifierNumber: string;
    Rate: number; // نرخ در موارد خاص
    Value1: string;
    Value2: string;
    Value3: string;
    Value4: string;
    Value5: string;
    Value6: string;
    Boolean1: boolean;
    Boolean2: boolean;
    Boolean3: boolean;
    Location: string;
    SendTime: string;

    constructor(init?: Partial<VoucherSummaryViewModel>) {
        this.ID = init?.ID || 0;
        this.FromUserID = init?.FromUserID || 0;
        this.FromNID = init?.FromNID || 0;
        this.FromFullName = init?.FromFullName || '';
        this.ToUserID = init?.ToUserID || 0;
        this.ToNID = init?.ToNID || 0;
        this.ToFullName = init?.ToFullName || '';
        this.TransactionTypeID = init?.TransactionTypeID || 0;
        this.TransactionTypeTitle = init?.TransactionTypeTitle || '';
        this.CreditTypeID = init?.CreditTypeID || 0;
        this.VoucherTime = init?.VoucherTime || '';
        this.VoucherDate = init?.VoucherDate || '';
        this.RefNumber = init?.RefNumber || '';
        this.Amount = init?.Amount || 0;
        this.Description = init?.Description || '';
        this.Content = init?.Content || '';
        this.CreditTypeTitle = init?.CreditTypeTitle || '';
        this.ChannelTypeID = init?.ChannelTypeID || 0;
        this.ChannelTypeTitle = init?.ChannelTypeTitle || '';
        this.ChargeTypeID = init?.ChargeTypeID || 0;
        this.ChargeTypeTitle = init?.ChargeTypeTitle || '';
        this.TerminalNumber = init?.TerminalNumber || '';
        this.TerminalTypeTitle = init?.TerminalTypeTitle || '';
        this.VoucherNumber = init?.VoucherNumber || '';
        this.VoucherDate = init?.VoucherDate || '';
        this.VoucherTime = init?.VoucherTime || '';
        this.Amount = init?.Amount || 0;
        this.CurrencyTypeID = init?.CurrencyTypeID || 0;
        this.CurrencyTypeTitle = init?.CurrencyTypeTitle || '';
        this.Valur = init?.Valur || ''; //  والور
        this.RefNumber = init?.RefNumber || '';//شماره مرجع
        this.IdentifierNumber = init?.IdentifierNumber || '';
        this.Description = init?.Description || ''; //توضیحات پلتفرم
        this.Rate = init?.Rate || 0; // نرخ در موارد خاص
        this.Value1 = init?.Value1 || '';
        this.Value2 = init?.Value2 || '';
        this.Value3 = init?.Value3 || '';
        this.Value4 = init?.Value4 || '';
        this.Value5 = init?.Value5 || '';
        this.Value6 = init?.Value6 || '';
        this.Boolean1 = init?.Boolean1 || false;
        this.Boolean2 = init?.Boolean2 || false;
        this.Boolean3 = init?.Boolean3 || false;
        this.Location = init?.Location || '';
        this.SendTime = init?.SendTime || '';
    }
}






