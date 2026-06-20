import swal from 'sweetalert2';

import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse, HttpResponse, HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { throwError, Observable } from "rxjs";
import { map, catchError } from 'rxjs/operators';
import { TokenViewModel } from '../../core/viewModels/token-view-model';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { appConfig } from '../../../app.config';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

    responseClone: any;
    constructor(private router: Router, private modalService: NgbModal, private http: HttpClient) { }


    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        //بهنگام لاگین ابتدایی این مسیر چک می شود
        if (req.headers.get('No-Auth') === 'True') {
            return next.handle(req.clone())
        }

        //refresh token
        var expiration = localStorage.getItem('expiration') ?? "2020-01-01";
        var stateToken = localStorage.getItem('stateToken') ?? "OK";
        let expireDateTime: Date = new Date(expiration);
        let currentDateTime: Date = new Date();

        if (expireDateTime < currentDateTime && stateToken == "OK") {
            localStorage.setItem("stateToken", "SUSP");
            var refreshToken = localStorage.getItem('refreshToken') ?? "";
            localStorage.setItem("userToken", refreshToken);
            const clonedreq = req.clone({
                headers: req.headers.set('Authorization', 'Bearer ' + localStorage.getItem('userToken'))
            });
            this.http.get<TokenViewModel>(`${appConfig.apiBaseUrl}/authentication/getRefreshToken`)
                .subscribe({
                    next: (res: TokenViewModel) => {
                        localStorage.setItem('userToken', res.Token);
                        localStorage.setItem('refreshToken', res.RefreshToken);
                        localStorage.setItem('expiration', res.Expiration.toString());
                        localStorage.setItem('stateToken', "OK");


                        //****************************************************************************** */

                        const clonedreq = req.clone({
                            headers: req.headers.set('Authorization', 'Bearer ' + localStorage.getItem('userToken'))
                        });
                        return next.handle(clonedreq).pipe(
                            map((event: HttpEvent<any>) => {
                                if (event instanceof HttpResponse) {
                                }
                                return event;
                            }),
                            catchError((error: HttpErrorResponse) => {

                                if (error.status === 401) {
                                    this.errorOnToken();
                                }
                                else if (error.status === 403) {
                                    this.errorOnAccess();
                                }
                                else {
                                    this.warningOnException(error);

                                }
                                return throwError(error);
                            }));

                        //********************************************************************************** */
                    }
                });
        }
        //در حین اجرای نرم افزار چک می شود
        if (localStorage.getItem('userToken') != null) {
            //access token

            const clonedreq = req.clone({
                headers: req.headers.set('Authorization', 'Bearer ' + localStorage.getItem('userToken'))
            });
            return next.handle(clonedreq).pipe(
                map((event: HttpEvent<any>) => {
                    if (event instanceof HttpResponse) {
                    }
                    return event;
                }),
                catchError((error: HttpErrorResponse) => {

                    if (error.status === 401) {
                        this.errorOnToken();
                    }
                    else if (error.status === 403) {
                        this.errorOnAccess();
                    }
                    else {
                        this.warningOnException(error);

                    }
                    return throwError(error);
                }));

        } else {
            this.errorOnToken();
            return next.handle(req.clone());
        }

    }


    errorOnAuthentication() {
        localStorage.removeItem('userToken');
        this.modalService.dismissAll();

        this.router.navigate(['/login']);
        swal.fire({
            icon: 'error',
            title: 'اطلاعات کاربری یافت نشد!',
            text: 'با دقت بیشتر، مجدد سعی نمایید...',
            showConfirmButton: false,
            timer: 1800,
            didClose: () => {
                this.router.navigate(['/login']);
            }
        })
    }

    errorOnToken() {
        localStorage.removeItem('userToken');
        this.modalService.dismissAll();

        this.router.navigate(['/auth/login']);
        swal.fire({
            icon: 'error',
            title: 'اطلاعات کاربری موجود نیست!',
            text: 'تا ثانیه‌ای دیگر به صفحه ورود منتقل می‌شوید',
            showConfirmButton: false,
            timer: 3000
        }).then((result) => {
            if (result.dismiss?.toString() === 'timer') {
                this.router.navigate(['/login']);
            }
        });
    }

    errorOnAccess() {
        swal.fire({
            icon: 'warning',
            title: 'خطای دسترسی!',
            text: 'کاربر به تراکنش یا صفحه مورد نظر دسترسی ندارد.',
            showConfirmButton: false,
            timer: 3000
        }).then((result) => {
            if (result.dismiss?.toString() === 'timer') {
                // this.router.navigate(["/"]);
            }
        });
    }

    warningOnException(err: HttpErrorResponse) {
        let errorTitle = 'خطای ناشناخته!';
        let errorMessage = 'خطای ناشناخته درون سامانه بوجود آمده است';
        if (err.status == 422) {
            errorTitle = 'خطای امنیتی';
            errorMessage = 'کد امنیتی نا معتبر است';
        }
        swal.fire({
            icon: 'warning',
            title: errorTitle,
            text: errorMessage,
            showConfirmButton: false,
            timer: 3000
        }).then((result) => {
            if (result.dismiss?.toString() === 'timer') {
                // this.router.navigate(["/"]);
            }
        });
    }
}
