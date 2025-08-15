import { Column, CreateDateColumn, DeleteDateColumn, Entity, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Page } from "./page.entity";

@Entity('users')
export class User{
    @PrimaryGeneratedColumn()
    id:number
    @Column({
        type:'varchar',
        length:35,
    })
    name:string
    @Column({
        type:'varchar',
        length:40,
    })
    email:string
    @Column({
        type:'varchar',
        length:100 ,
    })
    password:string
    @OneToMany(()=>Page,(page)=>page.user)
    page:Page[];
    @CreateDateColumn()
    created_at:Date
    @UpdateDateColumn()
    updated_at:Date
    @DeleteDateColumn()
    deleted_at:Date
}