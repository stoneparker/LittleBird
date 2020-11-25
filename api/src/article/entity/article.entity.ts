import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn } from "typeorm";
import { ArticleImg } from "./article-img.entity";

@Entity('article')
export class Article {

  @PrimaryGeneratedColumn()
  article_id: number;

  @Column({
    type: 'varchar',
    length: 100
  })
  title: string;

  @Column({
    type: 'varchar',
    length: 700
  })
  article_content: string;

  @Column({
    type: 'integer',
  })
  no_like: number;

  @Column({
    type: 'date'
  })
  publi_date: string;

  @OneToOne(type => ArticleImg, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({
    name: 'article_img_id',
    referencedColumnName: 'article_img_id'
  })
  @Column({
    type: 'integer',
  })
  article_img_id: number;
}