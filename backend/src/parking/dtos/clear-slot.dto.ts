import { IsInt, Min } from 'class-validator';

export class ClearSlotDto {
    @IsInt()
    @Min(1, { message: 'Slot number must be at least 1.' })
    slotNumber: number;
}
