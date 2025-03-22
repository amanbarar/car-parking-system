import { IsNotEmpty, IsInt, Min } from 'class-validator';

export class ExpandParkingLotDto {
    @IsNotEmpty({ message: `Parameter 'size' is required.` })
    @IsInt()
    @Min(1, { message: 'Expansion size must be at least 1.' })
    size: number;
}
