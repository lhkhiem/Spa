import { Model, Optional } from 'sequelize';
interface NewsletterSubscriptionAttributes {
    id: string;
    email: string;
    status: 'active' | 'unsubscribed' | 'bounced';
    subscribed_at?: Date;
    unsubscribed_at?: Date | null;
    source?: string | null;
    ip_address?: string | null;
    user_agent?: string | null;
    created_at?: Date;
    updated_at?: Date;
}
interface NewsletterSubscriptionCreationAttributes extends Optional<NewsletterSubscriptionAttributes, 'id' | 'status' | 'subscribed_at' | 'unsubscribed_at' | 'source' | 'ip_address' | 'user_agent' | 'created_at' | 'updated_at'> {
}
declare class NewsletterSubscription extends Model<NewsletterSubscriptionAttributes, NewsletterSubscriptionCreationAttributes> implements NewsletterSubscriptionAttributes {
    id: string;
    email: string;
    status: 'active' | 'unsubscribed' | 'bounced';
    subscribed_at: Date;
    unsubscribed_at: Date | null;
    source: string | null;
    ip_address: string | null;
    user_agent: string | null;
    readonly created_at: Date;
    readonly updated_at: Date;
}
export default NewsletterSubscription;
//# sourceMappingURL=NewsletterSubscription.d.ts.map