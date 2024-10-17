import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({
  name: 'vehicle',
})
export class Vehicle {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: String, unique: true})
    numberplate: string;
}
