import { IsNotEmpty, IsString } from 'class-validator';

export class GetSlotsByColorDto {
    @IsNotEmpty({ message: 'Car color is required.' })
    @IsString()
    color: string;

    // @IsNotEmpty({ message: 'Parking lot ID is required.' })
    // @IsString()
    // id: string;
}
