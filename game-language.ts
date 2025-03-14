interface CompetitiveRank {
	division: string;
	tier: number;
	role_icon?: string;
	rank_icon?: string;
	tier_icon?: string;
	asString?: string;
}

export abstract class GameRank {
	rankName!: string;
	rankDivision!: number;

	rankIcon!: string;
	divisionIcon?: string;

	rankValue!: number;
	rankOrder!: number;

	dbValue!: number;

	get rankDisplayName() {
		return `${this.rankName} ${this.rankDivision}`;
	}

	get asCompetitiveRank(): CompetitiveRank {
		return {
			division: this.rankName,
			tier: this.rankDivision,
			rank_icon: this.rankIcon,
			tier_icon: this.divisionIcon,
			asString: `${this.rankName} ${this.rankDivision}`,
		};
	}
}

export abstract class AbstractGameData {
	name: string;
	ignName: string;
	inGamePlayerCount: number;
	competitiveRankStyle: "per-role" | "per-account" | "casual";
	private storedGameRanks: GameRank[] = []; // Initialize with empty array
	signupSupport: boolean;

	signupButtonClass: string;

	constructor() {
		this.storedGameRanks = []; // Explicitly initialize in constructor
		this.setGameRanks = this.setGameRanks.bind(this);
	}

	setGameRanks(ranks: any[]) {
		this.storedGameRanks = ranks.map((rank: GameRank) => {
			return {
				...rank,
				get rankDisplayName() {
					return `${this.rankName}${
						this.rankDivision > 0 ? ` ${this.rankDivision}` : ""
					}`;
				},
				get asCompetitiveRank() {
					return {
						division: this.rankName,
						tier: this.rankDivision,
						rank_icon: this.rankIcon,
						tier_icon: this.divisionIcon,
						asString: `${this.rankName} ${this.rankDivision}`,
					};
				},
			};
		});
	}

	get gameRanks() {
		return this.storedGameRanks;
	}

	tankRole: {
		name: string;
		icon: string;
		iconDark: string;
	};
	dpsRole: {
		name: string;
		icon: string;
		iconDark: string;
	};
	supportRole: {
		name: string;
		icon: string;
		iconDark: string;
	};
}

class OverwatchGameData extends AbstractGameData {
	constructor() {
		super();

		this.setGameRanks([
			{
				rankName: "Unranked",
				rankDivision: 0,

				rankIcon: "/rankicons/unranked.webp",

				rankValue: 0,
				rankOrder: 0,

				dbValue: 0,
			},
			...[
				"Bronze",
				"Silver",
				"Gold",
				"Platinum",
				"Diamond",
				"Master",
				"Grandmaster",
				"Champion",
			].flatMap((rank, rankIndex) => {
				return Array.from({ length: 5 }, (_, i) => ({
					rankName: rank,
					rankDivision: 5 - i,

					rankIcon: `/rankicons/${rank.toLowerCase()}.webp`,
					divisionIcon: `/rankicons/tier-${5 - i}.webp`,

					rankValue: 1000 + rankIndex * 500 + i * 100,
					rankOrder: rankIndex + 1,

					dbValue: (rankIndex + 1) * 100 + (5 - i) - 100,
				}));
			}),
		]);
	}

	name = "Overwatch 2";
	ignName = "Battle.net";
	inGamePlayerCount = 5;
	competitiveRankStyle = "per-role" as const;

	signupButtonClass =
		"from-orange-500 to-orange-600 shadow-orange-500/20 hover:shadow-orange-500/30";

	tankRole = {
		name: "Tank",
		icon: "/icons/tank.webp",
		iconDark: "/icons/dark/tank.webp",
	};
	dpsRole = {
		name: "Damage",
		icon: "/icons/dps.webp",
		iconDark: "/icons/dark/dps.webp",
	};
	supportRole = {
		name: "Support",
		icon: "/icons/support.webp",
		iconDark: "/icons/dark/support.webp",
	};

	signupSupport = true;
}

