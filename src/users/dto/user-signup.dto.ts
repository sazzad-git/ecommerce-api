import { IsNotEmpty, IsString } from 'class-validator';
import { UserSignInDto } from './user-signin.dto';

export class UserSignupDto extends UserSignInDto {
  @IsNotEmpty()
  @IsString()
  name: string;
}
