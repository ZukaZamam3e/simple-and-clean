import { Component, ViewChild } from '@angular/core';
import { Nav, Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { HomePage, ListPage, BbsMeldingPage, DevelopmentPage, CommandCollectionPage, BbsTreasuresPage, BbsStickersPage } from './pages';


@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage: any = HomePage;

  pages: Array<{game: string, hasSubMenu: boolean, showSubMenu: boolean, component: any, pages: Array<{title: string, component: any}>}>;

  constructor(public platform: Platform, public statusBar: StatusBar, public splashScreen: SplashScreen) {
    this.initializeApp();

    // used for an example of ngFor and navigation
    this.pages = [
      { game: 'Home', hasSubMenu: false, showSubMenu: false, component: HomePage, pages: [] },
      {
        game: 'Birth By Sleep', hasSubMenu: true, showSubMenu: false, component: null, pages: [
          { title: 'Command Melding', component: BbsMeldingPage },
          { title: 'Command Collection', component: CommandCollectionPage },
          { title: 'Treasures', component: BbsTreasuresPage },
          { title: 'Stickers', component: BbsStickersPage }
        ]
      }
      //{ title: 'Development', component: DevelopmentPage },
    ];
    //this.rootPage = BbsMeldingPage;
  }

  initializeApp() {
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }

  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    this.nav.setRoot(page.component);
  }

  menuItemHandler(m): void {
    if(m.hasSubMenu) {
      m.showSubmenu = !m.showSubmenu;
    }
    else {
      this.nav.setRoot(m.component);
    }
  }

  
}
