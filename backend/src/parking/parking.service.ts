import { Injectable } from '@nestjs/common';
import { NotFoundException, BadRequestException } from '@nestjs/common';

import { ParkingLot } from './entities/parking-lot.entity';
import { Car } from './entities/car.entity';

@Injectable()
export class ParkingService {
    private parkingLots: Map<string, ParkingLot> = new Map();

    createParkingLot(id: string, size: number) {
        if (this.parkingLots.has(id)) {
            throw new BadRequestException(`Parking lot with ID "${id}" already exists.`);
        }
        this.parkingLots.set(id, new ParkingLot(size));
    }

    // getAllParkingLots() {
    //     console.log('parkingLots object');
    //     console.log(this.parkingLots);
    //     console.log('parkingLots array');
    //     console.log(Array.from(this.parkingLots));
    //     return Array.from(this.parkingLots);
    // }

    getAllParkingLots() {
        return Array.from(this.parkingLots, ([lotId, parkingLot]) => ({
            lotId,
            totalSlots: parkingLot.getTotalSlots(),
            occupiedSlots: Array.from(parkingLot.getOccupiedSlots().entries()).map(([slot, car]) => ({
                slot,
                car: car.toJSON()
            })),
            availableSlots: parkingLot.getAvailableSlots(),
            // colorIndex: Object.fromEntries(parkingLot.getColorIndex().entries()),
            colorIndex: Object.fromEntries(
                Array.from(parkingLot.getColorIndex().entries()).map(([color, slots]) => [color, Array.from(slots)])
            ),
            regIndex: Object.fromEntries(parkingLot.getRegIndex().entries())
        }));
    }

    expandParkingLot(lotId: string, size: number) {
        const parkingLot = this.isParkingLot(lotId);
        return parkingLot.expandSlots(size);
    }

    shrinkParkingLot(lotId: string, size: number) {
        const parkingLot = this.isParkingLot(lotId);
        return parkingLot.shrinkSlots(size);
    }

    parkCar(lotId: string, regNo: string, color: string) {
        const parkingLot = this.isParkingLot(lotId);
        const car = new Car(regNo, color);
        return parkingLot.allocateSlot(car);
    }

    freeSlot(lotId: string, slotNumber: number) {
        const parkingLot = this.isParkingLot(lotId);
        return parkingLot.freeSlot(slotNumber);
    }

    getOccupiedSlots(lotId: string) {
        const parkingLot = this.isParkingLot(lotId);
        return Array.from(parkingLot.getOccupiedSlots().entries()).map(([slot, car]) => ({
            slot,
            car
        }));
        // return parkingLot.getOccupiedSlots();
    }

    getSlotsByColor(lotId: string, color: string) {
        const parkingLot = this.isParkingLot(lotId);

        const slots = parkingLot.getSlotsByColor(color.toLowerCase());

        if (slots.length === 0) {
            throw new NotFoundException(`No cars with color "${color}" found.`);
        }

        return this.parkingLots.get(lotId)?.getSlotsByColor(color.toLowerCase());
    }

    getSlotByReg(lotId: string, regNo: string): number {
        const parkingLot = this.isParkingLot(lotId);
        const slot = parkingLot.getSlotByReg(regNo.toLowerCase());

        if (slot === null) {
            throw new NotFoundException(`No car with registration number "${regNo}" found.`);
        }

        return slot;
    }

    isParkingLot(lotId: string) {
        const parkingLot = this.parkingLots.get(lotId);
        if (!parkingLot) {
            console.log('Parking lot not found');
            throw new NotFoundException(`Parking lot with ID "${lotId}" not found.`);
        }
        return parkingLot;
    }
}
