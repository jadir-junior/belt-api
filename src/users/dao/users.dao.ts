import mongoose, { Document, Schema } from 'mongoose';

import { CreateUserDto } from '../dto/create.user.dto';
import { PatchUserDto } from '../dto/patch.user.dto';
import { PermissionFlags } from '../../common/enums/common.permissionflags.enum';
import { PutUserDto } from '../dto/put.user.dto';
import { User } from '../types/user.types';

interface UserDocument extends User, Document {}
class UsersDao {
    userSchema = new Schema(
        {
            email: String,
            password: { type: String, select: false },
            name: String,
            position: String,
            permissionFlags: Number,
        },
        {
            timestamps: true,
            toJSON: {
                transform: (doc, ret) => {
                    delete ret['password'];
                    return ret;
                },
            },
        }
    );

    User = mongoose.model<UserDocument>('Users', this.userSchema);

    async addUser(userFields: CreateUserDto) {
        const user = new this.User({
            ...userFields,
            permissionFlags: PermissionFlags.FREE_PERMISSION,
        });
        await user.save();
        return user;
    }

    async getUserById(_id: string) {
        return this.User.findOne({ _id })
            .select('_id email permissionFlags name position')
            .exec();
    }

    async getUserByEmailWithPassword(email: string) {
        return this.User.findOne({ email })
            .select('_id email permissionFlags name position +password')
            .exec();
    }

    async getUserByEmail(email: string) {
        return this.User.findOne({ email }).exec();
    }

    async updateUserById(
        userId: string,
        userFields: PatchUserDto | PutUserDto
    ) {
        const existingUser = await this.User.findOneAndUpdate(
            { _id: userId },
            { $set: userFields },
            { new: true }
        )
            .select('_id email permissionFlags name position')
            .exec();
        return existingUser;
    }
}

export default new UsersDao();
