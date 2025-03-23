import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsInt, Min } from 'class-validator';

export class CreateParkingLotDto {
    @ApiProperty({ description: 'Unique identifier for the parking lot.', example: 'PL1' })
    @IsString()
    @IsNotEmpty({ message: 'Parking lot ID is required.' })
    id: string;

    @ApiProperty({ description: 'Total number of slots in the parking lot.', minimum: 1, example: 5 })
    @IsInt()
    @Min(1, { message: 'Parking lot size must be at least 1.' })
    size: number;
}
