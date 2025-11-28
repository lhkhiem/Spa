/**
 * Email Templates
 * Templates for various email notifications
 */
interface ContactFormData {
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
    subject: string;
    message: string;
    createdAt: Date;
}
/**
 * Template for admin notification when new contact form is submitted
 */
export declare function getContactNotificationTemplate(data: ContactFormData): string;
/**
 * Template for customer confirmation email
 */
export declare function getContactConfirmationTemplate(data: ContactFormData): string;
interface ContactReplyData {
    customerName: string;
    customerEmail: string;
    originalSubject: string;
    originalMessage: string;
    replyMessage: string;
    adminName: string;
    adminEmail?: string;
    repliedAt: Date;
}
/**
 * Template for admin reply to customer
 */
export declare function getContactReplyTemplate(data: ContactReplyData): string;
interface OrderConfirmationData {
    customerName: string;
    customerEmail: string;
    orderNumber: string;
    orderDate: Date;
    total: number;
    paymentMethod: string;
    items: Array<{
        name: string;
        quantity: number;
        price: number;
        subtotal: number;
    }>;
    shippingAddress: {
        name: string;
        phone: string;
        address: string;
        city: string;
        district?: string;
        ward?: string;
    };
    orderUrl?: string;
}
/**
 * Template for order confirmation email (when payment is successful)
 */
export declare function getOrderConfirmationTemplate(data: OrderConfirmationData): string;
export {};
//# sourceMappingURL=emailTemplates.d.ts.map