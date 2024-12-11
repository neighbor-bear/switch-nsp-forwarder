import FuzzySearch from 'fuzzy-search';
import type { Database, QueryExecResult } from 'sql.js';

export interface System {
	systemID: number;
	systemName: string;
	systemShortName: string;
}

export interface Release {
	releaseID: number;
	romID: number;
	releaseTitleName: string;
	regionLocalizedID: number;
	TEMPregionLocalizedName: string;
	TEMPsystemShortName: string;
	releaseCoverFront: string | null;
	releaseDeveloper: string | null;
	releasePublisher: string | null;
	releaseDate: string | null;
	releaseReferenceURL: string | null;
}

export interface ROM {
	romID: number;
	systemID: number;
	regionID: number;
	romHashSHA1: string | null;
	romFileName: string;
}

export interface ParsedRomFilename {
	id?: string;
	name?: string;
	extension?: string;
	country?: string;
	year?: string;
	disc?: string;
	details?: string;
}

const SHORT_COUNTRY_NAMES: Record<string, string> = {
	U: 'USA',
	E: 'Europe',
	J: 'Japan',
};

function extname(path: string): string {
	return path.slice(path.lastIndexOf('.'));
}

function basename(path: string, ext: string): string {
	return path.slice(path.lastIndexOf('/') + 1, -ext.length);
}

export function parse(filename: string): ParsedRomFilename {
	const parsed: ParsedRomFilename = {};

	const ext = extname(filename);
	let name = basename(filename, ext);

	parsed.extension = ext.substring(1);

	// numerical ID at the beginning with hypen and optional whitespace (nds)
	const id = name.match(/^(\d+)\s*-\s*/);
	if (id) {
		parsed.id = id[1];
		name = name.substring(id[0].length);
	}

	const details: string[] = [];

	// capture all (parens) and [brackets]
	parsed.name = name
		.replace(/\((.*?)\)|\[(.*?)\]/g, (match, a, b) => {
			const inner = a || b;
			//console.log(match, inner);

			if (!parsed.id && isID(inner)) {
				parsed.id = inner;
			} else if (!parsed.country && isCountry(inner)) {
				parsed.country = inner;
			} else if (!parsed.year && isYear(inner)) {
				parsed.year = inner;
			} else if (!parsed.disc && isDisc(inner)) {
				parsed.disc = inner;
			} else {
				details.push(match);
			}

			return '';
		})
		.trim();

	if (details.length > 0) parsed.details = details.join(' ');

	return parsed;
}

function isID(id: string): boolean {
	return /^[A-Z]{4}-\d+$/.test(id);
}

function isCountry(country: string): boolean {
	if (/\,/.test(country)) {
		return (
			country
				.split(/\s*\,\s*/)
				.map(isCountry)
				.filter(Boolean).length > 0
		);
	}

	switch (country.toLowerCase()) {
		// XXX: need more comprehensive list
		case 'usa':
		case 'japan':
		case 'germany':
			return true;
	}

	switch (country.length) {
		case 1:
			return /[A-Z]/.test(country);
		case 2:
			return /[A-Z][a-zA-Z]/.test(country);
		default:
			return false;
	}
}

function isDisc(disc: string): boolean {
	return /^Disc (\d+)$/.test(disc);
}

function isYear(year: string): boolean {
	return /^\d{2,4}$/.test(year);
}

function replaceRomanNumerals(str: string) {
	// Mapping of Roman numerals to their values
	const romanToValue: Record<string, number> = {
		I: 1,
		V: 5,
		X: 10,
		L: 50,
		C: 100,
		D: 500,
		M: 1000,
	};

	// Function to convert a single Roman numeral string to an integer
	function romanToInt(roman: string) {
		let total = 0;
		for (let i = 0; i < roman.length; i++) {
			const current = romanToValue[roman[i]];
			const next = romanToValue[roman[i + 1]] || 0;
			// If the current value is less than the next, subtract it; otherwise, add it
			if (current < next) {
				total -= current;
			} else {
				total += current;
			}
		}
		return total;
	}

	// Strict regular expression to match valid Roman numerals only
	const romanRegex =
		/\b(M{0,3}(CM|CD|D?C{0,3})(XC|XL|L?X{0,3})(IX|IV|V?I{0,3}))\b/g;

	// Replace only valid Roman numerals in the string
	return str.replace(romanRegex, (match) => {
		if (!match) return match;
		const number = romanToInt(match.toUpperCase());
		return Number.isNaN(number) ? match : String(number); // Ensure invalid conversions are not replaced
	});
}

