import { Test, TestingModule } from '@nestjs/testing';
import { CitoyenAuthController } from './citoyen.auth.controller';
import { CitoyenAuthService } from './citoyen.auth.service';

describe('CitoyenAuthController', () => {
  let controller: CitoyenAuthController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CitoyenAuthController],
      providers: [CitoyenAuthService],
    }).compile();

    controller = module.get<CitoyenAuthController>(CitoyenAuthController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
