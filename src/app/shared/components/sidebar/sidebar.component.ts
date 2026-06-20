import { ResponsiveService } from './../../services/responsive-services';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { MessageViewModel } from '../../../core/viewModels/message-view-model';
import { HttpClient } from '@angular/common/http';
import { appConfig } from '../../../../app.config';

@Component({
  selector: 'app-sidebar',
  standalone: false,
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss'
})
export class SidebarComponent {

  activeMenu = 'payment';

  constructor(private router: Router, private http: HttpClient, public responsiveService: ResponsiveService) { }

  onClickMenu(type: string) {
    this.activeMenu = type;

    if (type === 'payment')
      this.router.navigate(['gateway/payment']);
    else if (type === 'invoice')
      this.router.navigate(['gateway/invoice']);
    else if (type === 'logout')
      this.logout();
  }

  logout() {
    this.http
      .get<MessageViewModel>(`${appConfig.apiBaseUrl}/authentication/logout`).subscribe({
        next: (res: MessageViewModel) => {
          if (res.Status === 'success') {
            this.router.navigate(['auth/login']);
            localStorage.clear();
          }
        },
      });
  }

}
