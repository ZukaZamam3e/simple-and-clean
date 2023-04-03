import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { CommandService } from '../core/command-service'
import { trigger, state, style, transition, animate } from '@angular/animations';
import { KhiiTreasure } from '../core/khiitreasure';
import { AcquiredTreasure } from '../core/acquired-treasure';
import { StorageService } from '../core/storage-service';
import { KhiiMaterial } from '../core/khii-material';
import { KhiiDrop } from '../core/khii-drop';

/**
 * Generated class for the CommandCollectionPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-khii-material',
  templateUrl: 'khii-material.html',
})


export class KhiiMaterialPage {

  public selected: KhiiMaterial;
  public drops: KhiiDrop[];
  public materials: KhiiMaterial[] = new Array<KhiiMaterial>();

  constructor(public navCtrl: NavController, public navParams: NavParams,
    public commandService: CommandService, public storageService: StorageService) {


    this.selected = new KhiiMaterial();
    this.selected.MaterialId = -1;

  }

  async ionViewDidLoad() {
    this.loadRecipes();
  }

  async loadRecipes() {
    this.materials = await this.commandService.fetchAllKhiiMaterials()
    this.materials.sort((a: KhiiMaterial, b: KhiiMaterial) => {
      if (a.OrderNumber < b.OrderNumber) {
        return -1;
      } else if (a.OrderNumber > b.OrderNumber) {
        return 1;
      } else {
        return 0;
      }
    });

    //this.storageService.setAcquiredKhiiRecipes([]);

    var recipes = await this.commandService.fetchAllKhiiRecipes();
    var acquiredRecipes = await this.storageService.getAcquiredKhiiRecipes();

    this.materials.forEach(m => {
      m.Count = 0;
    })

    recipes.forEach(r => {
      var i = acquiredRecipes.filter((at =>
        at === r.Id
      ));

      if (i.length === 0) {
        r.MaterialCounts.forEach(m => {
          var mat = this.materials.find(a => a.MaterialId === m.MaterialId);
          if (mat !== undefined && mat !== null) {
            mat.Count += m.Count;
          }
        })
      }
    })

    recipes.forEach(r => {
      var i = this.materials.find((at => r.Name === at.Name));
      if(i !== undefined && i !== null) {
        r.MaterialCounts.forEach(m => {
          var mat = this.materials.find(a => a.MaterialId === m.MaterialId);
          if (mat !== undefined && mat !== null) {
            mat.Count += (m.Count * i.Count);
          }
        })
      }
    })

  }

  selectMaterial(m: any) {
    this.selected.Selected = false;
    this.selected = m;
    this.selected.Selected = true;

    this.drops = this.selected.Drops;


  }
}