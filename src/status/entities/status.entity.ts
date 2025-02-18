import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({
  name: 'status',
})
export class Status {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: String, unique: true })
  name: string;
}
