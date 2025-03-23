import { IsNotEmpty, IsString } from 'class-validator';

export class GetVehiclesByColorDto {
    @IsNotEmpty({ message: 'Color is required.' })
    @IsString()
    color: string;
}