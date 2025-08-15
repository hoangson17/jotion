import { Column, CreateDateColumn, DeleteDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Page } from "./page.entity";

@Entity('blocks')
export class Block {
    @PrimaryGeneratedColumn()
    id: number
    @ManyToOne(() => Page, (page) => page.block)
    @JoinColumn({ name: 'page_id' })
    page: Page;
    // Block cha
    @ManyToOne(() => Block, (block) => block.children, { nullable: true })
    @JoinColumn({ name: 'parent_block_id' })
    parent_block: Block;
    // Các block con
    @OneToMany(() => Block, (block) => block.parent_block, { nullable: true })
    children: Block[];
    @Column({
        type: 'varchar',
        length: 30,
    })
    type: string
    @Column({
        type: 'int',
        nullable: true
    })
    position: number
    @Column({
        type: 'text',
        nullable: true
    })
    content_text: string
    @Column({
        type: 'boolean',
        nullable: true
    })
    content_check: boolean
    @Column({
        type: 'text',
        nullable: true
    })
    content_url: string
    @CreateDateColumn()
    created_at: Date;
    @UpdateDateColumn()
    updated_at: Date;
    @DeleteDateColumn()
    deleted_at: Date
}   