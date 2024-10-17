import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe, UseGuards, SetMetadata, DefaultValuePipe } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ParkingService } from './parking.service';
import { UpdateParkingPlaceDto } from './dto/update-parking-place.dto';
import { CreateParkingPlaceDto } from './dto/create-parking-place.dto';
import { BookingDto } from './dto/booking.dto';
import { UserParam } from '../auth/decorator/user.decorator';
import { JwtPayload } from '../auth/interface/JwtPayload.interface';
import { Booking } from './domain/booking.domain';
import { ParkingPlace } from './domain/parking-place.domain';
import { AuthRoleGuard } from '../auth/guard/auth-role.guard';
import { OneDateDto } from './dto/one-date.dto';
import { ValidRoles } from '../auth/interface/valid-roles';

@ApiTags('Parking')
@Controller('parking')
export class ParkingController {
  constructor(private readonly parkingService: ParkingService) {}
  
  @Post()
  create(@Body() createParkingDto: CreateParkingPlaceDto) : Promise<ParkingPlace> {
    return this.parkingService.createParkingPlace(createParkingDto);
  }

  @Get('/booking')
  findAllBooking() : Promise<Booking[]> {
    return this.parkingService.findAllBooking();
  }
  
  @Get()
  findAll() : Promise<ParkingPlace[]> {
    return this.parkingService.findAllParkingPlace();
  }
  
  
  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() updateParkingDto: UpdateParkingPlaceDto) 
  : Promise<ParkingPlace> {
    return this.parkingService.updateParkingPlace(id, updateParkingDto);
  }
  
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) : Promise<ParkingPlace> {
    return this.parkingService.removeParkingPlace(id);
  }
  
  @UseGuards(AuthRoleGuard)
  @SetMetadata('validRoles', [ValidRoles.client, ValidRoles.admin ])
  @Post('create_booking')
  createBooking(@Body() booking : BookingDto, @UserParam() userPayload : JwtPayload ) 
  : Promise<Booking> {
    return this.parkingService.createBooking(booking, userPayload);
  }
  
  @UseGuards(AuthRoleGuard)
  @SetMetadata('validRoles', [ValidRoles.employee, ValidRoles.admin ])
  @Get('occuped_parking_places')
  occupedParkingPlaces(@Body() date : OneDateDto ) 
  : Promise<ParkingPlace[]> {
    return this.parkingService.getOccupation( date.date);
  }
  
  
  
  @UseGuards(AuthRoleGuard)
  @SetMetadata('validRoles', [ValidRoles.client, ValidRoles.admin ])
  @Post('cancel_booking/:id')
  cancelBooking(@Param('id', ParseIntPipe) id: number, @UserParam() userPayload : JwtPayload) 
  : Promise<Booking> {
    return this.parkingService.cancelBooking(id, userPayload);
  }
  
  @Get('find_canceled_bookings')
  findCanceledBookings() : Promise<Booking[]> {
    return this.parkingService.findCanceledBookings();
  }
  
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) : Promise<ParkingPlace> {
    return this.parkingService.findByIdParkingPlace(id);
  }
  
  
  @Get('/booking/:id')
  findOneBooking(@Param('id', ParseIntPipe) id: number) : Promise<Booking> {
    return this.parkingService.findBookingById(id);
  }
  
  @Delete('/booking/:id')
  deleteBooing(@Param('id', ParseIntPipe) id: number) : Promise<Booking> {
    return this.parkingService.deleteBooking(id);
  }
}
