import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseFilters,
  UseGuards,
} from '@nestjs/common';
import { ProjectsService } from '../service/projects.service';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { CreateProjectDTO, UpdateProjectDTO } from '../dto/projects.dto';
import * as userDecorator from 'src/common/decorators/user.decorator';
import { HttpExceptionFilter } from 'src/common/filters/http.exception';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';

@Controller('projects')
@ApiTags('Projects')
@UseFilters(new HttpExceptionFilter())
export class ProjectsController {
  constructor(private readonly projectService: ProjectsService) {}
  @Post('/newProject')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create new project' })
  async newProject(
    @Body() createProjectDto: CreateProjectDTO,
    @userDecorator.CurrentUser() user: userDecorator.AuthUser,
  ) {
    const project = await this.projectService.createProject(
      createProjectDto,
      user.id,
    );
    return {
      message: 'project has been created',
      success: true,
      project,
    };
  }
  @Patch('/updateProject/:id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update a prject' })
  @ApiParam({ name: 'id', type: 'string' })
  async patchProject(
    @Param('id') id: string,
    @Body()
    updateProjectDto: UpdateProjectDTO,
  ) {
    const newProject = await this.projectService.updateProject(
      updateProjectDto,
      id,
    );
    return {
      messsage: 'Project has been updated',
      success: true,
      newProject,
    };
  }

  @Get('/getProjectById/:id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get project by ID' })
  @ApiParam({ name: 'id', type: 'string' })
  async fetchProjectById(@Param('id') id: string) {
    const findProject = await this.projectService.getProjectById(id);
    return {
      message: 'Project has been fetched',
      success: true,
      findProject,
    };
  }
  @Get('/getAllProject')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get project by ID' })
  async fetchAllProject() {
    const fetchProjects = await this.projectService.getAllProjects();
    return {
      message: 'Projects have been fetched',
      success: true,
      fetchProjects,
    };
  }
  @Delete('/removeProject/:id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Remove project' })
  async removeProject(@Param('id') id: string) {
    const projectRemoved = await this.removeProject(id);
    return {
      message: 'project has been removed',
      success: true,
      projectRemoved,
    };
  }
}
