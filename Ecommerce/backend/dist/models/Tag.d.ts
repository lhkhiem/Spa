import { Model } from 'sequelize';
declare class Tag extends Model {
    id: string;
    name: string;
    slug: string;
    description?: string;
    color?: string;
    is_active: boolean;
    post_count: number;
    readonly created_at: Date;
    readonly updated_at: Date;
}
export default Tag;
//# sourceMappingURL=Tag.d.ts.map