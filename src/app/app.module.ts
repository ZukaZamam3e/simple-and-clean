import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { HttpModule } from "@angular/http";

import { MyApp } from './app.component';
import { HomePage, ListPage, BbsMeldingPage, DevelopmentPage, 
  CommandCollectionPage, BbsTreasuresPage, BbsStickersPage, KhiiPuzzlePage, 
  KhiiTreasuresPage, KhiiSynthesisPage, KhiiMaterialPage } from './pages';

import { CommandService } from './core/command-service'
import { StorageService } from './core/storage-service'

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { CommandFilterPipe } from './bbs-melding/command-filter'

import { BrowserAnimationsModule } from "@angular/platform-browser/animations"

import { IonicStorageModule } from '@ionic/storage';

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    ListPage,
    BbsMeldingPage,
    DevelopmentPage,
    CommandCollectionPage,
    CommandFilterPipe,
    BbsTreasuresPage,
    BbsStickersPage,
    KhiiPuzzlePage,
    KhiiTreasuresPage,
    KhiiSynthesisPage,
    KhiiMaterialPage
  ],
  imports: [
    BrowserModule,
    HttpModule,
    BrowserAnimationsModule,
    IonicModule.forRoot(MyApp),
    IonicStorageModule.forRoot()
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    ListPage,
    BbsMeldingPage,
    CommandCollectionPage,
    DevelopmentPage,
    BbsTreasuresPage,
    BbsStickersPage,
    KhiiPuzzlePage,
    KhiiTreasuresPage,
    KhiiSynthesisPage,
    KhiiMaterialPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    CommandService,
    StorageService,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {}
