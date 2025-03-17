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

	constructor() {
		this.storedGameRanks = []; // Explicitly initialize in constructor
		this.setGameRanks = this.setGameRanks.bind(this);
		this.tankRole = {
			name: "",
			icon: "",
			iconDark: "",
		};
		this.dpsRole = {
			name: "",
			icon: "",
			iconDark: "",
		};
		this.supportRole = {
			name: "",
			icon: "",
			iconDark: "",
		};

		this.signupSupport = false;
		this.name = "The Video Game";
		this.ignName = "IGN";
		this.signupButtonClass = "";
		this.inGamePlayerCount = 5;
		this.competitiveRankStyle = "per-role";
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
}

class OverwatchGameData extends AbstractGameData {
	constructor() {
		super();

		this.name = "Overwatch 2";
		this.ignName = "Battle.net";
		this.inGamePlayerCount = 5;
		this.competitiveRankStyle = "per-role" as const;

		this.signupButtonClass =
			"from-orange-500 to-orange-600 shadow-orange-500/20 hover:shadow-orange-500/30";

		this.tankRole = {
			name: "Tank",
			icon: "/icons/tank.webp",
			iconDark: "/icons/dark/tank.webp",
		};
		this.dpsRole = {
			name: "Damage",
			icon: "/icons/dps.webp",
			iconDark: "/icons/dark/dps.webp",
		};
		this.supportRole = {
			name: "Support",
			icon: "/icons/support.webp",
			iconDark: "/icons/dark/support.webp",
		};

		this.signupSupport = true;

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
}

class MarvelRivalsGameData extends AbstractGameData {
	constructor() {
		super();

		this.name = "Marvel Rivals";
		this.ignName = "Marvel Rivals IGN";
		this.inGamePlayerCount = 6;
		this.competitiveRankStyle = "per-account" as const;

		this.signupButtonClass =
			"from-purple-500 to-cyan-500 shadow-purple-500/20 hover:shadow-purple-500/30";

		this.tankRole = {
			name: "Vanguard",
			icon: "/icons/vanguard.webp",
			iconDark: "/icons/dark/vanguard.webp",
		};
		this.dpsRole = {
			name: "Duelist",
			icon: "/icons/duelist.webp",
			iconDark: "/icons/dark/duelist.webp",
		};
		this.supportRole = {
			name: "Strategist",
			icon: "/icons/strategist.webp",
			iconDark: "/icons/dark/strategist.webp",
		};

		this.signupSupport = false;

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
				rankIcon: "/rankicons/rivals/eternity.webp",
				divisionIcon: `/rankicons/tier-1.webp`,

				rankValue: 3300,
				rankOrder: 8,

				dbValue: 701,
			},
		]);
	}
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
