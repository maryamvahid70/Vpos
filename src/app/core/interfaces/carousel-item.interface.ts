import { TemplateRef } from "@angular/core";

export interface ICarouselItem {
    template: TemplateRef<any>;
    context?: any;
}