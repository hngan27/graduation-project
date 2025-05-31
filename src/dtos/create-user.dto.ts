import { IsEmail, IsEnum, IsNotEmpty } from 'class-validator';
import { UserRole } from '../enums/UserRole';

export class CreateUserDTO {
  @IsNotEmpty({ message: 'validation.name_required' })
  name: string;

  @IsEmail({}, { message: 'validation.email_invalid' })
  email: string;

  @IsEnum(UserRole, { message: 'validation.role_required' })
  role: UserRole;
}
