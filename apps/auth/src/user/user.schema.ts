import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserDocument = User & Document;

export type UserRole = 'user' | 'admin';
export type UserStatus = 'active' | 'blocked';

@Schema({ timestamps: true })
export class User {
    @Prop({ required: true, unique: true })
    email!: string;

    @Prop({ required: true })
    passwordHash!: string;

    @Prop({ default: 'user', enum: ['user', 'admin'] })
    role!: UserRole;

    @Prop({ default: 'active', enum: ['active', 'blocked'] })
    status!: UserStatus;
}

export const UserSchema = SchemaFactory.createForClass(User);