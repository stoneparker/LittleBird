import { IsNotEmpty, IsString } from "class-validator";

export class GetThemeDto {
  theme_id: number;
  theme_name: string;
  theme_img_id: number | {
    theme_img_id: number;
    img_url: string;
  };
}

export class QueryPageDto {

  @IsString() @IsNotEmpty()
  page: number;
}