import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform } from 'ionic-angular';

import { CommandService } from '../core/command-service'
import { trigger, state, style, transition, animate } from '@angular/animations';
import { KhiiTreasure } from '../core/khiitreasure';
import { AcquiredTreasure } from '../core/acquired-treasure';
import { StorageService } from '../core/storage-service';
import { KhiiTreasureGroup } from '../core/khii-treasure-group';
import { KhiiRecipe } from '../core/khii-recipe';
import { KhiiMaterialCount } from '../core/khii-material-count';
import { KhiiRecipeBooster } from '../core/khii-recipe-booster';
import { KhiiMaterial } from '../core/khii-material';

/**
 * Generated class for the CommandCollectionPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-khii-synthesis',
  templateUrl: 'khii-synthesis.html',
  animations: [
    trigger('expand', [
      // state('meldFooterExpanded', style({opacity: '1', height: '250px', bottom: '0px'})),
      // state('meldFooterCollapsed', style({opacity: '0', height: '0', bottom: '0px', overflow: 'hidden'})),
      // transition('meldFooterExpanded <=> meldFooterCollapsed', animate('300ms ease-in-out')),
      state('synthesisExpanded', style({ height: '40vh' })),
      state('synthesisCollapsed', style({ height: '10vh' })),
      transition('synthesisExpanded <=> synthesisCollapsed', animate('500ms ease-in-out')),
      state('recipeExpanded', style({ height: '39vh' })),
      state('recipeCollapsed', style({ height: '0vh', opacity: 0 })),
      transition('recipeExpanded <=> recipeCollapsed', animate('500ms ease-in-out')),
      state('recipeSmallExpanded', style({ opacity: 1 })),
      state('recipeSmallCollapsed', style({ opacity: 0 })),
      transition('recipeSmallExpanded <=> recipeSmallCollapsed', animate('500ms ease-in-out')),
    ])
  ]
})


export class KhiiSynthesisPage {

  public recipes: KhiiRecipe[] = new Array<KhiiRecipe>();
  public acquiredRecipes: number[] = new Array<number>();
  public selected: KhiiRecipe;
  public materials: KhiiMaterial[] = new Array<KhiiMaterial>();

  private _recipeSearch: string;
  private recipeTotal: number = 1;

  public selectedMaterial: any;
  private selectedMaterialCount: number = 0;
  public selectedMaterialDecode: KhiiMaterial;

  public selectedMaterials: KhiiMaterialCount[];
  public selectedBoosters: KhiiRecipeBooster[];

  synthesisAnimation: any;
  recipeAnimation: any;
  recipeSmallAnimation: any;


  constructor(public navCtrl: NavController, public navParams: NavParams,
    public commandService: CommandService, public storageService: StorageService,
    public plt: Platform) {
    this.selected = new KhiiRecipe();
    this.selected.Id = -1;

    this.selectedMaterial = new KhiiMaterial();
    this.selectedMaterial.Id = -1;

    this.selectedMaterialDecode = new KhiiMaterial();
    this.selectedMaterialDecode.MaterialId = -1;

    this.synthesisAnimation = 'synthesisExpanded';
    this.recipeAnimation = 'recipeExpanded';
    this.recipeSmallAnimation = 'recipeSmallCollapsed';
  }

  async ionViewDidLoad() {
    this.loadRecipes();
  }

  async loadRecipes() {
    this.recipes = await this.commandService.fetchAllKhiiRecipes();
    this.recipeTotal = this.recipes.length;
    this.acquiredRecipes = await this.storageService.getAcquiredKhiiRecipes();
    this.recipes.forEach(r => {
      if (this.acquiredRecipes.filter(at =>
        at === r.Id
      ).length !== 0) {
        r.Acquired = true;
      }
    });

    this.materials = await this.commandService.fetchAllKhiiMaterials();

  }

  get recipeSearch(): string {
    return this._recipeSearch;
  }

  get percentage(): number {
    return Math.max(0, Math.floor((this.acquiredRecipes.length / (this.recipeTotal == 0 ? 1 : this.recipeTotal)) * 100));
  }
  set recipeSearch(value: string) {
    this._recipeSearch = value;
    //this.loadRecipes();
    setTimeout(async () => {
      if (value !== "") {
        var r = await this.commandService.fetchAllKhiiRecipes();
        this.recipes = r.filter(m => m.Name.toLocaleLowerCase().indexOf(value.toLocaleLowerCase()) !== -1);
        if (this.selected.Id != -1) {
          var s = this.recipes.find(m => m.Id === this.selected.Id);
          console.log(s)
          if (s !== undefined) {
            this.selected = s;
            s.Selected = true;
          } else {
            this.selected = new KhiiRecipe();
            this.selected.Id = -1;
          }
        }



      } else {
        this.loadRecipes();
      }
    }, 10);
  }

  async selectRecipe(r: KhiiRecipe) {
    if (this.selected.Id === r.Id) {
      r.Acquired = !r.Acquired;
      if (r.Acquired) {
        var ap = await this.storageService.getAcquiredKhiiRecipes();
        var i = ap.filter((at =>
          at === r.Id
        ));
        if (i.length === 0) {
          ap.push(r.Id);
        }
        this.acquiredRecipes = ap;

      } else {
        var ap = await this.storageService.getAcquiredKhiiRecipes();
        var i = ap.filter((at =>
          at === r.Id
        ));
        if (i.length === 1) {
          var index = ap.indexOf(r.Id, 0);
          if (index > -1) {
            ap.splice(index, 1);
          }
        }

      }

      this.storageService.setAcquiredKhiiRecipes(ap);

      this.acquiredRecipes = ap;
    } else {
      this.selected.Selected = false;

      this.selected = r;
    this.selectedMaterials = r.MaterialCounts;
    this.selectedBoosters = r.RecipeBoosters;
    this.selected.Selected = true;
    this.selectedMaterialDecode = new KhiiMaterial();
    this.selectedMaterialDecode.MaterialId = -1;

    this.selectedMaterial.Selected = false;
    this.selectedMaterial = new KhiiMaterial();
    this.selectedMaterial.MaterialId = -1;

    if(this.plt.width() <= 767) {
      this.synthesisAnimation = 'synthesisCollapsed';
      document.getElementById("divSynthesisScroll").scrollTop = document.getElementById("recipe_id_" + this.selected.Id).offsetTop - 20;
      this.recipeAnimation = 'recipeExpanded';
      this.recipeSmallAnimation = 'recipeSmallCollapsed';

      //this.scrollUp("divSynthesisScroll", document.getElementById("recipe_id_" + this.selected.Id).offsetTop);
    }
    }

    

  }

  scrollUp(element, distance){
    var s = document.getElementById(element).scrollTop;
    var scrollDistance = distance;
    var scrollSpeed = 200; // 1000 = 1 seconds

    var scrollAnimate = setInterval(function() {
       if (s > 0) {
            s += scrollDistance;
            document.getElementById(element).scrollTop = s;
       } else {
          clearInterval(scrollAnimate);
       } 
    },scrollSpeed);
}

  selectMaterial(m: any) {
    this.selectedMaterial.Selected = false;
    this.selectedMaterial = m;
    this.selectedMaterial.Selected = true;

    this.selectedMaterialDecode = this.materials.filter(m => m.MaterialId == this.selectedMaterial.MaterialId)[0];
    this.selectedMaterialDecode.Count = this.selectedMaterial.CountCeil;

    if(this.plt.width() <= 767) {
      this.recipeAnimation = 'recipeCollapsed';
      this.recipeSmallAnimation = 'recipeSmallExpanded';
    }
  }

  updateBooster(b: KhiiRecipeBooster) {
    if (b.On && b.MaterialName.indexOf("Energy") !== -1) {
      this.selectedMaterials.forEach(m => {
        m.Count *= 0.5;
        m.CountCeil = Math.ceil(m.Count);
      })
    } else if (!b.On && b.MaterialName.indexOf("Energy") !== -1) {
      this.selectedMaterials.forEach(m => {
        m.Count *= 2;
        m.CountCeil = m.Count;
      })
    } else if (b.On && b.MaterialName.indexOf("Bright") !== -1) {
      this.selected.Exp *= 2;
    } else if (!b.On && b.MaterialName.indexOf("Bright") !== -1) {
      this.selected.Exp *= 0.5;
    }

  }

  unselectRecipe() {
    this.selected.Selected = false;
    this.selected = new KhiiRecipe();
    this.selected.Id = -1;

    this.selectedMaterialDecode = new KhiiMaterial();
    this.selectedMaterialDecode.MaterialId = -1;

    this.selectedMaterial.Selected = false;
    this.selectedMaterial = new KhiiMaterial();
    this.selectedMaterial.MaterialId = -1;

    this.selectedMaterials = this.selected.MaterialCounts;
    this.selectedBoosters = this.selected.RecipeBoosters;

    if(this.plt.width() <= 767) {
      this.synthesisAnimation = 'synthesisExpanded';
    }
  }

  unselectMaterial() {
    this.selectedMaterialDecode = new KhiiMaterial();
    this.selectedMaterialDecode.MaterialId = -1;

    this.selectedMaterial.Selected = false;
    this.selectedMaterial = new KhiiMaterial();
    this.selectedMaterial.MaterialId = -1;

    if(this.plt.width() <= 767) {
      this.recipeAnimation = 'recipeExpanded';
      this.recipeSmallAnimation = 'recipeSmallCollapsed';
    }
  }

  onResize(event) {
    if(event.target.innerWidth <= 767) {
      if(this.selected.Id != -1) {
        this.synthesisAnimation = 'synthesisCollapsed';
      }

      if(this.selectedMaterialDecode.MaterialId != -1) {
        this.recipeAnimation = 'recipeCollapsed';
        this.recipeSmallAnimation = 'recipeSmallExpanded';
      }
    } else {
      if(this.selected.Id != -1) {
        this.synthesisAnimation = 'synthesisExpanded';
      }

      if(this.selectedMaterialDecode.MaterialId != -1) {
        this.recipeAnimation = 'recipeExpanded';
        this.recipeSmallAnimation = 'recipeSmallCollapsed';
      }
    }
  }

}