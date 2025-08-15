import { Body, Controller, Delete, Get, Param, Patch, Post, Request, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { AuthGuard } from 'src/guards/auth/auth.guard';

@Controller('document')
export class DocumentController {
    constructor(
        private readonly usersService: UsersService
    ) {}


    @UseGuards(AuthGuard)
    @Get()
    findAll(@Request() req: Request) {
        const userId = req['user'].id;
        return this.usersService.findAllDocuments(userId);
    }

    @UseGuards(AuthGuard)
    @Post()
    create(@Request() req: Request,@Body() body: any) {
        return this.usersService.createDocument(req['user'].id, body);
    }

    @UseGuards(AuthGuard)
    @Patch('/:id')
    update(
      @Request() req: any,
      @Param('id') id: number,
      @Body() body: any
    ) {
      const userId = req.user.id;
      return this.usersService.updateDocument(userId, id, body);
    }

    @UseGuards(AuthGuard)
    @Delete('/:id')
    remove(@Request() req: Request,@Param('id') id: number) {
        const userId = req['user'].id;
        return this.usersService.deleteDocument(userId, id);
    }

    @UseGuards(AuthGuard)
    @Post('/:id/child')
    createChildPage(@Request() req: Request,@Param('id') id: number,@Body() body:any) {
        const userId = req['user'].id;
        return this.usersService.createChildPage(userId,id,body);
    }

    @Get('/:id')
    findOne(@Param('id') id: number) {
        return this.usersService.findOneDocument(id);
    }

    @UseGuards(AuthGuard)
    @Post('/:id/block')
    createBlock(@Request() req: Request,@Param('id') id: number,@Body() body: any) {
        const userId = req['user'].id;
        return this.usersService.createBlock(userId,id,body);
    }

    @UseGuards(AuthGuard)
    @Patch('/:id/block/:blockId')
    updateBlock(@Request() req: Request,@Param('id') id: number,@Param('blockId') blockId: number,@Body() body: any) {
        const userId = req['user'].id;
        return this.usersService.updateBlock(userId,id,blockId,body);
    }

    @UseGuards(AuthGuard)
    @Delete('/:id/block/:blockId')
    removeBlock(@Request() req: Request,@Param('id') id: number,@Param('blockId') blockId: number) {
        const userId = req['user'].id;
        return this.usersService.removeBlock(userId,id,blockId);
    }

    @UseGuards(AuthGuard)
    @Post('/:id/block/:blockId/child')
    addChildBlock(@Request() req: Request,@Param('id') id: number,@Param('blockId') blockId: number,@Body() body: any) {
        const userId = req['user'].id;
        return this.usersService.addChildBlock(userId,id,blockId,body);
    }
}
