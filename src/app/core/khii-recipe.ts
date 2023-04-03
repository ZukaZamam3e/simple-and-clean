import { KhiiMaterialCount } from "./khii-material-count"
import { KhiiRecipeBooster } from "./khii-recipe-booster"

export class KhiiRecipe {
    public Id: number;
    public Name: string;
    public Rank: string;
    public Exp: number;
    public MaterialCounts: KhiiMaterialCount[] = new Array<KhiiMaterialCount>();
    public RecipeBoosters: KhiiRecipeBooster[] = new Array<KhiiRecipeBooster>();
    public Selected: boolean = false;
    public Acquired: boolean = false;
    public Image: string;
}