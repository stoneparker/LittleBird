import { SubscribeMessage, WebSocketGateway, OnGatewayInit, ConnectedSocket, MessageBody, WsResponse, WebSocketServer, OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';
import { Logger, Injectable } from '@nestjs/common';
import { HandleJoinForumDto, HandleLeaveForumDto } from './forum.dto';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Forum } from './entity/forum.entity';
import { User } from '../user/entity/user.entity';

class Message {
  forum_id: number;
  user_id: number;
  comment_id: number;
  comment_content: string;
};

@Injectable()
@WebSocketGateway(3001, { namespace: '/forum' })
export class ForumGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {

  @WebSocketServer()
  wss: Server;

  private logger: Logger = new Logger('ForumGateway');

  constructor(
    @InjectRepository(Forum) private readonly forumRepository: Repository<Forum>,
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {};

  afterInit(server: Socket) {
    this.logger.log('Namespace "/forum" pronto')
  };

  handleConnection(client: Socket) {
    console.log('Nova conexão: ' + client.id);
  };

  handleDisconnect(client: Socket) {
    console.log('Desconexão: ' + client.id)
  };

  @SubscribeMessage('join forum')
  handleJoinForum(@ConnectedSocket() client: Socket, @MessageBody() data: HandleJoinForumDto): void {
    client.join(data.nameRoom);

  };

  @SubscribeMessage('leave forum')
  handleLeaveForum(@ConnectedSocket() client: Socket, @MessageBody() data: HandleLeaveForumDto): void {
    client.leave(data.nameRoom);
  };

  async handleNewMessage(message: Message): Promise<void> {
    const forum = await this.forumRepository.createQueryBuilder('forum')
      .select(['forum.title'])
      .where('forum.forum_id = :forum_id', { forum_id: message.forum_id })
      .getOne();

    const user = await this.userRepository.createQueryBuilder('user')
      .select(['user.user_id', 'user.username', 'user_img'])
      .innerJoin('user.user_img_id', 'user_img')
      .where('user.user_id = :user_id', { user_id: message.user_id })
      .getOne();

    this.wss.to(forum.title).emit('new message', {
      comment_id: message.comment_id,
      comment_content: message.comment_content,
      user_id: user,
      no_like: 0
    });
  };

}
