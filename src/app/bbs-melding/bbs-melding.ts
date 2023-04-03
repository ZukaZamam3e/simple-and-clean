import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Command } from '../core/command'
import { MeldResult } from '../core/meldresult'
import { Ability } from '../core/ability'
import { MeldRecur } from '../core/meldRecur'
import { CommandService } from '../core/command-service'
import { trigger, state, style, transition, animate } from '@angular/animations'; 
import { StorageService } from '../core/storage-service';

function test() {
  console.log('test...')
  return '75%';
}

@IonicPage()
@Component({
  selector: 'page-bbs-melding',
  templateUrl: 'bbs-melding.html',
  animations: [
    trigger('expand', [
      state('meldFooterExpanded', style({opacity: '1', height: '250px', bottom: '0px'})),
      state('meldFooterCollapsed', style({opacity: '0', height: '0', bottom: '0px', overflow: 'hidden'})),
      transition('meldFooterExpanded <=> meldFooterCollapsed', animate('300ms ease-in-out')),
      state('ionContentExpanded', style({height: '100%'})),
      state('ionContentCollapsed', style({height: 'calc(100% - 250px)'})),
      transition('ionContentExpanded <=> ionContentCollapsed', animate('300ms ease-in-out'))
    ])
  ]
})


export class BbsMeldingPage {

  private _commandSearch: string = "";
  private curSelectedAbility: string;
  public showOnlyFilteredAbilities: boolean = false;
  public searchType: string = "CM";
  public character: string = ""

  public undoAbilities: string[] = new Array<string>();
  public redoAbilities: string[] = new Array<string>();

  meldFooterGroup: any;
  ionContentGroup: any;

  get commandSearch(): string {
    return this._commandSearch;
  }
  set commandSearch(value: string) {
    this._commandSearch = value;
    console.log(value);
    
    if(value !== "") {
      this.performFilter(value).then(data => {
        this.commands = data;
      })
    } else {
      this.loadCommands();
    }
    //this.commands = value !== "" ? this.performFilter(value) : this.commands;
  }

  public commands: Command[];

  public meldResults: MeldResult[];

  public abilityMeldResults: MeldResult[];

  constructor(public navCtrl: NavController, public navParams: NavParams,
    public commandService: CommandService, public storageService: StorageService) {
    this.meldFooterGroup = 'meldFooterCollapsed';
    this.ionContentGroup = 'ionContentExpanded';
    this.abilityMeldResults = new Array<MeldResult>();
  }

  async ionViewDidLoad() {
    console.log('ionViewDidLoad BbsMeldingPage');
    this.character = await this.storageService.getCharacterSelected();
    
    this.loadCommands();

    var melds = await this.commandService.fetchAllMeldResults();
    var abilities = await this.commandService.fetchAllAbilites();
    var abilityMap: { [key: string]: Ability[] } = {};
    for (var i = 0; i < abilities.length; ++i) {
        var ability = abilities[i];
        var abilityType = ability.Type.toLocaleLowerCase();
        if (!abilityMap[abilityType])
            abilityMap[abilityType] = [];
        abilityMap[abilityType].push(ability);
    }
    this.abilities = abilityMap;

    // Key: Outcome -> First -> Second
    var meldMap: { [key: string]: MeldResult[] } = {};
    for (var i = 0; i < melds.length; ++i) {
        var meld = melds[i];
        if(!!this.abilities[meld.Type.toLocaleLowerCase()]) {
          meld.Abilities = JSON.parse(JSON.stringify(this.abilities[meld.Type.toLocaleLowerCase()]));
        }
        
        var meldFirst = meld.First.toLocaleLowerCase();
        var meldSecond = meld.Second.toLocaleLowerCase();
        var outcome = meld.Outcome.toLocaleLowerCase();
        var outcomeMap = meldMap[outcome];
        if (!meldMap[outcome])
            outcomeMap = meldMap[outcome] = [];
        var okay = true;
        for (var j = 0; j < outcomeMap.length; ++j)
        {
            var outcomeMeld = outcomeMap[j];
            var outcomeFirst = outcomeMeld.First.toLocaleLowerCase();
            var outcomeSecond = outcomeMeld.Second.toLocaleLowerCase();
            if ((outcomeFirst == meldFirst && outcomeSecond == meldSecond) ||
                (outcomeSecond == meldFirst && outcomeFirst == meldSecond))
            {
                okay = false;
                break;
            }
        }
        if(okay)
          outcomeMap.push(meld);
    }

    this.melds = meldMap;
  }

