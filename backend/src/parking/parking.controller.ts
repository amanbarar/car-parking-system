import { Controller, Post, Patch, Get, Body, Param, Query } from '@nestjs/common';
import { BadRequestException, UsePipes, ValidationPipe } from '@nestjs/common';

import { ParkingService } from './parking.service';
// import { Car } from './entities/car.entity';

import { ParkCarDto } from './dtos/park-car.dto';
import { ClearSlotDto } from './dtos/clear-slot.dto';
import { ExpandParkingLotDto } from './dtos/expand-parking-lot.dto';
import { ShrinkParkingLotDto } from './dtos/shrink-parking-lot.dto';
import { GetSlotByRegDto } from './dtos/get-slot-by-reg.dto';
import { GetSlotsByColorDto } from './dtos/get-slots-by-color.dto';
import { CreateParkingLotDto } from './dtos/create-parking-lot.dto';
import { GetOccupiedSlotsDto } from './dtos/get-occupied-slots.dto';

@Controller('parking-lots')
export class ParkingController {
    constructor(private readonly parkingService: ParkingService) {}

    // POST: TO CREATE A NEW PARKING LOT
    @Post()
    @UsePipes(new ValidationPipe())
    createParkingLot(@Body() body: CreateParkingLotDto) {
        try {
            this.parkingService.createParkingLot(body.id, body.size);
            return { message: `Parking lot ${body.id} created with ${body.size} slots` };
        } catch (error: unknown) {
            if (error instanceof BadRequestException) {
                throw error;
            }
            throw new BadRequestException('An unexpected error occurred.');
        }
    }

    // GET: GET ALL PARKING LOTS
    @Get()
    getAllParkingLots() {
        return { parkingLots: this.parkingService.getAllParkingLots() };
    }

    // PATCH: EXPAND EXISTING PARKING LOT(S)
    @Patch(':lotId/expand')
    @UsePipes(new ValidationPipe())
    expandParkingLot(@Param('lotId') lotId: string, @Body() body: ExpandParkingLotDto) {
        this.parkingService.expandParkingLot(lotId, body.size);
        return { message: `Expanded by ${body.size} slots` };
    }

    // PATCH: SHRINK EXISTING PARKING LOT(S)
    @Patch(':lotId/shrink')
    @UsePipes(new ValidationPipe())
    shrinkParkingLot(@Param('lotId') lotId: string, @Body() body: ShrinkParkingLotDto) {
        this.parkingService.shrinkParkingLot(lotId, body.size);
        return { message: `Parking lot shrunk by ${body.size} slots` };
    }

    // POST: PARK A VEHICLE IN A PARKING LOT
    @Post(':lotId/park')
    @UsePipes(new ValidationPipe())
    parkCar(@Param('lotId') lotId: string, @Body() body: ParkCarDto) {
        return { allocated_slot_number: this.parkingService.parkCar(lotId, body.regNo, body.color) };
    }

    // POST: CLEAR AN OCCUPIED SLOT
    @Post(':lotId/clear')
    @UsePipes(new ValidationPipe())
    clearSlot(@Param('lotId') lotId: string, @Body() body: ClearSlotDto) {
        this.parkingService.freeSlot(lotId, body.slotNumber);
        return { freed_slot_number: body.slotNumber };
    }

    // GET: OCCUPIED SLOTS OF A PARKING LOT
    @Get(':lotId/occupied-slots')
    @UsePipes(new ValidationPipe())
    getOccupiedSlots(@Param() params: GetOccupiedSlotsDto) {
        return this.parkingService.getOccupiedSlots(params.lotId);
    }

    // GET: SLOTS WITH GIVEN COLOR
    @Get(':lotId/slots-by-color')
    @UsePipes(new ValidationPipe())
    getSlotsByColor(@Param('lotId') lotId: string, @Query() query: GetSlotsByColorDto) {
        return { slots: this.parkingService.getSlotsByColor(lotId, query.color) };
    }

    // GET: SLOT NUMBER BY REGISTRATION NUMBER
    @Get(':lotId/slot-by-reg')
    @UsePipes(new ValidationPipe())
    getSlotByReg(@Param('lotId') lotId: string, @Query() query: GetSlotByRegDto) {
        return { slot: this.parkingService.getSlotByReg(lotId, query.regNo) };
    }
}
