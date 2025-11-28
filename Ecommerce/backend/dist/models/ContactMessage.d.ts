import { Model } from 'sequelize';
declare class ContactMessage extends Model {
    id: string;
    first_name: string;
    last_name: string;
    email: string;
    phone: string | null;
    subject: string;
    message: string;
    status: string;
    assigned_to: string | null;
    replied_at: Date | null;
    replied_by: string | null;
    reply_message: string | null;
    ip_address: string | null;
    user_agent: string | null;
    readonly created_at: Date;
    readonly updated_at: Date;
}
export default ContactMessage;
//# sourceMappingURL=ContactMessage.d.ts.map