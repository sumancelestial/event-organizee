import { Column, Entity, ManyToOne, PrimaryGeneratedColumn, Unique } from "typeorm";
import { Events } from "./events";
import { Users } from "./users";

@Entity()
@Unique(["user", "event"])
export class Registrations {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Users, { onDelete: 'CASCADE' })
  user: Users

  @ManyToOne(() => Events, { onDelete: 'CASCADE' })
  event: Events

  @Column({ nullable: false, default: () => 'CURRENT_TIMESTAMP', type: "timestamp without time zone" })
  created: string
}
