import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException, NotFoundException } from '@nestjs/common';

import { ParkingService } from '../../src/parking/parking.service';

describe('ParkingService', () => {
    let service: ParkingService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [ParkingService]
        }).compile();

        service = module.get<ParkingService>(ParkingService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    it('should create a parking lot', () => {
        service.createParkingLot('lotA', 5);
        const parkingLots = service.getAllParkingLots();
        expect(parkingLots.length).toBe(1);
        expect(parkingLots[0].lotId).toBe('lotA');
    });

    it('should throw an error if creating a duplicate parking lot', () => {
        service.createParkingLot('lotA', 5);
        expect(() => service.createParkingLot('lotA', 5)).toThrow(BadRequestException);
    });

    it('should throw an error for non-existing parking lot', () => {
        expect(() => service.getOccupiedSlots('lotB')).toThrow(NotFoundException);
    });

    it('should expand a parking lot', () => {
        service.createParkingLot('lotA', 5);
        service.expandParkingLot('lotA', 3);
        const parkingLots = service.getAllParkingLots();
        expect(parkingLots[0].totalSlots).toBe(8);
    });

    it('should throw an error if expanding size is less than 1', () => {
        service.createParkingLot('lotA', 5);
        expect(() => service.expandParkingLot('lotA', 0)).toThrow(BadRequestException);
    });

    it('should shrink a parking lot', () => {
        service.createParkingLot('lotA', 5);
        service.shrinkParkingLot('lotA', 3);
        const parkingLots = service.getAllParkingLots();
        expect(parkingLots[0].totalSlots).toBe(2);
    });

    it('should throw an error if shrinking size is less than 1', () => {
        service.createParkingLot('lotA', 5);
        expect(() => service.shrinkParkingLot('lotA', 0)).toThrow(BadRequestException);
    });

    it('should delete a parking lot successfully', () => {
        service.createParkingLot('lotA', 5);

        expect(service.deleteParkingLot('lotA')).toBe('Parking lot lotA deleted successfully.');
        expect(service['parkingLots'].has('lotA')).toBe(false);
    });

    it('should throw NotFoundException if the parking lot does not exist', () => {
        expect(() => service.deleteParkingLot('INVALID_ID')).toThrow(NotFoundException);
    });

    it('should park a car and allocate a slot', () => {
        service.createParkingLot('lotA', 5);
        const allocatedSlot = service.parkCar('lotA', 'KA-01-1234', 'red');
        expect(typeof allocatedSlot).toBe('number');
    });

    it('should throw an error when car with same registration number is parked', () => {
        service.createParkingLot('lotA', 2);
        service.parkCar('lotA', 'KA-01-1234', 'red');
        expect(() => service.parkCar('lotA', 'KA-01-1234', 'red')).toThrow(BadRequestException);
    });

    it('should throw an error when parking lot is full', () => {
        service.createParkingLot('lotA', 1);
        service.parkCar('lotA', 'KA-01-1234', 'red');

        expect(() => service.parkCar('lotA', 'KA-01-5678', 'blue')).toThrow(BadRequestException);
    });

    it('should free a parking slot', () => {
        service.createParkingLot('lotA', 5);
        const slot = service.parkCar('lotA', 'KA-01-1234', 'red');
        if (slot !== null) {
            service.clearSlot('lotA', slot);
        }
        expect(service.getOccupiedSlots('lotA').length).toBe(0);
    });

    it('should throw an error when freeing an already empty slot', () => {
        service.createParkingLot('lotA', 5);
        expect(() => service.clearSlot('lotA', 1)).toThrow(BadRequestException);
    });

    it('should retrieve occupied slots', () => {
        service.createParkingLot('lotA', 5);
        service.parkCar('lotA', 'KA-01-1234', 'red');
        expect(service.getOccupiedSlots('lotA').length).toBe(1);
    });

    it('should retrieve vehicles by color', () => {
        service.createParkingLot('lotA', 5);
        service.parkCar('lotA', 'KA-01-1234', 'red');
        expect(service.getVehiclesByColor('lotA', 'red').length).toBe(1);
    });

    it('should retrieve slots by color', () => {
        service.createParkingLot('lotA', 5);
        service.parkCar('lotA', 'KA-01-1234', 'red');
        expect((service.getSlotsByColor('lotA', 'red') ?? []).length).toBe(1);
    });

    it('should retrieve slot by registration number', () => {
        service.createParkingLot('lotA', 5);
        service.parkCar('lotA', 'KA-01-1234', 'red');
        expect(service.getSlotByRegNo('lotA', 'KA-01-1234')).toBe(1);
    });

    it('should throw an error if the vehicle not found from given registration number', () => {
        service.createParkingLot('lotA', 5);
        service.parkCar('lotA', 'KA-01-1235', 'red');
        expect(() => service.getSlotByRegNo('lotA', 'KA-01-1234')).toThrow(NotFoundException);
    });
});
