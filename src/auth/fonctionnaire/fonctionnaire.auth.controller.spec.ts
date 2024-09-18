import { Test, TestingModule } from '@nestjs/testing';
import { FonctionnaireAuthController } from './fonctionnaire.auth.controller';
import { FonctionnaireAuthService } from './fonctionnaire.auth.service';

describe('FonctionnaireAuthController', () => {
  let controller: FonctionnaireAuthController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FonctionnaireAuthController],
      providers: [FonctionnaireAuthService],
    }).compile();

    controller = module.get<FonctionnaireAuthController>(FonctionnaireAuthController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
