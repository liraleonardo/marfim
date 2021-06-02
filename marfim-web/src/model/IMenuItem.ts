import { MenuItem } from 'primereact/components/menuitem/MenuItem';

export default interface IMenuItem {
  id: number;
  label: string;
  icon: string;
  pageUrl?: string;
  resourceCode: string;
  children?: IMenuItem[];
}

export function parseToMenuItem(
  iMenu: IMenuItem,
  command: (url: string) => void,
): MenuItem {
  return {
    label: iMenu.label,
    icon: iMenu.icon,
    command: () => (iMenu.pageUrl ? command(iMenu.pageUrl) : undefined),
    items: iMenu.children
      ? iMenu.children.map((child) => parseToMenuItem(child, command))
      : undefined,
    className: iMenu.children ? 'expandable-menu-item' : '',
  };
}
