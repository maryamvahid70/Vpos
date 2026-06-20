export class CalendarFilterDateModel {
    Year: number;
    Month: number;
    constructor(year?: number, month?: number) { 
        this.Year = year || 0;
        this.Month = month || 0;
    }
}