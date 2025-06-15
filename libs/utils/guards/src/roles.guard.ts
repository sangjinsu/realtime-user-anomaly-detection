import {CanActivate, ExecutionContext, Injectable, ForbiddenException, SetMetadata} from '@nestjs/common';
import { Reflector } from '@nestjs/core';

interface JwtPayload {
    sub: string;
    role: string;
    email?: string;
    [key: string]: any;
}

interface JwtRequest extends Request {
    user?: JwtPayload;
}

export const ROLES_KEY = 'roles';
export const Roles = (...roles: string[]) => SetMetadata(ROLES_KEY, roles);


@Injectable()
export class RolesGuard implements CanActivate {
    constructor(private reflector: Reflector) {}

    canActivate(context: ExecutionContext): boolean {
        const requiredRoles = this.reflector.getAllAndOverride<string[]>(
            ROLES_KEY,
            [context.getHandler(), context.getClass()],
        );
        if (!requiredRoles) return true;

        const request = context.switchToHttp().getRequest() as JwtRequest;
        const user = request.user;

        if (!user || !requiredRoles.includes(user.role)) {
            throw new ForbiddenException('접근 권한이 없습니다.');
        }

        return true;
    }
}