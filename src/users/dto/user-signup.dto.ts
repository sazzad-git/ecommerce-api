import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class UserSignupDto {
  @IsNotEmpty()
  @IsString()
  name!: string;

  @IsNotEmpty()
  @IsEmail()
  email!: string;

  @IsNotEmpty()
  @MinLength(6)
  password!: string;
}
