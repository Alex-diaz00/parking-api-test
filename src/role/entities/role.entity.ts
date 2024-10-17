import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({
  name: 'role',
})
export class Role {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: String, unique: true })
  name: string;
}
