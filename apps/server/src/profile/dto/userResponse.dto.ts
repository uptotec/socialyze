export class UserResponseDto {
  _id: string;
  firstName: string;
  lastName: string;
  name: string;
  bio: string;
  profilePhoto: Record<string, any>;
  photos: Record<string, any>[];
  age: number;
  university: string;
  faculty: string;
  interests: string[];
}
