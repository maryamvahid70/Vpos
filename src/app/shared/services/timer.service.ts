// import { Injectable } from '@angular/core';
// import { Observable, interval, map, startWith, take, timer } from 'rxjs';

// @Injectable({
//     providedIn: 'root'
// })
// export class TimerService {

//     create(duration: number): Observable<number> {
//         return timer(0, 1000).pipe(
//             map(tick => duration - tick),
//             take(duration + 1)
//         );
//     }

//     format(time: number): string {
//         const m = Math.floor(time / 60);
//         const s = time % 60;
//         return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
//     }
// }


import { Injectable } from '@angular/core';
import { BehaviorSubject, interval, Subscription } from 'rxjs';

export type TimerState = 'idle' | 'running' | 'finished';

export interface TimerModel {
    timeLeft: number;
    duration: number;
    state: TimerState;
}

@Injectable({
    providedIn: 'root'
})
export class TimerService {
    private sub!: Subscription;

    private stateSubject = new BehaviorSubject<TimerModel>({
        timeLeft: 0,
        duration: 0,
        state: 'idle'
    });

    state$ = this.stateSubject.asObservable();

    // ---------- helpers ----------
    private get snapshot(): TimerModel {
        return this.stateSubject.value;
    }

    private setState(patch: Partial<TimerModel>) {
        this.stateSubject.next({
            ...this.snapshot,
            ...patch
        });
    }

    // ---------- controls ----------

    start(duration: number) {
        this.stop();

        this.setState({
            duration,
            timeLeft: duration,
            state: 'running'
        });

        this.sub = interval(1000).subscribe(() => {
            const current = this.snapshot.timeLeft - 1;

            if (current <= 0) {
                this.finish();
            } else {
                this.setState({ timeLeft: current });
            }
        });
    }

    private finish() {
        this.stop();

        this.setState({
            timeLeft: 0,
            state: 'finished'
        });
    }

    stop() {
        if (this.sub) {
            this.sub.unsubscribe();
        }
    }

    reset() {
        this.stop();

        this.setState({
            timeLeft: this.snapshot.duration,
            state: 'idle'
        });
    }

    restart() {
        const duration = this.snapshot.duration;
        this.start(duration);
    }

    // 👇 هر زمان خواستی دکمه نمایش داده بشه
    forceFinish() {
        this.finish();
    }

    formatTime(seconds: number): string {
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `${m}:${s.toString().padStart(2, '0')}`;
    }
}