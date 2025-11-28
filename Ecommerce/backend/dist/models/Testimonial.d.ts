import { Model, Optional } from 'sequelize';
export interface TestimonialAttributes {
    id: string;
    customer_name: string;
    customer_title?: string | null;
    customer_initials?: string | null;
    testimonial_text: string;
    rating?: number | null;
    is_featured: boolean;
    sort_order: number;
    is_active: boolean;
    created_at?: Date;
    updated_at?: Date;
}
export type TestimonialCreationAttributes = Optional<TestimonialAttributes, 'id' | 'customer_title' | 'customer_initials' | 'rating' | 'is_featured' | 'sort_order' | 'is_active' | 'created_at' | 'updated_at'>;
export declare class Testimonial extends Model<TestimonialAttributes, TestimonialCreationAttributes> implements TestimonialAttributes {
    id: string;
    customer_name: string;
    customer_title: string | null;
    customer_initials: string | null;
    testimonial_text: string;
    rating: number | null;
    is_featured: boolean;
    sort_order: number;
    is_active: boolean;
    readonly created_at: Date;
    readonly updated_at: Date;
}
export default Testimonial;
//# sourceMappingURL=Testimonial.d.ts.map