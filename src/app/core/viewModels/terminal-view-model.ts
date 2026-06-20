export class TerminalViewModel {
    ID: number;
    UserID: number;
    UserFullName: string;
    UserNID: string;
    UserAvatar: string;
    WalletTitle: string;
    MerchantAliasName: string;
    MerchantID: number | null;
    MerchantStoreTypeID: number;
    MerchantStoreTypeTitle: string;
    MerchantAcceptDate: string;
    TerminalTypeID: number;
    TerminalTypeTitle: string;
    Title: string;
    TerminalNumber: string;
    InstallDate: string;
    ExpireDate: string;
    RefererUrl: string;
    IsActive: boolean;

    constructor(init?: Partial<TerminalViewModel>) {
        this.ID = init?.ID || 0;
        this.UserID = init?.UserID || 0;
        this.UserFullName = init?.UserFullName || "";
        this.UserNID = init?.UserNID || "";
        this.UserAvatar = init?.UserAvatar || "";
        this.WalletTitle = init?.WalletTitle || "";
        this.MerchantAliasName = init?.MerchantAliasName || '';
        this.MerchantID = init?.MerchantID || null;
        this.MerchantStoreTypeID = init?.MerchantStoreTypeID || 0;
        this.MerchantStoreTypeTitle = init?.MerchantStoreTypeTitle || "";
        this.MerchantAcceptDate = init?.MerchantAcceptDate || "";
        this.TerminalTypeID = init?.TerminalTypeID || 0;
        this.TerminalTypeTitle = init?.TerminalTypeTitle || "";
        this.Title = init?.Title || '';
        this.TerminalNumber = init?.TerminalNumber || '';
        this.InstallDate = init?.InstallDate || '';
        this.ExpireDate = init?.ExpireDate || "";
        this.RefererUrl = init?.RefererUrl || "";
        this.IsActive = init?.IsActive || false;
    }
}