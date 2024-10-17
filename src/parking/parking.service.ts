import { BadRequestException, HttpStatus, Injectable, NotFoundException, UnprocessableEntityException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserService } from '../user/user.service';
import { CreateParkingPlaceDto } from './dto/create-parking-place.dto';
import { ParkingPlace } from './domain/parking-place.domain';
import { BookingDto } from './dto/booking.dto';
import { JwtPayload } from '../auth/interface/JwtPayload.interface';
import { Booking } from './domain/booking.domain';
import { MaybeType } from '../utils/types/maybe.type';
import { UpdateParkingPlaceDto } from './dto/update-parking-place.dto';
import { Vehicle } from './domain/vehicle.domain';
import { between } from '../utils/validation/date';
import { LogService } from '../log/log.service';



@Injectable()
export class ParkingService {
  
  constructor(
    @InjectRepository(ParkingPlace)
    private parkingRepository: Repository<ParkingPlace>,
    @InjectRepository(Booking)
    private bookingRepository: Repository<Booking>,
    @InjectRepository(Vehicle)
    private vehicleRepository: Repository<Vehicle>,
    private readonly userService: UserService,
    private readonly logService: LogService,
  ) {}
  
  
  async findByName(name : string) : Promise<ParkingPlace> {
    
    const parkingPlace = await this.parkingRepository.findOne({where : { name: name }});

    return parkingPlace ? parkingPlace : null;
  }


  async createParkingPlace(createParkingDto: CreateParkingPlaceDto) : Promise<ParkingPlace> {

    const existName = await this.findByName(createParkingDto.name);

    if (existName){
      throw new UnprocessableEntityException({
        status: HttpStatus.UNPROCESSABLE_ENTITY,
        errors: {
          parkingPlace: 'Name of parking place already exist',
        },
      });
    }

    const parkingPlace = this.parkingRepository.create(createParkingDto);

    await this.parkingRepository.insert(parkingPlace);

    return parkingPlace;
  }

  async findAllParkingPlace() : Promise<ParkingPlace[]> {
    return await this.parkingRepository.find();
  }

  async findByIdParkingPlace(id: number) : Promise<ParkingPlace> {

    const parkingPlace = await this.parkingRepository.findOne({where : { id : id }});

    if (parkingPlace) { 
      return parkingPlace;
    } 
    throw new NotFoundException('Parking place not found');
  }


  async updateParkingPlace(id: number, updateParkingDto: UpdateParkingPlaceDto) : Promise<ParkingPlace> {
    
    const parkingPlace = await this.findByIdParkingPlace(id);

    const parkingByName = await this.findByName(updateParkingDto.name);
  
    if (parkingByName && parkingByName.id !== id){
      throw new UnprocessableEntityException({
        status: HttpStatus.UNPROCESSABLE_ENTITY,
        errors: {
          parkingPlace : 'Name of parking place already exist',
        },
      });
    }

    parkingPlace.name = updateParkingDto.name;

    await this.parkingRepository.update({ id: id }, parkingPlace);

    return parkingPlace;
    
  }

  async removeParkingPlace(id: number) : Promise<ParkingPlace> {
    const parkinPlace = await this.findByIdParkingPlace(id);
    return await this.parkingRepository.remove(parkinPlace);
  }


  private async getOneAvaliablePlaceFromDates(startDate : Date , endDate : Date) 
  : Promise<MaybeType<ParkingPlace>>{

    const parkingPlaces = await this.parkingRepository.find();
    
    for (let i = 0; i < parkingPlaces.length; i++) {
      let avaliable = true;

      const parkingPlace = await this.parkingRepository.findOne({
        where: { id: parkingPlaces[i].id },
        relations: ['bookings'] 
      });
      for (let j = 0; j < parkingPlace.bookings.length && avaliable; j++) {
        const booking = parkingPlace.bookings[j];
                        
        if ( booking.startDate.getTime() >= new Date(startDate).getTime() 

        && booking.startDate.getTime() < new Date(endDate).getTime() ||

        booking.endDate.getTime() > new Date(startDate).getTime()
  
        && booking.endDate.getTime() <= new Date(endDate).getTime() ||

        booking.startDate.getTime() <= new Date(startDate).getTime()
  
        && booking.endDate.getTime() >= new Date(endDate).getTime()

      ){
        if (booking.isActive)
          avaliable = false;
      }

    }
    if (avaliable){
      return parkingPlace;
      }

    }

    throw new NotFoundException('Avaliable parking place not found');

    }


