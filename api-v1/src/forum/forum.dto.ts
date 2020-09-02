import { IsString, IsNotEmpty } from "class-validator";

export class RemoveCommentDto {

 @IsString() @IsNotEmpty()
 comment_id: number;
};

export class GetForumByThemeDto {

  @IsString() @IsNotEmpty()
  theme_id: number;
};

export class GetForumAndCommentDto {

  @IsString() @IsNotEmpty()
  forum_id: number;
};

export class CreateCommentParamDto {

  @IsString() @IsNotEmpty()
  forum_id: number;
};

export class CreateCommentBodyDto {

  @IsString() @IsNotEmpty()
  comment_content: string;
};

export class CreateLikeDto {

  @IsString() @IsNotEmpty()
  forum_id: number;
};

export class RemoveLikeDto {

  @IsString() @IsNotEmpty()
  forum_id: number;
};

export class QueryPageDto {

  @IsString() @IsNotEmpty()
  page: number;
};

export class HandleJoinForumDto {
  nameRoom: string;
};

export class HandleLeaveForumDto {
  nameRoom: string;
};

