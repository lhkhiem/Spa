import { Model, Optional } from 'sequelize';
export interface AboutSectionAttributes {
    id: string;
    section_key: string;
    title?: string | null;
    content?: string | null;
    image_url?: string | null;
    button_text?: string | null;
    button_link?: string | null;
    list_items?: any | null;
    order_index: number;
    is_active: boolean;
    created_at?: Date;
    updated_at?: Date;
}
export type AboutSectionCreationAttributes = Optional<AboutSectionAttributes, 'id' | 'title' | 'content' | 'image_url' | 'button_text' | 'button_link' | 'list_items' | 'order_index' | 'is_active' | 'created_at' | 'updated_at'>;
export declare class AboutSection extends Model<AboutSectionAttributes, AboutSectionCreationAttributes> implements AboutSectionAttributes {
    id: string;
    section_key: string;
    title: string | null;
    content: string | null;
    image_url: string | null;
    button_text: string | null;
    button_link: string | null;
    list_items: any | null;
    order_index: number;
    is_active: boolean;
    readonly created_at: Date;
    readonly updated_at: Date;
}
export default AboutSection;
//# sourceMappingURL=AboutSection.d.ts.map