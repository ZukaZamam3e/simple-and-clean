import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { AcquiredCommand } from "./acquired-command";
import { AcquiredTreasure } from './acquired-treasure';
import { KhiiPuzzle } from './khiipuzzle';

@Injectable()
export class StorageService {
  isStorageReady = false;

  constructor(private storage: Storage) {
    storage.ready()
      .then(() => {
        this.isStorageReady = true;
        console.log(`Storage Ready. Using ${storage.driver}`)
      });
  }

  getAcquiredCommands(character: string): Promise<AcquiredCommand[]> {
    return this.storage.get(character + "_acquiredCommands").then((data) => {
        if(data === null) {
            return [];
        } else {
            return data;
        }
    });
  }

  setAcquiredCommands(commands: AcquiredCommand[], character: string) {
    return this.storage.set(character + '_acquiredCommands', commands);
  }

  getCharacterSelected() {
    return this.storage.get("commandCollectionCharacter").then((data) => {
      if (data === null) {
        return "Terra";
      } else {
        return data;
      }
    });
  }

  setCharacterSeleced(character: string) {
    return this.storage.set('commandCollectionCharacter', character);
  }

  getAcquiredTreasures(character: string, type: string): Promise<AcquiredTreasure[]> {
    return this.storage.get(character + "_" + type + "_acquiredTreasures").then((data) => {
        if(data === null) {
            return [];
        } else {
            return data;
        }
    });
  }

  setAcquiredTreasures(commands: AcquiredTreasure[], character: string, type: string) {
    return this.storage.set(character + "_" + type + '_acquiredTreasures', commands);
  }

  getAcquiredKhiiPuzzles(): Promise<number[]> {
    return this.storage.get("khii_puzzles").then((data) => {
        if(data === null) {
            return [];
        } else {
            return data;
        }
    });
  }

  setAcquiredKhiiPuzzles(commands: number[]) {
    return this.storage.set("khii_puzzles", commands);
  }

  getAcquiredKhiiTreasures(): Promise<number[]> {
    return this.storage.get("khii_treasures").then((data) => {
        if(data === null) {
            return [];
        } else {
            return data;
        }
    });
  }

  setAcquiredKhiiTreasures(commands: number[]) {
    return this.storage.set("khii_treasures", commands);
  }

  getAcquiredKhiiRecipes(): Promise<number[]> {
    return this.storage.get("khii_recipes").then((data) => {
        if(data === null) {
            return [];
        } else {
            return data;
        }
    });
  }

  setAcquiredKhiiRecipes(commands: number[]) {
    return this.storage.set("khii_recipes", commands);
  }
}

// Pseudo Guid generator. Good enough for address.id value.
class Guid {
  static newGuid(): string {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'
      .replace(/[xy]/g, (c) => {
        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
      });
  }
}
