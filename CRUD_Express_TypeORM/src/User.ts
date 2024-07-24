import { Entity, PrimaryGeneratedColumn, Column } from "typeorm"
import { IsInt, IsString, Min, Length } from "class-validator";
import { Transform } from "class-transformer";

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id!: number

    @Column()
    @IsString()
    @Length(0)
    name!: string

    @Column()
    @Transform(({ value }) => parseInt(value, 10), { toClassOnly: true })
    @IsInt()
    @Min(0)
    age!: number

}