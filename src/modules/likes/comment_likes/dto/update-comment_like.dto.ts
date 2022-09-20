import { PartialType } from '@nestjs/mapped-types';
import { CreateCommentLikeDto } from './create-comment_like.dto';

export class UpdateCommentLikeDto extends PartialType(CreateCommentLikeDto) {}
