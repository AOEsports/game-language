import { getRivalsPlayerProfile } from "../fetch-rank";
import getPlayerProfile, { getHigherRankByRole } from "../overwatchrank";

export interface FetchedPlayerData {
	ign: string;
	privateProfile?: boolean;
	tank?: GameRank;
	support?: GameRank;
	dps?: GameRank;
	season?: string;
}

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
	dbNumber: number | null
): GameRank {
	if (
		!dbNumber ||
		dbNumber <= 0 ||
		!game.gameRanks ||
		game.gameRanks.length === 0
	) {
		return UNRANKED_RANK;
	}

	const found = game.gameRanks.find((rank) => rank.dbValue === dbNumber);
	return found ? found : UNRANKED_RANK; // Return unranked if no match found
}

export function calculateBufferForRole(
	game: AbstractGameData,
	dbNumber: number,
	buffer: number
) {
	if (
		!dbNumber ||
		dbNumber <= 0 ||
		!game.gameRanks ||
		game.gameRanks.length === 0
	) {
		return UNRANKED_RANK;
	}
	const found = game.gameRanks.find((rank) => rank.dbValue === dbNumber);
	if (!found) return UNRANKED_RANK;
	let didFind = false;
	while (didFind && buffer > 0) {
		const newRankNumber = found.rankValue + buffer;
		const foundRank = game.gameRanks.find(
			(rank) => rank.rankValue === newRankNumber
		);
		if (foundRank) return foundRank;
		else {
			buffer -= 100;
		}
	}
	return found;
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

export async function fetchPlayerRank(
	game: AbstractGameData,
	ingamename: string
): Promise<FetchedPlayerData | null> {
	console.log(`Fetching rank for ${ingamename}, in game ${game.name}`);
	if (game.name == "Overwatch" || game.name == "Overwatch 2") {
		const profile = await getPlayerProfile(ingamename);
		if (!profile) return Promise.resolve(null);
		if ("error" in profile) return Promise.resolve(null);
		if (!profile.competitive) {
			return {
				ign: profile.username,
				privateProfile: true,
			};
		}

		const highestTank = getHigherRankByRole("tank", profile);
		const highestSupport = getHigherRankByRole("support", profile);
		const highestDps = getHigherRankByRole("dps", profile);

		return {
			ign: profile.username,
			tank: highestTank?.rank
				? matchToRank(
						game,
						highestTank?.rank.division,
						highestTank?.rank.tier
				  )
				: UNRANKED_RANK,
			support: highestSupport?.rank
				? matchToRank(
						game,
						highestSupport?.rank.division,
						highestSupport?.rank.tier
				  )
				: UNRANKED_RANK,
			dps: highestDps?.rank
				? matchToRank(
						game,
						highestDps?.rank.division,
						highestDps?.rank.tier
				  )
				: UNRANKED_RANK,
			season: profile
				? profile.competitive
					? profile.competitive.pc
						? `${profile.competitive.pc.season}`
						: profile.competitive.console
						? `${profile.competitive.console.season}`
						: "Unknown Season"
					: "No Comp"
				: "Private Profile",
			privateProfile: false,
		};
	}
	if (game.name == "Marvel Rivals") {
		const rivalsProfile = await getRivalsPlayerProfile(ingamename);
		if (!rivalsProfile) return Promise.resolve(null);

		if (rivalsProfile.isPrivate || !("ranks" in rivalsProfile)) {
			return {
				ign: rivalsProfile.name,
				privateProfile: true,
			};
		}

		return {
			ign: rivalsProfile.name,
			tank: dbNumberToRank(
				game,
				rivalsProfile.ranks.vanguard.currentRank.aoeNumber
			),
			support: dbNumberToRank(
				game,
				rivalsProfile.ranks.strategist.currentRank.aoeNumber
			),
			dps: dbNumberToRank(
				game,
				rivalsProfile.ranks.duelist.currentRank.aoeNumber
			),
			season: rivalsProfile.ranks.vanguard.seasonId,
			privateProfile: false,
		};
	}
	return Promise.resolve(null);
}

const OVERWATCH = new OverwatchGameData();
const RIVALS = new MarvelRivalsGameData();

function getGameData(game?: string | null) {
	if (game == "Overwatch") return OVERWATCH;
	if (game == "Marvel Rivals") return RIVALS;
	return OVERWATCH;
}

export { getGameData, OVERWATCH, RIVALS };
