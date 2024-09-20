import { Test, TestingModule } from '@nestjs/testing';
import { CitoyenAuthService } from './citoyen.auth.service';

describe('CitoyenAuthService', () => {
  let service: CitoyenAuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CitoyenAuthService],
    }).compile();

    service = module.get<CitoyenAuthService>(CitoyenAuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
