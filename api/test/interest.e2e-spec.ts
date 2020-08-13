import { INestApplication, ValidationPipe } from "@nestjs/common";
import { TestingModule, Test } from "@nestjs/testing";
import { AppModule } from "../src/app.module";
import { getConnection } from "typeorm";
import request from 'supertest';

describe('Interest', () => {
  let app: INestApplication;

  beforeAll(async () => {

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    await app.init();
  });

  afterAll(async () => {
    await getConnection().close();
    await app.close();
  });

  describe('Criar um interesse', () => {
    let token = null;

    beforeAll(async () => {
      await getConnection().dropDatabase()
      await getConnection().synchronize();

      const user = {
        user_id: 1,
        email: 'carlosboavida@gm.com',
        user_img_id: 1,
        user_pass: '123vidaboa',
        username: 'carlosboaviida',
        born_in: '2020-06-15'
      };

      await getConnection().createQueryBuilder().insert().into("user_img").values({ user_img_id: 1, img_url: "http://localhost:4456" }).execute();
      await getConnection().createQueryBuilder().insert().into("tb_user").values(user).execute();
      await getConnection().createQueryBuilder().insert().into("theme_img").values({ theme_img_id: 1, img_url: "http://localhost:4456" }).execute();
      await getConnection().createQueryBuilder().insert().into("theme").values({ theme_id: 1, theme_name: "Sexo", theme_img_id: 1 }).execute();
      await getConnection().createQueryBuilder().insert().into("interest").values({ interest_id: 1, theme_id: 1, user_id: 1 }).execute();


      const response = await request(app.getHttpServer()).post('/auth/login').send({ email: 'carlosboavida@gm.com', user_pass: '123vidaboa' });
      token = response.body.token;
    });

    it('> POST /interest Deve criar um interesse', async () => {

      const response = await request(app.getHttpServer())
        .post('/interest')
        .send({ theme_id: 1 })
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(204);
    });

    it('> POST /interest Não deve criar um interesse (Token JWT inválido)', async () => {
      const response = await request(app.getHttpServer())
        .post('/interest')
        .send({ theme_id: 1 })
        .set('Authorization', `Bearer ${token}errado`);

      expect(response.status).toBe(401);
    });

    it('> POST /interest Não deve criar um interesse (Tema não encontrado)', async () => {
      const response = await request(app.getHttpServer())
        .post('/interest')
        .send({ theme_id: 2 })
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(404);
    });
  });

  describe('Buscar interesses', () => {
    let token = null;

    beforeAll(async () => {
      await getConnection().dropDatabase()
      await getConnection().synchronize();

      const user = {
        user_id: 1,
        email: 'carlosboavida@gm.com',
        user_img_id: 1,
        user_pass: '123vidaboa',
        username: 'carlosboaviida',
        born_in: '2020-06-15'
      };

      await getConnection().createQueryBuilder().insert().into("user_img").values({ user_img_id: 1, img_url: "http://localhost:4456" }).execute();
      await getConnection().createQueryBuilder().insert().into("tb_user").values(user).execute();
      await getConnection().createQueryBuilder().insert().into("theme_img").values({ theme_img_id: 1, img_url: "http://localhost:4456" }).execute();
      await getConnection().createQueryBuilder().insert().into("theme").values({ theme_id: 1, theme_name: "Sexo", theme_img_id: 1 }).execute();
      await getConnection().createQueryBuilder().insert().into("interest").values({ interest_id: 1, theme_id: 1, user_id: 1 }).execute();
      // await getConnection().createQueryBuilder().insert().into("interest").values({ interest_id: 2, theme_id: 1, user_id: 1 }).execute();

      const response = await request(app.getHttpServer()).post('/auth/login').send({ email: 'carlosboavida@gm.com', user_pass: '123vidaboa' });
      token = response.body.token;
    });

    it('> GET /interest Deve retornar os interesses do usuário', async () => {
      const response = await request(app.getHttpServer())
        .get('/interest?page=1')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body[0]).toEqual(expect.objectContaining({
        user_id: expect.any(Number),
        interest_id: expect.any(Number),
        theme_id: {
          theme_id: expect.any(Number),
          theme_name: expect.any(String),
          theme_img_id: {
            theme_img_id: expect.any(Number),
            img_url: expect.any(String)
          }
        }
      }));
    });

    it('> GET /interest Não deve retornar os interesses do usuário (Token JWT inválido)', async () => {
      const response = await request(app.getHttpServer())
        .get('/interest')
        .set('Authorization', `Bearer ${token}errado`);

      expect(response.status).toBe(401);
    });
  });
  describe('Remover um interesse', () => {
    let token = null;

    beforeAll(async () => {
      await getConnection().dropDatabase()
      await getConnection().synchronize();

      const user = {
        user_id: 1,
        email: 'carlosboavida@gm.com',
        user_img_id: 1,
        user_pass: '123vidaboa',
        username: 'carlosboaviida',
        born_in: '2020-06-15'
      };

      await getConnection().createQueryBuilder().insert().into("user_img").values({ user_img_id: 1, img_url: "http://localhost:4456" }).execute();
      await getConnection().createQueryBuilder().insert().into("tb_user").values(user).execute();
      await getConnection().createQueryBuilder().insert().into("theme_img").values({ theme_img_id: 1, img_url: "http://localhost:4456" }).execute();
      await getConnection().createQueryBuilder().insert().into("theme").values({ theme_id: 1, theme_name: "Sexo", theme_img_id: 1 }).execute();
      await getConnection().createQueryBuilder().insert().into("interest").values({ interest_id: 1, theme_id: 1, user_id: 1 }).execute();

      const response = await request(app.getHttpServer()).post('/auth/login').send({ email: 'carlosboavida@gm.com', user_pass: '123vidaboa' });
      token = response.body.token;
    });

    it('> DELETE /interest/:interest_id Deve remover um interesse', async () => {
      const interest_id = 1;
      const response = await request(app.getHttpServer())
        .delete(`/interest/${interest_id}`)
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(204);
    });

    it('> DELETE /interest/:interest_id Não deve remover um interesse (Token JWT inválido)', async () => {
      const interest_id = 1;
      const response = await request(app.getHttpServer())
        .delete(`/interest/${interest_id}`)
        .set('Authorization', `Bearer ${token}errado`);

      expect(response.status).toBe(401);
    });

    it('> DELETE /interest Não deve remover um interesse (Interesse não encontrado)', async () => {
      const interest_id = 2;
      const response = await request(app.getHttpServer())
        .delete(`/interest/${interest_id}`)
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(404);
    });
  });
});