class MarvelRivalsGameData extends AbstractGameData {
	constructor() {
		super();

		this.setGameRanks([
			{
				rankName: "Unranked",
				rankDivision: 0,

				rankIcon: "/rankicons/unranked.webp",

				rankValue: 0,
				rankOrder: 0,

				dbValue: 0,
			},
			...[
				"Bronze",
				"Silver",
				"Gold",
				"Platinum",
				"Diamond",
				"Grandmaster",
				"Celestial",
			].flatMap((rank, rankIndex) => {
				return Array.from({ length: 3 }, (_, i) => ({
					rankName: rank,
					rankDivision: 3 - i,

					rankIcon: `/rankicons/rivals/${rank.toLowerCase()}.webp`,
					divisionIcon: `/rankicons/tier-${3 - i}.webp`,

					rankValue: 1200 + rankIndex * 300 + i * 100,
					rankOrder: rankIndex + 1,

					dbValue: (rankIndex + 1) * 100 + (3 - i) - 100,
				}));
			}),
			{
				rankName: "Eternity",
				rankDivision: 0,

				rankIcon: "/rankicons/rivals/celestial.webp",
				divisionIcon: `/rankicons/tier-1.webp`,

				rankValue: 3300,
				rankOrder: 8,

				dbValue: 701,
			},
		]);
	}

	name = "Marvel Rivals";
	ignName = "Marvel Rivals IGN";
	inGamePlayerCount = 6;
	competitiveRankStyle = "per-account" as const;

	signupButtonClass =
		"from-purple-500 to-cyan-500 shadow-purple-500/20 hover:shadow-purple-500/30";

	tankRole = {
		name: "Vanguard",
		icon: "/icons/vanguard.webp",
		iconDark: "/icons/dark/vanguard.webp",
	};
	dpsRole = {
		name: "Duelist",
		icon: "/icons/duelist.webp",
		iconDark: "/icons/dark/duelist.webp",
	};
	supportRole = {
		name: "Strategist",
		icon: "/icons/strategist.webp",
		iconDark: "/icons/dark/strategist.webp",
	};

	signupSupport = false;
}

const UNRANKED_RANK = {
	rankName: "Unranked",
	rankDivision: 0,

	rankIcon: "/rankicons/unranked.webp",

	rankValue: 0,
	rankOrder: 0,

	dbValue: 0,

	get asCompetitiveRank(): CompetitiveRank {
		return {
			division: this.rankName,
			tier: this.rankDivision,
			rank_icon: this.rankIcon,
			tier_icon: this.divisionIcon,
			asString: `${this.rankName} ${this.rankDivision}`,
		};
	},
} as GameRank;

export function matchToRank(
	game: AbstractGameData,
	rankName: string,
	rankTier: number
) {
	if (!game.gameRanks || game.gameRanks.length === 0) {
		return UNRANKED_RANK;
	}

	const found = game.gameRanks.find(
		(rank) =>
			rank.rankName.toLowerCase() === rankName.toLowerCase() &&
			rank.rankDivision == rankTier
	);
	return found ? found : UNRANKED_RANK; // Return unranked if no match found
}

export function dbNumberToRank(
	game: AbstractGameData,
	dbNumber: number
): GameRank {
	if (dbNumber <= 0 || !game.gameRanks || game.gameRanks.length === 0) {
		return UNRANKED_RANK;
	}

	const found = game.gameRanks.find((rank) => rank.dbValue === dbNumber);
	return found ? found : UNRANKED_RANK; // Return unranked if no match found
}

export function playerNumberToRank(
	game: AbstractGameData,
	playerNumber: number
): GameRank {
	if (playerNumber <= 0 || !game.gameRanks || game.gameRanks.length === 0) {
		return UNRANKED_RANK;
	}

	const found = game.gameRanks.find((rank) => rank.rankValue == playerNumber);
	return found ? found : UNRANKED_RANK; // Return unranked if no match found
}

const OVERWATCH = new OverwatchGameData();
const RIVALS = new MarvelRivalsGameData();

function getGameData(game?: string | null) {
	if (game == "Overwatch") return OVERWATCH;
	if (game == "Marvel Rivals") return RIVALS;
	return OVERWATCH;
}

export { getGameData, OVERWATCH, RIVALS };
