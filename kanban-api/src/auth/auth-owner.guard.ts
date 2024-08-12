import { BadRequestException, CanActivate, ExecutionContext, ForbiddenException, Injectable} from '@nestjs/common';
import { ProjectsService } from 'src/projects/projects.service';
  
@Injectable()
export class AuthOwnerGuard implements CanActivate {
  constructor( private readonly projectsService: ProjectsService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const userId = request.user.sub;
    const projectId = Number(request.params.id);
    if (isNaN(projectId)) {
      throw new BadRequestException('Invalid project ID');
    }
    const project = await this.projectsService.findOne(projectId)
    if (project.userId !== userId){
        throw new ForbiddenException({ message: 'Access Denied' });
    }
    return true;
  }
}

