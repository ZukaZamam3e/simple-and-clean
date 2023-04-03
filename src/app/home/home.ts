import { Component, ViewChild } from '@angular/core';
import { Nav, NavController } from 'ionic-angular';
import { Game } from '../core/game';

//import { ListPage, BbsMeldingPage, DevelopmentPage, CommandCollectionPage, BbsTreasuresPage, BbsStickersPage, KhiiPuzzlePage, KhiiTreasuresPage } from './../pages';

import { ListPage, BbsMeldingPage, DevelopmentPage, 
  CommandCollectionPage, BbsTreasuresPage, BbsStickersPage, KhiiPuzzlePage, 
  KhiiTreasuresPage, KhiiSynthesisPage, KhiiMaterialPage } from './../pages';
@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  @ViewChild(Nav) nav: Nav;

  games: Game[];

  constructor(public navCtrl: NavController) {
    this.games = [
      {
        Title: "Birth By Sleep FM", Icon: './assets/imgs/home/bbs-2.png', ComingSoon: false, Pages: [
          { PageTitle: "Command Melding", PageModule: BbsMeldingPage  },
          { PageTitle: 'Command Collection', PageModule: CommandCollectionPage },
          { PageTitle: 'Treasures', PageModule: BbsTreasuresPage },
          { PageTitle: 'Stickers', PageModule: BbsStickersPage },
        ]
      },
      {
        Title: "Kingdom Hearts II FM", Icon: './assets/imgs/home/kh2-2.png', ComingSoon: false, Pages: [
          // { PageTitle: "Coming soon!!!", PageModule: null },
          { PageTitle: "Puzzles", PageModule: KhiiPuzzlePage  },
          { PageTitle: "Treasures", PageModule: KhiiTreasuresPage  },
          { PageTitle: "Synthesis", PageModule: KhiiSynthesisPage  },
          { PageTitle: "Materials", PageModule: KhiiMaterialPage  },
        ]
      },
      {
        Title: "Kingdom Hearts FM", Icon: './assets/imgs/home/kh-2.png', ComingSoon: true, Pages: [
          { PageTitle: "Coming soon!!!", PageModule: null },
        ]
      }
      
      //{ title: 'Development', component: DevelopmentPage },
    ];

    
  }

  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    var x = 0;
    console.log('This is a test!');
    if(typeof page.PageModule !== "undefined" && page.PageModule !== null) {
      this.navCtrl.push(page.PageModule);
    }
  }

}
