import { BadRequestException } from '@nestjs/common';

import { Car } from './car.entity';

export class ParkingLot {
    private size: number;
    private occupiedSlots: Map<number, Car>;
    private minHeap: number[];
    private colorIndex: Map<string, Set<number>>;
    private regIndex: Map<string, number>;

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

    getTotalSlots(): number {
        return this.size;
    }

    getOccupiedSlots() {
        return this.occupiedSlots;
    }

    getAvailableSlots(): number[] {
        return this.minHeap;
    }

    getColorIndex(): Map<string, Set<number>> {
        return this.colorIndex;
    }

    getRegIndex(): Map<string, number> {
        return this.regIndex;
    }

    getVehiclesByColor(color: string): string[] {
        if (!this.colorIndex.has(color)) {
            return []; // ✅ No vehicles of this color found
        }

        return Array.from(this.colorIndex.get(color)!)
            .map((slot) => this.occupiedSlots.get(slot))
            .filter((car) => car !== undefined)
            .map((car) => car.regNo);
    }

    getSlotsByColor(color: string): number[] {
        return Array.from(this.colorIndex.get(color.toLowerCase()) ?? []);
    }

    getSlotByReg(regNo: string): number | null {
        return this.regIndex.get(regNo.toLowerCase()) ?? null;
    }

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
        this.occupiedSlots.set(slotNumber, new Car(regNo, color));
        this.regIndex.set(regNo, slotNumber);

        if (!this.colorIndex.has(color)) {
            this.colorIndex.set(color, new Set());
        }
        this.colorIndex.get(color)!.add(slotNumber);

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

    expandSlots(count: number) {
        if (count <= 0) {
            throw new BadRequestException('Slot expansion count must be greater than zero.');
        }
        const start = this.size + 1;
        for (let i = start; i < start + count; i++) {
            this.minHeap.push(i);
        }
        this.size += count;
    }

    shrinkSlots(count: number): boolean {
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
        return removedCount === count;
    }

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
