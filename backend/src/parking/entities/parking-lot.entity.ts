import { BadRequestException } from '@nestjs/common';

import { ParkingSlot } from './parking-slot.entity';
import { Car } from './car.entity';

export class ParkingLot {
    // private slots: ParkingSlot[];
    private occupiedSlots: Map<number, Car | null>;
    private size: number;
    private minHeap: number[];
    private colorIndex: Map<string, Set<number>>;
    private regIndex: Map<string, number>;

    constructor(size: number) {
        if (size <= 0) {
            throw new BadRequestException('Parking lot size must be greater than zero.');
        }
        // this.slots = Array.from({ length: size }, (_, i) => new ParkingSlot(i + 1));
        this.size = size;
        // this.occupiedSlots = new Map(Array.from({ length: size }, (_, i) => [i + 1, null]));
        this.occupiedSlots = new Map();
        this.minHeap = Array.from({ length: size }, (_, i) => i + 1);
        this.colorIndex = new Map();
        this.regIndex = new Map();
    }

    // public getSlots() {
    //     return this.slots;
    // }

    allocateSlot(car: Car): number | null {
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
        // this.slots
        this.occupiedSlots.set(slotNumber, new Car(regNo, color));
        this.regIndex.set(regNo, slotNumber);

        if (!this.colorIndex.has(color)) {
            this.colorIndex.set(color, new Set());
        }
        this.colorIndex.get(color)!.add(slotNumber);

        console.log(this.occupiedSlots);
        console.log(this.regIndex);
        console.log(this.colorIndex);
        console.log(this);
        return slotNumber;
    }

    freeSlot(slotNumber: number): boolean {
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

    // expandSlots(count: number) {
    //     if (count <= 0) {
    //         throw new Error('Slot expansion count must be greater than zero.');
    //     }
    //     const start = this.slots.length + 1;
    //     for (let i = start; i < start + count; i++) {
    //         this.slots.push(new ParkingSlot(i));
    //         this.minHeap.push(i);
    //     }
    // }

    expandSlots(count: number) {
        if (count <= 0) {
            throw new BadRequestException('Slot expansion count must be greater than zero.');
        }
        const start = this.size + 1;
        for (let i = start; i < start + count; i++) {
            // this.occupiedSlots.set(i, null);
            this.minHeap.push(i);
        }
        this.size += count;
    }

    shrinkSlots(count: number): boolean {
        if (count <= 0) {
            throw new BadRequestException('Slot reduction count must be greater than zero.');
        }
        if (count > this.occupiedSlots.size) {
            throw new BadRequestException('Cannot remove more slots than currently exist.');
        }
        if (count > this.minHeap.length) {
            throw new BadRequestException('Cannot remove occupied slots.');
        }
        let removedCount = 0;
        while (removedCount < count && this.minHeap.length > 0) {
            const lastSlot = this.minHeap.pop()!;
            // this.slots = this.slots.filter((slot) => slot.slotNumber !== lastSlot);
            this.occupiedSlots.delete(lastSlot);
            removedCount++;
        }
        this.size -= removedCount;
        return removedCount === count;
    }

    getOccupiedSlots() {
        return Array.from(this.occupiedSlots.entries()).map(([slot, car]) => ({
            slot,
            car
        }));
    }

    getSlotsByColor(color: string): number[] {
        return Array.from(this.colorIndex.get(color.toLowerCase()) ?? []);
    }

    getSlotByReg(regNo: string): number | null {
        return this.regIndex.get(regNo.toLowerCase()) ?? null;
    }
}
