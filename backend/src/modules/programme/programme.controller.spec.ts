import { Test, TestingModule } from '@nestjs/testing';
import { ProgrammeController } from './programme.controller.js';

describe('ProgrammeController', () => {
  let controller: ProgrammeController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProgrammeController],
    }).compile();

    controller = module.get<ProgrammeController>(ProgrammeController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
