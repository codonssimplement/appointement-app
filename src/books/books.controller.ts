import {
    Controller,
    Get,
    Post,
    Put,
    Delete,
    Body,
    Param,
  } from '@nestjs/common'
  import { BooksService } from './books.service'
  import { Book } from './book.entity'
  
  @Controller('books')
  export class BooksController {
    constructor(private readonly booksService: BooksService) {}
  
    @Get()
    findAll(): Promise<Book[]> {
      return this.booksService.findAll()
    }
  
    @Get(':id')
    findOne(@Param('id') id: number): Promise<Book> {
      return this.booksService.findOne(id)
    }
  
    @Post()
    create(@Body() createBookDto: Book): Promise<Book> {
      return this.booksService.create(createBookDto)
    }
  
    @Put(':id')
    update(
      @Param('id') id: number,
      @Body() updateBookDto: Partial<Book>
    ): Promise<Book> {
      return this.booksService.update(id, updateBookDto)
    }
  
    @Delete(':id')
    remove(@Param('id') id: number): Promise<void> {
      return this.booksService.remove(id)
    }
  }