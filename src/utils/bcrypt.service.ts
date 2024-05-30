import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

const BCRYPT_HASH_ROUNDS = 10;

@Injectable()
export class BcryptService {
    async hashPassword(password: string) {
        const salt = await bcrypt.genSalt(BCRYPT_HASH_ROUNDS);
        const hash = await bcrypt.hash(password, salt);
        return hash;
    }

    async comparePasswords(attemptedPassword: string, hashedPassword: string) {
        return await bcrypt.compare(attemptedPassword, hashedPassword);
    }
}