import { IsAlphanumeric, IsEmail, IsString, MinLength } from 'class-validator'

export class SignUpModel {
    @IsAlphanumeric()
    public username: string = ''

    @IsEmail()
    public email: string = ''

    @IsString()
    @MinLength(8)
    public password: string = ''
}
