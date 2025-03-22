import { IsNotEmpty, IsString, IsInt, Min } from 'class-validator';

export class ShrinkParkingLotDto {
    // @IsNotEmpty({ message: 'Parking lot ID is required.' })
    // @IsString()
    // id: string;

    @IsInt()
    @Min(1, { message: 'Reduction size must be at least 1.' })
    size: number;
}
