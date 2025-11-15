export interface MegaMenuItem {
  id: string;
  title: string;
  href: string;
  description?: string;
}

export interface MegaMenuColumn {
  id: string;
  title: string;
  items: MegaMenuItem[];
}

export interface MegaMenuData {
  id: string;
  columns: MegaMenuColumn[];
  featured?: {
    title: string;
    description: string;
    image: string;
    href: string;
  };
}
