import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, OneToMany } from 'typeorm';
import { Role } from '../../role/entities/role.entity';
import { Status } from '../../status/entities/status.entity';


@Entity({
  name: 'user',
})
export class User {

  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: String, unique: true, nullable: true })
  email: string | null;

  @Column({ nullable: true, select: false })
  password?: string;

  @Column({ type: String, nullable: true })
  firstName: string | null;

  @Column({ type: String, nullable: true })
  lastName: string | null;

  @ManyToOne(() => Role, {
    eager: true,
  })
  role?: Role | null;

  @ManyToOne(() => Status, {
    eager: true,
  })
  status?: Status;
  

}
