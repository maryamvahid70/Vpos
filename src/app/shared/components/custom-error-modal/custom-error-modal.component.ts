import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-custom-error-modal',
  standalone: false,
  templateUrl: './custom-error-modal.component.html',
  styleUrl: './custom-error-modal.component.scss'
})
export class CustomErrorModalComponent {

  @Input() text: string = '';
  @Input() desc: string = '';
  @Output() action = new EventEmitter<any>();
  interval: any;
  timeLeft: number = 0;

  ngOnInit() {
    this.startTimer();
  }

  startTimer() {
    clearInterval(this.interval);
    this.timeLeft = 5;
    this.interval = setInterval(() => {
      if (this.timeLeft > 0) {
        this.timeLeft--;
      }
    }, 1000);
  }

  formatTime(timeLeft: number): string {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(seconds).padStart(2, '0');
    return `${formattedMinutes}:${formattedSeconds}`;
  }

}
