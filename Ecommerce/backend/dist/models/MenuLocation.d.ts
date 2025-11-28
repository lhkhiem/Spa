import { Model, Optional } from 'sequelize';
interface MenuLocationAttributes {
    id: string;
    name: string;
    slug: string;
    description?: string;
    is_active: boolean;
    created_at: Date;
    updated_at: Date;
}
interface MenuLocationCreationAttributes extends Optional<MenuLocationAttributes, 'id' | 'created_at' | 'updated_at' | 'description' | 'is_active'> {
}
declare class MenuLocation extends Model<MenuLocationAttributes, MenuLocationCreationAttributes> implements MenuLocationAttributes {
    id: string;
    name: string;
    slug: string;
    description?: string;
    is_active: boolean;
    created_at: Date;
    updated_at: Date;
}
export default MenuLocation;
//# sourceMappingURL=MenuLocation.d.ts.map