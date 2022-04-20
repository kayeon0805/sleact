import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
// 워크스페이스 참가자 목록을 실시간으로 담고 있는 객체
import { onlineMap } from './onlineMap';

// websocket: namespce -> room
// sleact: workspace -> channel/dm
// => 사용자들이 어떤 워크스페이스를 만들지 모르기 때문에 정규표현식 사용
@WebSocketGateway({ namespace: /\/ws-.+/ })
export class EventsGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer() public server: Server;

  @SubscribeMessage('test')
  handleTest(@MessageBody() data: string) {
    console.log('test', data);
  }

  @SubscribeMessage('login')
  handleLogin(
    @MessageBody() data: { id: number; channels: number[] },
    @ConnectedSocket() socket: Socket,
  ) {
    const newNamespace = socket.nsp;
    console.log('login', newNamespace);
    onlineMap[socket.nsp.name][socket.id] = data.id;
    newNamespace.emit('onlineList', Object.values(onlineMap[socket.nsp.name]));
    data.channels.forEach((channel) => {
      console.log('join', socket.nsp.name, channel);
      socket.join(`${socket.nsp.name}-${channel}`);
    });
  }

  afterInit(server: Server) {
    console.log('WebSocketServer init');
  }

  // 연결됐을 때
  handleConnection(@ConnectedSocket() socket: Socket): any {
    // socket.nsp.name => 워크 스페이스 이름
    if (!onlineMap[socket.nsp.name]) {
      onlineMap[socket.nsp.name] = {};
    }
    socket.emit('hello', socket.nsp.name);
  }

  // 연결 끊었을 때
  handleDisconnect(@ConnectedSocket() socket: Socket): any {
    console.log('disconnected', socket.nsp.name);
    const newNamespace = socket.nsp;
    delete onlineMap[socket.nsp.name][socket.id];
    newNamespace.emit('onlineList', Object.values(onlineMap[socket.nsp.name]));
  }
}
