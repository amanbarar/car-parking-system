import { IsNotEmpty, IsString } from 'class-validator';

export class GetSlotByRegDto {
    @IsNotEmpty({ message: 'Car registration number is required.' })
    @IsString()
    regNo: string;

    // @IsNotEmpty({ message: 'Parking lot ID is required.' })
    // @IsString()
    // id: string;
}
