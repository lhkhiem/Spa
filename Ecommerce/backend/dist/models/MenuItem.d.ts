import { Model, Optional } from 'sequelize';
interface MenuItemAttributes {
    id: string;
    menu_location_id: string;
    parent_id?: string;
    title: string;
    url?: string;
    icon?: string;
    type: string;
    entity_id?: string;
    target: string;
    rel?: string;
    css_classes?: string;
    sort_order: number;
    is_active: boolean;
    created_at: Date;
    updated_at: Date;
}
interface MenuItemCreationAttributes extends Optional<MenuItemAttributes, 'id' | 'created_at' | 'updated_at' | 'parent_id' | 'url' | 'icon' | 'entity_id' | 'rel' | 'css_classes' | 'sort_order' | 'is_active' | 'target' | 'type'> {
}
declare class MenuItem extends Model<MenuItemAttributes, MenuItemCreationAttributes> implements MenuItemAttributes {
    id: string;
    menu_location_id: string;
    parent_id?: string;
    title: string;
    url?: string;
    icon?: string;
    type: string;
    entity_id?: string;
    target: string;
    rel?: string;
    css_classes?: string;
    sort_order: number;
    is_active: boolean;
    created_at: Date;
    updated_at: Date;
}
export default MenuItem;
//# sourceMappingURL=MenuItem.d.ts.map