export class VoucherViewModel {
    ID: number;
    VoucherNumber: string;
    TransactionTypeTitle: string;
    VoucherTime: string;
    VoucherDate: string;
    RefNumber: string;
    Amount: number;
    Description: string;
    Content: string;
    FromFullName: string;

    constructor(init?: Partial<VoucherViewModel>) {
        this.ID = init?.ID || 0;
        this.VoucherNumber = init?.VoucherNumber || '';
        this.TransactionTypeTitle = init?.TransactionTypeTitle || '';
        this.VoucherTime = init?.VoucherTime || '';
        this.VoucherDate = init?.VoucherDate || '';
        this.RefNumber = init?.RefNumber || '';
        this.Amount = init?.Amount || 0;
        this.Description = init?.Description || '';
        this.Content = init?.Content || '';
        this.FromFullName = init?.FromFullName || '';
    }
}