import { Injectable } from '@nestjs/common';
import { CreateCommentLikeDto } from './dto/create-comment_like.dto';
import { UpdateCommentLikeDto } from './dto/update-comment_like.dto';

@Injectable()
export class CommentLikesService {
  create(createCommentLikeDto: CreateCommentLikeDto) {
    return 'This action adds a new commentLike';
  }

  findAll() {
    return `This action returns all commentLikes`;
  }

  findOne(id: number) {
    return `This action returns a #${id} commentLike`;
  }

  update(id: number, updateCommentLikeDto: UpdateCommentLikeDto) {
    return `This action updates a #${id} commentLike`;
  }

  remove(id: number) {
    return `This action removes a #${id} commentLike`;
  }
}
