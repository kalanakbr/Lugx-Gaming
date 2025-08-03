import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Order {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column('jsonb')
  items!: any; // Optionally replace 'any' with your cart item type

  @Column('decimal')
  totalPrice!: number;

  @Column()
  createdAt!: Date;
}
