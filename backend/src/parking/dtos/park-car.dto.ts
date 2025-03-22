import { IsNotEmpty, IsString } from 'class-validator';

export class ParkCarDto {
    @IsNotEmpty({ message: 'Car registration number is required.' })
    @IsString()
    regNo: string;

    @IsNotEmpty({ message: 'Car color is required.' })
    @IsString()
    color: string;
}
