import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CommandCollectionPage } from './command-collection';

@NgModule({
  declarations: [
    CommandCollectionPage,
  ],
  imports: [
    IonicPageModule.forChild(CommandCollectionPage),
  ],
})
export class CommandCollectionPageModule {}
