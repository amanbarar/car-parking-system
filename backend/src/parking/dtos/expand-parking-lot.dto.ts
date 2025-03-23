import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsInt, Min } from 'class-validator';

export class ExpandParkingLotDto {
    @ApiProperty({ description: 'Number of slots to expand the parking lot by.', minimum: 1, example: 2 })
    @IsNotEmpty({ message: `Parameter 'size' is required.` })
    @IsInt()
    @Min(1, { message: 'Expansion size must be at least 1.' })
    size: number;
}
