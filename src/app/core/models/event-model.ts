export class EventModel {
    ID: number;
    DayKey: number;
    MonthKey: number;
    IsHoliday: boolean;
    CalenderType: string;
    Title: string;
    IsActive: boolean;
    Events: string;
    constructor(init?: Partial<EventModel>) {
        this.ID = init?.ID || 0;
        this.DayKey = init?.DayKey || 0;
        this.MonthKey = init?.MonthKey || 0;
        this.IsHoliday = init?.IsHoliday || false;
        this.CalenderType = init?.CalenderType || '';
        this.Title = init?.Title || '';
        this.IsActive = init?.IsActive || false;
        this.Events = init?.Events || '';
    }
}