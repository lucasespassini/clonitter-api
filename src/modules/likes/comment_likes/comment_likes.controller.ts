import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { CommentLikesService } from './comment_likes.service';
import { CreateCommentLikeDto } from './dto/create-comment_like.dto';
import { UpdateCommentLikeDto } from './dto/update-comment_like.dto';

@Controller('comment-likes')
export class CommentLikesController {
  constructor(private readonly commentLikesService: CommentLikesService) {}

  @Post()
  create(@Body() createCommentLikeDto: CreateCommentLikeDto) {
    return this.commentLikesService.create(createCommentLikeDto);
  }

  @Get()
  findAll() {
    return this.commentLikesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.commentLikesService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateCommentLikeDto: UpdateCommentLikeDto,
  ) {
    return this.commentLikesService.update(+id, updateCommentLikeDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.commentLikesService.remove(+id);
  }
}
