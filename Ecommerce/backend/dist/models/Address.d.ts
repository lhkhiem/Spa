import { Model } from 'sequelize';
declare class Address extends Model {
    id: string;
    user_id: string;
    first_name: string;
    last_name: string;
    company?: string;
    address_line1: string;
    address_line2?: string;
    city: string;
    state: string;
    postal_code: string;
    country: string;
    phone?: string;
    is_default: boolean;
    type: 'shipping' | 'billing' | 'both';
    readonly created_at: Date;
    readonly updated_at: Date;
}
export default Address;
//# sourceMappingURL=Address.d.ts.map