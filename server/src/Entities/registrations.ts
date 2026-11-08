import { Column, Entity, ManyToOne, PrimaryGeneratedColumn, Unique } from "typeorm";
import { Events } from "./events";
import { Users } from "./users";

@Entity()
@Unique(["user", "event"])
export class Registrations {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false, default: () => 'CURRENT_TIMESTAMP', type: "timestamp without time zone"})
  created: string

  @ManyToOne(()=>Users, (user)=>user.registrations, {onDelete:'CASCADE'})
  user: Users

  @ManyToOne(()=>Events, (event)=>event.registrations, {onDelete:'CASCADE'})
  event: Events
}
