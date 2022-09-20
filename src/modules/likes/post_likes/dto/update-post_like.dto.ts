import { PartialType } from '@nestjs/mapped-types';
import { CreatePostLikeDto } from './create-post_like.dto';

export class UpdatePostLikeDto extends PartialType(CreatePostLikeDto) {}
