import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { TreasureGroup } from '../core/treasure-group'
import { CommandService } from '../core/command-service'
import { trigger, state, style, transition, animate } from '@angular/animations';
import { Treasure } from '../core/treasure';
import { CharacterTreasure } from '../core/character-treasure';
import { AcquiredTreasure } from '../core/acquired-treasure';
import { StorageService } from '../core/storage-service';

/**
 * Generated class for the CommandCollectionPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
    selector: 'page-bbs-treasures',
    templateUrl: 'bbs-treasures.html',
})
export class BbsTreasuresPage {
    public treasures: CharacterTreasure[];

    public treasureGroup: TreasureGroup[] = new Array<TreasureGroup>();
    public acquiredTreasures: AcquiredTreasure[] = new Array<AcquiredTreasure>();
    public numTreasures: number = 0;

    public character: string = "";

    private type: string = "T";

    public selected: Treasure = new Treasure();

    constructor(public navCtrl: NavController, public navParams: NavParams,
        public commandService: CommandService, public storageService: StorageService) {
    }

    async ionViewDidLoad() {
        console.log('ionViewDidLoad CommandCollectionPage');
        this.character = await this.storageService.getCharacterSelected();
        //this.loadCommands();
    
      }
    
      characterChanged() {
        this.storageService.setCharacterSeleced(this.character);
        this.loadCommands();
        this.selected = new Treasure();
      }

      async loadCommands() {
        // Load acquired commands
        this.acquiredTreasures = await this.storageService.getAcquiredTreasures(this.character, this.type);
        console.log(this.acquiredTreasures);
        this.acquiredTreasures = this.acquiredTreasures.filter(at => at.Character === this.character && at.Type === this.type);
        // Load list
        this.treasures = await this.commandService.fetchAllTreasures();
        //console.log(this.treasures);
        
        this.treasureGroup = [];
        // Load last seleted
        
    
        this.treasureGroup.push(await this.loadTreasureGroup("Land of Departure"));
        this.treasureGroup.push(await this.loadTreasureGroup("Enchanted Dominion"));
        this.treasureGroup.push(await this.loadTreasureGroup("Dwarf Woodlands"));
        this.treasureGroup.push(await this.loadTreasureGroup("Castle of Dreams"));
        this.treasureGroup.push(await this.loadTreasureGroup("The Mysterious Tower"));
        this.treasureGroup.push(await this.loadTreasureGroup("Radiant Garden"));
        this.treasureGroup.push(await this.loadTreasureGroup("Disney Town"));
        this.treasureGroup.push(await this.loadTreasureGroup("Olympus Coliseum"));
        this.treasureGroup.push(await this.loadTreasureGroup("Deep Space"));
        this.treasureGroup.push(await this.loadTreasureGroup("Neverland"));
        this.treasureGroup.push(await this.loadTreasureGroup("The Keyblade Graveyard"));
    
    
        this.numTreasures = 0;
        var char = this.character;
        this.treasureGroup.forEach(c => {
          this.numTreasures += c.Treasures.length;
          c.Treasures.forEach(t => {
            if(this.acquiredTreasures.filter(at => 
                at.Id === t.Id && at.Character === char && at.Type === this.type
            ).length !== 0) {
              t.Acquired = true;
            }
          })
        });
      }

      selectTreasure(t: Treasure) {
        if (this.selected.Id === t.Id) {
          t.Acquired = !t.Acquired;
          if (t.Acquired) {
            var ats = this.acquiredTreasures.filter((at => 
                at.Id === t.Id && at.Character === this.character && at.Type === this.type
            ));
            if (ats.length === 0) {
              let at: AcquiredTreasure = new AcquiredTreasure();
              at.Character = this.character;
              at.Id = t.Id;
              at.Type = t.Type;
              this.acquiredTreasures.push(at);
            }
          } else {
            var ats = this.acquiredTreasures.filter((at => 
                at.Id === t.Id && at.Character === this.character && at.Type === this.type
            ));
            if (ats.length === 1) {
              let at: AcquiredTreasure = ats[0];
              var index = this.acquiredTreasures.indexOf(at, 0);
              if (index > -1) {
                this.acquiredTreasures.splice(index, 1);
              }
            }
          }
    
          this.storageService.setAcquiredTreasures(this.acquiredTreasures, this.character, this.type);
    
        } else if (this.selected.Id !== null) {
          this.selected.Selected = false;
        }
    
        this.selected = t;
        this.selected.Selected = true;
    
      }

      async loadTreasureGroup(world): Promise<TreasureGroup> {
        let group = new TreasureGroup();
        group.Group = world;
    
        group.Treasures = this.treasures.find(c => c.Name.indexOf(this.character) !== -1).Treasures;
        group.Treasures = group.Treasures.filter(t => t.World.indexOf(world) !== -1 && t.Type === this.type);
        group.Treasures = group.Treasures.sort((a: Treasure, b: Treasure) => {
          if (a.SortOrder < b.SortOrder) {
            return -1;
          } else if (a.SortOrder > b.SortOrder) {
            return 1;
          } else {
            return 0;
          }
        });

        return group;
    }

}