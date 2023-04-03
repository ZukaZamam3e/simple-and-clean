import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import 'rxjs';
import 'rxjs/add/operator/map';
import { Command } from './command';
import { Ability } from './ability';
import { MeldResult } from './meldresult';
import { Character } from './character';
import { CharacterTreasure } from './character-treasure';
import { PACKAGE_ROOT_URL } from '@angular/core/src/application_tokens';
import { KhiiPuzzle } from './khiipuzzle';
import { KhiiTreasure } from './khiitreasure';
import { KhiiRecipe } from './khii-recipe';
import { KhiiMaterial } from './khii-material';

@Injectable()
export class CommandService {
    constructor(private http: Http) {
    }

    // Async version
    async fetchAllCommands(): Promise<Command[]> {
        const url = `./assets/data/commands.json`;
        return this.http.get(url)
            .retry(2)
            .map(x => {
                var result: Command[] = x.json();
                result = result.sort((a: Command, b: Command) => {
                    if (a.Ability < b.Ability) {
                        return -1;
                    } else if (a.Ability > b.Ability) {
                        return 1;
                    } else {
                        return 0;
                    }
                });
                return result;
            })
            .toPromise();
    }

    // Async version
    async fetchAllAbilites(): Promise<Ability[]> {
        const url = `./assets/data/abilities.json`;
        return this.http.get(url)
            .retry(2)
            .map(x => {
                var result: Ability[] = x.json();
                result = result.sort((a: Ability, b: Ability) => {
                    if (a.Type < b.Type) {
                        return -1;
                    } else if (a.Type > b.Type) {
                        return 1;
                    } else {
                        return 0;
                    }
                });
                return result;
            })
            .toPromise();
    }

    // Async version
    async fetchAllMeldResults(): Promise<MeldResult[]> {
        const url = `./assets/data/melding.json`;
        return this.http.get(url)
            .retry(2)
            .map(x => {
                var result: MeldResult[] = x.json();
                result = result.sort((a: MeldResult, b: MeldResult) => {
                    if (a.Type < b.Type) {
                        return -1;
                    } else if (a.Type > b.Type) {
                        return 1;
                    } else {
                        return 0;
                    }
                });
                return result;
            })
            .toPromise();
    }

    // Async version
    async fetchAllCollection(): Promise<Character[]> {
        const url = `./assets/data/collection.json`;
        return this.http.get(url)
            .retry(2)
            .map(x => {
                var result: Character[] = x.json();
                return result;
            })
            .toPromise();
    }

    async fetchAllTreasures(): Promise<CharacterTreasure[]> {
        const url = `./assets/data/treasures.json`;
        return this.http.get(url)
            .retry(2)
            .map(x => {
                var result: CharacterTreasure[] = x.json();
                return result;
            })
            .toPromise();
    }

    async featchAllKhiiPuzzles(): Promise<KhiiPuzzle[]> {
        const url = `./assets/data/kh2puzzles.json`;
        return this.http.get(url)
            .retry(2)
            .map(x => {
                var result: KhiiPuzzle[] = x.json();
                return result;
            })
            .toPromise();
    }

    async fetchAllKhiiTreasure(): Promise<KhiiTreasure[]> {
        const url = `./assets/data/khiitreasures.json`;
        return this.http.get(url)
            .retry(2)
            .map(x => {
                var result: KhiiTreasure[] = x.json();
                return result;
            })
            .toPromise();
    }

    async fetchAllKhiiRecipes(): Promise<KhiiRecipe[]> {
        const url = `./assets/data/kh2recipes.json`;
        return this.http.get(url)
            .retry(2)
            .map(x => {
                var result: KhiiRecipe[] = x.json();
                return result;
            })
            .toPromise();
    }

    async fetchAllKhiiMaterials(): Promise<KhiiMaterial[]> {
        const url = `./assets/data/kh2materials.json`;
        return this.http.get(url)
            .retry(2)
            .map(x => {
                var result: KhiiMaterial[] = x.json();
                return result;
            })
            .toPromise();
    }
}