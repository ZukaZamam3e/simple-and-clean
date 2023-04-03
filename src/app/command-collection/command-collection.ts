import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { CollectionGroup } from '../core/collection-group'
import { CommandService } from '../core/command-service'
import { trigger, state, style, transition, animate } from '@angular/animations';
import { Collection } from '../core/collection';
import { Character } from '../core/character';
import { AcquiredCommand } from '../core/acquired-command';
import { StorageService } from '../core/storage-service';

/**
 * Generated class for the CommandCollectionPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-command-collection',
  templateUrl: 'command-collection.html',
})
export class CommandCollectionPage {

  public collections: Character[];

  public collectionGroup: CollectionGroup[] = new Array<CollectionGroup>();
  public acquiredCommands: AcquiredCommand[] = new Array<AcquiredCommand>();
  public numCommands: number = 0;

  public character: string = "";

  public selected: Collection = new Collection();

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
    this.selected = new Collection();
    this.selected.Command = "Select a command!"
    
  }


  async loadCommands() {
    // Load acquired commands
    this.acquiredCommands = await this.storageService.getAcquiredCommands(this.character);
    this.acquiredCommands = this.acquiredCommands.filter(ac => ac.Character === this.character);
    // Load list
    this.collections = await this.commandService.fetchAllCollection();
    this.collectionGroup = [];
    // Load last seleted

    this.collectionGroup.push(await this.loadCollectionGroup("Attack"));
    this.collectionGroup.push(await this.loadCollectionGroup("Magic"));
    this.collectionGroup.push(await this.loadCollectionGroup("Items"));
    this.collectionGroup.push(await this.loadCollectionGroup("Friendship"));
    this.collectionGroup.push(await this.loadCollectionGroup("Movement"));
    this.collectionGroup.push(await this.loadCollectionGroup("Defense"));
    this.collectionGroup.push(await this.loadCollectionGroup("Reprisals"));
    this.collectionGroup.push(await this.loadCollectionGroup("Shotlocks"));
    this.collectionGroup.push(await this.loadCollectionGroup("DimensionLinks"));
    this.collectionGroup.push(await this.loadCollectionGroup("Finish"));
    this.collectionGroup.push(await this.loadCollectionGroup("Abilities"));


    this.numCommands = 0;
    var char = this.character;
    this.collectionGroup.forEach(c => {
      this.numCommands += c.Collection.length;
      c.Collection.forEach(cl => {
        if(this.acquiredCommands.filter(ac => 
          ac.Command === cl.Command && ac.Character === char 
        ).length !== 0) {
          cl.Acquired = true;
        }
      })
    });
  }


  selectCommand(c: Collection) {
    if (this.selected.Command === c.Command) {
      c.Acquired = !c.Acquired;
      if (c.Acquired) {
        var acs = this.acquiredCommands.filter((ac => 
          ac.Command === c.Command && ac.Character === this.character
        ));
        if (acs.length === 0) {
          let ac: AcquiredCommand = new AcquiredCommand();
          ac.Character = this.character;
          ac.Command = c.Command;
          this.acquiredCommands.push(ac);
        }
      } else {
        var acs = this.acquiredCommands.filter((ac => 
          ac.Command === c.Command && ac.Character === this.character
        ));
        if (acs.length === 1) {
          let ac: AcquiredCommand = acs[0];
          var index = this.acquiredCommands.indexOf(ac, 0);
          if (index > -1) {
            this.acquiredCommands.splice(index, 1);
          }
        }
      }

      this.storageService.setAcquiredCommands(this.acquiredCommands, this.character);

    } else if (this.selected.Command !== '') {
      this.selected.Selected = false;
    }

    const cnElems = document.getElementsByClassName("cn");

    for (var i = 0; i < cnElems.length; ++i) {
      cnElems[i].classList.remove("selected_command");
    }

    this.selected = c;
    this.selected.Selected = true;

  }

  async loadCollectionGroup(type): Promise<CollectionGroup> {
    let group = new CollectionGroup();
    group.Group = type;

    group.Collection = this.collections.find(c => c.Name.indexOf(this.character) !== -1).Collection;
    group.Collection = group.Collection.filter(c => c.Type.indexOf(type) !== -1);
    group.Collection = group.Collection.sort((a: Collection, b: Collection) => {
      if (a.SortOrder < b.SortOrder) {
        return -1;
      } else if (a.SortOrder > b.SortOrder) {
        return 1;
      } else {
        return 0;
      }
    });

    switch (type) {
      case "Attack": {
        group.Icon = "a";
        break;
      }

      case "Magic": {
        group.Icon = "m";
        break;
      }

      case "Items": {
        group.Icon = "i";
        break;
      }

      case "Friendship": {
        group.Icon = "f";
        break;
      }

      case "Movement": {
        group.Icon = "mv";
        break;
      }

      case "Defense": {
        group.Icon = "d";
        break;
      }

      case "Reprisals": {
        group.Icon = "r";
        break;
      }

      case "Shotlocks": {
        group.Icon = "s";
        break;
      }

      case "DimensionLinks": {
        group.Icon = "dl";
        break;
      }

      case "Finish": {
        group.Icon = "f1";
        break;
      }

      case "Finish2": {
        group.Icon = "f2";
        break;
      }

      case "Finish3": {
        group.Icon = "f3";
        break;
      }

      case "Abilities": {
        group.Icon = "ab";
        break;
      }

      default: {
        break;
      }
    }

    return group;
  }

}
