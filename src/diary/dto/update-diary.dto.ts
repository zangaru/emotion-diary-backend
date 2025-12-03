import { PartialType } from '@nestjs/mapped-types';
import { CreateDiaryDto } from './create-diary.dto';

// PartialType을 사용하여 CreateDiaryDto의 모든 필드가 선택적(optional)인 UpdateDiaryDto 생성
export class UpdateDiaryDto extends PartialType(CreateDiaryDto) {}
