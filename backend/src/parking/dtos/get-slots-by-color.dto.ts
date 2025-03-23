import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class GetSlotsByColorDto {
    @ApiProperty({ description: 'Car color to search for.', example: 'Black' })
    @IsNotEmpty({ message: 'Car color is required.' })
    @IsString()
    color: string;
}
