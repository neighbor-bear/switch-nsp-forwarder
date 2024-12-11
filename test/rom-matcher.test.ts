import initSqlJs from 'sql.js';
import { join } from 'node:path';
import { readFileSync } from 'node:fs';
import { describe, expect, test } from 'vitest';
import { parse, getRomMetadata, getSystem } from '../src/rom-matcher';

const sql = await initSqlJs();

const openvgdbPath = join(__dirname, 'openvgdb.sqlite');
const db = new sql.Database(readFileSync(openvgdbPath));

const DATASET = [
	{
		path: 'sdmc:/ROMs/GBA/Pokemon - Fire Red Version (U) (V1.1).gba',
		sha1: 'dd5945db9b930750cb39d00c84da8571feebf417',
		parsed: {
			name: 'Pokemon - Fire Red Version',
			extension: 'gba',
			country: 'U',
			details: '(V1.1)',
		},
		expected: {
			releaseTitleName: 'Pokémon: Fire Red Version',
			regionLocalizedID: 7,
			releaseDeveloper: 'Game Freak',
			TEMPsystemShortName: 'GBA',
		},
	},
	{
		path: 'sdmc:/ROMs/NES/Legend of Zelda, The (U) (PRG1) [!].nes',
		sha1: '3701381a82fc7d52b2dd3e8892047b30a114ab43',
		parsed: {
			name: 'Legend of Zelda, The',
			extension: 'nes',
			country: 'U',
			details: '(PRG1) [!]',
		},
		expected: {
			releaseTitleName: 'The Legend of Zelda',
			regionLocalizedID: 21,
			releaseDeveloper: 'Nintendo',
			TEMPsystemShortName: 'NES',
		},
	},
	{
		path: 'sdmc:/ROMs/NES/Super Mario Bros (E).nes',
		sha1: 'ab30029efec6ccfc5d65dfda7fbc6e6489a80805',
		parsed: {
			name: 'Super Mario Bros',
			extension: 'nes',
			country: 'E',
		},
		expected: {
			releaseTitleName: 'Super Mario Bros.',
			regionLocalizedID: 7,
			releaseDeveloper: 'Nintendo',
			TEMPsystemShortName: 'NES',
		},
	},
	{
		path: 'sdmc:/ROMs/NES/Super Mario Bros. 3 (USA) (Rev 1).nes',
		sha1: '6bd518e85eb46a4252af07910f61036e84b020d1',
		parsed: {
			name: 'Super Mario Bros. 3',
			extension: 'nes',
			country: 'USA',
			details: '(Rev 1)',
		},
		expected: {
			releaseTitleName: 'Super Mario Bros. 3',
			regionLocalizedID: 21,
			releaseDeveloper: 'Nintendo',
			TEMPsystemShortName: 'NES',
		},
	},
	{
		path: 'sdmc:/ROMs/SNES/Chrono Trigger (USA).sfc',
		sha1: 'de5822f4f2f7a55acb8926d4c0eaa63d5d989312',
		parsed: {
			name: 'Chrono Trigger',
			extension: 'sfc',
			country: 'USA',
		},
		expected: {
			releaseTitleName: 'Chrono Trigger',
			regionLocalizedID: 21,
			releaseDeveloper: 'SquareSoft',
			TEMPsystemShortName: 'SNES',
		},
	},
	{
		path: 'sdmc:/ROMs/SNES/Mega Man 7 (USA).smc',
		sha1: '38ac3fe3cc372f6c1833b315e0779c27ab4164fb',
		parsed: {
			name: 'Mega Man 7',
			extension: 'smc',
			country: 'USA',
		},
		expected: {
			releaseTitleName: 'Mega Man 7',
			regionLocalizedID: 21,
			releaseDeveloper: 'Capcom',
			TEMPsystemShortName: 'SNES',
		},
	},
	{
		path: 'sdmc:/ROMs/SNES/Mega Man VII (U).smc',
		sha1: '38ac3fe3cc372f6c1833b315e0779c27ab4164fb',
		parsed: {
			name: 'Mega Man VII',
			extension: 'smc',
			country: 'U',
		},
		expected: {
			releaseTitleName: 'Mega Man 7',
			regionLocalizedID: 21,
			releaseDeveloper: 'Capcom',
			TEMPsystemShortName: 'SNES',
		},
	},
	{
		path: 'sdmc:/ROMs/SNES/Mega Man X (USA).sfc',
		sha1: '449a00631208fbcc8d58209e66d0d488674b7fb1',
		parsed: {
			name: 'Mega Man X',
			extension: 'sfc',
			country: 'USA',
		},
		expected: {
			releaseTitleName: 'Mega Man X',
			regionLocalizedID: 21,
			releaseDeveloper: 'Capcom',
			TEMPsystemShortName: 'SNES',
		},
	},
	{
		path: 'sdmc:/ROMs/SNES/Mega Man X3 (USA).sfc',
		sha1: 'b226f7ec59283b05c1e276e2f433893f45027cac',
		parsed: {
			name: 'Mega Man X3',
			extension: 'sfc',
			country: 'USA',
		},
		expected: {
			releaseTitleName: 'Mega Man X3',
			regionLocalizedID: 21,
			releaseDeveloper: 'Capcom',
			TEMPsystemShortName: 'SNES',
		},
	},
	{
		path: 'sdmc:/ROMs/SNES/Mega Man X2 (USA).sfc',
		sha1: '637079014421563283cded6aeaa0604597b2e33c',
		parsed: {
			name: 'Mega Man X2',
			extension: 'sfc',
			country: 'USA',
		},
		expected: {
			releaseTitleName: 'Mega Man X2',
			regionLocalizedID: 21,
			releaseDeveloper: 'Capcom',
			TEMPsystemShortName: 'SNES',
		},
	},
	{
		path: 'sdmc:/ROMs/SNES/Super Mario Kart (USA).sfc',
		sha1: '47e103d8398cf5b7cbb42b95df3a3c270691163b',
		parsed: {
			name: 'Super Mario Kart',
			extension: 'sfc',
			country: 'USA',
		},
		expected: {
			releaseTitleName: 'Super Mario Kart',
			regionLocalizedID: 21,
			releaseDeveloper: 'Nintendo',
			TEMPsystemShortName: 'SNES',
		},
	},
	{
		path: 'sdmc:/ROMs/SNES/Super Mario World (U) [!].smc',
		sha1: '553cf42f35acf63028a369608742bb5b913c103f',
		parsed: {
			name: 'Super Mario World',
			extension: 'smc',
			country: 'U',
			details: '[!]',
		},
		expected: {
			releaseTitleName: 'Super Mario World',
			regionLocalizedID: 21,
			releaseDeveloper: 'Nintendo',
			TEMPsystemShortName: 'SNES',
		},
	},
	{
		path: "sdmc:/ROMs/SNES/Super Mario World 2 - Yoshi's Island (USA).sfc",
		sha1: 'c807f2856f44fb84326fac5b462340dcdd0471f8',
		parsed: {
			name: "Super Mario World 2 - Yoshi's Island",
			extension: 'sfc',
			country: 'USA',
		},
		expected: {
			releaseTitleName: "Super Mario World 2: Yoshi's Island",
			regionLocalizedID: 21,
			releaseDeveloper: 'Nintendo',
			TEMPsystemShortName: 'SNES',
		},
	},
	{
		path: 'sdmc:/ROMs/PSX/Armored Core - Master of Arena [U] [SLUS-01030].pbp',
		sha1: undefined,
		parsed: {
			name: 'Armored Core - Master of Arena',
			extension: 'pbp',
			country: 'U',
		},
		expected: {
			releaseTitleName: 'Armored Core: Master of Arena (Disc 1)',
			regionLocalizedID: 21,
			releaseDeveloper: null,
			TEMPsystemShortName: 'PSX',
		},
	},
	{
		path: 'sdmc:/ROMs/PSX/Tales of Phantasia (English by Absolute Zero v1).bin',
		sha1: undefined,
		parsed: {
			name: 'Tales of Phantasia',
			extension: 'bin',
			details: '(English by Absolute Zero v1)',
		},
		expected: {
			releaseTitleName: 'Tales of Phantasia',
			regionLocalizedID: 13,
			releaseDeveloper: null,
			TEMPsystemShortName: 'PSX',
		},
	},
	{
		path: 'sdmc:/ROMs/N64/Super Smash Bros. (U) [!].z64',
		sha1: 'e2929e10fccc0aa84e5776227e798abc07cedabf',
		parsed: {
			name: 'Super Smash Bros.',
			extension: 'z64',
			country: 'U',
			details: '[!]',
		},
		expected: {
			releaseTitleName: 'Super Smash Bros.',
			regionLocalizedID: 21,
			releaseDeveloper: 'HAL Labs',
			TEMPsystemShortName: 'N64',
		},
	},
	{
		path: 'sdmc:/ROMs/N64/Mario Kart 64 (E) (V1.1) [!].z64',
		sha1: 'f6b5f519dd57ea59e9f013cc64816e9d273b2329',
		parsed: {
			name: 'Mario Kart 64',
			extension: 'z64',
			country: 'E',
			details: '(V1.1) [!]',
		},
		expected: {
			releaseTitleName: 'Mario Kart 64',
			regionLocalizedID: 7,
			releaseDeveloper: 'Nintendo',
			TEMPsystemShortName: 'N64',
		},
	},
	{
		path: 'sdmc:/ROMs/N64/GoldenEye 007 (U) [!].z64',
		sha1: 'abe01e4aeb033b6c0836819f549c791b26cfde83',
		parsed: {
			name: 'GoldenEye 007',
			extension: 'z64',
			country: 'U',
			details: '[!]',
		},
		expected: {
			releaseTitleName: 'GoldenEye 007',
			regionLocalizedID: 21,
			releaseDeveloper: null,
			TEMPsystemShortName: 'N64',
		},
	},
] as const;

describe('parse()', () => {
	test.each(DATASET)('should parse $path', async ({ path, parsed }) => {
		const parsedPath = parse(path);
		expect(parsedPath).toMatchObject(parsed);
	});
});

describe('getSystem()', () => {
	test.each(DATASET)(
		'should match $expected.TEMPsystemShortName for $path',
		async ({ path, expected }) => {
			const system = getSystem(db, path);
			expect(system?.systemShortName).toBe(expected.TEMPsystemShortName);
		},
	);
});

describe('getRomMetadata()', () => {
	test.each(DATASET)(
		'should match $expected.releaseTitleName for $path',
		async ({ path, sha1, expected }) => {
			const match = await getRomMetadata(db, path, sha1);
			expect(match).toMatchObject(expected);
		},
	);
});
