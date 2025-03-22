import { IsNotEmpty, IsString } from 'class-validator';

export class GetOccupiedSlotsDto {
    @IsNotEmpty({ message: 'Parking lot ID is required.' })
    @IsString()
    lotId: string;
}
