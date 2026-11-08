import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Organizations } from "./organizations";

@Entity()
export class Users {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  first_name: string;

  @Column()
  last_name: string;

  @Column()
  email: string;

  @Column()
  token: string;

  @ManyToOne(()=>Organizations, (org)=>org.users, {onDelete:'CASCADE'})
  org: Organizations
}