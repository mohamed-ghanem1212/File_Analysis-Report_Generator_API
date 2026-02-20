import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/db/service/db.service';
import { CreateProjectDTO } from '../dto/projects.dto';

@Injectable()
export class ProjectsService {
  constructor(private readonly prisma: PrismaService) {}

  async createProject(createProjectDto: CreateProjectDTO) {
    if (!createProjectDto) {
      throw new BadRequestException('Please provide the essential Data');
    }
    const findUser = await this.prisma.user.findUnique({
      where: { id: createProjectDto.userId },
    });
    if (!findUser) {
      throw new NotFoundException('User not found');
    }
    const project = await this.prisma.project.create({
      data: createProjectDto,
      include: {
        user: {
          select: {
            id: true,
            username: true,
            email: true,
            isActive: true,
            role: true,
          },
        },
      },
    });
    return project;
  }
}
