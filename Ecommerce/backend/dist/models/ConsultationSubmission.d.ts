import { Model } from 'sequelize';
declare class ConsultationSubmission extends Model {
    id: string;
    name: string;
    phone: string;
    email: string | null;
    province: string;
    message: string | null;
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
export default ConsultationSubmission;
//# sourceMappingURL=ConsultationSubmission.d.ts.map