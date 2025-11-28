import { Model } from 'sequelize';
declare class Topic extends Model {
    id: string;
    name: string;
    slug: string;
    description?: string;
    color?: string;
    icon?: string;
    is_active: boolean;
    sort_order: number;
    readonly created_at: Date;
    readonly updated_at: Date;
}
export default Topic;
//# sourceMappingURL=Topic.d.ts.map