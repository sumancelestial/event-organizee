import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Events } from "./events";
import { Users } from "./users";

@Entity()
export class Organizations {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ nullable: false, default: () => 'CURRENT_TIMESTAMP', type: "timestamp without time zone"})
  created: string;

  @OneToMany(()=>Events, (event)=>event.org)
  events: Events[]

  @OneToMany(()=>Users, (user)=>user.org)
  users: Users[]
}