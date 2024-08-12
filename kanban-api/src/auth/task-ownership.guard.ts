import { BadRequestException, CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
import { TasksService } from 'src/tasks/tasks.service';
  
@Injectable()
export class TaskOwnershipGuard implements CanActivate {
  constructor( private readonly taskService: TasksService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const userId = request.user.sub;
    const projectId = Number(request.params.id);
    const taskId = Number(request.params.taskId);
    if (isNaN(projectId)) {
      throw new BadRequestException('Invalid project ID');
    }
    if (isNaN(taskId)) {
      throw new BadRequestException('Invalid task ID');
    }
    const taskProjectId = await this.taskService.getProjectId(taskId);
    if (taskProjectId !== projectId){
        throw new ForbiddenException({ message: 'Task was not found or does not belong to the project' });
    }
    return true;
  }
}

