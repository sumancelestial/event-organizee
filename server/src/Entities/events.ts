import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Organizations } from "./organizations";

@Entity()
export class Events {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name_text: string

  @Column()
  name_html: string
  
  @Column()
  dsc_text: string
  
  @Column()
  dsc_html: string
  
  @Column()
  capacity: number
  
  @Column({ nullable: false, default: () => 'CURRENT_TIMESTAMP', type: "timestamp without time zone"})
  start_utc: string
  
  @Column({ nullable: false, default: () => 'CURRENT_TIMESTAMP', type: "timestamp without time zone"})
  end_utc: string

  @ManyToOne(()=>Organizations, (org)=>org.events, {onDelete:'CASCADE'})
  org: Organizations
  
}