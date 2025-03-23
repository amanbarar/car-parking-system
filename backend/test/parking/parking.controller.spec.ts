import { Test, TestingModule } from '@nestjs/testing';
import { ParkingController } from '../../src/parking/parking.controller';
import { ParkingService } from '../../src/parking/parking.service';
import { BadRequestException, NotFoundException } from '@nestjs/common';

describe('ParkingController', () => {
    let controller: ParkingController;
    let service: ParkingService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [ParkingController],
            providers: [
                {
                    provide: ParkingService,
                    useValue: {
                        createParkingLot: jest.fn().mockImplementation((id, size) => ({
                            message: `Parking lot ${id} created with ${size} slots`
                        })),
                        getAllParkingLots: jest.fn().mockReturnValue([{ lotId: 'lotA', totalSlots: 5 }]),
                        expandParkingLot: jest.fn().mockReturnValue({ total_slot: 8 }),
                        shrinkParkingLot: jest.fn().mockReturnValue({ total_slot: 2 }),
                        parkCar: jest.fn().mockReturnValue(1),
                        clearSlot: jest.fn().mockReturnValue({ freed_slot_number: 1 }),
                        getOccupiedSlots: jest.fn().mockReturnValue([
                            { slot: 1, regNo: 'KA-01-1234', color: 'red' },
                            { slot: 2, regNo: 'KA-01-5678', color: 'blue' }
                        ]),
                        getVehiclesByColor: jest.fn().mockReturnValue(['KA-01-1234', 'KA-01-5678']),
                        getSlotsByColor: jest.fn().mockReturnValue([1, 2]),
                        getSlotByRegNo: jest.fn().mockReturnValue(3)
                    }
                }
            ]
        }).compile();

        controller = module.get<ParkingController>(ParkingController);
        service = module.get<ParkingService>(ParkingService);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });

    it('should create a parking lot', () => {
        expect(controller.createParkingLot({ id: 'lotA', size: 5 })).toEqual({
            message: 'Parking lot lotA created with 5 slots'
        });
    });

    it('should throw an error if creating a duplicate parking lot', () => {
        jest.spyOn(service, 'createParkingLot').mockImplementation(() => {
            throw new BadRequestException();
        });
        expect(() => controller.createParkingLot({ id: 'lotA', size: 5 })).toThrow(BadRequestException);
    });

    it('should get all parking lots', () => {
        expect(controller.getAllParkingLots()).toEqual({
            parkingLots: [{ lotId: 'lotA', totalSlots: 5 }]
        });
    });

    it('should expand a parking lot', () => {
        expect(controller.expandParkingLot('lotA', { size: 3 })).toEqual({
            total_slot: 8
        });
    });

    it('should shrink a parking lot', () => {
        expect(controller.shrinkParkingLot('lotA', { size: 3 })).toEqual({
            total_slot: 2
        });
    });

    it('should park a car', () => {
        expect(controller.parkCar('lotA', { regNo: 'KA-01-1234', color: 'red' })).toEqual({
            allocated_slot_number: 1
        });
    });

    it('should clear a slot', () => {
        expect(controller.clearSlot('lotA', { slotNumber: 1 })).toEqual({
            freed_slot_number: 1
        });
    });

    it('should get occupied slots in a parking lot', () => {
        expect(controller.getOccupiedSlots({ lotId: 'lotA' })).toEqual([
            { slot: 1, regNo: 'KA-01-1234', color: 'red' },
            { slot: 2, regNo: 'KA-01-5678', color: 'blue' }
        ]);
    });

    it('should get slot numbers by vehicle color', () => {
        expect(controller.getSlotsByColor('lotA', { color: 'red' })).toEqual({
            slots: [1, 2]
        });
    });

    it('should get registration numbers by vehicle color', () => {
        expect(controller.getVehiclesByColor('lotA', { color: 'red' })).toEqual({
            slots: ['KA-01-1234', 'KA-01-5678']
        });
    });

    it('should get the slot number by registration number', () => {
        expect(controller.getSlotByRegNo('lotA', { regNo: 'KA-01-1234' })).toEqual({
            slot: 3
        });
    });
});
