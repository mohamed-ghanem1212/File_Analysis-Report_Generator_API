import { Test, TestingModule } from '@nestjs/testing';
import { DebtItemsController } from '../controller/debt_items.controller';

describe('DebtItemsController', () => {
  let controller: DebtItemsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DebtItemsController],
    }).compile();

    controller = module.get<DebtItemsController>(DebtItemsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
