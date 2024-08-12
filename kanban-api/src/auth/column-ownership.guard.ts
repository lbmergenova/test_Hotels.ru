import { BadRequestException, CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
import { ColumnsService } from 'src/columns/columns.service';
  
@Injectable()
export class ColumnOwnershipGuard implements CanActivate {
  constructor( private readonly columnsService: ColumnsService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const userId = request.user.sub;
    const projectId = Number(request.params.id);
    const columnsId = Number(request.params.columnsId);
    if (isNaN(projectId)) {
      throw new BadRequestException('Invalid project ID');
    }
    if (isNaN(columnsId)) {
      throw new BadRequestException('Invalid columns ID')
    }
    const column= await this.columnsService.findOne(columnsId);
    if (column.projectId = projectId){
        throw new ForbiddenException({ message: 'Project not found or belongs to another project' });
    }
    return true;
  }
}

