import { Controller, Post, Patch, Get, Delete, Body, Param, Query } from '@nestjs/common';
import { BadRequestException, UsePipes, ValidationPipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiQuery } from '@nestjs/swagger';

import { ParkingService } from './parking.service';

import { ParkCarDto } from './dtos/park-car.dto';
import { ClearSlotDto } from './dtos/clear-slot.dto';
import { ExpandParkingLotDto } from './dtos/expand-parking-lot.dto';
import { ShrinkParkingLotDto } from './dtos/shrink-parking-lot.dto';
import { GetSlotByRegDto } from './dtos/get-slot-by-reg.dto';
import { GetSlotsByColorDto } from './dtos/get-slots-by-color.dto';
import { CreateParkingLotDto } from './dtos/create-parking-lot.dto';
import { GetOccupiedSlotsDto } from './dtos/get-occupied-slots.dto';
import { GetVehiclesByColorDto } from './dtos/get-vehicles-by-color.dto';

// Controller class to handle all the parking lot operations
// This class is responsible for handling the incoming requests and returning the response
@ApiTags('Parking Lot')
@Controller('parking_lot/')
export class ParkingController {
    constructor(private readonly parkingService: ParkingService) {}

    // POST method to create a new parking lot
    // Takes the ID of the parking lot and the size of the parking lot as parameters
    // Returns a success message
    @Post()
    @ApiOperation({ summary: 'Create a new parking lot' })
    @ApiResponse({ status: 201, description: 'Parking lot created successfully' })
    @ApiResponse({ status: 400, description: 'Bad request' })
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

    // GET method to get all the parking lots
    // Returns an array of parking lots with their details
    @Get()
    @ApiOperation({ summary: 'Get all parking lots' })
    @ApiResponse({ status: 200, description: 'List of parking lots' })
    getAllParkingLots() {
        return { parkingLots: this.parkingService.getAllParkingLots() };
    }

    // PATCH method to expand an existing parking lot
    // Takes the ID of the parking lot and the size to expand as parameters
    // Returns the total slots of the parking lot
    @Patch(':lotId/expand')
    @ApiOperation({ summary: 'Expand an existing parking lot' })
    @ApiParam({ name: 'lotId', description: 'Parking lot ID' })
    @ApiResponse({ status: 200, description: 'Parking lot expanded successfully' })
    @ApiResponse({ status: 400, description: 'Bad request' })
    @UsePipes(new ValidationPipe())
    expandParkingLot(@Param('lotId') lotId: string, @Body() body: ExpandParkingLotDto) {
        return this.parkingService.expandParkingLot(lotId, body.size);
    }

    // PATCH method to shrink an existing parking lot
    // Takes the ID of the parking lot and the size to shrink as parameters
    // Returns the total slots of the parking lot
    @Patch(':lotId/shrink')
    @ApiOperation({ summary: 'Shrink an existing parking lot' })
    @ApiParam({ name: 'lotId', description: 'Parking lot ID' })
    @ApiResponse({ status: 200, description: 'Parking lot shrunk successfully' })
    @ApiResponse({ status: 400, description: 'Bad request' })
    @UsePipes(new ValidationPipe())
    shrinkParkingLot(@Param('lotId') lotId: string, @Body() body: ShrinkParkingLotDto) {
        return this.parkingService.shrinkParkingLot(lotId, body.size);
    }

    // DELETE method to delete a parking lot
    // Takes the ID of the parking lot as a parameter
    // Returns a success message
    @Delete(':lotId')
    @ApiOperation({ summary: 'Delete a parking lot' })
    @ApiParam({ name: 'lotId', description: 'Parking lot ID' })
    @ApiResponse({ status: 200, description: 'Parking lot deleted successfully' })
    @ApiResponse({ status: 404, description: 'Parking lot not found' })
    deleteParkingLot(@Param('lotId') lotId: string): { message: string } {
        const result: string = this.parkingService.deleteParkingLot(lotId);
        return { message: result };
    }

