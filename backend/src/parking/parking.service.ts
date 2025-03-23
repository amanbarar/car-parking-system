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

    getAllParkingLots() {
        return Array.from(this.parkingLots, ([lotId, parkingLot]) => ({
            lotId,
            ...parkingLot.toJSON()
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

    clearSlot(lotId: string, slotNumber: number) {
        const parkingLot = this.isParkingLot(lotId);
        return parkingLot.clearSlot(slotNumber);
    }

    getOccupiedSlots(lotId: string) {
        const parkingLot = this.isParkingLot(lotId);
        return Array.from(parkingLot.getOccupiedSlots().entries()).map(([slot, car]) => ({
            slot,
            car
        }));
    }

    getVehiclesByColor(lotId: string, color: string) {
        const parkingLot = this.isParkingLot(lotId);
        return parkingLot.getVehiclesByColor(color.toLowerCase());
    }

    getSlotsByColor(lotId: string, color: string) {
        const parkingLot = this.isParkingLot(lotId);
        return parkingLot.getSlotsByColor(color.toLowerCase());
    }

    getSlotByRegNo(lotId: string, regNo: string): number {
        const parkingLot = this.isParkingLot(lotId);
        const slot = parkingLot.getSlotByRegNo(regNo.toLowerCase());
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
