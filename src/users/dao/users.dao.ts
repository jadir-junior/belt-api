import mongoose, { Schema } from 'mongoose';

import { CreateUserDto } from '../dto/create.user.dto';
import { PermissionFlags } from '../../common/enums/common.permissionflags.enum';

class UsersDao {
    userSchema = new Schema(
        {
            email: String,
            password: { type: String, select: false },
            name: String,
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

    User = mongoose.model('Users', this.userSchema);

    async addUser(userFields: CreateUserDto) {
        const user = new this.User({
            ...userFields,
            permissionFlags: PermissionFlags.FREE_PERMISSION,
        });
        await user.save();
        return user;
    }
}

export default new UsersDao();
