import { Model } from 'sequelize';
declare class User extends Model {
    id: string;
    email: string;
    password_hash: string;
    name: string;
    status: string;
    role: string;
    readonly created_at: Date;
    readonly updated_at: Date;
}
export default User;
//# sourceMappingURL=User.d.ts.map