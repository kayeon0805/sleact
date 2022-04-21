import {
  Body,
  Controller,
  NotFoundException,
  Post,
  UseGuards,
  Get,
  Response,
  ForbiddenException,
} from '@nestjs/common';
import { ApiCookieAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { User } from 'common/decorators/user.decorator';
import { LocalAuthGuard } from 'src/auth/local.auth.guard';
import { LoggedInGuard } from 'src/auth/logged-in.guards';
import { NotLoggedInGuard } from 'src/auth/not-logged-in.guards';
import { Users } from '../entities/Users';
import { JoinRequestDto } from './dto/join.request.dto';
import { UsersService } from './users.service';

@ApiTags('USERS')
@Controller('api/users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  // 담은 user.id로 유저 아이디, 이메일, 닉네임과 해당 유저가 속한 워크스페이스 정보를 받아옴
  @ApiCookieAuth('connect.sid')
  @ApiOperation({ summary: '내 정보 가져오기' })
  @Get()
  async getProfile(@User() user: Users) {
    return user || false;
  }

  // 로그인을 한 후 request에 user.id를 담음.
  @ApiOperation({ summary: '로그인' })
  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@User() user: Users) {
    return user;
  }

  @ApiOperation({ summary: '회원가입' })
  @UseGuards(NotLoggedInGuard)
  @Post()
  async join(@Body() data: JoinRequestDto) {
    const user = this.usersService.findByEmail(data.email);
    if (!user) {
      throw new NotFoundException();
    }
    const result = await this.usersService.join(
      data.email,
      data.nickname,
      data.password,
    );
    if (result) {
      return 'ok';
    } else {
      throw new ForbiddenException();
    }
  }

  @ApiCookieAuth('connect.sid')
  @ApiOperation({ summary: '로그아웃' })
  @UseGuards(LoggedInGuard)
  @Post('logout')
  async logout(@Response() res) {
    res.clearCookie('connect.sid', { httpOnly: true });
    return res.send('ok');
  }
}
