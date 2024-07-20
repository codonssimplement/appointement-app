import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Book } from './book.entity'

@Injectable()
export class BooksService {
  constructor(
    @InjectRepository(Book)
    private booksRepository: Repository<Book>
  ) {}

  findAll(): Promise<Book[]> {
    return this.booksRepository.find()
  }

  findOne(id: number): Promise<Book> {
    return this.booksRepository.findOneBy({ id })
  }

  create(book: Book): Promise<Book> {
    return this.booksRepository.save(book)
  }

  async update(id: number, updateBookDto: Partial<Book>): Promise<Book> {
    await this.booksRepository.update(id, updateBookDto)
    return this.booksRepository.findOneBy({ id })
  }

  async remove(id: number): Promise<void> {
    await this.booksRepository.delete(id)
  }
}