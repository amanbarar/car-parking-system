import { ApiProperty } from '@nestjs/swagger';
import { IsInt, Min } from 'class-validator';

export class ShrinkParkingLotDto {
    @ApiProperty({ description: 'Number of slots to remove from the parking lot.', minimum: 1, example: 2 })
    @IsInt()
    @Min(1, { message: 'Reduction size must be at least 1.' })
    size: number;
}
