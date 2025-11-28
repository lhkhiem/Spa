import { Model } from 'sequelize';
declare class AssetFolder extends Model {
    id: string;
    name: string;
    parent_id?: string | null;
    path?: string | null;
    readonly created_at: Date;
}
export default AssetFolder;
//# sourceMappingURL=AssetFolder.d.ts.map