  async loadCommands() {
    
    console.log("Loading commands...");

    try {
      
      this.commands = await this.commandService.fetchAllCommands();
      console.log(this.commands);
      this.commands = this.commands.filter((command: Command) => command.Character.toLocaleLowerCase().indexOf(this.character.toLocaleLowerCase()) !== -1);
      console.log(this.commands);
    } catch (err) {
      console.error(err);
    } finally {
    }
  }

  characterChanged() {
    this.storageService.setCharacterSeleced(this.character);
    this.loadCommands();
  }

  async performFilter(filterBy: string): Promise<Command[]> {
    filterBy = filterBy.toLocaleLowerCase();
    console.log("Else")
    //this.loadCommands();
    
    var c = await this.commandService.fetchAllCommands();
    // var ch = this.character === "Terra" ? "T" : this.character === "Ventus" ? "V" : "A";
    c = c.filter((command: Command) => command.Character.toLocaleLowerCase().indexOf(this.character.toLocaleLowerCase()) !== -1)
    switch(this.searchType) {
      case "CM": {
        return c.filter((command: Command) => command.Ability.toLocaleLowerCase().indexOf(filterBy) !== -1);
      }
      case "AB": {
        var a = await this.commandService.fetchAllAbilites();
        a = a.filter((ability: Ability) => ability.Outcome.toLocaleLowerCase().indexOf(filterBy) !== -1);
        var mr = await this.commandService.fetchAllMeldResults();
        
        mr = mr.filter((meldResult: MeldResult) => a.some((ab: Ability) => ab.Type === meldResult.Type));
        console.log("Abilitys with " + filterBy);
        console.log(mr);
        return c.filter((command: Command) =>mr.some((meldResult: MeldResult) => meldResult.Outcome === command.Ability));
      }
      case "CH": {
        return c.filter((command: Command) => command.Character.toLocaleLowerCase().indexOf(filterBy) !== -1);
      }
      case "IG": {
        var mr = await this.commandService.fetchAllMeldResults();
        mr = mr.filter((meldResult: MeldResult) => (meldResult.First.toLocaleLowerCase().indexOf(filterBy) !== -1 
            || meldResult.Second.toLocaleLowerCase().indexOf(filterBy) !== -1));
        return c.filter((command: Command) =>mr.some((meldResult: MeldResult) => meldResult.Outcome === command.Ability));
      }
    }
  }

  searchTypeChange() {
    this.performFilter(this.commandSearch).then(data => {
      this.commands = data;
    })
  }

  private melds: { [key: string]: MeldResult[] };
  private abilities: { [key: string]: Ability[] };

  async toggleMeldDetails(ability: string, undoRedoType: number) {
    
    /*switch(undoRedoType) {
      case 0: {
        this.undoAbilities = new Array<string>();
        this.redoAbilities = new Array<string>();
        break;
      }
      case 1: {
        this.undoAbilities.push(this.curSelectedAbility);
        break;
      }

    }*/
    this.curSelectedAbility = ability;
    //c.ShowDetails = !c.ShowDetails;
    this.meldFooterGroup = 'meldFooterExpanded';
    this.ionContentGroup = 'ionContentCollapsed';

    var abmr = this.melds[ability.toLocaleLowerCase()]; 
    console.log('Melds:');
    console.log(abmr);
    
    if(!!abmr) {
      this.abilityMeldResults = JSON.parse(JSON.stringify(abmr));
      // if(this.searchType === "AB") {
      //   console.log('filtering abilities....')
      //   this.filterAbilities();
      // }

      switch(this.searchType)
      {
        case "AB": {
          this.filterAbilitiesChar();
          break;
        }
        case "IG": {
          this.filterAbilitiesIng();
          break;
        }
      }
    } else {
      this.abilityMeldResults = new Array<MeldResult>();
    }

    //this.abilityMeldResults = JSON.parse(JSON.stringify(this.melds[ability.toLocaleLowerCase()]));
    //this.filterAbilitiesChar();
    

    var x = 0;
  }

