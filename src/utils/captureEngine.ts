import { PokemonMember, TrainerSpecialization } from '../types';
import { KANTO_ITEMS, ShopItem } from '../data/kantoItems';

export interface CaptureAttemptResult {
  hasBall: boolean;
  captured: boolean;
  consumedBallId?: string;
  chosenBall?: ShopItem;
  catchChance?: number;
  shakes?: number;
  modifiedRate?: number;
  catchNotice: {
    hasBall: boolean;
    usedBallName?: string;
    usedBallIcon?: string;
    catchChance?: number;
    captured: boolean;
    shakes?: number;
    message: string;
  };
}

/**
 * Returns the official species base catch rate (1-255) according to official Pokémon data.
 */
function getOfficialSpeciesCatchRate(pokemon: Omit<PokemonMember, 'id'>): number {
  const monName = (pokemon.species || pokemon.name || '').trim();
  const nameLower = monName.toLowerCase();

  // Legendaries
  if (['mewtwo', 'articuno', 'zapdos', 'moltres'].includes(nameLower) || pokemon.isLegendary) {
    return 3;
  }
  if (nameLower === 'mew') return 45;

  // Specific Kanto Species Rates (Official Gen 1-4 Pokedex values)
  const officialRates: Record<string, number> = {
    // Common wild pokemon (255)
    caterpie: 255, metapod: 120, weedle: 255, kakuna: 120,
    pidgey: 255, rattata: 255, spearow: 255, ekans: 255,
    sandshrew: 255, 'nidoran♀': 235, 'nidoran♂': 235, zubat: 255,
    oddish: 255, paras: 190, venonat: 190, diglett: 255,
    meowth: 255, psyduck: 190, mankey: 190, growlithe: 190,
    poliwag: 255, abra: 200, machop: 180, bellsprout: 255,
    tentacool: 190, geodude: 255, ponyta: 190, slowpoke: 190,
    magnemite: 190, doduo: 190, seel: 190, grimer: 190,
    shellder: 190, gastly: 190, drowzee: 190, krabby: 225,
    voltorb: 190, exeggcute: 90, cubone: 190, koffing: 190,
    rhyhorn: 120, horsea: 225, goldeen: 225, staryu: 225,
    magikarp: 255,

    // Starters & Rare 1st stage (45)
    bulbasaur: 45, ivysaur: 45, venusaur: 45,
    charmander: 45, charmeleon: 45, charizard: 45,
    squirtle: 45, wartortle: 45, blastoise: 45,
    dratini: 45, dragonair: 45, dragonite: 45,
    snorlax: 25, lapras: 45, aerodactyl: 45,
    eevee: 45, vaporeon: 45, jolteon: 45, flareon: 45,
    porygon: 45, scyther: 45, pinsir: 45, tauros: 45,
    kangaskhan: 45, chansey: 30, tangela: 45, mr_mime: 45,
    jynx: 45, electabuzz: 45, magmar: 45,

    // Mid-stage / evolutions
    pidgeotto: 120, pidgeot: 45, raticate: 127, fearow: 90,
    arbok: 90, raichu: 75, sandslash: 90, nidorina: 120,
    nidoqueen: 45, nidorino: 120, nidoking: 45, clefairy: 150,
    clefable: 25, vulpix: 190, ninetales: 75, jigglypuff: 170,
    wigglytuff: 50, golbat: 90, gloom: 120, vileplume: 45,
    parasect: 75, venomoth: 75, dugtrio: 50, golduck: 75,
    primeape: 75, arcanine: 75, poliwhirl: 120, poliwrath: 45,
    kadabra: 100, alakazam: 50, machoke: 90, machamp: 45,
    weepinbell: 120, victreebel: 45, tentacruel: 60, graveler: 120,
    golem: 45, rapidash: 60, slowbro: 75, magneton: 60,
    farfetchd: 45, dodrio: 45, dewgong: 75, muk: 75,
    cloyster: 60, haunter: 90, gengar: 45, onix: 45,
    hypno: 75, kingler: 60, electrode: 60, exeggutor: 45,
    marowak: 75, hitmonlee: 45, hitmonchan: 45, licking: 45,
    weezing: 60, rhydon: 60, seadra: 75, seaking: 60,
    starmie: 60, gyarados: 45, ditto: 35
  };

  if (officialRates[nameLower]) {
    return officialRates[nameLower];
  }

  // Fallback heuristics based on stage and level
  const stage = pokemon.stage || 1;
  const level = pokemon.level || 5;

  if (stage >= 3 || level >= 40) return 45;
  if (stage >= 2 || level >= 25) return 120;
  return 220;
}

