import {
    Injectable,
    ConflictException,
    UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UserService } from './user/user.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
    constructor(
        private readonly userService: UserService,
        private readonly jwtService: JwtService,
    ) {}

    async register(dto: RegisterDto) {
        const exists = await this.userService.findByEmail(dto.email);
        if (exists) throw new ConflictException('이미 존재하는 이메일입니다.');

        const passwordHash = await bcrypt.hash(dto.password, 10);
        const user = await this.userService.create(dto.email, passwordHash);

        return {
            id: user._id,
            email: user.email,
            role: user.role,
            status: user.status,
        };
    }

    async login(dto: LoginDto) {
        const user = await this.userService.findByEmail(dto.email);
        if (!user) throw new UnauthorizedException('이메일 또는 비밀번호가 일치하지 않습니다.');

        const isMatch = await bcrypt.compare(dto.password, user.passwordHash);
        if (!isMatch) throw new UnauthorizedException('이메일 또는 비밀번호가 일치하지 않습니다.');

        if (user.status === 'blocked') throw new UnauthorizedException('차단된 계정입니다.');

        const payload = {
            sub: user.id,
            email: user.email,
            role: user.role,
        };

        const token = await this.jwtService.signAsync(payload, {
            secret: process.env.JWT_SECRET,
            expiresIn: process.env.JWT_EXPIRES_IN || '1h',
        });

        return {
            accessToken: token,
            user: {
                id: user.id,
                email: user.email,
                role: user.role,
            },
        };
    }
}