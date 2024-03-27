export type Item = ItemWithHref | ItemWithChildren;

export interface ItemWithHref {
  title: string;
  href: string;
}

export interface ItemWithChildren {
  title: string;
  items: ItemWithHref[];
}