  async createBooking(booking : BookingDto, userPayload : JwtPayload ) : Promise<Booking> {
 
    if (booking.startDate >= booking.endDate){
      throw new BadRequestException({
        status: HttpStatus.BAD_REQUEST,
        errors: {
          dates : 'The start date must be less than the end date',
        },
      });
    }

    if (new Date(booking.startDate).getTime() < new Date().getTime()){
      throw new BadRequestException({
        status: HttpStatus.BAD_REQUEST,
        errors: {
          dates : 'The start date must be more than the current date',
        },
      });
    }

    const availablePlace = await this.getOneAvaliablePlaceFromDates(booking.startDate, booking.endDate);
    
    const newBooking = this.bookingRepository.create(booking);
    newBooking.parkingPlace = availablePlace;
    newBooking.user = await this.userService.findById(userPayload.id);
    newBooking.vehicle = this.vehicleRepository.create(booking.vehicle);
    
    await this.bookingRepository.insert(newBooking);

    this.logService.create(`Booking created: User ${userPayload.firstName} ${userPayload.lastName} with email ${userPayload.email} has been created a booking at ${availablePlace.name} from ${booking.startDate} to ${booking.endDate}`)


    return newBooking;
  }


  async getOccupation(date? : Date ) : Promise<ParkingPlace[]>{
    date = date ? date : new Date();
    return await this.getOccupatedParkingPlaces(date);
  }


  private async getOccupatedParkingPlaces( date : Date ) : Promise<ParkingPlace[]> {
    
    let list : ParkingPlace[] = [];
    const parkingPlaces = await this.parkingRepository.find();

    for (let i = 0; i < parkingPlaces.length; i++) {
      let occupeted = false;

      const parkingPlace = await this.parkingRepository.findOne({
        where: { id: parkingPlaces[i].id },
        relations: ['bookings'] 
      });
      
      for (let j = 0; j < parkingPlace.bookings.length && !occupeted; j++) {
        
        const booking = parkingPlace.bookings[j];

        if ( between( date, booking.startDate, booking.endDate ) && booking.isActive ){
        occupeted = true;
      }

    }
    if (occupeted){
      list.push(parkingPlace);
      }
    }
    return list;
  }



  async cancelBooking( id: number, userPayload : JwtPayload) : Promise<Booking>{

    const canceledBooking = await this.bookingRepository.findOne( {where: {id: id}, relations:['parkingPlace']})

    if (!canceledBooking){
      throw new NotFoundException('Parking place not found');
    }
    canceledBooking.isActive = false;

    await this.bookingRepository.update(id, canceledBooking);

    this.logService.create(`Booking canceled: Booking with a place in ${canceledBooking.parkingPlace.name} dated ${canceledBooking.startDate} until ${canceledBooking.endDate}  has been canceled by the user ${canceledBooking.user.firstName} ${canceledBooking.user.lastName} with email ${canceledBooking.user.email}`)

    return canceledBooking;
  }


  async findCanceledBookings(): Promise<Booking[]>{
    return await this.bookingRepository.find({where : {isActive: false}});
  }

  async findBookingById(id : number){
    const booking = await this.bookingRepository.findOne({where: {id: id}})

    if (booking){
      return booking;
    }
    throw new NotFoundException('Booking not found');
  }


  async deleteBooking(id : number) : Promise<Booking>{
    const booking = await this.findBookingById(id);
    return await this.bookingRepository.remove(booking);
  }

  async findAllBooking() : Promise<Booking[]>{
    return await this.bookingRepository.find({order: {id: "ASC",}});
  }

}


