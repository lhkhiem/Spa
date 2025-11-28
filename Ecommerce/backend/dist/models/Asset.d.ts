import { Model } from 'sequelize';
declare class Asset extends Model {
    id: string;
    type: string;
    provider: string;
    url: string;
    cdn_url: string;
    width: number;
    height: number;
    format: string;
    sizes: any;
    folder_id?: string | null;
    readonly created_at: Date;
}
export default Asset;
//# sourceMappingURL=Asset.d.ts.map