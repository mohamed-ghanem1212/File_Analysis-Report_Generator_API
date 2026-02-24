import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/db/service/db.service';
import { CreateProjectDTO, UpdateProjectDTO } from '../dto/projects.dto';

@Injectable()
export class ProjectsService {
  constructor(private readonly prisma: PrismaService) {}

  async createProject(createProjectDto: CreateProjectDTO, id: string) {
    if (!createProjectDto) {
      throw new BadRequestException('Please provide the essential Data');
    }
    const findUser = await this.prisma.user.findUnique({
      where: { id },
    });
    if (!findUser) {
      throw new NotFoundException('User not found');
    }
    const project = await this.prisma.project.create({
      data: { userId: id, ...createProjectDto },
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
  async updateProject(updateProjectDto: UpdateProjectDTO, id: string) {
    if (!id) {
      throw new BadRequestException("Can't fetch the projet without ID");
    }
    if (!updateProjectDto) {
      const sameProject = await this.getProjectById(id);
      return sameProject;
    }
    const updatedProject = await this.prisma.project.update({
      where: { id },
      data: {
        name: updateProjectDto.name,
        visibility: updateProjectDto.visibility,
        settings: updateProjectDto.settings,
      },
      include: {
        user: {
          select: {
            username: true,
            email: true,
            id: true,
            isActive: true,
            role: true,
          },
        },
      },
    });
    return updatedProject;
  }

  async getProjectById(id: string) {
    if (!id) {
      throw new BadRequestException("Can't fetch the projet without ID");
    }
    const findProject = await this.prisma.project.findUnique({ where: { id } });
    if (!findProject) {
      throw new NotFoundException('Project not found');
    }
    return findProject;
  }
  async removeProjectById(id: string) {
    if (!id) {
      throw new BadRequestException("Can't fetch the projet without ID");
    }
    try {
      return await this.prisma.project.delete({
        where: { id },
      });
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException('Project not found');
      }
      throw error;
    }
  }

  async getAllProjects() {
    const allProjects = await this.prisma.project.findMany();
    if (allProjects.length === 0) {
      throw new BadRequestException('projects list is empty');
    }
    return allProjects;
  }
}
