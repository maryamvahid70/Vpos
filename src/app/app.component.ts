import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';
import { NavigationEnd, NavigationStart, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { LoadingService } from './shared/services/loading.service';
import { filter, take } from 'rxjs';
@Component({
  selector: 'app-root',
  standalone: false,
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'initial';
  date: FormControl = new FormControl();

  constructor(private modalService: NgbModal, private router: Router, private loadingService: LoadingService) {
    this.loadingService.show();

    this.router.events
      .pipe(
        filter(event => event instanceof NavigationEnd),
        take(1) // فقط بار اول
      )
      .subscribe(() => {
        this.loadingService.hide();
      });
      
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationStart) {
        this.modalService.dismissAll();
      }
    });
  }
}
