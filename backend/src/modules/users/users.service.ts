import { InjectRedis } from '@nestjs-modules/ioredis';
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Redis } from 'ioredis';
import { Block } from 'src/entities/block.entity';
import { Page } from 'src/entities/page.entity';
import { User } from 'src/entities/user.entity';
import Hash from 'src/utils/hashing';
import { In, Repository } from 'typeorm';
import { v4 as uuid } from 'uuid';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(Block)
    private blockRepository: Repository<Block>,
    @InjectRepository(Page)
    private documentRepository: Repository<Page>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private jwtService: JwtService,
    @InjectRedis() private readonly redis: Redis,
  ) {}

  async findAll() {
    return this.userRepository.find();
  }

  async findOne(id: number, relations: any = {}) {
    return this.userRepository.findOne({ where: { id }, relations });
  }

  async createUser(data: any) {
    data.password = Hash.make(data.password);
    return this.userRepository.save(data);
  }

  async updateUser(id: number, data: any) {
    return this.userRepository.update(id, data);
  }

  async removeUser(id: number) {
    return this.userRepository.delete(id);
  }

  async login(body: any) {
    // kiểm tra email có tồn tại trong database hay không
    const user = await this.userRepository.findOne({
      where: { email: body.email },
    });
    if (!user) {
      return false;
    }
    // so sánh password từ body và hash password trong database
    if (!Hash.compare(body.password, user.password)) {
      return false;
    }

    // tao JWT
    // - xác định thời gian (.env)
    // - xác định data đưa vào jwt
    const jtiAccessToken = uuid();
    const token = this.jwtService.sign({
      jti: jtiAccessToken,
      userId: user.id,
      email: user.email,
    });

    const jtiRefreshToken = uuid();
    const refeshToken = this.jwtService.sign(
      {
        jti: jtiRefreshToken,
        userId: user.id,
        email: user.email,
      },
      {
        expiresIn: process.env.JWT_REFRESH_TOKEN_EXPIRED,
        secret: process.env.JWT_REFRESH_TOKEN_SECRET,
      },
    );

    // thêm jti vào redis
    // jtiRefreshToken: jtiAccessToken,
    // decode access token lấy exp
    const { exp: expAccessToken } = this.verifyToken(token);
    // decode refresh token lấy exp
    const { exp: expRefreshToken } = this.veryfyRefreshToken(refeshToken);
    await this.redis.set(
      `jwt_refresh_${jtiRefreshToken}`,
      JSON.stringify({
        jtiAccessToken,
        exp: expAccessToken,
      }),
      'EX',
      Math.round(expRefreshToken - Date.now() / 1000),
    );
    return {
      accessToken: token,
      refeshToken,
      user,
    };
  }

  profile(id: number) {
    return this.userRepository.findOne({
      where: { id },
      relations: ['page'],
    });
  }

  verifyToken = (token: string) => {
    try {
      const decode = this.jwtService.verify(token);
      return decode;
    } catch (error) {
      return null;
    }
  };

  veryfyRefreshToken = (token: string) => {
    try {
      const decode = this.jwtService.verify(token, {
        secret: process.env.JWT_REFRESH_TOKEN_SECRET,
      });
      return decode;
    } catch (error) {
      return null;
    }
  };

  async refreshToken(body: any) {
    const refreshToken = body.refreshToken;
    try {
      const decode = this.jwtService.verify(refreshToken, {
        secret: process.env.JWT_REFRESH_TOKEN_SECRET,
      });
      const token = this.jwtService.sign({
        userId: decode.userId,
        email: decode.email,
      });
      // thêm token cũ vào blacklist
      // => lấy jti access token cũ
      //  b1: lấy jti của refesh token
      const jtiRefreshToken = decode.jti;
      // b2: gọi lên redis -> jti của access token
      const accessToken = await this.redis.get(
        `jwt_refresh_${jtiRefreshToken}`,
      );
      // b3: thêm jti access token vào blacklist
      if (accessToken) {
        const now = Date.now() / 1000;
        const { exp, jtiAccessToken } = JSON.parse(accessToken);
        if (now < exp) {
          await this.redis.set(
            `jwt_blacklist_${jtiAccessToken}`,
            jtiAccessToken,
            'EX',
            Math.round(exp - now),
          );
        }
      } else {
        return false;
      }
      return {
        accessToken: token,
        refreshToken,
      };
    } catch {
      return false;
    }
  }

  async logout(jti: string, exp: number) {
    const diff = exp - Date.now() / 1000;
    await this.redis.set(`jwt_blacklist_${jti}`, jti, 'EX', Math.round(diff));
    return {
      success: true,
    };
  }

  async createDocument(userId: number, body: any) {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['page'],
    });
    if (!user) {
      throw new Error('User không tồn tại');
    }
    const newDocument = this.documentRepository.create({
      ...body,
      title: 'Untitled',
      user,
    });
    await this.documentRepository.save(newDocument);
    const userUpate = await this.userRepository.findOne({
        where: { id: userId },
        relations: ['page'],
      });

    return userUpate;
  }

  async updateDocument(userId: number, id: number, body: any) {
    const document = await this.documentRepository.findOne({
      where: { id },
      relations: { user: true }, // ✅ dùng object thay vì mảng cho TypeORM v0.3+
    });

    if (!document) {
      throw new Error('Không tìm thấy');
    }

    if (document.user.id !== userId) {
      throw new Error('Bạn không có quyền sửa');
    }

    const updated = await this.documentRepository.merge(document, body);

    await this.documentRepository.save(updated);

    return document;
  }

  async deleteDocument(userId: number, id: number) {
    const document = await this.documentRepository.findOne({
      where: { id },
      relations: { user: true }, // ✅ sửa từ ['user'] → { user: true }
    });

    if (!document || document.user.id !== userId) {
      throw new Error('Không tìm thấy tài liệu hoặc bạn không có quyền xóa');
    }

    await this.documentRepository.delete(id);
    return { message: `Deleted document ${document.title}` };
  }

  findOneDocument(id: number) {
    return this.documentRepository.findOne({ where: { id }, relations: ['user', 'children'] });
  }

  findAllDocuments(userId: number) {
    return this.documentRepository.find({ where: { user: { id: userId } }, relations: ['user', 'parent'] });
  }

  async createChildPage(userId: number, parentId: number, data: any) {
    const user = await this.userRepository.findOne({
      where: { id: userId },
    });
  
    if (!user) {
      throw new Error('User không tồn tại');
    }
  
    const parentPage = await this.documentRepository.findOne({
      where: { id: parentId },
    });
  
    if (!parentPage) {
      throw new Error('Trang cha không tồn tại');
    }
  
    const newChildPage = this.documentRepository.create({
      ...data,
      user,
      title: 'Untitled',
      parent: parentPage,
    });

    await this.documentRepository.save(newChildPage);

  
    return newChildPage;
  }


  
  async createBlock(userId: number, id: number, data: any) {
    const page = await this.documentRepository.findOne({
      where: { id },
      relations: [ 'block', 'user'], 
    });
  
    if (!page) {
      throw new Error('Page không tồn tại');
    }
  
    if (page.user?.id !== userId) {
      throw new Error('Bạn không có quyền thêm block vào page này');
    }
  
    const newBlock = this.blockRepository.create({
      ...data,
      page: page, 
    });
    
    await this.blockRepository.save(newBlock);
    const pageUpdate = await this.documentRepository.findOne({
      where: { id },
      relations: [ 'block'],
    });
    return pageUpdate; 
  }
  
  async updateBlock(userId: number, id: number, blockId: number, data: any) {
    const block = await this.blockRepository.findOne({
      where: { id: blockId },
      relations: ['page'],
    });
  
    if (!block) {
      throw new Error('Không tìm thấy block');
    }
  
    if (block.page.user?.id !== userId) {
      throw new Error('VMLINUX');
    }
  
    const updated = await this.blockRepository.merge(block, data);
  
    await this.blockRepository.save(updated);
  
    return block;
  }

  async removeBlock(userId: number, id: number, blockId: number) {
    const block = await this.blockRepository.findOne({
      where: { id: blockId },
      relations: ['page'],
    });
  
    if (!block) {
      throw new Error('Không tìm thấy block');
    }
    await this.blockRepository.delete(blockId);
  
    return { message: `Deleted block ${block.type}` };
  }


  async addChildBlock(userId: number, id: number, blockId: number, data: any) {
    const block = await this.blockRepository.findOne({
      where: { id: blockId },
      relations: ['children'],
    });
  
    if (!block) {
      throw new Error('Không tìm thấy block');
    }
  
    const newChildBlock = this.blockRepository.create({
      ...data,
      parent_block: block,
    });
  
    await this.blockRepository.save(newChildBlock);
  
    return block;
  }

  async updateChildBlock(childBlockId: number, data: any) {
    const childBlock = await this.blockRepository.findOne({
      where: { id: childBlockId },
      relations: ['parent_block'],
    });
  
    if (!childBlock) {
      throw new Error('Không tìm thấy block');
    }
  
    const updated = await this.blockRepository.merge(childBlock, data);
  
    await this.blockRepository.save(updated);
  
    return childBlock;
  }

  async removeChildBlock(childBlockId: number) {
    const childBlock = await this.blockRepository.findOne({
      where: { id: childBlockId },
      relations: ['parent_block'],
    });
  
    if (!childBlock) {
      throw new Error('Không tìm thấy block');
    }
  
    await this.blockRepository.delete(childBlockId);
  
    return { message: `Deleted block ${childBlock.type}` };
  }

  
}
