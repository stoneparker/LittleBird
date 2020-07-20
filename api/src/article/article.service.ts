import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Article } from './entity/article.entity';
import { Repository } from 'typeorm';
import { ThemeArticle } from './entity/theme-article.entity';
import { LikeArticle } from './entity/like-article.entity';
import { Response } from 'express';

@Injectable()
export class ArticleService {

  constructor(
    @InjectRepository(Article) private readonly articleRespository: Repository<Article>,
    @InjectRepository(ThemeArticle) private readonly themeArticleRespository: Repository<ThemeArticle>,
    @InjectRepository(LikeArticle) private readonly likeArticleRespository: Repository<LikeArticle>
  ) {}

  // TODO Construir ?????
  async getArticle(response: Response, article_id: number): Promise<Response | void> {

    const article = await this.articleRespository.createQueryBuilder('article')
      .select(['article', 'article_img'])
      .innerJoin('article.article_img_id', 'article_img')
      .where('article.article_id = :article_id', { article_id })
      .getOne();

    if (!article) {
      return response.status(404).json({ error: 'Artigo não foi encontrado.' });
    };

    let themes: any = await this.themeArticleRespository.createQueryBuilder('theme_article')
      .select(['theme_article', 'theme'])
      .innerJoin('theme_article.theme_id', 'theme')
      .where('theme_article.article_id = :article_id', { article_id })
      .getMany();

    themes = themes.map((theme) => {
      delete theme.theme_article_id
      delete theme.article_id
      delete theme.theme_id.theme_img_id

      return theme.theme_id;
    });

    const theme_article = {
      article,
      themes
    }

    return response.status(200).json(theme_article);
  }

  async getArticlesByLike(): Promise<Article[]> {
    const articles = await this.articleRespository.createQueryBuilder('article')
      .select(['article', 'article_img'])
      .innerJoin('article.article_img_id', 'article_img')
      .orderBy('article.no_like', 'DESC')
      .getMany();

    return articles;
  }

  async getArticlesByUserLike(user_id: number): Promise<LikeArticle[]> {
    let articles = await this.likeArticleRespository.createQueryBuilder('like_article')
      .select(['like_article', 'article', 'article_img'])
      .innerJoin('like_article.article_id', 'article')
      .innerJoin('article.article_img_id', 'article_img')
      .where('like_article.user_id = :user_id', { user_id })
      .orderBy('article.no_like', 'DESC')
      .getMany();

    articles = articles.map((article) => {
      delete article.like_article_id;
      delete article.user_id;

      return article;
    });

    return articles;
  }

  async getArticlesByTheme(response: Response, theme_id: number): Promise<Response> {

    const theme = await this.themeArticleRespository.createQueryBuilder('theme_article')
      .select(['theme_article.theme_id'])
      .where('theme_article.theme_id = :theme_id', { theme_id })
      .getOne();

    if (!theme) {
      return response.status(404).json({ error: 'Tema não existe no servidor ou não possui nenhum artigo.' });
    }

    let articles = await this.themeArticleRespository.createQueryBuilder('theme_article')
      .select(['theme_article', 'article', 'article_img'])
      .innerJoin('theme_article.article_id', 'article')
      .innerJoin('article.article_img_id', 'article_img')
      .where('theme_article.theme_id = :theme_id', { theme_id })
      .orderBy('article.no_like', 'DESC')
      .getMany();

    articles = articles.map((article) => {
      delete article.theme_id;
      delete article.theme_article_id;

      return article;
    });

    return response.status(200).json(articles);
  }

  async createArticleLike(user_id: number, article_id: number): Promise<void> {

    await this.likeArticleRespository.createQueryBuilder("like_article")
      .insert()
      .into('like_article').values({
        article_id,
        user_id
      }).execute();

  }

  async deleteArticleLike(response: Response, user_id: number, article_id: number): Promise<Response | void> {
    const article = await this.articleRespository.createQueryBuilder('article')
      .select('article.article_id')
      .where('article.article_id = :article_id', { article_id })
      .getOne();

    if (!article) {
      return response.status(404).json({ error: 'O artigo não foi encontrado.' });
    }

    await this.likeArticleRespository.createQueryBuilder('like_article')
      .delete()
      .where('like_article.user_id = :user_id', { user_id })
      .andWhere('like_article.article_id = :article_id', { article_id })
      .execute();

    return response.status(204).end();
  }
}
