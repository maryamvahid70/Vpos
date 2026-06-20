export interface IContextMenuItem{
    label: string;
    action: () => void;
    icon?: string; // Optional icon for the menu item
  }