    // POST method to park a car in the parking lot
    // Takes the ID of the parking lot, registration number and color of the car as parameters
    // Returns the slot number where the car is parked
    @Post(':lotId/park')
    @ApiOperation({ summary: 'Park a vehicle' })
    @ApiParam({ name: 'lotId', description: 'Parking lot ID' })
    @ApiResponse({ status: 201, description: 'Vehicle parked successfully' })
    @ApiResponse({ status: 400, description: 'Bad request' })
    @UsePipes(new ValidationPipe())
    parkCar(@Param('lotId') lotId: string, @Body() body: ParkCarDto) {
        return { allocated_slot_number: this.parkingService.parkCar(lotId, body.regNo, body.color) };
    }

    // GET method to get all the occupied slots of a parking lot
    // Takes the ID of the parking lot as a parameter
    // Returns an array of occupied slots with the car details
    @Get(':lotId/status')
    @ApiOperation({ summary: 'Get occupied slots' })
    @ApiParam({ name: 'lotId', description: 'Parking lot ID' })
    @ApiResponse({ status: 200, description: 'Occupied slots retrieved' })
    @ApiResponse({ status: 400, description: 'Bad request' })
    @UsePipes(new ValidationPipe())
    getOccupiedSlots(@Param() params: GetOccupiedSlotsDto) {
        return this.parkingService.getOccupiedSlots(params.lotId);
    }

    // POST method to clear an occupied slot
    // Takes the ID of the parking lot and the slot number as parameters
    // Returns the slot number that was cleared
    @Post(':lotId/clear')
    @ApiOperation({ summary: 'Clear an occupied slot' })
    @ApiParam({ name: 'lotId', description: 'Parking lot ID' })
    @ApiResponse({ status: 200, description: 'Slot cleared successfully' })
    @ApiResponse({ status: 400, description: 'Bad request' })
    @UsePipes(new ValidationPipe())
    clearSlot(@Param('lotId') lotId: string, @Body() body: ClearSlotDto) {
        this.parkingService.clearSlot(lotId, body.slotNumber);
        return { freed_slot_number: body.slotNumber };
    }

    // GET method to get all the empty slots of a parking lot
    // Takes the ID of the parking lot as a parameter
    // Returns an array of empty slots
    @Get(':lotId/slot_numbers')
    @ApiOperation({ summary: 'Get slot numbers by vehicle color' })
    @ApiParam({ name: 'lotId', description: 'Parking lot ID' })
    @ApiQuery({ name: 'color', description: 'Vehicle color' })
    @ApiResponse({ status: 200, description: 'Slot numbers retrieved' })
    @ApiResponse({ status: 400, description: 'Bad request' })
    @UsePipes(new ValidationPipe())
    getSlotsByColor(@Param('lotId') lotId: string, @Query() query: GetSlotsByColorDto) {
        return { slots: this.parkingService.getSlotsByColor(lotId, query.color) };
    }

    // GET method to get all the registration numbers of a parking lot by color
    // Takes the ID of the parking lot and the color as parameters
    // Returns an array of registration numbers
    @Get(':lotId/registration_numbers')
    @ApiOperation({ summary: 'Get registration numbers by vehicle color' })
    @ApiParam({ name: 'lotId', description: 'Parking lot ID' })
    @ApiQuery({ name: 'color', description: 'Vehicle color' })
    @ApiResponse({ status: 200, description: 'Registration numbers retrieved' })
    @ApiResponse({ status: 400, description: 'Bad request' })
    @UsePipes(new ValidationPipe())
    getVehiclesByColor(@Param('lotId') lotId: string, @Query() query: GetVehiclesByColorDto) {
        return { slots: this.parkingService.getVehiclesByColor(lotId, query.color) };
    }

    // GET method to get the slot number by registration number
    // Takes the ID of the parking lot and the registration number as parameters
    // Returns the slot number where the car is parked
    @Get(':lotId/registration_number')
    @ApiOperation({ summary: 'Get slot number by registration number' })
    @ApiParam({ name: 'lotId', description: 'Parking lot ID' })
    @ApiQuery({ name: 'regNo', description: 'Vehicle registration number' })
    @ApiResponse({ status: 200, description: 'Slot number retrieved' })
    @ApiResponse({ status: 400, description: 'Bad request' })
    @UsePipes(new ValidationPipe())
    getSlotByRegNo(@Param('lotId') lotId: string, @Query() query: GetSlotByRegDto) {
        return { slot: this.parkingService.getSlotByRegNo(lotId, query.regNo) };
    }
}
