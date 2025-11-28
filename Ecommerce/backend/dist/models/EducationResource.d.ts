import { Model, Optional } from 'sequelize';
export interface EducationResourceAttributes {
    id: string;
    title: string;
    slug: string;
    description?: string | null;
    image_url: string;
    link_url: string;
    link_text?: string | null;
    duration?: string | null;
    ceus?: string | null;
    level?: string | null;
    resource_type?: string | null;
    is_featured: boolean;
    sort_order: number;
    is_active: boolean;
    created_at?: Date;
    updated_at?: Date;
}
export type EducationResourceCreationAttributes = Optional<EducationResourceAttributes, 'id' | 'slug' | 'description' | 'link_text' | 'duration' | 'ceus' | 'level' | 'resource_type' | 'is_featured' | 'sort_order' | 'is_active' | 'created_at' | 'updated_at'>;
export declare class EducationResource extends Model<EducationResourceAttributes, EducationResourceCreationAttributes> implements EducationResourceAttributes {
    id: string;
    title: string;
    slug: string;
    description: string | null;
    image_url: string;
    link_url: string;
    link_text: string | null;
    duration: string | null;
    ceus: string | null;
    level: string | null;
    resource_type: string | null;
    is_featured: boolean;
    sort_order: number;
    is_active: boolean;
    readonly created_at: Date;
    readonly updated_at: Date;
}
export default EducationResource;
//# sourceMappingURL=EducationResource.d.ts.map