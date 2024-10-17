import { Column, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from '../../user/entities/user.entity';
import { ParkingPlace } from './parking.entity';
import { Vehicle } from './vehicle.entity';

@Entity({
  name: 'booking',
})
export class Booking {
    @PrimaryGeneratedColumn()
    id: number;

    @OneToOne(() => Vehicle)
    @JoinColumn()
    vehicle: Vehicle

    @Column({ type: Date})
    startDate: Date;
    
    @Column({ type: Date})
    endDate: Date;

    @ManyToOne(() => User, {
        eager: true,
      })
      user?: User;

    @ManyToOne(() => ParkingPlace, (parkingPlace) => parkingPlace.bookings)
    parkingPlace: ParkingPlace

    @Column({ type: Boolean, default: true})
    isActive: boolean;

}