  redoAbility() {
    if(this.redoAbilities.length > 0) {
      var ability = this.redoAbilities.pop();
      this.toggleMeldDetails(ability, 1);
    }
  }

  undoAbility() {
    if (this.undoAbilities.length > 0) {
      var ability = this.undoAbilities.pop();
      this.redoAbilities.push(ability);
      this.toggleMeldDetails(ability, 2);
    }
  }

  toggleFilterAbilities() {
    this.searchType === "AB" ? this.filterAbilities() : this.undoFilterAbilities();
  }

  filterAbilities() {
    //this.abilityMeldResults = 
    console.log(this.abilityMeldResults)
    if (!!this.abilityMeldResults) {
      this.abilityMeldResults.forEach(mr => {
        var mra = JSON.parse(JSON.stringify(mr.Abilities));
        //console.log(mra)
        mr.Abilities = mra.filter(ab => ab.Outcome.toLocaleLowerCase().indexOf(this.commandSearch) !== -1)
        console.log(mr.Outcome + ": " + mr.Abilities.length);
      })

      var newAMR = new Array<MeldResult>();

      console.log('Adding outcomes to filtered abilities...')
      for (var i = 0; i < this.abilityMeldResults.length; ++i) {
        if (this.abilityMeldResults[i].Abilities.length !== 0) {
          console.log(this.abilityMeldResults[i].Outcome);
          newAMR.push(this.abilityMeldResults[i]);
        }
      }

      this.abilityMeldResults = newAMR;
    }

    var x = 0;
  }

  filterAbilitiesIng() {
    //this.abilityMeldResults = 
    if (!!this.abilityMeldResults) {
      this.abilityMeldResults = this.abilityMeldResults.filter(amr => amr.First.toLocaleLowerCase().indexOf(this.commandSearch.toLocaleLowerCase()) !== -1
        || amr.Second.toLocaleLowerCase().indexOf(this.commandSearch.toLocaleLowerCase()) !== -1)
    }
  }

  filterAbilitiesChar() {
    //this.abilityMeldResults = 
    var ch = this.character === "Terra" ? "T" : this.character === "Ventus" ? "V" : "A";
    if (!!this.abilityMeldResults) {
      console.log("AMR: ")
      console.log(ch)
    console.log(this.abilityMeldResults);
    this.abilityMeldResults = this.abilityMeldResults.filter(amr => amr.Who.indexOf(ch) !== -1)
    console.log("Filtered AMR: ")
    console.log(this.abilityMeldResults);
    var newAMR = new Array<MeldResult>();

    console.log('Adding outcomes to filtered abilities...')
    for (var i = 0; i < this.abilityMeldResults.length; ++i) {
      if (this.abilityMeldResults[i].Abilities.length !== 0) {
        this.abilityMeldResults[i].Abilities = this.abilityMeldResults[i].Abilities.filter(o => o.Outcome.toLocaleLowerCase().indexOf(this.commandSearch.toLocaleLowerCase()) !== -1)
        if(this.abilityMeldResults[i].Abilities.length !== 0) {
          newAMR.push(this.abilityMeldResults[i]);
        }
        // forEach(o => {
        //   if(o.Outcome.toLocaleLowerCase().indexOf(this.commandSearch.toLocaleLowerCase()))
        //   newAMR.push(this.abilityMeldResults[i]);
        // })
        //console.log(this.abilityMeldResults[i].Outcome);
        //newAMR.push(this.abilityMeldResults[i]);
      }
    }

    this.abilityMeldResults = newAMR;
  }
  }

  undoFilterAbilities() {
    if(!!this.abilityMeldResults && !!this.curSelectedAbility) {
      this.abilityMeldResults = JSON.parse(JSON.stringify(this.melds[this.curSelectedAbility.toLocaleLowerCase()]));
    }
  }
  
  closeMeldFooter() {
    this.meldFooterGroup = 'meldFooterCollapsed';
    this.ionContentGroup = 'ionContentExpanded';
    this.abilityMeldResults = new Array<MeldResult>();
  }

  createListElement(text) {
    var liElement = document.createElement("li");
    var textnode = document.createTextNode(text);    
    liElement.appendChild(textnode);
    return liElement;
  }

  onChange() {
    console.log("Test...")
  }

}





