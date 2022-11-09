import { IsString, MinLength } from 'class-validator'

export class LogInModel {
    @IsString()
    public login: string = ''

    @IsString()
    @MinLength(8)
    public password: string = ''
}
