import { PartialType } from '@nestjs/swagger';
import { CreateParkingPlaceDto } from './create-parking-place.dto';

export class UpdateParkingPlaceDto extends PartialType(CreateParkingPlaceDto) {}
