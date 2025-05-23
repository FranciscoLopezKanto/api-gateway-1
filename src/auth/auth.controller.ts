import { Body, ConflictException, Controller, Delete, Get, Param, Patch, Post, Put, Query, Req, Res, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ChangePasswordRequestDto, LoginRequestDto, RegisterRequestDto } from './dto/auth.dto';
import { UserRequestDto } from './dto/user.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { Roles } from './decorators/role.decorator';
import { RolesGuard } from './guards/roles.guard';
import { Request, Response } from 'express';
import { JwtRefreshGuard } from './guards/jwt-refresh.guard';
import { UpdateDocumentDto } from './dto/update-document.dto';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Post('login')
    login(
        @Body() payload: LoginRequestDto,
        @Res({ passthrough: true }) res: Response
    ): Promise<void> {
        try {
            return this.authService.login(payload,res);
        } catch (error) {
            throw new Error(
                typeof error === 'string' ? error : error.message || 'Error desconocido'
            );
        }
    }

    @Post('refresh')
    @UseGuards(JwtRefreshGuard)
    refresh(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
        return this.authService.refreshAccessToken(req, res);
    }

    @Post('logout')
    logout(@Res({ passthrough: true }) res: Response) {
        res.clearCookie('refreshToken', {
            httpOnly: true,
            secure: false, // true si usas HTTPS
            sameSite: 'lax',
        });
        return res.status(200).json({ message: 'Sesión cerrada' });
    }

    @UseGuards(JwtAuthGuard)
    @Post('register')
    async register(@Body() payload: RegisterRequestDto): Promise<RegisterRequestDto> {
        try {
            return await this.authService.register(payload);
        } catch (error) {
            throw new ConflictException(
                typeof error === 'string' ? error : error.message || 'Error desconocido'
            );
        }
    }

    @Post('change-password')
    changePassword(@Body() payload: ChangePasswordRequestDto): Promise<string> {
        return this.authService.changePassword(payload);
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Get('user')
    getUser(@Query('email') email: string) {
        return this.authService.getUserByEmail(email);
    }

    @UseGuards(JwtAuthGuard)
    @Get('user/:_id')
    getUserById(@Param('_id') _id: string): Promise<UserRequestDto | null> {
        return this.authService.getUserById(_id);
    }

    @UseGuards(JwtAuthGuard)
    @Get('users')
    getUsers(): Promise<UserRequestDto[]> {
        return this.authService.getAllUsers();
    }

    @UseGuards(JwtAuthGuard)
    @Put('user/edit/:_id')
    updateUser(
        @Param('_id') _id: string,
        @Body() updateData: Partial<UserRequestDto>,
    ): Promise<UserRequestDto> {
        return this.authService.updateUser(_id, updateData);
    }

    @UseGuards(JwtAuthGuard)
    @Delete('user/:_id')
    deleteUser(@Param('_id') _id: string): Promise<string> {
        return this.authService.deleteUser(_id);
    }

    @Patch('user/:_id/documents')
    //seGuards(JwtAuthGuard)
    updateUserDocument(
    @Param('_id') _id: string,
    @Body() document: UpdateDocumentDto,
    ) {
    return this.authService.updateUserDocument(_id, document);
    }


}
