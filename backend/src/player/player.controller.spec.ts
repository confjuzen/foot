import { Test, TestingModule } from '@nestjs/testing';
import { PlayerController } from './player.controller';
import { InMemoryDataService } from '../data/in-memory-data.service';

import { rmSync } from 'fs';
import { join } from 'path';

describe('PlayerController', () => {
	let controller: PlayerController;
	let dataService: InMemoryDataService;
	const testDataDir = join(__dirname, '..', '..', 'test-data');

	beforeEach(async () => {
		process.env.DATA_DIR = testDataDir;
		rmSync(testDataDir, { recursive: true, force: true });

		const module: TestingModule = await Test.createTestingModule({
			controllers: [PlayerController],
			providers: [InMemoryDataService],
		}).compile();

		controller = module.get<PlayerController>(PlayerController);
		dataService = module.get<InMemoryDataService>(InMemoryDataService);
	});

	it('should be defined', () => {
		expect(controller).toBeDefined();
	});

	it('should create a player', () => {
		const createPlayerDto = { name: 'Kylian Mbappé', position: 'Forward' };
		const player = controller.createPlayer(createPlayerDto);

		expect(player.id).toBe(1);
		expect(player.name).toBe('Kylian Mbappé');
		expect(player.position).toBe('Forward');
	});

	it('should get all players', () => {
		const createPlayerDto = { name: 'Kylian Mbappé', position: 'Forward' };
		controller.createPlayer(createPlayerDto);

		const players = controller.getPlayers();
		expect(players).toHaveLength(1);
		expect(players[0].name).toBe('Kylian Mbappé');
	});
});
