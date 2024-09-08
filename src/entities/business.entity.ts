import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'businesses' })
export class Business {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column('decimal', { precision: 9, scale: 6 })
  latitude: number;

  @Column('decimal', { precision: 9, scale: 6 })
  longitude: number;

  @Column()
  type: string;
}
