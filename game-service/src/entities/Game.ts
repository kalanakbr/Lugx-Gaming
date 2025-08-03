import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity()
export class Game {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  category: string;

  @Column()
  releaseDate: string;

  @Column("decimal")
  price: number;
}
