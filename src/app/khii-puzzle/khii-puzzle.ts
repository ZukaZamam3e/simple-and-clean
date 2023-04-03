import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { TreasureGroup } from '../core/treasure-group'
import { CommandService } from '../core/command-service'
import { trigger, state, style, transition, animate } from '@angular/animations';
import { Treasure } from '../core/treasure';
import { CharacterTreasure } from '../core/character-treasure';
import { AcquiredTreasure } from '../core/acquired-treasure';
import { StorageService } from '../core/storage-service';
import { KhiiPuzzle } from '../core/khiipuzzle';
import { KhiiPuzzleGroup } from '../core/khii-puzzle-group';

/**
 * Generated class for the CommandCollectionPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
    selector: 'page-khii-puzzle',
    templateUrl: 'khii-puzzle.html',
})
export class KhiiPuzzlePage {

    public puzzleGroup: KhiiPuzzleGroup[] = new Array<KhiiPuzzleGroup>();
      public numTreasures: number = 0;

    public puzzles: KhiiPuzzle[];
    public acquiredPuzzles: number[] = new Array<number>();
    public selected: KhiiPuzzle;
    private _puzzleSearch: string = "";
    private _worldSearch: string = "";

    public sort1: string = "";
    public sort1Direction: string = "A";

    public sort2: string = "";
    public sort2Direction: string = "A";

    constructor(public navCtrl: NavController, public navParams: NavParams,
        public commandService: CommandService, public storageService: StorageService) {
        this.selected = new KhiiPuzzle();
    }

    async ionViewDidLoad() {


        this.loadPuzzles();

    }

    get puzzleSearch(): string {
        return this._puzzleSearch;
    }
    set puzzleSearch(value: string) {
        this._puzzleSearch = value;

        if (value !== "") {
            this.performFilter(this._puzzleSearch, this._worldSearch).then(data => {
                this.puzzles = data;
            })

        } else {
            this.loadPuzzles();
        }
        this.sortBy();
    }

    get worldSearch(): string {
        return this._worldSearch;
    }
    set worldSearch(value: string) {
        this._worldSearch = value;

        if (value !== "") {
            this.performFilter(this._puzzleSearch, this._worldSearch).then(data => {
                this.puzzles = data;
            })
        } else {
            this.loadPuzzles();
        }
        this.sortBy();
    }

    async performFilter(puzzle: string, world: string): Promise<KhiiPuzzle[]> {
        var puzzles = await this.commandService.featchAllKhiiPuzzles();

        if (puzzle !== "") {
            puzzles = puzzles.filter((p: KhiiPuzzle) => p.Puzzle.toLocaleLowerCase().indexOf(puzzle.toLocaleLowerCase()) !== -1);
        }

        if (world !== "") {
            puzzles = puzzles.filter((p: KhiiPuzzle) => p.World.toLocaleLowerCase().indexOf(world.toLocaleLowerCase()) !== -1);
        }

        return puzzles;
    }


    async loadPuzzles() {
        this.acquiredPuzzles = await this.storageService.getAcquiredKhiiPuzzles();
        this.puzzles = await this.commandService.featchAllKhiiPuzzles();
        console.log(this.puzzles)

        // this.puzzles.forEach(c => {
        //     //this.numTreasures += c.Treasures.length;
        //     //c.Treasures.forEach(t => {
        //       if(this.acquiredPuzzles.filter(at => 
        //           at === c.Id
        //       ).length !== 0) {
        //         c.Acquired = true;
        //       }
        //     //})
        //   });

          this.puzzleGroup = [];
          // Load last seleted
      
          this.puzzleGroup.push(await this.loadPuzzleGroup("Twilight Town"));
          this.puzzleGroup.push(await this.loadPuzzleGroup("Radiant Garden"));
          this.puzzleGroup.push(await this.loadPuzzleGroup("Beast’s Castle"));
          this.puzzleGroup.push(await this.loadPuzzleGroup("Olympus Coliseum"));
          this.puzzleGroup.push(await this.loadPuzzleGroup("Agrabah"));
          this.puzzleGroup.push(await this.loadPuzzleGroup("The Land of Dragons"));
          this.puzzleGroup.push(await this.loadPuzzleGroup("100 Acre Wood"));
          this.puzzleGroup.push(await this.loadPuzzleGroup("Pride Lands"));
          this.puzzleGroup.push(await this.loadPuzzleGroup("Atlantica"));
          this.puzzleGroup.push(await this.loadPuzzleGroup("Disney Castle"));
          this.puzzleGroup.push(await this.loadPuzzleGroup("Timeless River"));
          this.puzzleGroup.push(await this.loadPuzzleGroup("Halloween Town"));
          this.puzzleGroup.push(await this.loadPuzzleGroup("Port Royal"));
          this.puzzleGroup.push(await this.loadPuzzleGroup("Space Paranoids"));
          this.puzzleGroup.push(await this.loadPuzzleGroup("The World That Never Was"));
      
          this.numTreasures = 0;
          this.puzzleGroup.forEach(c => {
            this.numTreasures += c.Treasures.length;
            c.Treasures.forEach(t => {
              if(this.acquiredPuzzles.filter(at => 
                  at === t.Id
              ).length !== 0) {
                t.Acquired = true;
              }
            })
          });
    }

    async selectedPuzzle(p: KhiiPuzzle) {
        if (this.selected.Id === p.Id) {
            p.Acquired = !p.Acquired;
            if (p.Acquired) {
                var ap = await this.storageService.getAcquiredKhiiPuzzles();
                var i = ap.filter((at =>
                    at === p.Id
                ));
                if (i.length === 0) {
                    ap.push(p.Id);
                }
                this.acquiredPuzzles = ap;

            } else {
                var ap = await this.storageService.getAcquiredKhiiPuzzles();
                var i = ap.filter((at =>
                    at === p.Id
                ));
                if (i.length === 1) {
                    var index = ap.indexOf(p.Id, 0);
                    if (index > -1) {
                        ap.splice(index, 1);
                    }
                }

            }

            this.storageService.setAcquiredKhiiPuzzles(ap);

            this.acquiredPuzzles = ap;
        } else {
            this.selected.Selected = false;
        }

        this.selected = p;
        this.selected.Selected = true;
    }

    async loadPuzzleGroup(world): Promise<KhiiPuzzleGroup> {
        let group = new KhiiPuzzleGroup();
        group.Group = world;

        //console.log(this.puzzles);
        console.log(group.Group)
    
        group.Treasures = this.puzzles.filter(t => t.World.indexOf(world) !== -1);
        console.log(group.Treasures)
        group.Treasures = group.Treasures.sort((a: KhiiPuzzle, b: KhiiPuzzle) => {
          if (a.OrderNumber < b.OrderNumber) {
            return -1;
          } else if (a.OrderNumber > b.OrderNumber) {
            return 1;
          } else {
            return 0;
          }
        });

        //console.log(group)

        return group;
    }

    async sortBy() {
        var puzzles = this.puzzles;



        switch (this.sort1) {
            case 'Puzzle': {
                puzzles = puzzles.sort((a: KhiiPuzzle, b: KhiiPuzzle) => {
                    if (this.sort1Direction === "A" && a.Puzzle > b.Puzzle) {
                        return 1;
                    } else if (this.sort1Direction === "A" && a.Puzzle < b.Puzzle) {
                        return -1;
                    } else if (this.sort1Direction === "D" && a.Puzzle < b.Puzzle) {
                        return 1;
                    } else if (this.sort1Direction === "D" && a.Puzzle > b.Puzzle) {
                        return -1;
                    } else {
                        return 0;
                    }
                });
                break;
            }
            case 'Piece': {
                puzzles = puzzles.sort((a: KhiiPuzzle, b: KhiiPuzzle) => {
                    if (this.sort1Direction === "A" && a.PieceNumber > b.PieceNumber) {
                        return 1;
                    } else if (this.sort1Direction === "A" && a.PieceNumber < b.PieceNumber) {
                        return -1;
                    } else if (this.sort1Direction === "D" && a.PieceNumber < b.PieceNumber) {
                        return 1;
                    } else if (this.sort1Direction === "D" && a.PieceNumber > b.PieceNumber) {
                        return -1;
                    } else {
                        return 0;
                    }
                });
                break;
            }
            case 'World': {
                puzzles = puzzles.sort((a: KhiiPuzzle, b: KhiiPuzzle) => {
                    if (this.sort1Direction === "A" && a.World > b.World) {
                        return 1;
                    } else if (this.sort1Direction === "A" && a.World < b.World) {
                        return -1;
                    } else if (this.sort1Direction === "D" && a.World < b.World) {
                        return 1;
                    } else if (this.sort1Direction === "D" && a.World > b.World) {
                        return -1;
                    } else {
                        return 0;
                    }
                });
                break;
            }
            case 'Area': {
                puzzles = puzzles.sort((a: KhiiPuzzle, b: KhiiPuzzle) => {
                    if (this.sort1Direction === "A" && a.Area > b.Area) {
                        return 1;
                    } else if (this.sort1Direction === "A" && a.Area < b.Area) {
                        return -1;
                    } else if (this.sort1Direction === "D" && a.Area < b.Area) {
                        return 1;
                    } else if (this.sort1Direction === "D" && a.Area > b.Area) {
                        return -1;
                    } else {
                        return 0;
                    }
                });
                break;
            }
            case 'Notes': {
                puzzles = puzzles.sort((a: KhiiPuzzle, b: KhiiPuzzle) => {
                    if (this.sort1Direction === "A" && a.Notes > b.Notes) {
                        return 1;
                    } else if (this.sort1Direction === "A" && a.Notes < b.Notes) {
                        return -1;
                    } else if (this.sort1Direction === "D" && a.Notes < b.Notes) {
                        return 1;
                    } else if (this.sort1Direction === "D" && a.Notes > b.Notes) {
                        return -1;
                    } else {
                        return 0;
                    }
                });
                break;
            }
        }

        // if(this.sort1 != this.sort2) {
        // switch (this.sort2) {
        //     case 'Puzzle': {
        //         puzzles = puzzles.((a: KhiiPuzzle, b: KhiiPuzzle) => {
        //             if (this.sort2Direction === "A" && a.Puzzle < b.Puzzle) {
        //                 return 1;
        //             } else if (this.sort2Direction === "A" && a.Puzzle > b.Puzzle) {
        //                 return -1;
        //             }else if (this.sort2Direction === "D" && a.Puzzle > b.Puzzle) {
        //                 return 1;
        //             } else if (this.sort2Direction === "D" && a.Puzzle < b.Puzzle) {
        //                 return -1;
        //             } else {
        //                 return 0;
        //             }
        //         });
        //         break;
        //     }
        //     case 'Piece': {
        //         puzzles = puzzles.sort((a: KhiiPuzzle, b: KhiiPuzzle) => {
        //             if (this.sort2Direction === "A" && a.PieceNumber < b.PieceNumber) {
        //                 return 1;
        //             } else if (this.sort2Direction === "A" && a.PieceNumber > b.PieceNumber) {
        //                 return -1;
        //             }else if (this.sort2Direction === "D" && a.PieceNumber > b.PieceNumber) {
        //                 return 1;
        //             } else if (this.sort2Direction === "D" && a.PieceNumber < b.PieceNumber) {
        //                 return -1;
        //             } else {
        //                 return 0;
        //             }
        //         });
        //         break;
        //     }
        //     case 'World': {
        //         puzzles = puzzles.sort((a: KhiiPuzzle, b: KhiiPuzzle) => {
        //             if (this.sort2Direction === "A" && a.World < b.World) {
        //                 return 1;
        //             } else if (this.sort2Direction === "A" && a.World > b.World) {
        //                 return -1;
        //             }else if (this.sort2Direction === "D" && a.World > b.World) {
        //                 return 1;
        //             } else if (this.sort2Direction === "D" && a.World < b.World) {
        //                 return -1;
        //             } else {
        //                 return 0;
        //             }
        //         });
        //         break;
        //     }
        //     case 'Area': {
        //         puzzles = puzzles.sort((a: KhiiPuzzle, b: KhiiPuzzle) => {
        //             if (this.sort2Direction === "A" && a.Area < b.Area) {
        //                 return 1;
        //             } else if (this.sort2Direction === "A" && a.Area > b.Area) {
        //                 return -1;
        //             }else if (this.sort2Direction === "D" && a.Area > b.Area) {
        //                 return 1;
        //             } else if (this.sort2Direction === "D" && a.Area < b.Area) {
        //                 return -1;
        //             } else {
        //                 return 0;
        //             }
        //         });
        //         break;
        //     }
        //     case 'Notes': {
        //         puzzles = puzzles.sort((a: KhiiPuzzle, b: KhiiPuzzle) => {
        //             if (this.sort2Direction === "A" && a.Notes < b.Notes) {
        //                 return 1;
        //             } else if (this.sort2Direction === "A" && a.Notes > b.Notes) {
        //                 return -1;
        //             }else if (this.sort2Direction === "D" && a.Notes > b.Notes) {
        //                 return 1;
        //             } else if (this.sort2Direction === "D" && a.Notes < b.Notes) {
        //                 return -1;
        //             } else {
        //                 return 0;
        //             }
        //         });
        //         break;
        //     }
        // }
        //}

        this.puzzles = puzzles;
    }

}