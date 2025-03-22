import { Car } from './car.entity';

export class ParkingSlot {
    constructor(
        public slots: Map<number, Car | null>
        // public slotNumber: number,
        // public isOccupied: boolean = false
        // public car: Car | null = null,
    ) {}

    // isAvailable(): boolean {
    //     return this.car == null;
    // }

    // assignCar(car: Car): void {
    //     if (this.car) throw new Error('Slot already occupied.');
    //     this.car = car;
    // }

    // removeCar(): void {
    //     if (!this.car) throw new Error('Slot already free.');
    // }
}
