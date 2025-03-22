import { IsString, IsNotEmpty, IsInt, Min } from 'class-validator';

export class CreateParkingLotDto {
    @IsString()
    @IsNotEmpty({ message: 'Parking lot ID is required.' })
    id: string;

    @IsInt()
    @Min(1, { message: 'Parking lot size must be at least 1.' })
    size: number;
}
