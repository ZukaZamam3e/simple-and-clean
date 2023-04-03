import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { KhiiTreasuresPage } from './khii-treasures';

@NgModule({
  declarations: [
    KhiiTreasuresPage,
  ],
  imports: [
    IonicPageModule.forChild(KhiiTreasuresPage),
  ],
})
export class KhiiTreasuresPageModule {}