function mapResults<T>(results: QueryExecResult): T[] {
	if (!results) return [];
	return results.values.map((v) => {
		const mapped: Record<string, unknown> = Object.create(null);
		for (let i = 0; i < v.length; i++) {
			mapped[results.columns[i]] = v[i];
		}
		return mapped as T;
	});
}

function getRomBySha1(db: Database, sha1: string): ROM | undefined {
	const [results] = db.exec('SELECT * FROM ROMs WHERE romHashSHA1=?', [
		sha1.toUpperCase(),
	]);
	return mapResults<ROM>(results)[0];
}

function getReleaseByRomId(db: Database, romId: number): Release | undefined {
	const [results] = db.exec('SELECT * FROM RELEASES WHERE romID=?', [romId]);
	return mapResults<Release>(results)[0];
}

function getSystemByShortName(
	db: Database,
	shortName: string,
): System | undefined {
	const [results] = db.exec('SELECT * FROM SYSTEMS WHERE systemShortName=?', [
		shortName,
	]);
	return mapResults<System>(results)[0];
}

export function getSystem(db: Database, path: string): System | undefined {
	const dir = new URL('.', path).pathname.split('/').slice(-2, -1)[0];
	const system = getSystemByShortName(db, dir.toUpperCase());
	return system;
}

function getReleasesByNameAndSystem(
	db: Database,
	name: string,
	system: string,
): Release[] {
	const [results] = db.exec(
		'SELECT * FROM RELEASES WHERE releaseTitleName LIKE ? AND TEMPsystemShortName=? COLLATE NOCASE',
		[name, system],
	);
	return mapResults<Release>(results);
}

export async function getRomMetadata(
	db: Database,
	path: string,
	sha1?: string,
): Promise<Release | undefined> {
	// first attempt to match by the SHA1 hash, if it was provided
	if (sha1) {
		const romMatch = getRomBySha1(db, sha1);
		if (romMatch) {
			const release = getReleaseByRomId(db, romMatch.romID);
			if (release) return release;
		}
	}

	// match against "RELEASES" table by name and system short code
	const system = getSystem(db, path);
	if (!system) return;

	const parsed = parse(path);
	if (!parsed.name) return;

	let searchName = parsed.name
		.replace(/\s*\b1$/, '') // if it ends with "1", just remove
		.replace(/^the\s*|\,\s*the$/i, ''); // if it begins with "the" or ends with ", the", then remove it

	let releases = getReleasesByNameAndSystem(
		db,
		`%${searchName}%`,
		system.systemShortName,
	);
	if (!releases.length) {
		// Try again with a colon instead of a dash
		searchName = searchName.replace(/ -/g, ':');
		releases = getReleasesByNameAndSystem(
			db,
			`%${searchName}%`,
			system.systemShortName,
		);
	}
	if (!releases.length) {
		// Try again with a roman numerals replaced with numbers
		searchName = replaceRomanNumerals(searchName);
		releases = getReleasesByNameAndSystem(
			db,
			`%${searchName}%`,
			system.systemShortName,
		);
	}
	if (!releases.length) return;

	// Use fuzzy search to find the most relevent record based on the title name
	const searcher = new FuzzySearch(releases, ['releaseTitleName'], {
		caseSensitive: false,
		sort: true,
	});
	const fuzzyMatches = searcher.search(searchName);
	if (!fuzzyMatches.length) return;

	const firstTitleName = fuzzyMatches[0].releaseTitleName;
	const filteredFuzzyMatches = fuzzyMatches.filter(
		(v) => v.releaseTitleName === firstTitleName,
	);

	// Select the record with the most appropriate country based on the filename
	if (parsed.country) {
		const country =
			SHORT_COUNTRY_NAMES[parsed.country.toUpperCase()] || parsed.country;
		const matchByCountry = filteredFuzzyMatches.find(
			(v) => v.TEMPregionLocalizedName === country,
		);
		if (matchByCountry) return matchByCountry;
	}

	return filteredFuzzyMatches[0];
}
