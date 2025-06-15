import {CanActivate, ExecutionContext, Injectable, UnauthorizedException,} from '@nestjs/common';
import {JwtService} from '@nestjs/jwt';
import {Request} from 'express';
import {JwtRequest} from "./jwt.request.type";

@Injectable()
export class JwtAuthGuard implements CanActivate {
    constructor(private readonly jwtService: JwtService) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest() as JwtRequest;
        const token = this.extractToken(request);

        if (!token) {
            throw new UnauthorizedException('토큰이 없습니다.');
        }

        try {
            request.user = await this.jwtService.verifyAsync(token, {
                secret: process.env.JWT_SECRET,
            }); // 토큰에서 추출한 사용자 정보를 요청 객체에 추가
        } catch {
            throw new UnauthorizedException('유효하지 않은 토큰입니다.');
        }

        return true;
    }

    private extractToken(request: Request): string | undefined {
        const authHeader = request.headers.authorization;
        if (!authHeader) return undefined;

        const [type, token] = authHeader.split(' ');
        return type === 'Bearer' ? token : undefined;
    }
}