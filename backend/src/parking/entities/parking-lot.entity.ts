import { BadRequestException } from '@nestjs/common';

import { Car } from './car.entity';

// Represents a parking lot with a fixed number of slots.

export class ParkingLot {
    private size: number;
    private occupiedSlots: Map<number, Car>;
    private minHeap: number[];
    private colorIndex: Map<string, Set<number>>;
    private regIndex: Map<string, number>;

    // Creates a new ParkingLot instance with the specified number of slots.
    // If the size is less than or equal to zero, a BadRequestException is thrown.
    constructor(size: number) {
        if (size <= 0) {
            throw new BadRequestException('Parking lot size must be greater than zero.');
        }
        this.size = size;
        this.occupiedSlots = new Map();
        this.minHeap = Array.from({ length: size }, (_, i) => i + 1);
        this.colorIndex = new Map();
        this.regIndex = new Map();
    }

    // Returns the total number of slots in the parking lot.
    getTotalSlots(): number {
        return this.size;
    }

    // Returns a map of occupied slots with the slot number as the key and the car as the value.
    getOccupiedSlots(): Map<number, Car> {
        return this.occupiedSlots;
    }

    // Returns an array of available slots.
    getAvailableSlots(): number[] {
        return this.minHeap;
    }

    // Returns a map of slots indexed by color.
    getColorIndex(): Map<string, Set<number>> {
        return this.colorIndex;
    }

    // Returns a map of registration numbers indexed by registration number.
    getRegIndex(): Map<string, number> {
        return this.regIndex;
    }

    // Returns an array of registration numbers of cars with the specified color.
    getVehiclesByColor(color: string): string[] {
        if (!this.colorIndex.has(color)) {
            return [];
        }

        return Array.from(this.colorIndex.get(color)!)
            .map((slot) => this.occupiedSlots.get(slot))
            .filter((car) => car !== undefined)
            .map((car) => car.regNo);
    }

    // Returns an array of slot numbers of slots with cars of the specified color.
    getSlotsByColor(color: string): number[] {
        return Array.from(this.colorIndex.get(color.toLowerCase()) ?? []);
    }

    // Returns the slot number of the car with the specified registration number.
    getSlotByRegNo(regNo: string): number | null {
        return this.regIndex.get(regNo.toLowerCase()) ?? null;
    }

    // Allocate a slot for the specified car and return the slot number.
    // If the parking lot is full, a BadRequestException is thrown.
    allocateSlot(car: Car): number | null {
        if (this.minHeap.length === 0) throw new BadRequestException('The parking lot is already full.');
        if (!car.regNo || !car.color) {
            throw new BadRequestException('Car registration number and color are required.');
        }
        if (this.minHeap.length === 0) return null;

        const regNo = car.regNo.toLowerCase();
        const color = car.color.toLowerCase();

        if (this.regIndex.has(regNo)) {
            throw new BadRequestException('Car with this registration number is already parked.');
        }

        const slotNumber = this.minHeap.shift()!;
        this.occupiedSlots.set(slotNumber, new Car(regNo, color));
        this.regIndex.set(regNo, slotNumber);

        if (!this.colorIndex.has(color)) {
            this.colorIndex.set(color, new Set());
        }
        this.colorIndex.get(color)!.add(slotNumber);

        return slotNumber;
    }

    // Clear the slot with the specified slot number and return true if successful.
    // If the slot is already empty, a BadRequestException is thrown.
    clearSlot(slotNumber: number): boolean {
        if (!this.occupiedSlots.has(slotNumber)) {
            throw new BadRequestException('No car is parked in this slot.');
        }
        const car = this.occupiedSlots.get(slotNumber)!;
        this.occupiedSlots.delete(slotNumber);
        this.regIndex.delete(car.regNo.toLowerCase());
        this.colorIndex.get(car.color.toLowerCase())?.delete(slotNumber);

        this.minHeap.push(slotNumber);
        this.minHeap.sort((a, b) => a - b);

        return true;
    }

    // Expand the number of slots by the specified count and return the new total number of slots.
    // If the count is less than or equal to zero, a BadRequestException is thrown.
    expandSlots(count: number): number {
        if (count <= 0) {
            throw new BadRequestException('Slot expansion count must be greater than zero.');
        }
        const start = this.size + 1;
        for (let i = start; i < start + count; i++) {
            this.minHeap.push(i);
        }
        this.size += count;
        return this.size;
    }

    // Shrink the number of slots by the specified count and return the new total number of slots.
    // If the count is less than or equal to zero, a BadRequestException is thrown.
    // If the count is greater than the current number of slots, a BadRequestException is thrown.
    // If the count is greater than the number of available slots, a BadRequestException is thrown.
    shrinkSlots(count: number): number {
        if (count <= 0) {
            throw new BadRequestException('Slot reduction count must be greater than zero.');
        }
        if (count > this.size) {
            throw new BadRequestException('Cannot remove more slots than currently exist.');
        }
        if (count > this.minHeap.length) {
            throw new BadRequestException('Cannot remove occupied slots.');
        }
        let removedCount = 0;
        while (removedCount < count && this.minHeap.length > 0) {
            const lastSlot = this.minHeap.pop()!;
            this.occupiedSlots.delete(lastSlot);
            removedCount++;
        }
        this.size -= removedCount;
        return this.size;
    }

    // Converts the ParkingLot instance to a JSON object.
    toJSON() {
        return {
            totalSlots: this.getTotalSlots(),
            occupiedSlots: Array.from(this.occupiedSlots.entries()).map(([slot, car]) => ({
                slot,
                regNo: car.regNo,
                color: car.color
            })),
            availableSlots: this.getAvailableSlots(),
            colorIndex: Object.fromEntries(Array.from(this.colorIndex.entries()).map(([color, slots]) => [color, Array.from(slots)])),
            regIndex: Object.fromEntries(this.regIndex.entries())
        };
    }
}
