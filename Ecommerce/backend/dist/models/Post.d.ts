import { Model } from 'sequelize';
declare class Post extends Model {
    id: string;
    title: string;
    slug: string;
    excerpt: string;
    content: any;
    cover_asset_id: string;
    status: string;
    author_id: string;
    published_at: Date;
    seo: any;
    header_code: string;
    is_featured: boolean;
    read_time: string | null;
    readonly created_at: Date;
    readonly updated_at: Date;
}
export default Post;
//# sourceMappingURL=Post.d.ts.map