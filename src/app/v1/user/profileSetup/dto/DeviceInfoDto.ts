import { IsDefined, IsString, IsNumber } from 'class-validator';

export class DeviceInfoDto {

    @IsDefined()
    @IsString()
    device_id: string | null;

    @IsDefined()
    @IsNumber()
    device_type: number;

    @IsDefined()
    @IsString()
    auth_token: string | null;

    @IsDefined()
    @IsString()
    device_token: string | null;

    @IsDefined()
    @IsString()
    app_version: string | null;

    @IsDefined()
    @IsString()
    os: string | null;

    @IsDefined()
    @IsString()
    language: string | null;
}
