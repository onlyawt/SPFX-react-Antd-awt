import { Item, ItemUpdateResultData } from '@pnp/sp';

export interface IHelloWorldProps {
  description: string;
  test: string;
}
export interface ItemAddResult {
  item: Item;
  data: any;
}
export interface ItemUpdateResult {
  item: Item;
  data: ItemUpdateResultData;
}
