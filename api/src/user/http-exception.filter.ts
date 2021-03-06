import { QueryFailedError } from 'typeorm';
import { ExceptionFilter, ArgumentsHost, Catch } from '@nestjs/common';
import { Response } from 'express';

@Catch(QueryFailedError)
export class QueryFailedExceptionFilter implements ExceptionFilter {
  catch(exception, host: ArgumentsHost) {
    const context = host.switchToHttp();
    const response = context.getResponse<Response>();

    let errorResponse;  

    if (exception.code == 23505) {
      errorResponse = {
        error: "O e-mail ou username informados já estão presentes no banco de dados.",
      };
      response.status(409).json(errorResponse);
    } else if (exception.code == 23503) {
      errorResponse = {
        error: "O user_img_id não existe no servidor.",
      };
      response.status(404).json(errorResponse);
    } else
      response.status(500).json({ error: "Erro interno no servidor." });
  }
}
