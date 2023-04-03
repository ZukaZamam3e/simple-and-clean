import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { trigger, state, style, transition, animate } from '@angular/animations'; 

/**
 * Generated class for the DevelopmentPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-development',
  templateUrl: 'development.html',
  animations: [
    trigger('expand', [
      state('ActiveGroup', style({opacity: '1', height: '25%', bottom: '00px'})),
      state('NotActiveGroup', style({opacity: '0', height: '0', bottom: '0px', overflow: 'hidden'})),
      transition('ActiveGroup <=> NotActiveGroup', animate('300ms ease-in-out')),
      state('Expanded', style({height: '100%'})),
      state('Collapsed', style({height: '75%'})),
      transition('Expanded <=> Collapsed', animate('300ms ease-in-out'))
    ])
  ]
})
export class DevelopmentPage {
  items: any;
  activeGroup: any;
  scrollContentGroup: any;
  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.items = [
      {title: 'First Button', data: 'First-content', activeGroup: 'NotActiveGroup'},
      {title: 'Second Button', data: 'Second-content', activeGroup: 'NotActiveGroup'},
      {title: 'Third Button', data: 'Third-content', activeGroup: 'NotActiveGroup'}
    ];
    this.activeGroup = 'NotActiveGroup';
    this.scrollContentGroup = 'Expanded';
  }



  ionViewDidLoad() {
    console.log('ionViewDidLoad DevelopmentPage');
  }

  expandItem(item){
    this.activeGroup = this.activeGroup === 'ActiveGroup' ? 'NotActiveGroup' : 'ActiveGroup';
    this.scrollContentGroup = this.scrollContentGroup === 'Expanded' ? 'Collapsed' : 'Expanded';
      // this.items.map(listItem => {
      //   if (item == listItem){
      //     this.activeGroup = listItem.activeGroup === 'ActiveGroup' ? 'NotActiveGroup' : 'ActiveGroup';
      //   }
      //   return listItem;
      // });

      // setTimeout(() => {
      //   this.activeGroup = 'NotActiveGroup';
      // }, 1000)
    }

    

}
