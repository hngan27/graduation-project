import nodemailer from 'nodemailer';
import { UserRole } from '../enums/UserRole';

interface AccountCreationEmailData {
    name: string;
    email: string;
    password: string;
    role: UserRole;
}

export class EmailService {
    private transporter;

    constructor() {
        this.transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: parseInt(process.env.SMTP_PORT || '465'),
            secure: true,
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS
            }
        });
    }

    async sendAccountCreationEmail(to: string, data: AccountCreationEmailData) {
        let roleText: string;
        let additionalInfo: string = '';

        switch (data.role) {
            case UserRole.STUDENT:
                roleText = 'Học viên';
                break;
            case UserRole.INSTRUCTOR:
                roleText = 'Giảng viên';
                additionalInfo = `
                <p><strong>Lưu ý:</strong> Tài khoản của bạn đang chờ được phê duyệt từ Admin.</p>`;
                break;
            default:
                roleText = 'Người dùng';
        }
        
        const htmlContent = `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h2>Chào mừng ${data.name} đến với E-learning!</h2>
                
                <div style="background-color: #f8f9fa; padding: 20px; border-radius: 5px; margin: 20px 0;">
                    <p>Tài khoản ${roleText} của bạn đã được tạo thành công.</p>
                    
                    <h3>Thông tin đăng nhập của bạn:</h3>
                    <ul>
                        <li>Email: ${data.email}</li>
                        <li>Mật khẩu: ${data.password}</li>
                    </ul>
                    
                    ${additionalInfo}
                    
                    <p><strong>Lưu ý:</strong> Vui lòng đăng nhập và đổi mật khẩu ngay khi nhận được email này.</p>
                </div>

                <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;">
                    <p>Trân trọng,</p>
                    <p>Ban quản trị E-learning</p>
                </div>
            </div>
        `;

        try {
            await this.transporter.sendMail({
                from: process.env.SMTP_USER, // Sử dụng trực tiếp email đã cấu hình
                to: to,
                subject: 'Thông tin tài khoản E-learning của bạn',
                html: htmlContent
            });

            return {
                success: true,
                message: 'Email sent successfully'
            };
        } catch (error) {
            console.error('Error sending email:', error);
            throw new Error('Failed to send email notification');
        }
    }

    async sendInstructorApprovalEmail(to: string, name: string) {
        const htmlContent = `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h2>Xin chúc mừng ${name}!</h2>
                
                <div style="background-color: #f8f9fa; padding: 20px; border-radius: 5px; margin: 20px 0;">
                    <p>Tài khoản Giảng viên của bạn đã được phê duyệt.</p>
                    <p>Bạn có thể đăng nhập và bắt đầu tạo các khóa học của mình.</p>
                </div>

                <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;">
                    <p>Trân trọng,</p>
                    <p>Ban quản trị E-learning</p>
                </div>
            </div>
        `;

        try {
            await this.transporter.sendMail({
                from: process.env.SMTP_USER, // Sử dụng trực tiếp email đã cấu hình
                to: to,
                subject: 'Tài khoản Giảng viên đã được phê duyệt',
                html: htmlContent
            });

            return {
                success: true,
                message: 'Approval email sent successfully'
            };
        } catch (error) {
            console.error('Error sending approval email:', error);
            throw new Error('Failed to send approval email');
        }
    }
}