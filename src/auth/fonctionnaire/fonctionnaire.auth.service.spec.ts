import { Test, TestingModule } from '@nestjs/testing';
import { FonctionnaireAuthService } from './fonctionnaire.auth.service';

describe('FonctionnaireAuthService', () => {
  let service: FonctionnaireAuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FonctionnaireAuthService],
    }).compile();

    service = module.get<FonctionnaireAuthService>(FonctionnaireAuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
