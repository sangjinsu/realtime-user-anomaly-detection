import {CanActivate, ExecutionContext, Injectable, UnauthorizedException,} from '@nestjs/common';
import {JwtService} from '@nestjs/jwt';
import {Request} from 'express';

interface JwtPayload {
    sub: string;
    role: string;
    email?: string;
    [key: string]: any;
}

interface JwtRequest extends Request {
    user?: JwtPayload;
}


@Injectable()
export class JwtAuthGuard implements CanActivate {
    constructor(private readonly jwtService: JwtService) {
    }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest() as JwtRequest;
        const token = this.extractTokenFromHeader(request);

        if (!token) {
            throw new UnauthorizedException('토큰이 없습니다.');
        }

        try {
            request.user = await this.jwtService.verifyAsync(token, {
                secret: process.env.JWT_SECRET,
            });
        } catch {
            throw new UnauthorizedException('유효하지 않은 토큰입니다.');
        }

        return true;
    }

    private extractTokenFromHeader(request: Request): string | undefined {
        const [type, token] = (request.headers.authorization || '').split(' ');
        return type === 'Bearer' ? token : undefined;
    }
}