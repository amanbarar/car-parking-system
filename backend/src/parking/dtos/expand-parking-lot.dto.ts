import { IsNotEmpty, IsString, IsInt, Min } from 'class-validator';

export class ExpandParkingLotDto {
    // @IsNotEmpty({ message: 'Parking lot ID is required.' })
    // @IsString()
    // id: string;

    @IsNotEmpty({ message: `Parameter 'size' is required.` })
    @IsInt()
    @Min(1, { message: 'Expansion size must be at least 1.' })
    size: number;
}
