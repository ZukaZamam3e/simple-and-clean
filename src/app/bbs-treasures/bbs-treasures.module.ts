import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { BbsTreasuresPage } from './bbs-treasures';

@NgModule({
  declarations: [
    BbsTreasuresPage,
  ],
  imports: [
    IonicPageModule.forChild(BbsTreasuresPage),
  ],
})
export class BbsTreasuresPageModule {}