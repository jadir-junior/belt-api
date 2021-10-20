export interface PutUserDto {
    _id: string;
    email: string;
    password: string;
    name: string;
    position: string;
    permissionFlags: number;
    photo: string;
}
