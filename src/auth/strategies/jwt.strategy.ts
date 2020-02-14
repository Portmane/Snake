import {PassportStrategy} from "@nestjs/passport";
import {Strategy, ExtractJwt} from 'passport-jwt'
import {Inject, Injectable, UnauthorizedException} from "@nestjs/common";
import {JwtPayloadInterface} from "../interfaces/jwt-payload.interface";
import {UserRepository} from "../repos/user.repository";
import {User} from "../domain/user.entity";
import * as config from 'config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy){
    constructor(
        @Inject(UserRepository)
        private userRepository: UserRepository,
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: process.env.JWT_SECRET || config.get('jwt.secret'),
        });
    }



    async validate(payload: JwtPayloadInterface):Promise<User> {
        const {username} = payload;
        const findUserByUsername = await this.userRepository.findOne({username});

        if (!username) {
            throw new UnauthorizedException();
        }

        return findUserByUsername;
    }
}