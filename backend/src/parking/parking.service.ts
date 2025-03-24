import { Injectable } from '@nestjs/common';
import { NotFoundException, BadRequestException } from '@nestjs/common';

import { ParkingLot } from './entities/parking-lot.entity';
import { Car } from './entities/car.entity';

// Service class to handle all the parking lot operations
@Injectable()
export class ParkingService {
    private parkingLots: Map<string, ParkingLot> = new Map();

    // Method to create a new parking lot
    // Takes two parameters, the ID of the parking lot and the size of the parking lot
    createParkingLot(id: string, size: number) {
        if (this.parkingLots.has(id)) {
            throw new BadRequestException(`Parking lot with ID "${id}" already exists.`);
        }
        this.parkingLots.set(id, new ParkingLot(size));
    }

    // Method to get all the parking lots
    // Returns an array of parking lots with their details
    getAllParkingLots() {
        return Array.from(this.parkingLots, ([lotId, parkingLot]) => ({
            lotId,
            ...parkingLot.toJSON()
        }));
    }

    // Method to get the details of a parking lot
    // Takes the ID of the parking lot as a parameter
    // Returns the total slots of the parking lot
    expandParkingLot(lotId: string, size: number) {
        const parkingLot = this.isParkingLot(lotId);
        return parkingLot.expandSlots(size);
    }

    // Method to shrink the parking lot
    // Takes the ID of the parking lot and the size to shrink as parameters
    // Returns the total slots of the parking lot
    shrinkParkingLot(lotId: string, size: number) {
        const parkingLot = this.isParkingLot(lotId);
        return parkingLot.shrinkSlots(size);
    }

    // Method to delete a parking lot
    // Takes the ID of the parking lot as a parameter
    // Returns a success message
    deleteParkingLot(lotId: string): string {
        if (!this.parkingLots.has(lotId)) {
            throw new NotFoundException(`Parking lot with ID "${lotId}" not found.`);
        }
        this.parkingLots.delete(lotId);
        return `Parking lot ${lotId} deleted successfully.`;
    }

    // Method to park a car in the parking lot
    // Takes the ID of the parking lot, registration number and color of the car as parameters
    // Returns the slot number where the car is parked
    parkCar(lotId: string, regNo: string, color: string) {
        const parkingLot = this.isParkingLot(lotId);
        const car = new Car(regNo, color);
        return parkingLot.allocateSlot(car);
    }

    // Method to remove a car from the parking lot
    // Takes the ID of the parking lot and the slot number as parameters
    // Returns the slot number where the car was parked
    clearSlot(lotId: string, slotNumber: number) {
        const parkingLot = this.isParkingLot(lotId);
        return parkingLot.clearSlot(slotNumber);
    }

    // Method to get all the occupied slots of a parking lot
    // Takes the ID of the parking lot as a parameter
    // Returns an array of occupied slots with the car details
    getOccupiedSlots(lotId: string) {
        const parkingLot = this.isParkingLot(lotId);
        return Array.from(parkingLot.getOccupiedSlots().entries()).map(([slot, car]) => ({
            slot,
            car
        }));
    }

    // Method to get all the empty slots of a parking lot
    // Takes the ID of the parking lot as a parameter
    // Returns an array of empty slots
    getVehiclesByColor(lotId: string, color: string) {
        const parkingLot = this.isParkingLot(lotId);
        return parkingLot.getVehiclesByColor(color.toLowerCase());
    }

    // Method to get all the slots of a parking lot by color
    // Takes the ID of the parking lot and the color as parameters
    // Returns an array of slots with the car details
    getSlotsByColor(lotId: string, color: string) {
        const parkingLot = this.isParkingLot(lotId);
        return parkingLot.getSlotsByColor(color.toLowerCase());
    }

    // Method to get the slot number by registration number
    // Takes the ID of the parking lot and the registration number as parameters
    // Returns the slot number where the car is parked
    getSlotByRegNo(lotId: string, regNo: string): number {
        const parkingLot = this.isParkingLot(lotId);
        const slot = parkingLot.getSlotByRegNo(regNo.toLowerCase());
        if (slot === null) {
            throw new NotFoundException(`No car with registration number "${regNo}" found.`);
        }
        return slot;
    }

    // Method to get the details of a parking lot
    // Takes the ID of the parking lot as a parameter
    // Returns the parking lot details
    isParkingLot(lotId: string) {
        const parkingLot = this.parkingLots.get(lotId);
        if (!parkingLot) {
            throw new NotFoundException(`Parking lot with ID "${lotId}" not found.`);
        }
        return parkingLot;
    }
}
