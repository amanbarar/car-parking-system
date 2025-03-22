import { Injectable } from '@nestjs/common';
import { NotFoundException, BadRequestException } from '@nestjs/common';
import { ParkingLot } from './entities/parking-lot.entity';
import { Car } from './entities/car.entity';
import { isInstance } from 'class-validator';

@Injectable()
export class ParkingService {
    private parkingLots: Map<string, ParkingLot> = new Map();

    createParkingLot(id: string, size: number) {
        if (this.parkingLots.has(id)) {
            throw new BadRequestException(`Parking lot with ID "${id}" already exists.`);
        }
        this.parkingLots.set(id, new ParkingLot(size));
    }

    getAllParkingLots() {
        // return Array.from(this.parkingLots.keys());
        // return Array.from(this.parkingLots, ([parkingLot, details]) => ({
        //     parkingLot,
        //     totalSlots: details.getSlots().length
        // }));
        return Array.from(this.parkingLots);
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
        return parkingLot.getOccupiedSlots();
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
            throw new NotFoundException(`Parking lot with ID "${lotId}" not found.`);
        }
        return parkingLot;
    }
}
