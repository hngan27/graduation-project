import { IsString, MinLength, IsEmail } from 'class-validator';
import i18next from 'i18next';

export class LoginDTO {
  @IsEmail({}, { message: () => i18next.t('login.errors.email_invalid') })
  email: string;

  @IsString({ message: i18next.t('login.errors.password_required') })
  @MinLength(3, { message: i18next.t('login.errors.password_length') })
  password: string;
}
