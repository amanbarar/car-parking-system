import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class GetVehiclesByColorDto {
    @ApiProperty({ description: 'Color of the vehicles to be retrieved.', example: 'Black' })
    @IsNotEmpty({ message: 'Color is required.' })
    @IsString()
    color: string;
}
