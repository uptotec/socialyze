import { FacultyResponseDto, IntrestResponseDto } from 'search';
import { UniversityResponseDto } from 'search/university.dto';

export class UserResponseDto {
  id: string;
  firstName: string;
  lastName: string;
  fullName: string;
  bio: string;
  profilePhoto: Record<string, any>;
  photos: Record<string, any>[];
  age: number;
  university: UniversityResponseDto;
  faculty: FacultyResponseDto;
  interests: IntrestResponseDto[];
}
