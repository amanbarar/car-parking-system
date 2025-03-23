import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class GetOccupiedSlotsDto {
    @ApiProperty({ description: 'ID of the parking lot.', example: 'PL1' })
    @IsNotEmpty({ message: 'Parking lot ID is required.' })
    @IsString()
    lotId: string;
}
