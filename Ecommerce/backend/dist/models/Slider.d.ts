import { Model, Optional } from 'sequelize';
export interface SliderAttributes {
    id: string;
    title: string;
    description?: string | null;
    button_text?: string | null;
    button_link?: string | null;
    image_id?: string | null;
    image_url?: string | null;
    order_index: number;
    is_active: boolean;
    created_at?: Date;
    updated_at?: Date;
}
export interface SliderCreationAttributes extends Optional<SliderAttributes, 'id' | 'created_at' | 'updated_at'> {
}
export declare class Slider extends Model<SliderAttributes, SliderCreationAttributes> implements SliderAttributes {
    id: string;
    title: string;
    description: string | null;
    button_text: string | null;
    button_link: string | null;
    image_id: string | null;
    image_url: string | null;
    order_index: number;
    is_active: boolean;
    readonly created_at: Date;
    readonly updated_at: Date;
}
//# sourceMappingURL=Slider.d.ts.map