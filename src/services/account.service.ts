import { User } from '../entity/user.entity';
import { UserRole } from '../enums/UserRole';
import { Specialization } from '../enums/Specialization';
import { AuthType } from '../enums/AuthType';
import { generateRandomPassword } from '../utils/passwordGenerator';
import { EmailService } from './email.service';
import { Repository } from 'typeorm';

interface CreateUserDto {
    email: string;
    name: string;
    username: string;
    specialization?: Specialization;
    about?: string;
    role: UserRole.STUDENT | UserRole.INSTRUCTOR;
}

export class AccountService {
    constructor(
        private userRepository: Repository<User>,
        private emailService: EmailService
    ) {}

    async createUserAccount(dto: CreateUserDto) {
        try {
            // Kiểm tra email đã tồn tại
            const existingUser = await this.userRepository.findOne({ 
                where: [
                    { email: dto.email },
                    { username: dto.username }
                ] 
            });
            
            if (existingUser) {
                throw new Error('Email or username already exists');
            }

            // Tạo mật khẩu ngẫu nhiên
            const randomPassword = generateRandomPassword();

            // Tạo user mới
            const user = new User();
            user.name = dto.name;
            user.username = dto.username;
            user.email = dto.email;
            user.hash_password = await user.hashPassword(randomPassword, AuthType.LOCAL);
            user.specialization = dto.specialization || Specialization.NONE;

            // Xử lý role
            if (dto.role === UserRole.INSTRUCTOR) {
                user.about = dto.about || '';
                user.role = UserRole.PENDING_APPROVAL;
            } else {
                user.role = UserRole.STUDENT;
            }

            // Lưu user
            await this.userRepository.save(user);

            // Gửi email thông báo
            await this.emailService.sendAccountCreationEmail(dto.email, {
                name: dto.name,
                email: dto.email,
                password: randomPassword,
                role: dto.role
            });

            return {
                success: true,
                message: 'Account created successfully'
            };
        } catch (error) {
            throw new Error(`Failed to create account: ${error instanceof Error ? error.message : String(error)}`);
        }
    }
}