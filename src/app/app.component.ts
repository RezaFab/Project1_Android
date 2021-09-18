/* eslint-disable @typescript-eslint/member-ordering */
import { Component, QueryList, ViewChildren } from '@angular/core';
import { IonRouterOutlet, Platform, ToastController } from '@ionic/angular';
import { Router } from '@angular/router';
import { ApiService } from './api.service';
import { OneSignal } from '@ionic-native/onesignal/ngx';
import { SplashScreen } from '@capacitor/splash-screen';
import { App } from '@capacitor/app';
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {
  curency: string;
  constructor(
    private platform: Platform,
    private router: Router,
    private toastController: ToastController,
    private api: ApiService,
    private oneSignal: OneSignal
  ) {
    this.initializeApp();
    // eslint-disable-next-line prefer-arrow/prefer-arrow-functions
    console.log = function() {};
  }
  @ViewChildren(IonRouterOutlet) routerOutlets: QueryList<IonRouterOutlet>;
  lastTimeBackPress = 0;
  timePeriodToExit = 2000;

  backButtonEvent() {

    this.platform.backButton.subscribe(() => {
      if (window.location.pathname === '/tabs/home') {
        App.exitApp();
      }
    });
    this.platform.backButton.subscribe(async () => {
      this.routerOutlets.forEach((outlet: IonRouterOutlet) => {
        if (outlet && outlet.canGoBack()) {
          outlet.pop();
        } else if (
          this.router.url === '/tabs/home' ||
          this.router.url === '/login' ||
          this.router.url === '/tabs/profile'
        ) {
          if (
            new Date().getTime() - this.lastTimeBackPress <
            this.timePeriodToExit
          ) {
            App.exitApp();
          } else {
            this.lastTimeBackPress = new Date().getTime();
          }
        }
      });
    });
  }

  initializeApp() {
    this.platform.ready().then(() => {
      setTimeout(() => {
        SplashScreen.hide();
      }, 2000);
      this.backButtonEvent();
    });
      this.api.getData('settings').subscribe(
        (res: any) => {
          console.log('key', res);
          if (res.success) {
            console.log('res', res);
            localStorage.setItem('currency_symbol', res.data.currency_symbol);
            localStorage.setItem('currency',res.data.currency_code);
            this.curency = localStorage.getItem('currency_symbol');
            if (this.platform.is('cordova')) {
              this.oneSignal.startInit(
                res.data.app_id,
                res.data.project_no
              );
              this.oneSignal
                .getIds()
                .then((ids) => (this.api.deviceToken = ids.userId));
              console.log('one signal', this.oneSignal
                .getIds()
                .then((ids) => (this.api.deviceToken = ids.userId)));
              this.oneSignal.endInit();
            }
            else {
              this.api.deviceToken = null;
            }
          }
        }, err => { }
      );
  }


}
