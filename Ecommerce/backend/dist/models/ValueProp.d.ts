import { Model, Optional } from 'sequelize';
export interface ValuePropAttributes {
    id: string;
    title: string;
    subtitle?: string | null;
    icon_key?: string | null;
    icon_color?: string | null;
    icon_background?: string | null;
    sort_order: number;
    is_active: boolean;
    created_at?: Date;
    updated_at?: Date;
}
export type ValuePropCreationAttributes = Optional<ValuePropAttributes, 'id' | 'subtitle' | 'icon_key' | 'icon_color' | 'icon_background' | 'sort_order' | 'is_active' | 'created_at' | 'updated_at'>;
export declare class ValueProp extends Model<ValuePropAttributes, ValuePropCreationAttributes> implements ValuePropAttributes {
    id: string;
    title: string;
    subtitle: string | null;
    icon_key: string | null;
    icon_color: string | null;
    icon_background: string | null;
    sort_order: number;
    is_active: boolean;
    readonly created_at: Date;
    readonly updated_at: Date;
}
export default ValueProp;
//# sourceMappingURL=ValueProp.d.ts.map