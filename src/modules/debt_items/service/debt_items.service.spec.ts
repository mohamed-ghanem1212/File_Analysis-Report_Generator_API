import { Test, TestingModule } from '@nestjs/testing';
import { DebtItemsService } from '../service/debt_items.service';

describe('DebtItemsService', () => {
  let service: DebtItemsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DebtItemsService],
    }).compile();

    service = module.get<DebtItemsService>(DebtItemsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