export function attemptPokemonCapture(
  targetPokemon: Omit<PokemonMember, 'id'>,
  inventory: Record<string, number>,
  specialization: TrainerSpecialization,
  skill: number,
  location: string = '',
  turnNumber: number = 1
): CaptureAttemptResult {
  const currentInv = inventory || {};

  // Find all owned Poké Balls in inventory with qty > 0
  const ownedBalls: { item: ShopItem; qty: number; ratio: number }[] = [];

  for (const item of KANTO_ITEMS) {
    if (item.category === 'POKEBALL') {
      const qty = currentInv[item.id] || 0;
      if (qty > 0) {
        let effectiveRatio = item.catchRatio || 1.0;
        const targetType = (targetPokemon.type || '').toLowerCase();
        const secType = (targetPokemon.secondaryType || '').toLowerCase();
        const combinedTypes = `${targetType} ${secType}`;
        const locLower = (location || '').toLowerCase();

        // Special ratio conditions according to official PokeRoad rules
        if (item.id === 'quick-ball') {
          // Veloz Ball: x5.0 on turn 1, x1.0 on subsequent turns
          effectiveRatio = turnNumber === 1 ? 5.0 : 1.0;
        } else if (item.id === 'dusk-ball') {
          // Ocaso Ball: x3.5 in caves/tunnels/night or against Ghost/Dark, x1.0 otherwise
          if (combinedTypes.includes('fantasma') || combinedTypes.includes('siniestro') || locLower.includes('cueva') || locLower.includes('túnel') || locLower.includes('noche') || locLower.includes('oscur')) {
            effectiveRatio = 3.5;
          } else {
            effectiveRatio = 1.0;
          }
        } else if (item.id === 'master-ball') {
          effectiveRatio = 255.0;
        }

        ownedBalls.push({ item, qty, ratio: effectiveRatio });
      }
    }
  }

  // Case A: No Poké Balls available in inventory
  if (ownedBalls.length === 0) {
    const monName = targetPokemon.species || targetPokemon.name;
    return {
      hasBall: false,
      captured: false,
      catchNotice: {
        hasBall: false,
        captured: false,
        message: `⚠️ ¡No tenías ningún tipo de Poké Ball en tu Mochila para capturar a ${monName}! Recibiste las demás recompensas del evento pero no pudiste obtener al Pokémon. ¡Recuerda comprar Poké Balls en la Pokétienda!`
      }
    };
  }

  // Case B: Player owns Poké Balls -> Select the best ball for this encounter
  ownedBalls.sort((a, b) => b.ratio - a.ratio);
  const bestBallObj = ownedBalls[0];
  const chosenBall = bestBallObj.item;
  const ballMultiplier = bestBallObj.ratio;

  const monName = targetPokemon.species || targetPokemon.name;
  const baseCatchRate = getOfficialSpeciesCatchRate(targetPokemon);

  // 1. Calculate HP ratio (wild Pokemon weakened in combat by trainer skill & specialization)
  const maxHP = 100;
  const hpReductionSkill = (skill / 150);
  const hpReductionSpec = specialization === 'Captura' ? 0.25 : 0;
  const hpReductionTurn = turnNumber > 1 ? 0.15 : 0;
  
  const wildHPRatio = Math.max(0.12, 1.0 - hpReductionSkill - hpReductionSpec - hpReductionTurn);
  const currentHP = Math.max(1, Math.round(maxHP * wildHPRatio));

  // Official Gen 3/4 HP Factor: (3 * HPmax - 2 * HPcurrent) / (3 * HPmax)
  const hpFactor = (3 * maxHP - 2 * currentHP) / (3 * maxHP);

  // 2. Status Bonus (S): Sleep/Freeze = 2.0, Paralysis/Poison/Burn = 1.5, None = 1.0
  let statusBonus = 1.0;
  if (specialization === 'Captura') {
    statusBonus = 2.0; // Sleep condition applied by capture master
  } else if (skill >= 65) {
    statusBonus = 1.5; // Paralysis condition applied by skilled trainer
  }

  // 3. Official Modified Catch Rate (a)
  // Formula: a = floor( hpFactor * BaseCatchRate * BallBonus * StatusBonus )
  let a = 0;
  if (chosenBall.id === 'master-ball') {
    a = 255;
  } else {
    a = Math.floor(hpFactor * baseCatchRate * ballMultiplier * statusBonus);
  }

  // 4. Perform official 4-shake checks if a < 255
  let captured = false;
  let shakes = 0;
  let b = 65535;

  if (a >= 255) {
    captured = true;
    shakes = 4;
    a = 255;
  } else {
    // Official Shake Threshold Formula: b = floor( 65535 * (a / 255)^0.25 )
    b = Math.floor(65535 * Math.pow(a / 255, 0.25));

    // Perform 4 independent random checks between 0 and 65535
    for (let i = 0; i < 4; i++) {
      const roll = Math.floor(Math.random() * 65536);
      if (roll < b) {
        shakes++;
      } else {
        break; // Ball breaks
      }
    }

    if (shakes === 4) {
      captured = true;
    }
  }

  // Exact mathematical probability of passing all 4 shakes
  const probabilityDecimal = a >= 255 ? 1.0 : Math.pow((b + 1) / 65536, 4);
  const catchChance = Math.min(100, Math.max(1, Math.round(probabilityDecimal * 100)));

  let message = '';
  if (captured) {
    message = `🔴 ¡Usaste 1x ${chosenBall.name}! [Fórmula Oficial: Rate base ${baseCatchRate}, a=${a}]. La Poké Ball tambaleó 4 veces (⭐⭐⭐⭐) y ¡capturaste con éxito a ${monName}! (Probabilidad: ${catchChance}%).`;
  } else {
    const shakeText = shakes === 1 ? '1 vez' : `${shakes} veces`;
    message = `💨 ¡Lanzaste 1x ${chosenBall.name}! [Fórmula Oficial: a=${a}]. La Poké Ball tambaleó ${shakeText} antes de que ${monName} rompiere la cápsula y huyera. (Probabilidad de éxito: ${catchChance}%).`;
  }

  return {
    hasBall: true,
    captured,
    consumedBallId: chosenBall.id,
    chosenBall,
    catchChance,
    shakes,
    modifiedRate: a,
    catchNotice: {
      hasBall: true,
      usedBallName: chosenBall.name,
      usedBallIcon: chosenBall.iconEmoji,
      catchChance,
      captured,
      shakes,
      message
    }
  };
}

