import { Column, CreateDateColumn, DeleteDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { User } from "./user.entity";
import { Block } from "./block.entity";

@Entity('pages')
export class Page {
    @PrimaryGeneratedColumn()
    id: number
    @Column({
        type: 'varchar',
        length: 50
    })
    title: string
    @ManyToOne(() => Page, (page) => page.children, { nullable: true })
    @JoinColumn({ name: 'parent_page_id' })
    parent: Page;
    @OneToMany(() => Page, (page) => page.parent)
    children: Page[];
    @ManyToOne(() => User, (user) => user.id)
    @JoinColumn({ name: 'userId' })
    user: User;
    @OneToMany(() => Block, (block) => block.page)
    block: Block[];
    @CreateDateColumn()
    created_at: Date
    @UpdateDateColumn()
    updated_at: Date
    @DeleteDateColumn()
    deleted_at: Date
} 