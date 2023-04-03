import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { KhiiPuzzlePage } from './khii-puzzle';

@NgModule({
  declarations: [
    KhiiPuzzlePage,
  ],
  imports: [
    IonicPageModule.forChild(KhiiPuzzlePage),
  ],
})
export class KhiiPuzzlePageModule {}