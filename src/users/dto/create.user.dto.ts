export interface CreateUserDto {
    email: string;
    password: string;
    name?: string;
    position?: string;
    permissionFlags?: number;
}
