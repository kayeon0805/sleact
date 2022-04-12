import { PickType } from '@nestjs/swagger';
import { Users } from 'src/entities/Users';

// PickType: Users 에서 정의한 @ApiProperty({ example: 1, description: '사용자 아이디'})처럼
// 원하는 것들만 DTO로 가져올 수 있음. 중복 제거
export class JoinRequestDto extends PickType(Users, [
  'email',
  'nickname',
  'password',
] as const) {}
