import { Injectable } from '@nestjs/common';
import { CreatePostLikeDto } from './dto/create-post_like.dto';
import { UpdatePostLikeDto } from './dto/update-post_like.dto';

@Injectable()
export class LikesService {
  create(createLikeDto: CreatePostLikeDto) {
    return 'This action adds a new like';
  }

  findAll() {
    return `This action returns all likes`;
  }

  findOne(id: number) {
    return `This action returns a #${id} like`;
  }

  update(id: number, updateLikeDto: UpdatePostLikeDto) {
    return `This action updates a #${id} like`;
  }

  remove(id: number) {
    return `This action removes a #${id} like`;
  }
}
