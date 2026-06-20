import { ResponsiveService } from './../../../services/responsive-services';
import { Component, HostListener } from '@angular/core';
import { Subscription } from 'rxjs';
import { fadeInAnimation } from "../../../routes/router-animation";

@Component({
  selector: 'app-content',
  standalone: false,
  templateUrl: './content.component.html',
  styleUrl: './content.component.scss',
  animations: [fadeInAnimation] 
})
export class ContentComponent {

  private sub!: Subscription;

  constructor(public responsiveService: ResponsiveService) { }

  ngOnInit(): void {
    this.updateViewportHeight();
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }

  @HostListener('window:resize')
  onResize() {
    this.updateViewportHeight();
  }

  private updateViewportHeight() {
    const vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
  }

  public getRouterOutletState(outlet: any) {
    return outlet.isActivated ? outlet.activatedRoute : "";
  }

}
