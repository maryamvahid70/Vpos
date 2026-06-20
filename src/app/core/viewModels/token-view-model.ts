export class TokenViewModel {
    Status: boolean;
    Token: string;
    TokenType: string;
    RefreshToken: string;
    Message: string;
    IdToken: string;
    Expiration: Date;

    constructor(init?: Partial<TokenViewModel>) {
        this.Status = init?.Status || false;
        this.Token = init?.Token || '';
        this.TokenType = init?.TokenType || "";
        this.RefreshToken = init?.RefreshToken || "";
        this.Message = init?.Message || "";
        this.IdToken = init?.IdToken || "";
        this.Expiration = init?.Expiration || new Date();
    }
}