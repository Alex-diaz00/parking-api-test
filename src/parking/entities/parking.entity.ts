import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Booking } from './booking.entity';

@Entity({
  name: 'parking_place',
})
export class ParkingPlace {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: String, unique: true})
    name: string;

    @OneToMany(() => Booking, (booking) => booking.parkingPlace) 
    bookings: Booking[]
}
