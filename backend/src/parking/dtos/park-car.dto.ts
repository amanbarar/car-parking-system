import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class ParkCarDto {
    @ApiProperty({ description: 'Car registration number.', example: 'UP-14-DC-1987' })
    @IsNotEmpty({ message: 'Car registration number is required.' })
    @IsString()
    regNo: string;

    @ApiProperty({ description: 'Car color.', example: 'Black' })
    @IsNotEmpty({ message: 'Car color is required.' })
    @IsString()
    color: string;
}
