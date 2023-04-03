import { KhiiDrop } from "./khii-drop"

export class KhiiMaterial {
    public MaterialId: number;
    public Name: string;
    public Rank: string;
    public Drops: KhiiDrop[] = new Array<KhiiDrop>();
    public Selected: boolean = false;
    public Image: string;
    public OrderNumber: number;
    public Count: number = 0;
}