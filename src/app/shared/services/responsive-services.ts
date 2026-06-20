import { effect, Injectable } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { map, shareReplay } from 'rxjs/operators';
import { toSignal } from '@angular/core/rxjs-interop';

@Injectable({
    providedIn: 'root'
})
export class ResponsiveService {

    constructor(
        private breakpointObserver: BreakpointObserver
    ) {

        effect(() => {
            const html = document.documentElement;
            if (this.isMobile()) {
                html.setAttribute('data-device', 'mobile');
            }
            else {
                html.setAttribute('data-device', 'desktop');
            }
        });

    }

    isMobile$ = this.breakpointObserver
        .observe(['(max-width: 575px)'])
        .pipe(
            map(result => result.matches),
            shareReplay(1)
        );

    isMobile = toSignal(this.isMobile$, {
        initialValue: false
    });

    isTablet$ = this.breakpointObserver
        .observe(['(max-width: 767px)'])
        .pipe(
            map(result => result.matches),
            shareReplay(1)
        );

    isTablet = toSignal(this.isTablet$, {
        initialValue: false
    });

    isDesktop$ = this.breakpointObserver
        .observe(['(min-width: 767px)'])
        .pipe(
            map(result => result.matches),
            shareReplay(1)
        );

    isDesktop = toSignal(this.isDesktop$, {
        initialValue: false
    });

    handset$ = this.breakpointObserver
        .observe([Breakpoints.Handset])
        .pipe(
            map(result => result.matches),
            shareReplay(1)
        );

}
