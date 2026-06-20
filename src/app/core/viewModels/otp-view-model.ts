export class OTPViewModel {
    UserID: number;
    WalletTitle: string;
    PocketNumber: string;
    Cellphone: string;
    Username: string;
    SecretKey: string;
    Action: string;
    Content: string;
    Amount: number;
    MerchantID: number | null;
    MerchantFullName: string;
    TerminalID: number;
    TerminalNumber: string;
    ApiKey: string | null;
    ChannelTypeID: number;
    LastSentDateTime: string;
    OTP?: string;

    constructor(init?: Partial<OTPViewModel>) {
        this.UserID = init?.UserID || 0;
        this.WalletTitle = init?.WalletTitle || "";
        this.PocketNumber = init?.PocketNumber || "";
        this.Cellphone = init?.Cellphone || "";
        this.Username = init?.Username || "";
        this.SecretKey = init?.SecretKey || "";
        this.Action = init?.Action || "";
        this.Content = init?.Content || "";
        this.Amount = init?.Amount || 0;
        this.MerchantID = init?.MerchantID || null;
        this.MerchantFullName = init?.MerchantFullName || "";
        this.TerminalID = init?.TerminalID || 0;
        this.TerminalNumber = init?.TerminalNumber || "";
        this.ApiKey = init?.ApiKey || null;
        this.ChannelTypeID = init?.ChannelTypeID || 0;
        this.LastSentDateTime = init?.LastSentDateTime || "";
        this.OTP = init?.OTP || "";
    }
}