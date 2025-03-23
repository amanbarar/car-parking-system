import { ApiProperty } from '@nestjs/swagger';
import { IsInt, Min } from 'class-validator';

export class ClearSlotDto {
    @ApiProperty({ description: 'The slot number to be cleared.', minimum: 1, example: 5 })
    @IsInt()
    @Min(1, { message: 'Slot number must be at least 1.' })
    slotNumber: number;
}
