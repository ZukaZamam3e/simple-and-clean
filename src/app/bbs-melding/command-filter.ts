import { Pipe, PipeTransform } from '@angular/core';
import { Command } from '../core/command'

@Pipe({
    name: 'ability',
    pure: false
})
export class CommandFilterPipe implements PipeTransform {
    transform(items: any[], filter: Command): any {
        if (!items || !filter) {
            return items;
        }
        // filter items array, items which match and return true will be
        // kept, false will be filtered out
        return items.filter(item => item.title.indexOf(filter.Ability) !== -1);
    }
}