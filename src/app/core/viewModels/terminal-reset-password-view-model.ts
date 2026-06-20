export class TerminalResetPasswordViewModel {
    MerchantID : number | null;
    TerminalNumber : string;
    Cellphone: string;
    CaptchaWord: string;
    CaptchaSessionID: string;
    ApiKey: string;

    constructor(init?: Partial<TerminalResetPasswordViewModel>) {
        this.MerchantID  = init?.MerchantID  || null;
        this.TerminalNumber  = init?.TerminalNumber  || "";
        this.Cellphone = init?.Cellphone || "";
        this.CaptchaWord = init?.CaptchaWord || '';
        this.CaptchaSessionID = init?.CaptchaSessionID || "";
        this.ApiKey = init?.ApiKey || "";
    }
}