import { IsEmail, IsNotEmpty, MinLength, Validate } from "class-validator";
import { Unique } from "src/common/validators/email-unique";

export default class CreateUserDto {
    @IsNotEmpty({
        message: "tên không được để trống",
    })
    name: string;
    @IsNotEmpty({
        message: "email không được để trống",
    })
    @IsEmail({}, { message: "nhập đúng định dạng email" })
    @Validate(Unique, ['users', 'email'], {
        message:  "email đã tồn tại",
    })
    email: string;

    @MinLength(8, { message: "password phải nhất 8 ký tự" })
    password: string;
}