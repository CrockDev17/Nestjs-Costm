import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class CreatePresenceSessionDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(120)
  cours: string;
}
