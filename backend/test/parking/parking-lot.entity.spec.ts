import { BadRequestException } from '@nestjs/common';
import { ParkingLot } from '../../src/parking/entities/parking-lot.entity';
import { Car } from '../../src/parking/entities/car.entity';

describe('ParkingLot Entity', () => {
    let parkingLot: ParkingLot;

    beforeEach(() => {
        parkingLot = new ParkingLot(5);
    });

    it('should create a ParkingLot instance with correct size', () => {
        expect(parkingLot.getTotalSlots()).toBe(5);
        expect(parkingLot.getAvailableSlots().length).toBe(5);
    });

    it('should throw an error if created with size 0 or negative', () => {
        expect(() => new ParkingLot(0)).toThrow(BadRequestException);
        expect(() => new ParkingLot(-1)).toThrow(BadRequestException);
    });

    it('should allocate a slot to a car', () => {
        const car = new Car('KA-01-1234', 'red');
        const slot = parkingLot.allocateSlot(car);

        expect(slot).toBe(1);
        expect(parkingLot.getOccupiedSlots().size).toBe(1);
        expect(parkingLot.getAvailableSlots().length).toBe(4);
    });

    it('should not allow duplicate registration numbers', () => {
        parkingLot.allocateSlot(new Car('KA-01-1234', 'red'));

        expect(() => parkingLot.allocateSlot(new Car('KA-01-1234', 'blue'))).toThrow(BadRequestException);
    });

    it('should clear a slot and make it available again', () => {
        const car = new Car('KA-01-5678', 'blue');
        const slot = parkingLot.allocateSlot(car);
        if (slot != null) {
            expect(parkingLot.clearSlot(slot)).toBe(true);
        }
        expect(parkingLot.getOccupiedSlots().size).toBe(0);
        expect(parkingLot.getAvailableSlots().length).toBe(5);
    });

    it('should throw an error when trying to clear an empty slot', () => {
        expect(() => parkingLot.clearSlot(1)).toThrow(BadRequestException);
    });

    it('should expand parking slots', () => {
        parkingLot.expandSlots(3);

        expect(parkingLot.getTotalSlots()).toBe(8);
        expect(parkingLot.getAvailableSlots().length).toBe(8);
    });

    it('should throw an error when expanding by 0 or negative count', () => {
        expect(() => parkingLot.expandSlots(0)).toThrow(BadRequestException);
        expect(() => parkingLot.expandSlots(-2)).toThrow(BadRequestException);
    });

    it('should shrink parking slots', () => {
        parkingLot.shrinkSlots(2);

        expect(parkingLot.getTotalSlots()).toBe(3);
        expect(parkingLot.getAvailableSlots().length).toBe(3);
    });

    it('should not shrink more slots than available', () => {
        expect(() => parkingLot.shrinkSlots(10)).toThrow(BadRequestException);
    });

    it('should retrieve vehicles by color', () => {
        parkingLot.allocateSlot(new Car('KA-01-1111', 'red'));
        parkingLot.allocateSlot(new Car('KA-01-2222', 'red'));
        parkingLot.allocateSlot(new Car('KA-01-3333', 'blue'));

        expect(parkingLot.getVehiclesByColor('red')).toEqual(['ka-01-1111', 'ka-01-2222']); // ✅ Fixed
        expect(parkingLot.getVehiclesByColor('blue')).toEqual(['ka-01-3333']); // ✅ Already correct
    });

    it('should retrieve slot numbers by color', () => {
        parkingLot.allocateSlot(new Car('KA-01-1111', 'red'));
        parkingLot.allocateSlot(new Car('KA-01-2222', 'red'));

        expect(parkingLot.getSlotsByColor('red')).toEqual([1, 2]);
    });

    it('should retrieve slot number by registration number', () => {
        parkingLot.allocateSlot(new Car('KA-01-5678', 'blue'));

        expect(parkingLot.getSlotByRegNo('KA-01-5678')).toBe(1);
        expect(parkingLot.getSlotByRegNo('KA-01-9999')).toBeNull();
    });

    it('should return correct JSON representation', () => {
        parkingLot.allocateSlot(new Car('KA-01-1234', 'red'));

        expect(parkingLot.toJSON()).toEqual({
            totalSlots: 5,
            occupiedSlots: [{ slot: 1, regNo: 'ka-01-1234', color: 'red' }],
            availableSlots: [2, 3, 4, 5],
            colorIndex: { red: [1] },
            regIndex: { 'ka-01-1234': 1 }
        });
    });
});
