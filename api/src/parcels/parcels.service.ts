import { Injectable } from '@nestjs/common';
import { CreateParcelDto } from './dto/create-parcel.dto';
import { UpdateParcelDto } from './dto/update-parcel.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ParcelsService {
  constructor(private prisma: PrismaService) {}
  create(createParcelDto: CreateParcelDto) {
    return 'This action adds a new parcel';
  }

  findAll() {
    return this.prisma.parcel.findMany({
      include: {
        products: true,
      },
    });
  }

  findOne(id: number) {
    return `This action returns a #${id} parcel`;
  }

  update(id: number, updateParcelDto: UpdateParcelDto) {
    return `This action updates a #${id} parcel`;
  }

  remove(id: number) {
    return `This action removes a #${id} parcel`;
  }
}
