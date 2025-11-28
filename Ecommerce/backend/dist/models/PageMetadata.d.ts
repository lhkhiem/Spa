import { Model, Optional } from 'sequelize';
export interface PageMetadataAttributes {
    id: string;
    path: string;
    title: string | null;
    description: string | null;
    og_image: string | null;
    keywords: string[] | null;
    enabled: boolean;
    auto_generated: boolean;
    created_at: Date;
    updated_at: Date;
}
interface PageMetadataCreationAttributes extends Optional<PageMetadataAttributes, 'id' | 'title' | 'description' | 'og_image' | 'keywords' | 'enabled' | 'auto_generated' | 'created_at' | 'updated_at'> {
}
export declare class PageMetadata extends Model<PageMetadataAttributes, PageMetadataCreationAttributes> implements PageMetadataAttributes {
    id: string;
    path: string;
    title: string | null;
    description: string | null;
    og_image: string | null;
    keywords: string[] | null;
    enabled: boolean;
    auto_generated: boolean;
    readonly created_at: Date;
    readonly updated_at: Date;
}
export default PageMetadata;
//# sourceMappingURL=PageMetadata.d.ts.map