import { Controller, Get, Post, Body, Param, Delete } from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CreateCommentDto } from './dto/create-comment.dto';

@Controller('comment')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Post()
  create(@Body() createCommentDto: CreateCommentDto) {
    return this.commentsService.create(createCommentDto);
  }

  @Get()
  findAll() {
    return this.commentsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.commentsService.findOne(+id);
  }

  @Get('post/:postId')
  findAllCommentsByPostId(@Param('postId') postId: string) {
    return this.commentsService.findAllCommentsByPostId(postId);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.commentsService.remove(+id);
  }

  @Post('add-like/:id')
  addLike(@Param('id') id: string) {
    return this.commentsService.addLike(+id);
  }

  @Post('remove-like/:id')
  removeLike(@Param('id') id: string) {
    return this.commentsService.removeLike(+id);
  }
}
