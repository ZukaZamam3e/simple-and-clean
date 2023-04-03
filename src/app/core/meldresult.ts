import { Ability } from './ability'
export class MeldResult {
    public First: string = '';
    public Second: string = '';
    public Outcome: string = '';
    public Who: string = '';
    public Type: string = '';
    public Percent: string = '';
    public Abilities: Ability[] = new Array<Ability>();
}