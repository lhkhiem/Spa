import { Model, Optional } from 'sequelize';
interface MediaFolderAttributes {
    id: string;
    name: string;
    parent_id?: string | null;
    created_at?: Date;
    updated_at?: Date;
}
interface MediaFolderCreationAttributes extends Optional<MediaFolderAttributes, 'id' | 'created_at' | 'updated_at' | 'parent_id'> {
}
declare class MediaFolder extends Model<MediaFolderAttributes, MediaFolderCreationAttributes> implements MediaFolderAttributes {
    id: string;
    name: string;
    parent_id?: string | null;
    readonly created_at: Date;
    readonly updated_at: Date;
}
export default MediaFolder;
//# sourceMappingURL=MediaFolder.d.ts.map