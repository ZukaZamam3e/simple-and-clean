import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { BbsStickersPage } from './bbs-stickers';

@NgModule({
  declarations: [
    BbsStickersPage,
  ],
  imports: [
    IonicPageModule.forChild(BbsStickersPage),
  ],
})
export class BbsStickersPageModule {}