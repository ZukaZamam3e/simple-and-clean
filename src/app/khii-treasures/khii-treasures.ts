import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { CommandService } from '../core/command-service'
import { trigger, state, style, transition, animate } from '@angular/animations';
import { KhiiTreasure } from '../core/khiitreasure';
import { AcquiredTreasure } from '../core/acquired-treasure';
import { StorageService } from '../core/storage-service';
import { KhiiTreasureGroup } from '../core/khii-treasure-group';

/**
 * Generated class for the CommandCollectionPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-khii-treasures',
  templateUrl: 'khii-treasures.html',
})
export class KhiiTreasuresPage {
  public treasures: KhiiTreasure[];
  
      public treasureGroup: KhiiTreasureGroup[] = new Array<KhiiTreasureGroup>();
      public acquiredTreasures: number[] = new Array<number>();
      public numTreasures: number = 0;
  
      public character: string = "";
  
      private type: string = "S";
  
      public selected: KhiiTreasure;// = new KhiiTreasure();
  
      constructor(public navCtrl: NavController, public navParams: NavParams,
          public commandService: CommandService, public storageService: StorageService) {
            this.selected = new KhiiTreasure();
      }
  
      async ionViewDidLoad() {
          console.log('ionViewDidLoad CommandCollectionPage');
          this.character = await this.storageService.getCharacterSelected();
          //this.loadCommands();
          this.loadCommands();
          
      
        }
      
  
        async loadCommands() {
          // Load acquired commands
          this.acquiredTreasures = await this.storageService.getAcquiredKhiiTreasures();
          //this.acquiredTreasures = this.acquiredTreasures.filter(at => at.Character === this.character && at.Type === this.type);
          // Load list
          this.treasures = await this.commandService.fetchAllKhiiTreasure();
          //console.log(this.treasures);
          
          this.treasureGroup = [];
          // Load last seleted
      
          this.treasureGroup.push(await this.loadTreasureGroup("Twilight Town"));
          this.treasureGroup.push(await this.loadTreasureGroup("Radiant Garden"));
          this.treasureGroup.push(await this.loadTreasureGroup("Beast’s Castle"));
          this.treasureGroup.push(await this.loadTreasureGroup("Olympus Coliseum"));
          this.treasureGroup.push(await this.loadTreasureGroup("Agrabah"));
          this.treasureGroup.push(await this.loadTreasureGroup("The Land of Dragons"));
          this.treasureGroup.push(await this.loadTreasureGroup("100 Acre Wood"));
          this.treasureGroup.push(await this.loadTreasureGroup("Pride Lands"));
          this.treasureGroup.push(await this.loadTreasureGroup("Disney Castle"));
          this.treasureGroup.push(await this.loadTreasureGroup("Timeless River"));
          this.treasureGroup.push(await this.loadTreasureGroup("Halloween Town"));
          this.treasureGroup.push(await this.loadTreasureGroup("Port Royal"));
          this.treasureGroup.push(await this.loadTreasureGroup("Space Paranoids"));
          this.treasureGroup.push(await this.loadTreasureGroup("The World That Never Was"));
      
          this.numTreasures = 0;
          var char = this.character;
          this.treasureGroup.forEach(c => {
            this.numTreasures += c.Treasures.length;
            c.Treasures.forEach(t => {
              if(this.acquiredTreasures.filter(at => 
                  at === t.Id
              ).length !== 0) {
                t.Acquired = true;
              }
            })
          });
        }
  
        selectTreasure(t: KhiiTreasure) {
          if (this.selected.Id === t.Id) {
            t.Acquired = !t.Acquired;
            if (t.Acquired) {
              var ats = this.acquiredTreasures.filter((at => 
                  at === t.Id
              ));
              if (ats.length === 0) {
                this.acquiredTreasures.push(t.Id);
              }
            } else {
              var ats = this.acquiredTreasures.filter((at => 
                  at === t.Id
              ));
              if (ats.length === 1) {
                let at: number = ats[0];
                var index = this.acquiredTreasures.indexOf(at, 0);
                if (index > -1) {
                  this.acquiredTreasures.splice(index, 1);
                }
              }
            }
      
            this.storageService.setAcquiredKhiiTreasures(this.acquiredTreasures);
      
          } else if (this.selected.Id !== null) {
            this.selected.Selected = false;
          }
      
          this.selected = t;
          this.selected.Selected = true;
      
        }
  
        async loadTreasureGroup(world): Promise<KhiiTreasureGroup> {
          let group = new KhiiTreasureGroup();
          group.Group = world;
      
          group.Treasures = this.treasures.filter(t => t.World.indexOf(world) !== -1);
          group.Treasures = group.Treasures.sort((a: KhiiTreasure, b: KhiiTreasure) => {
            if (a.ChestNumber < b.ChestNumber) {
              return -1;
            } else if (a.ChestNumber > b.ChestNumber) {
              return 1;
            } else {
              return 0;
            }
          });
  
          return group;
      }

}