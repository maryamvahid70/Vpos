export class SegmentedInputModel {

    [key: string]: any;

    Seg: string;
    Seg1: string;
    Seg2: string;
    Seg3: string;
    Seg4: string;
    Seg5: string;
    Seg6: string;
    Seg7: string;

    constructor(init?: Partial<SegmentedInputModel>) {
        this.Seg = init?.Seg || '';
        this.Seg1 = init?.Seg1 || '';
        this.Seg2 = init?.Seg2 || ''
        this.Seg3 = init?.Seg3 || ''
        this.Seg4 = init?.Seg4 || '';
        this.Seg5 = init?.Seg5 || '';
        this.Seg6 = init?.Seg6 || '';
        this.Seg7 = init?.Seg7 || '';
    }
}