import { GameEvent } from '../types';

export const GAME_EVENTS: GameEvent[] = [
  {
    id: 'event-10',
    title: 'El Primer Paso y el Desafío del Rival',
    category: 'RIVAL_MATCH',
    age: 10,
    location: 'Pueblo Paleta - Ruta 1',
    description: 'Apenas sales de tu casa con tu primer Pokémon en la Pokéball, tu rival de la infancia te intercepta con una sonrisa desafiante. "¡A ver si tienes lo que se necesita para ser entrenador!"',
    options: [
      {
        id: 'opt-10-a',
        text: 'Aceptar el combate directo confiando en el instinto de tu Pokémon.',
        outcomeText: 'Sorprendes a tu rival con un ataque enérgico. Tu inicial demuestra un coraje brutal.',
        statEffects: { skill: 8, bond: 10 },
        isVictory: true
      },
      {
        id: 'opt-10-b',
        text: 'Analizar sus movimientos y luchar a la defensiva con estrategia.',
        outcomeText: 'Aprovechas su impaciencia y contraatacas justo a tiempo. ¡Una victoria limpia y táctica!',
        statEffects: { skill: 12, stamina: -5 },
        triggerNextEventId: 'event-chain-rival-rematch',
        chainedNotice: '⚡ Desbloqueará en el futuro: "Consecuencia: La Venganza de tu Rival en el Puente Pepita"',
        isVictory: true
      },
      {
        id: 'opt-10-c',
        text: 'Ofrecer compartir consejos de entrenamiento antes de luchar.',
        outcomeText: 'Tu rival respeta tu deportividad. La batalla es intensa pero ambos aprenden mucho.',
        statEffects: { bond: 15, reputation: 10 }
      }
    ]
  },
  {
    id: 'event-route-1',
    title: 'Primeros Encuentros: La Fauna de la Ruta 1',
    category: 'WILD_ENCOUNTER',
    age: 10,
    location: 'Pueblo Paleta - Ruta 1',
    description: 'Mientras recorres el frondoso sendero hacia Ciudad Verde, las hierbas altas se agitan. Escuchas el trino vibrante de aves y el veloz correteo de pequeños roedores.',
    options: [
      {
        id: 'opt-r1-a',
        text: 'Capturar un Pidgey silvestre aprovechando su vuelo bajo.',
        outcomeText: '¡Pipi-pip... Clic! Capturas a un ágil Pidgey. Tu equipo gana un excelente vigía aéreo.',
        statEffects: { skill: 6, bond: 8, stamina: -2 },
        addPokemon: {
          name: 'Pidgey',
          species: 'Pidgey',
          type: 'Normal / Volador',
          level: 8,
          stage: 1,
          iconEmoji: '🐦'
        }
      },
      {
        id: 'opt-r1-b',
        text: 'Atrincherarte sigilosamente para atrapar a un Rattata voraz.',
        outcomeText: 'Sorprendes a Rattata masticando Bayas. Se une al equipo sorprendido pero leal.',
        statEffects: { stamina: 8, money: 200 },
        addPokemon: {
          name: 'Rattata',
          species: 'Rattata',
          type: 'Normal',
          level: 8,
          stage: 1,
          iconEmoji: '🐭'
        }
      },
      {
        id: 'opt-r1-c',
        text: 'Estudiar los hábitos de la fauna y compartir comida con ellos.',
        outcomeText: 'Ganas la confianza de las criaturas silvestres. Fortaleces tu vínculo con la naturaleza.',
        statEffects: { bond: 12, skill: 5, reputation: 5 }
      }
    ]
  },
  {
    id: 'event-11',
    title: 'Desafío del Gimnasio Roca: Medalla Roca',
    category: 'GYM_BATTLE',
    age: 11,
    location: 'Ciudad Plateada',
    description: 'Entras al imponente Gimnasio de Roca. El Líder Brock te observa serenamente desde su plataforma mientras sacude el polvo de sus manos. "La resistencia de la roca no se quiebra fácilmente".',
    options: [
      {
        id: 'opt-11-a',
        text: 'Atacar con todo el poder de ventaja elemental de tu equipo (Planta/Agua).',
        statRequirements: { skill: 25 },
        outcomeText: 'Tu estrategia rinde frutos. Rompes la defensa de Onix y consigues tu primera medalla oficial.',
        statEffects: { skill: 10, reputation: 8, money: 500 },
        awardBadgeId: 'badge-roca',
        evolveStarter: true,
        isVictory: true
      },
      {
        id: 'opt-11-b',
        text: 'Agotar la resistencia del rival con cambios rápidos de Pokémon.',
        statRequirements: { stamina: 40 },
        outcomeText: 'Mano de obra exhaustiva. Sufriste desgaste físico pero la Medalla Roca ya brilla en tu estuche.',
        statEffects: { skill: 7, stamina: -12, money: 500 },
        awardBadgeId: 'badge-roca',
        isVictory: true
      },
      {
        id: 'opt-11-c',
        text: 'Probar un ataque arriesgado de fuerza bruta sin preparación.',
        outcomeText: 'El golpe falla por poco y el Onix de Brock responde con Venganza. Sufres una amarga derrota.',
        statEffects: { skill: -2, bond: -5, stamina: -15 },
        isDefeat: true
      }
    ]
  },
  {
    id: 'event-route-viridian',
    title: 'Aventura Silvestre en el Bosque Verde',
    category: 'WILD_ENCOUNTER',
    age: 11,
    location: 'Bosque Verde',
    description: 'Los coposos árboles centenarios bloquean la luz. Chispas amarillas destellan en la copa de los árboles y diminutos gusanos tejen seda en el sotobosque.',
    options: [
      {
        id: 'opt-rv-a',
        text: 'Rastrear las descargas eléctricas y capturar a un Pikachu salvaje.',
        outcomeText: '¡Chispa brillante! Tras un ágil intercambio de movimientos, Pikachu entra felizmente a la Pokéball.',
        statEffects: { skill: 8, bond: 10, reputation: 8 },
        addPokemon: {
          name: 'Pikachu',
          species: 'Pikachu',
          type: 'Eléctrico',
          level: 13,
          stage: 1,
          iconEmoji: '⚡'
        }
      },
      {
        id: 'opt-rv-b',
        text: 'Capturar un Caterpie entusiasta para Criarlo hasta Mariposa.',
        outcomeText: 'Atrapas a un saludable Caterpie. Su potencial de evolución rápida es prometedor.',
        statEffects: { bond: 12, stamina: 5 },
        addPokemon: {
          name: 'Caterpie',
          species: 'Caterpie',
          type: 'Bicho',
          level: 10,
          stage: 1,
          iconEmoji: '🐛'
        }
      },
      {
        id: 'opt-rv-c',
        text: 'Ayudar a un Nidoran herido y curarle con Antídotos del bosque.',
        outcomeText: 'Nidoran se recupera e insiste en acompañarte en tu viaje como agradecimiento.',
        statEffects: { bond: 15, reputation: 10 },
        addPokemon: {
          name: 'Nidoran♂',
          species: 'Nidoran♂',
          type: 'Veneno',
          level: 12,
          stage: 1,
          iconEmoji: '🦔'
        }
      }
    ]
  },
  {
    id: 'event-12',
    title: 'Infiltración en la Cueva: Reclutas del Equipo Sombra',
    category: 'VILLAIN_TEAM',
    age: 12,
    location: 'Monte Moon',
    description: 'Mientras exploras la cueva en busca de fósiles, descubres a unos reclutas sospechosos intentando robar los Pokémon salvajes de la zona con redes de alta tensión.',
    options: [
      {
        id: 'opt-12-a',
        text: 'Confrontarlos de inmediato y expulsarlos de la cueva.',
        statRequirements: { skill: 30 },
        outcomeText: 'Derrotas a los villanos en un combate doble. Los Pokémon locales te lo agradecen con lealtad.',
        statEffects: { reputation: 12, bond: 10, money: 800 },
        triggerNextEventId: 'event-chain-rocket-revenge',
        chainedNotice: '⚡ Desbloqueará en el futuro: "Consecuencia: Emboscada Nocturna del Team Sombra"',
        addPokemon: {
          name: 'Zubat Furia',
          species: 'Golbat',
          type: 'Veneno / Volador',
          level: 22,
          stage: 2,
          iconEmoji: '🦇'
        },
        isVictory: true
      },
      {
        id: 'opt-12-b',
        text: 'Informar a los Oficiales de Policía y colaborar en la emboscada.',
        outcomeText: 'Tu prudencia ayuda a desmantelar toda la célula criminal local. Recibes una recompensa oficial.',
        statEffects: { reputation: 15, money: 2000 },
        isVictory: true
      },
      {
        id: 'opt-12-c',
        text: 'Ignorar el conflicto y aprovechar para recolectar minerales valiosos.',
        outcomeText: 'Consigues objetos valiosos para vender, pero tu conciencia queda inquietada.',
        statEffects: { money: 3500, bond: -10, reputation: -8 },
        triggerNextEventId: 'event-chain-casino-heist',
        chainedNotice: '⚡ Desbloqueará en el futuro: "Consecuencia: Torneo Clandestino del Casino Subterráneo"'
      }
    ]
  },
  {
    id: 'event-route-3',
    title: 'El Sendero Rocoso de la Ruta 3',
    category: 'WILD_ENCOUNTER',
    age: 12,
    location: 'Ruta 3 - Cañón Inferior',
    description: 'Rocas escarpadas y acantilados de arcilla marcan el camino hacia el Monte Moon. Criaturas rocosas y pequeños felinos acechan desde las alturas.',
    options: [
      {
        id: 'opt-r3-a',
        text: 'Capturar un Geodude firme que rueda desde el acantilado.',
        outcomeText: 'Tu inicial detiene la rodada de Geodude y lo atrapas. ¡Una adición con defensa impenetrable!',
        statEffects: { skill: 10, stamina: -5 },
        addPokemon: {
          name: 'Geodude',
          species: 'Geodude',
          type: 'Roca / Tierra',
          level: 16,
          stage: 1,
          iconEmoji: '🪨'
        }
      },
      {
        id: 'opt-r3-b',
        text: 'Capturar un Jigglypuff que entona dulcemente bajo un gran árbol.',
        outcomeText: '¡Pipi-pip... Clic! Cintas de canción y buena vibra para tu equipo.',
        statEffects: { bond: 12, reputation: 6 },
        addPokemon: {
          name: 'Jigglypuff',
          species: 'Jigglypuff',
          type: 'Normal / Hada',
          level: 15,
          stage: 1,
          iconEmoji: '🎀'
        }
      },
      {
        id: 'opt-r3-c',
        text: 'Escalar las paredes rocosas para entrenar la resistencia física.',
        outcomeText: 'Fortaleces los músculos de tu cuerpo y la tenacidad de todo tu equipo.',
        statEffects: { stamina: 15, skill: 6 }
      }
    ]
  },
  {
    id: 'event-13',
    title: 'Destello Enigmático: ¡Pokémon Variocolor!',
    category: 'WILD_ENCOUNTER',
    age: 13,
    location: 'Bosque Verde',
    description: 'Un aura dorada brilla entre la fronda del bosque. Un Pidgey de plumaje variocolor (Shiny) desciende tranquilamente sobre una rama.',
    options: [
      {
        id: 'opt-13-a',
        text: 'Lanzar una Ultra Ball con máxima precisión visual.',
        statRequirements: { skill: 35 },
        outcomeText: '¡Pipi-pip... Clic! ¡Capturaste un deslumbrante Pidgey Variocolor! La gente en el pueblo no lo puede creer.',
        statEffects: { reputation: 18, bond: 10, money: -300 },
        addPokemon: {
          name: 'Pidgeotto Shiny',
          species: 'Pidgeotto',
          type: 'Normal / Volador',
          level: 25,
          stage: 2,
          isShiny: true,
          iconEmoji: '✨'
        }
      },
      {
        id: 'opt-13-b',
        text: 'Luchar con serenidad para reducir su salud antes de lanzar la ball.',
        outcomeText: 'El combate es impecable y la captura es limpia. Tu equipo aprende a tener compostura.',
        statEffects: { skill: 8, bond: 12 },
        addPokemon: {
          name: 'Pidgeotto Shiny',
          species: 'Pidgeotto',
          type: 'Normal / Volador',
          level: 25,
          stage: 2,
          isShiny: true,
          iconEmoji: '✨'
        }
      },
      {
        id: 'opt-13-c',
        text: 'Tomar una foto para tus redes y dejarlo volar en libertad.',
        outcomeText: 'La foto se vuelve viral entre la comunidad de entrenadores. Te ganas el respeto de los ecologistas.',
        statEffects: { reputation: 25, bond: 15 }
      }
    ]
  },
  {
    id: 'event-route-24',
    title: 'Colinas y Prados de la Ruta 24 y 25',
    category: 'WILD_ENCOUNTER',
    age: 13,
    location: 'Ruta 24 - Alrededores del Cabo Celeste',
    description: 'Cerca de la bahía y la residencia del Investigador Bill, el viento trae fragancias florales e intensas auras místicas. Pokémon psíquicos y de fuego merodean en la hierba.',
    options: [
      {
        id: 'opt-r24-a',
        text: 'Bloquear la Teletransportación de Abra y capturarlo hábilmente.',
        statRequirements: { skill: 32 },
        outcomeText: 'Anticipas su parpadeo psíquico con una Veloz Ball. ¡Capturas a un valiosísimo Abra!',
        statEffects: { skill: 12, reputation: 10 },
        addPokemon: {
          name: 'Abra',
          species: 'Abra',
          type: 'Psíquico',
          level: 20,
          stage: 1,
          iconEmoji: '🔮'
        }
      },
      {
        id: 'opt-r24-b',
        text: 'Capturar un Growlithe fiero y leal de pelaje brillante.',
        outcomeText: 'Su temperamento protector encaja perfecto en tu equipo. ¡Un aliado ardiente!',
        statEffects: { bond: 12, skill: 8 },
        addPokemon: {
          name: 'Growlithe',
          species: 'Growlithe',
          type: 'Fuego',
          level: 22,
          stage: 1,
          iconEmoji: '🐕'
        }
      },
      {
        id: 'opt-r24-c',
        text: 'Capturar un Bellsprout tropical con látigos cepa.',
        outcomeText: 'Bellsprout demuestra agilidad botánica y se une entusiasmado.',
        statEffects: { stamina: 8, bond: 10 },
        addPokemon: {
          name: 'Bellsprout',
          species: 'Bellsprout',
          type: 'Planta / Veneno',
          level: 21,
          stage: 1,
          iconEmoji: '🌿'
        }
      }
    ]
  },
  {
    id: 'event-14',
    title: 'Desafío del Gimnasio Agua: Medalla Cascada',
    category: 'GYM_BATTLE',
    age: 12,
    location: 'Ciudad Celeste',
    description: 'El gimnasio está construido sobre una piscina olímpica con plataformas flotantes. Misty realiza un salto acrobático y te desafía con su Starmie.',
    options: [
      {
        id: 'opt-14-a',
        text: 'Aprovechar la velocidad de tus Pokémon en las plataformas finas (Planta/Eléctrico).',
        statRequirements: { skill: 35 },
        outcomeText: 'Esquivas los Rayo Burbuja y asestas el golpe final. ¡Ganas la Medalla Cascada!',
        statEffects: { skill: 8, reputation: 8, money: 600 },
        awardBadgeId: 'badge-cascada',
        isVictory: true
      },
      {
        id: 'opt-14-b',
        text: 'Forzar un combate acuático sumergiéndote con tu equipo.',
        statRequirements: { stamina: 45 },
        outcomeText: 'Resistencia extrema. Tu determinación impresiona a Misty y te otorga la victoria.',
        statEffects: { skill: 5, stamina: -12, bond: 8, money: 600 },
        awardBadgeId: 'badge-cascada',
        isVictory: true
      },
      {
        id: 'opt-14-c',
        text: 'Atacar de forma impulsiva a Starmie sin evaluar sus movimientos.',
        outcomeText: 'Starmie usa Recuperación y te supera con Hidroariete. ¡Derrota aplastante en la piscina!',
        statEffects: { skill: -3, stamina: -10 },
        isDefeat: true
      }
    ]
  },
  {
    id: 'event-15',
    title: 'El Enigma del Incienso y la Piedra Evolutiva',
    category: 'LIFESTYLE',
    age: 15,
    location: 'Ruta 6 - Guardería',
    description: 'Un anciano sabio de la Guardería Pokémon te regala un objeto místico y te propone entrenar a fondo para liberar el potencial dormido de tu equipo.',
    options: [
      {
        id: 'opt-15-a',
        text: 'Someter a tu equipo a un riguroso régimen de entrenamiento intensivo.',
        statRequirements: { stamina: 35 },
        outcomeText: '¡Tu Pokémon inicial alcanza un estado de forma increíble y evoluciona a su forma final!',
        statEffects: { skill: 15, stamina: -15, bond: 10 },
        triggerNextEventId: 'event-chain-fossil-revival',
        chainedNotice: '⚡ Desbloqueará en el futuro: "Consecuencia: Resurrección del Fósil Prehistórico"',
        evolveStarter: true
      },
      {
        id: 'opt-15-b',
        text: 'Acampar bajo las estrellas y fortalecer la amistad profunda del equipo.',
        outcomeText: 'El vínculo afectivo se dispara al máximo. Todos tus Pokémon confían ciegamente en ti.',
        statEffects: { bond: 25, stamina: 15 }
      },
      {
        id: 'opt-15-c',
        text: 'Investigar en la biblioteca de la Guardería métodos de crianza.',
        outcomeText: 'Descubres secretos valiosos para aumentar el rendimiento de tu equipo.',
        statEffects: { skill: 12, reputation: 10 }
      }
    ]
  },
  {
    id: 'event-route-12',
    title: 'La Costa Acuática de la Ruta 12',
    category: 'WILD_ENCOUNTER',
    age: 15,
    location: 'Ruta 12 - Muelle del Océano',
    description: 'El largo puente de madera sobre el mar es frecuentado por Pescadores legendarios. En las aguas profundas nadan misteriosas sombras serpenteantes y colosos marinos.',
    options: [
      {
        id: 'opt-r12-a',
        text: 'Pescar con Caña Buena y capturar un escurridizo Dratini.',
        statRequirements: { skill: 45 },
        outcomeText: '¡Una luz mística emerge de las olas! Atrapas a un rarísimo Dratini en tu equipo.',
        statEffects: { skill: 15, reputation: 15 },
        addPokemon: {
          name: 'Dratini',
          species: 'Dratini',
          type: 'Dragón',
          level: 30,
          stage: 1,
          iconEmoji: '🐉'
        }
      },
      {
        id: 'opt-r12-b',
        text: 'Enfrentar la furia de las olas y capturar un feroz Gyarados.',
        statRequirements: { stamina: 50 },
        outcomeText: 'Soportas sus potentes Hiperrayos e impones disciplina. ¡Un gigante colosal en tu bando!',
        statEffects: { skill: 14, stamina: -12 },
        addPokemon: {
          name: 'Gyarados',
          species: 'Gyarados',
          type: 'Agua / Volador',
          level: 32,
          stage: 2,
          iconEmoji: '🌊'
        }
      },
      {
        id: 'opt-r12-c',
        text: 'Aprender técnicas de navegación y pesca de los ancianos marineros.',
        outcomeText: 'Adquieres vastos conocimientos marinos y consigues preciados Pokécupones.',
        statEffects: { money: 2000, skill: 8, stamina: 10 }
      }
    ]
  },
  {
    id: 'event-16',
    title: 'Desafío del Gimnasio Eléctrico: Medalla Trueno',
    category: 'GYM_BATTLE',
    age: 13,
    location: 'Ciudad Carmín',
    description: 'Entre chispas de alto voltaje y generadores industriales, el veterano de guerra Lt. Surge cruje sus nudillos junto a su impetuoso Raichu.',
    options: [
      {
        id: 'opt-16-a',
        text: 'Bloquear la electricidad usando tierra o aislamiento táctico.',
        statRequirements: { skill: 42 },
        outcomeText: 'Anulas su Rayo y contraatacas con contundencia. ¡Medalla Trueno conseguida!',
        statEffects: { skill: 10, reputation: 8, money: 800 },
        awardBadgeId: 'badge-trueno',
        isVictory: true
      },
      {
        id: 'opt-16-b',
        text: 'Aceptar un duelo de velocidad pura frente a frente.',
        statRequirements: { skill: 50 },
        outcomeText: 'Tu velocidad de reacción es asombrosa. Lt. Surge te saluda militarmente en reconocimiento.',
        statEffects: { skill: 12, reputation: 10, money: 800 },
        triggerNextEventId: 'event-chain-zapdos-flight',
        chainedNotice: '⚡ Desbloqueará en el futuro: "Consecuencia: El Despertar de Zapdos en la Central"',
        awardBadgeId: 'badge-trueno',
        isVictory: true
      },
      {
        id: 'opt-16-c',
        text: 'Dudar al dar las órdenes bajo el ruido atronador de las descargas.',
        outcomeText: 'Raichu aprovecha tu indecisión con Onda Voltio. Caes derrotado ante las chispas.',
        statEffects: { skill: -3, stamina: -12 },
        isDefeat: true
      }
    ]
  },
  {
    id: 'event-17',
    title: 'Gran Torneo de Exhibición y Oferta de Patrocinio',
    category: 'LEAGUE_TOURNAMENT',
    age: 17,
    location: 'Estadio de Ciudad Azafrán',
    description: 'Tus actuaciones atraen la atención de Silph Co. Te ofrecen un contrato de patrocinio si das un buen espectáculo en el Torneo de Primavera.',
    options: [
      {
        id: 'opt-17-a',
        text: 'Dar un espectáculo deslumbrante con combinaciones vistosas.',
        statRequirements: { reputation: 45 },
        outcomeText: '¡La multitud enloquece! Firmas un patrocinio multimillonario con la corporación.',
        statEffects: { reputation: 20, money: 6000 },
        isVictory: true
      },
      {
        id: 'opt-17-b',
        text: 'Competir con la máxima disciplina táctica sin adornos.',
        statRequirements: { skill: 52 },
        outcomeText: 'Ganas el torneo limpiamente. Te respetan como un profesional serio.',
        statEffects: { skill: 15, reputation: 15, money: 4000 },
        isVictory: true
      },
      {
        id: 'opt-17-c',
        text: 'Rechazar las marcas corporativas para mantener la esencia pura del viaje.',
        outcomeText: 'Te conviertes en un héroe de culto entre los entrenadores tradicionales.',
        statEffects: { bond: 20, reputation: 25, money: 1000 }
      }
    ]
  },
  {
    id: 'event-safari-zone',
    title: 'Expedición en la Santuaria Zona Safari',
    category: 'WILD_ENCOUNTER',
    age: 17,
    location: 'Zona Safari - Área Secreta',
    description: 'Armado con 30 Safari Balls y cebo especial, exploras la gran reserva natural de Kanto. Especies extrañas y muy codiciadas rondan en la vegetación exuberante.',
    options: [
      {
        id: 'opt-saf-a',
        text: 'Atraer con cebo sigiloso a un veloz Scyther y atraparlo.',
        statRequirements: { skill: 50 },
        outcomeText: '¡Sus guadañas destellan antes de entrar a la Safari Ball! Un atacante temible para tu equipo.',
        statEffects: { skill: 15, reputation: 12 },
        addPokemon: {
          name: 'Scyther',
          species: 'Scyther',
          type: 'Bicho / Volador',
          level: 38,
          stage: 1,
          iconEmoji: '⚔️'
        }
      },
      {
        id: 'opt-saf-b',
        text: 'Capturar un implacable Tauros que lidera la manada.',
        statRequirements: { stamina: 50 },
        outcomeText: 'Demostración de fuerza brava. Tauros acepta tu liderazgo y se suma a la causa.',
        statEffects: { stamina: 12, skill: 10 },
        addPokemon: {
          name: 'Tauros',
          species: 'Tauros',
          type: 'Normal',
          level: 38,
          stage: 1,
          iconEmoji: '🐂'
        }
      },
      {
        id: 'opt-saf-c',
        text: 'Capturar un Chansey bondadoso capaz de sanar al grupo.',
        outcomeText: 'Chansey comparte su huevo con tu equipo. Tu resistencia médica alcanza niveles óptimos.',
        statEffects: { bond: 20, stamina: 15 },
        addPokemon: {
          name: 'Chansey',
          species: 'Chansey',
          type: 'Normal',
          level: 36,
          stage: 1,
          iconEmoji: '🥚'
        }
      }
    ]
  },
  {
    id: 'event-18',
    title: 'Desafío del Gimnasio Planta: Medalla Arcoíris',
    category: 'GYM_BATTLE',
    age: 14,
    location: 'Ciudad Azulona',
    description: 'En el invernadero aroma-terapéutico de Ciudad Azulona, la Líder Erika cultiva una fragancia embriagadora que dificulta la concentración en combate.',
    options: [
      {
        id: 'opt-18-a',
        text: 'Mantener la mente despejada y atacar con precisión de Fuego / Volador.',
        statRequirements: { skill: 48 },
        outcomeText: 'Disipas las esporas aromáticas y consigues la hermosa Medalla Arcoíris.',
        statEffects: { skill: 10, reputation: 8, money: 1000 },
        awardBadgeId: 'badge-arcoiris',
        isVictory: true
      },
      {
        id: 'opt-18-b',
        text: 'Resistir el sueño a través del vínculo telepático con tu equipo.',
        statRequirements: { bond: 50 },
        outcomeText: 'Tu Pokémon se despierta justo a tiempo por tu voz. ¡Una victoria emotiva!',
        statEffects: { bond: 12, skill: 8, money: 1000 },
        awardBadgeId: 'badge-arcoiris',
        isVictory: true
      },
      {
        id: 'opt-18-c',
        text: 'Ceder al cansancio y ser dormido por Somnífero sin reaccionar.',
        outcomeText: 'Erika gana el combate sin despeinarse. Caes derrotado bajo el aroma del invernadero.',
        statEffects: { stamina: -12, skill: -2 },
        isDefeat: true
      }
    ]
  },
  {
    id: 'event-19',
    title: 'Captura Mística: El Snorlax Dormilón de la Ruta 12',
    category: 'WILD_ENCOUNTER',
    age: 19,
    location: 'Ruta 12 - Paso de la Costa',
    description: 'Un imponente Snorlax dormilón bloquea por completo el puente de la costa. Al tocar la Poké Flauta, despierta desperezándose con una potencia descomunal.',
    options: [
      {
        id: 'opt-19-a',
        text: 'Aceptar su desafío de resistencia y capturarlo tras un duelo feroz.',
        statRequirements: { skill: 55 },
        outcomeText: 'Resistes sus Golpes Cuerpo y logras capturarlo en una Ultra Ball. ¡Un gigante indestructible!',
        statEffects: { skill: 10, bond: 10 },
        addPokemon: {
          name: 'Snorlax',
          species: 'Snorlax',
          type: 'Normal',
          level: 42,
          stage: 1,
          iconEmoji: '🐻'
        }
      },
      {
        id: 'opt-19-b',
        text: 'Usar una estrategia de desgaste con problemas de estado.',
        statRequirements: { stamina: 55 },
        outcomeText: 'Aprovechas su somnolencia para reducir sus defensas y capturarlo limpiamente.',
        statEffects: { skill: 10, reputation: 8 },
        addPokemon: {
          name: 'Snorlax',
          species: 'Snorlax',
          type: 'Normal',
          level: 40,
          stage: 1,
          iconEmoji: '🐻'
        }
      },
      {
        id: 'opt-19-c',
        text: 'Alimentarlo con bayas de alta calidad y ganarte su simpatía sin combatir.',
        outcomeText: 'Snorlax disfruta el festín, se despeja del camino y te regala Restos de comida.',
        statEffects: { stamina: 15, bond: 15 }
      }
    ]
  },
  {
    id: 'event-route-cerulean-cave',
    title: 'Especies Épicas en la Cueva Celeste',
    category: 'WILD_ENCOUNTER',
    age: 20,
    location: 'Cueva Celeste - Abismo Profundo',
    description: 'La mística gruta prohibida solo abre sus puertas a entrenadores consagrados. El ambiente palpita con el rugido de Pokémon temibles y auras colosales.',
    options: [
      {
        id: 'opt-cc-a',
        text: 'Someter a un poderoso Dragonair que custodia los cristales.',
        statRequirements: { skill: 65 },
        outcomeText: 'Tras un combate místico de alto nivel, Dragonair se inclina ante ti y se une a tu equipo.',
        statEffects: { skill: 18, reputation: 18 },
        addPokemon: {
          name: 'Dragonair',
          species: 'Dragonair',
          type: 'Dragón',
          level: 50,
          stage: 2,
          iconEmoji: '🐉'
        }
      },
      {
        id: 'opt-cc-b',
        text: 'Forjar un pacto con un Lapras majestuoso que navega en las corrientes.',
        statRequirements: { bond: 60 },
        outcomeText: 'Lapras te reconoce como Maestro y se convierte en la montura y baluarte de tu grupo.',
        statEffects: { bond: 18, stamina: 15 },
        addPokemon: {
          name: 'Lapras',
          species: 'Lapras',
          type: 'Agua / Hielo',
          level: 52,
          stage: 1,
          iconEmoji: '🦕'
        }
      },
      {
        id: 'opt-cc-c',
        text: 'Absorber la energía del núcleo místico para perfeccionar tu mente.',
        outcomeText: 'Alcanzas un estado de concentración absoluta. Tu reputación como Maestro es incuestionable.',
        statEffects: { skill: 20, reputation: 20 }
      }
    ]
  },
  {
    id: 'event-20',
    title: 'Desafío del Gimnasio Psíquico: Medalla Pantano',
    category: 'GYM_BATTLE',
    age: 20,
    location: 'Ciudad Azafrán',
    description: 'Paneles de teletransporte y cucharas dobladas te rodean. La Líder Sabrina predice el futuro con sus poderes mentales. "Ya sé cómo terminará este combate".',
    options: [
      {
        id: 'opt-20-a',
        text: 'Romper sus predicciones con movimientos impredecibles y audaces (Bicho/Fantasma/Siniestro).',
        statRequirements: { skill: 58 },
        outcomeText: 'Desorientas sus poderes Psíquicos con tácticas caóticas. ¡Obtienes la Medalla Pantano!',
        statEffects: { skill: 14, reputation: 12, money: 2500 },
        awardBadgeId: 'badge-pantano',
        isVictory: true
      },
      {
        id: 'opt-20-b',
        text: 'Entrenar tu mente para bloquear su telepatía directamente.',
        statRequirements: { skill: 65 },
        outcomeText: 'Tu enfoque absoluto deja sin respuesta a su Alakazam. Sabrina admite su error de visión.',
        statEffects: { skill: 18, reputation: 15, money: 2500 },
        awardBadgeId: 'badge-pantano',
        isVictory: true
      },
      {
        id: 'opt-20-c',
        text: 'Caer sin resistencia en las ilusiones de sus espejismos psíquicos.',
        outcomeText: 'Tu equipo se confunde a sí mismo. Sabrina gana la batalla sin despeinarse.',
        statEffects: { skill: -4, stamina: -10 },
        isDefeat: true
      }
    ]
  },
  {
    id: 'event-21',
    title: 'El Duelo Crucial en el Puente Pepita',
    category: 'RIVAL_MATCH',
    age: 21,
    location: 'Ruta 24',
    description: 'Tu rival te espera con sus medallas puestas en el abrigo. "He viajado por todo el mundo para superarte. ¡Demuéstrame si estás a mi altura!"',
    options: [
      {
        id: 'opt-21-a',
        text: 'Poner a prueba todo lo aprendido en una batalla épica.',
        statRequirements: { skill: 62 },
        outcomeText: 'Tras un intercambio feroz, tu equipo logra una victoria por la mínima. Ambos chocan los puños.',
        statEffects: { skill: 15, reputation: 20, bond: 15 },
        isVictory: true
      },
      {
        id: 'opt-21-b',
        text: 'Arriesgar con un Pokémon recién capturado para tomarlo por sorpresa.',
        statRequirements: { skill: 68 },
        outcomeText: 'La jugada sale magistral. Tu rival se queda boquiabierto ante tu flexibilidad táctica.',
        statEffects: { skill: 18, reputation: 22, money: 3000 },
        isVictory: true
      },
      {
        id: 'opt-21-c',
        text: 'Luchar con fatiga acumulada sin evaluar tus fuerzas.',
        outcomeText: 'Tu rival nota tu cansancio y aprovecha sus ataques. Sufres una dolorosa derrota.',
        statEffects: { stamina: -15, bond: -5 },
        isDefeat: true
      }
    ]
  },
  {
    id: 'event-22',
    title: 'Desafío del Gimnasio Fuego: Medalla Volcán',
    category: 'GYM_BATTLE',
    age: 22,
    location: 'Isla Cinnabar',
    description: 'Sobre una plataforma suspendida en lava ardiente, el acertijero Blaine te reta entre llamaradas intensas. "¿Qué es aquello que arde más cuanto más luchas?"',
    options: [
      {
        id: 'opt-22-a',
        text: 'Responder "¡La pasión de un Entrenador!" y sofocar sus llamas (Agua/Tierra).',
        statRequirements: { skill: 68 },
        outcomeText: 'Tu contraataque elemental apaga su fuego. ¡Medalla Volcán conseguida!',
        statEffects: { skill: 15, reputation: 12, money: 3000 },
        awardBadgeId: 'badge-volcan',
        isVictory: true
      },
      {
        id: 'opt-22-b',
        text: 'Mantener la calma térmica usando barreras de agua y tierra con temple.',
        statRequirements: { stamina: 60, skill: 65 },
        outcomeText: 'Un combate frío y calculador en medio del volcán. Victoria indiscutible.',
        statEffects: { skill: 14, stamina: -12, money: 3000 },
        awardBadgeId: 'badge-volcan',
        isVictory: true
      },
      {
        id: 'opt-22-c',
        text: 'Sufrir un golpe de calor por el entorno sofocante.',
        outcomeText: 'El calor afecta el rendimiento de tu equipo. Tienes que retirarte sufriendo una derrota.',
        statEffects: { stamina: -20 },
        isDefeat: true
      }
    ]
  },
  {
    id: 'event-23',
    title: 'El Reto Internacional del Frente de Batalla',
    category: 'LEAGUE_TOURNAMENT',
    age: 23,
    location: 'Frente de Batalla - Pirámide',
    description: 'Recibes un pase VIP para competir en el prestigioso Frente de Batalla contra los mejores estrategas internacionales.',
    options: [
      {
        id: 'opt-23-a',
        text: 'Competir en la Fábrica de la Batalla con rotación aleatoria.',
        statRequirements: { skill: 72 },
        outcomeText: 'Demuestras una comprensión perfecta del metajuego. Te entregan el Símbolo del Conocimiento.',
        statEffects: { skill: 20, reputation: 25, money: 8000 },
        isVictory: true
      },
      {
        id: 'opt-23-b',
        text: 'Confiar únicamente en tus Pokémon más veteranos.',
        statRequirements: { bond: 70 },
        outcomeText: 'El poder del vínculo veterano aplasta las estrategias complejas del enemigo.',
        statEffects: { bond: 20, skill: 15, reputation: 20 },
        isVictory: true
      },
      {
        id: 'opt-23-c',
        text: 'Usar el dinero del torneo para mejorar tu equipamiento de viaje.',
        outcomeText: 'Aprovechas las tiendas de lujo del Frente para abastecerte.',
        statEffects: { money: 10000, stamina: 20 }
      }
    ]
  },
  {
    id: 'event-24',
    title: 'La Octava Medalla: El Gimnasio Dragón / Tierra',
    category: 'GYM_BATTLE',
    age: 24,
    location: 'Ciudad Verde / Ciudad Endrino',
    description: 'El último escollo antes de la Liga Pokémon. El líder supremo combate con criaturas dracónicas de poder aplastante. ¡Si ganas aquí, las 8 Medallas serán tuyas!',
    options: [
      {
        id: 'opt-24-a',
        text: 'Desplegar una ofensiva combinada sin dar margen a sus Dragones (Hielo/Dragón).',
        statRequirements: { skill: 75 },
        outcomeText: '¡Increíble! Logras abatir a Dragonite con un combo espectacular. ¡COMPLETAS LAS 8 MEDALLAS REGIONALES!',
        statEffects: { skill: 20, reputation: 25, money: 5000 },
        awardBadgeId: 'badge-dragon',
        isVictory: true
      },
      {
        id: 'opt-24-b',
        text: 'Soportar sus ataques de Hiperrayo y contraatacar en el momento de recarga.',
        statRequirements: { skill: 80 },
        outcomeText: 'Estrategia maestra. El público se pone en pie. ¡Consigues tu 8ª Medalla con honor!',
        statEffects: { skill: 22, bond: 15, money: 5000 },
        awardBadgeId: 'badge-tierra',
        isVictory: true
      },
      {
        id: 'opt-24-c',
        text: 'Perder el ritmo ante la potencia abrumadora del Hiperrayo.',
        outcomeText: 'Tus Pokémon son derrotados rápidamente. La octava medalla se te resiste.',
        statEffects: { stamina: -15, skill: -3 },
        isDefeat: true
      }
    ]
  },
  {
    id: 'event-25',
    title: 'La Gran Crisis: Encuentro Mítico con las Aves Legendarias',
    category: 'VILLAIN_TEAM',
    age: 25,
    location: 'Isla Espuma / Central Energía',
    description: 'El remanente del Team Rocket intenta capturar a las Aves Legendarias de Kanto para controlar los elementos de la región. El destino de Kanto está en tus manos.',
    options: [
      {
        id: 'opt-25-a',
        text: 'Confrontar a los Ejecutivos Rocket en un duelo decisivo y liberar a las Aves.',
        statRequirements: { skill: 78 },
        outcomeText: 'Derrotas a los villanos en un combate épico. El Ave Legendaria te reconoce como Guardián de Kanto.',
        statEffects: { skill: 15, reputation: 20, bond: 15 },
        addPokemon: {
          name: 'Zapdos',
          species: 'Zapdos',
          type: 'Eléctrico / Volador',
          level: 60,
          stage: 3,
          isLegendary: true,
          iconEmoji: '⚡'
        },
        isVictory: true
      },
      {
        id: 'opt-25-b',
        text: 'Formar equipo con el Campeón de la Liga para una operación conjunta.',
        statRequirements: { reputation: 70 },
        outcomeText: 'Juntos frustran los planes del sindicato criminal. El Campeón te nombra héroe regional.',
        statEffects: { skill: 20, reputation: 35, money: 8000 },
        isVictory: true
      },
      {
        id: 'opt-25-c',
        text: 'Aprovechar la distracción para capturar al Legendario con una Master Ball.',
        statRequirements: { money: 10000, skill: 75 },
        outcomeText: '¡Captura legendaria histórica! El mundo entero habla de tu hazaña.',
        statEffects: { reputation: 40, skill: 15 },
        addPokemon: {
          name: 'Mewtwo',
          species: 'Mewtwo',
          type: 'Psíquico',
          level: 75,
          stage: 3,
          isLegendary: true,
          isShiny: true,
          iconEmoji: '🔮'
        },
        isVictory: true
      }
    ]
  },
  {
    id: 'event-26',
    title: 'Fase de Clasificación de la Liga Pokémon',
    category: 'LEAGUE_TOURNAMENT',
    age: 26,
    location: 'Meseta Añil - Sede de la Liga',
    description: 'Las antorchas de la Liga Pokémon están encendidas. Más de 200 entrenadores con 8 medallas compiten en las rondas preliminares en estadios de Roca, Agua, Hielo y Planta.',
    options: [
      {
        id: 'opt-26-a',
        text: 'Barrer las rondas clasificatorias invicto con rotación de equipo.',
        statRequirements: { skill: 80 },
        outcomeText: 'Clasificas a la fase final como el favorito número 1 del torneo.',
        statEffects: { skill: 18, reputation: 20, money: 8000 },
        isVictory: true
      },
      {
        id: 'opt-26-b',
        text: 'Avanzar paso a paso analizando minuciosamente a cada rival.',
        statRequirements: { skill: 75, stamina: 60 },
        outcomeText: 'Llegas a las semifinales sin desgaste innecesario en tus Pokémon.',
        statEffects: { skill: 20, stamina: 10, money: 8000 },
        isVictory: true
      },
      {
        id: 'opt-26-c',
        text: 'Confiarte en la primera ronda sobre césped sin preparación.',
        outcomeText: 'Sufres un susto enorme y pierdes el primer combate preliminar.',
        statEffects: { stamina: -15, skill: -3 },
        isDefeat: true
      }
    ]
  },
  {
    id: 'event-27',
    title: 'El Guantelete del Alto Mando: Los 4 Mejores',
    category: 'LEAGUE_TOURNAMENT',
    age: 27,
    location: 'Sede del Alto Mando',
    description: 'Cuatro salas consecutivas. Cuatro maestros temibles (Lorelei, Bruno, Agatha y Lance). No hay curación entre combates salvo tus propios ítems.',
    options: [
      {
        id: 'opt-27-a',
        text: 'Administrar tus recursos con precisión clínica y superar a los 4.',
        statRequirements: { skill: 85 },
        outcomeText: '¡Hazaña antológica! Derrotas a Lorelei, Bruno, Agatha y Lance en una noche histórica.',
        statEffects: { skill: 15, reputation: 18, bond: 12, legendaryScoreDelta: 10 },
        isVictory: true
      },
      {
        id: 'opt-27-b',
        text: 'Confiar en el espíritu indomable de tu equipo para ganar cada duelo.',
        statRequirements: { bond: 85, stamina: 65 },
        outcomeText: 'Tus Pokémon lo dan todo por ti. Rompes la barrera del Alto Mando con garra pura.',
        statEffects: { bond: 18, skill: 12, stamina: -20, legendaryScoreDelta: 10 },
        isVictory: true
      },
      {
        id: 'opt-27-c',
        text: 'Sufrir agotamiento frente al cuarto miembro (Especialista Dragón).',
        outcomeText: 'Te quedas a las puertas de la gloria. Caes derrotado por los dragones de Lance.',
        statEffects: { stamina: -25, skill: -5 },
        isDefeat: true
      }
    ]
  },
  {
    id: 'event-28',
    title: '¡COMBATE DE TÍTULO! Desafío al Campeón de la Liga',
    category: 'LEAGUE_TOURNAMENT',
    age: 28,
    location: 'Cámara del Salón de la Fama',
    description: 'Bajo los focos del estadio abarrotado por 80.000 espectadores, el Campeón de la Liga te espera en el centro del cuadrilátero. ¡El combate más importante de tu vida!',
    options: [
      {
        id: 'opt-28-a',
        text: 'Ejecutar la obra maestra táctica de tu carrera.',
        statRequirements: { skill: 88 },
        outcomeText: '¡¡VICTORIA!! ¡El último Pokémon del Campeón cae derrotado! ¡TE CONVIERTES EN EL NUEVO CAMPEÓN REGIONAL DE LA LIGA POKÉMON!',
        statEffects: { skill: 20, reputation: 25, bond: 15, money: 15000, legendaryScoreDelta: 25 },
        isVictory: true
      },
      {
        id: 'opt-28-b',
        text: 'Atacar con el corazón desbordante de pasión y entrega absoluta.',
        statRequirements: { bond: 88, stamina: 70 },
        outcomeText: '¡Tu Pokémon inicial aguanta por pura lealtad y asesta el golpe final! ¡¡ERES EL NUEVO CAMPEÓN REGIONAL!!',
        statEffects: { bond: 25, reputation: 25, skill: 15, money: 15000, legendaryScoreDelta: 25 },
        isVictory: true
      },
      {
        id: 'opt-28-c',
        text: 'Cometer un fallo de cálculo en el turno final por nerviosismo.',
        outcomeText: 'El Campeón retiene el título por un margen milimétrico. Caes derrotado en un combate legendario.',
        statEffects: { reputation: 10, money: 3000 },
        isDefeat: true
      }
    ]
  },
  {
    id: 'event-29',
    title: 'Defensa del Título y Gira Mundial de Exhibición',
    category: 'LIFESTYLE',
    age: 29,
    location: 'Gira Internacional',
    description: 'Como Campeón consagrado, viajas por diversas regiones impartiendo seminarios de entrenamiento, enfrentando a aspirantes y defendiendo tu corona.',
    options: [
      {
        id: 'opt-29-a',
        text: 'Defender la corona invicto en todas las batallas oficiales (Camino Combate).',
        statRequirements: { skill: 90 },
        outcomeText: 'Consolidas una era de hegemonía indiscutible. Tu legado de combate trasciende fronteras.',
        statEffects: { skill: 20, reputation: 25, money: 15000 },
        isVictory: true
      },
      {
        id: 'opt-29-b',
        text: 'Fundar tu propia academia de jóvenes entrenadores promesa (Camino Mentoría).',
        statRequirements: { bond: 85, reputation: 80 },
        outcomeText: 'Formas a la nueva generación de campeones. Tu impacto en la comunidad es inolvidable.',
        statEffects: { reputation: 30, bond: 25, money: 12000 }
      },
      {
        id: 'opt-29-c',
        text: 'Viajar como trotamundos en busca de especies raras e indómitas (Camino Captura).',
        statRequirements: { stamina: 80 },
        outcomeText: 'Tu vida de aventuras inspira libros de texto y documentales de televisión.',
        statEffects: { stamina: 20, bond: 20 }
      }
    ]
  },
  {
    id: 'event-30',
    title: 'Consagración a los 30 Años: Erigir la Estatua en el Salón de la Fama',
    category: 'LIFESTYLE',
    age: 30,
    location: 'Sede Central de la Liga Pokémon',
    description: 'Llegas a los 30 años de edad. Ha llegado el momento del colofón de tu aventura. Los jueces de la Liga Pokémon y la prensa regional se reúnen para desvelar la Estatua conmemorativa de tu Leyenda.',
    options: [
      {
        id: 'opt-30-a',
        text: 'Consagrar tu Estatua de Oro Inmortal como Maestro de la Pokédex Kanto.',
        outcomeText: '¡La Liga revela tu monumento de oro celebrando tus logros en Kanto!',
        statEffects: { }
      },
      {
        id: 'opt-30-b',
        text: 'Erigir tu Estatua de Oro Inmortal junto a tu Equipo Campeón en el Salón de la Fama.',
        outcomeText: '¡Tallada en granito y de pie en el Salón de la Fama, tu estatua preside la entrada!',
        statEffects: { }
      },
      {
        id: 'opt-30-c',
        text: 'Dedicar la Estatua a la Vínculo y Mentoría de las Futuras Generaciones de Kanto.',
        outcomeText: '¡Tu estatua servirá de inspiración para miles de niños que inician su viaje en Pueblo Paleta!',
        statEffects: { }
      }
    ]
  }
];

export const CHAINED_EVENTS: GameEvent[] = [
  {
    id: 'event-chain-rival-rematch',
    title: 'Consecuencia: La Venganza de tu Rival en el Puente Pepita',
    category: 'RIVAL_MATCH',
    age: 13,
    location: 'Puente Pepita - Ciudad Celeste',
    description: 'Debido a la lección defensiva que le diste en tu primer combate en Pueblo Paleta, tu rival te espera al final del Puente Pepita con un equipo entrenado expresamente para romper tu guardia.',
    isChainedOnly: true,
    parentEventTitle: 'El Primer Paso y el Desafío del Rival',
    options: [
      {
        id: 'opt-chain-rival-a',
        text: 'Anticipar su contragolpe con una cobertura elemental perfecta.',
        statRequirements: { skill: 38 },
        outcomeText: 'Sorprendes totalmente a tu rival. Reconoce tu superioridad estratégica con rabia contenida.',
        statEffects: { skill: 15, reputation: 12 },
        isVictory: true
      },
      {
        id: 'opt-chain-rival-b',
        text: 'Ofrecerle una revancha amistosa compartiendo tácticas de equipo.',
        statRequirements: { bond: 40 },
        outcomeText: 'Tu rival acepta a regañadientes y fortalecen una sana rivalidad que te motiva a mejorar.',
        statEffects: { bond: 20, reputation: 15 }
      }
    ]
  },
  {
    id: 'event-chain-rocket-revenge',
    title: 'Consecuencia: Emboscada Nocturna del Team Sombra',
    category: 'VILLAIN_TEAM',
    age: 14,
    location: 'Ruta 8 - Camino Solitario',
    description: 'Por haber encarado y expulsado a sus reclutas en el Monte Moon, un Comandante del Team Sombra interrumpe tu travesía nocturna buscando recuperar el terreno perdido.',
    isChainedOnly: true,
    parentEventTitle: 'Infiltración en la Cueva: Reclutas del Equipo Sombra',
    options: [
      {
        id: 'opt-chain-rocket-a',
        text: 'Enfrentar al Comandante en un intenso combate con desventaja de luz.',
        statRequirements: { skill: 45 },
        outcomeText: 'Luchas con valentía indestructible y derrotas a su Houndoom. ¡Consigues arrebatarle suministros de contrabando!',
        statEffects: { skill: 18, reputation: 20, money: 2000 },
        isVictory: true
      },
      {
        id: 'opt-chain-rocket-b',
        text: 'Utilizar el terreno oscuro para confundir a los ejecutivos y escapar victorioso.',
        statRequirements: { stamina: 45 },
        outcomeText: 'Logras poner a salvo a tu equipo y alertar a los Oficiales de Policía de la patrulla más cercana.',
        statEffects: { stamina: 10, bond: 15, reputation: 15 }
      }
    ]
  },
  {
    id: 'event-chain-casino-heist',
    title: 'Consecuencia: Torneo Clandestino del Casino Subterráneo',
    category: 'LIFESTYLE',
    age: 14,
    location: 'Guarida Subterránea - Ciudad Azulona',
    description: 'Los compradores a quienes vendiste los minerales del Monte Moon te invitan a un torneo ilegal de altas apuestas organizado en los sótanos del Casino.',
    isChainedOnly: true,
    parentEventTitle: 'Infiltración en la Cueva: Reclutas del Equipo Sombra',
    options: [
      {
        id: 'opt-chain-casino-a',
        text: 'Competir en el torneo subterráneo para ganar el premio gordo.',
        statRequirements: { skill: 45 },
        outcomeText: 'Ganas el torneo clandestino amasando una fortuna en Pokécupones, pero la policía te sigue la pista.',
        statEffects: { money: 6000, reputation: -10, skill: 10 },
        isVictory: true
      },
      {
        id: 'opt-chain-casino-b',
        text: 'Boicotear la competición ilegal y liberar a los Pokémon secuestrados.',
        statRequirements: { bond: 45 },
        outcomeText: 'Liberas a un Dratini retenido en las jaulas que inmediatamente decide unirse a tu equipo.',
        statEffects: { bond: 25, reputation: 20 },
        addPokemon: {
          name: 'Dratini Rescatado',
          species: 'Dratini',
          type: 'Dragón',
          level: 28,
          stage: 1,
          iconEmoji: '🐉'
        }
      }
    ]
  },
  {
    id: 'event-chain-fossil-revival',
    title: 'Consecuencia: Resurrección del Fósil Prehistórico',
    category: 'WILD_ENCOUNTER',
    age: 18,
    location: 'Isla Cánabar - Laboratorio Genético',
    description: 'El riguroso régimen de investigación al que sometiste a tu equipo permitió al Laboratorio Científico extraer ADN viable de una piedra mística y resucitar un Pokémon extinto.',
    isChainedOnly: true,
    parentEventTitle: 'El Enigma del Incienso y la Piedra Evolutiva',
    options: [
      {
        id: 'opt-chain-fossil-a',
        text: 'Dar la bienvenida a Aerodactyl en tu equipo de combate.',
        statRequirements: { skill: 55 },
        outcomeText: '¡Un imponente Aerodactyl despierta de su letargo ancestral y emite un rugido feroz aceptando tu liderazgo!',
        statEffects: { skill: 15, reputation: 22, legendaryScoreDelta: 10 },
        addPokemon: {
          name: 'Aerodactyl Prehistórico',
          species: 'Aerodactyl',
          type: 'Roca / Volador',
          level: 35,
          stage: 2,
          isLegendary: true,
          iconEmoji: '🦖'
        }
      },
      {
        id: 'opt-chain-fossil-b',
        text: 'Donar el espécimen resucitado al Museo de Ciencias para su preservación.',
        outcomeText: 'La comunidad científica internacional premia tu generosidad con una gran beca y reconocimiento mundial.',
        statEffects: { reputation: 35, money: 8000, legendaryScoreDelta: 10 }
      }
    ]
  },
  {
    id: 'event-chain-zapdos-flight',
    title: 'Consecuencia: El Despertar de Zapdos en la Central',
    category: 'WILD_ENCOUNTER',
    age: 19,
    location: 'Central de Energía Abandonada',
    description: 'Tus audaces maniobras tácticas frente al Lt. Surge resonaron en la red eléctrica, atrayendo al Ave Legendaria del Trueno, Zapdos, sobre la torre principal.',
    isChainedOnly: true,
    parentEventTitle: 'Desafío del Gimnasio Eléctrico: Medalla Trueno',
    options: [
      {
        id: 'opt-chain-zapdos-a',
        text: 'Lanzar una Ultra Ball con concentración absoluta bajo los relámpagos.',
        statRequirements: { skill: 65 },
        outcomeText: '¡Pipi-pip... Clic! ¡Logras capturar al Ave Legendaria Zapdos en una demostración mítica de habilidad!',
        statEffects: { skill: 25, reputation: 30, legendaryScoreDelta: 15 },
        addPokemon: {
          name: 'Zapdos',
          species: 'Zapdos',
          type: 'Eléctrico / Volador',
          level: 50,
          stage: 3,
          isLegendary: true,
          iconEmoji: '⚡'
        }
      },
      {
        id: 'opt-chain-zapdos-b',
        text: 'Sintonizar la frecuencia de tu equipo con la tormenta para recibir su bendición.',
        statRequirements: { bond: 60 },
        outcomeText: 'Zapdos descarga un rayo purificador sobre tu equipo y vuela libre hacia las nubes, dejando una fuerza insuperable.',
        statEffects: { bond: 30, skill: 20, stamina: 25, legendaryScoreDelta: 15 }
      }
    ]
  }
];

export const BRANCHING_EVENTS: GameEvent[] = [
  {
    id: 'event-fork-11',
    title: 'Bifurcación de Caminos: ¿Bosque Verde o Cueva Subterránea?',
    category: 'LIFESTYLE',
    age: 11,
    location: 'Encrucijada de Ciudad Verde',
    description: 'El mapa de Kanto se divide ante ti. Hacia el norte yace el espeso Bosque Verde repleto de copas frondosas. Hacia el este se abre la boca de la Cueva Diglett y el atajo hacia las colinas.',
    options: [
      {
        id: 'opt-fork-11-a',
        text: 'Tomar el atajo arbolado del Bosque Verde.',
        outcomeText: 'Te adentras bajo la sombra verde. Escuchas el revoloteo de insectos y avistas criaturas silvestres entre las hojas.',
        statEffects: { stamina: 5, bond: 5 },
        insertEventIdsOnSelect: ['event-branch-bosque-cazabichos']
      },
      {
        id: 'opt-fork-11-b',
        text: 'Adentrarte en los túneles subterráneos de la Cueva Diglett.',
        outcomeText: 'Enciendes tu linterna y desciendes al fresco ambiente subterráneo repleto de túneles rocosos.',
        statEffects: { skill: 5, money: 300 },
        insertEventIdsOnSelect: ['event-branch-diglett-cave']
      },
      {
        id: 'opt-fork-11-c',
        text: 'Trazar una ruta comercial hacia el Monte Moon aprovechando tu estrategia.',
        outcomeText: 'Tu agudo sentido comercial te permite encontrar a un mercader viajero en el camino rocoso.',
        statEffects: { money: 1000, reputation: 5 },
        specializationRequirement: 'Estrategia',
        specializationBonusText: 'Especialidad Estrategia',
        insertEventIdsOnSelect: ['event-branch-fossil-merchant']
      }
    ]
  },
  {
    id: 'event-fork-13',
    title: 'Ruta Hacia el Sur: ¿Crucero S.S. Anne o Túnel Roca?',
    category: 'LIFESTYLE',
    age: 13,
    location: 'Puerto Carmín / Entrada al Túnel Roca',
    description: 'Tus viajes te traen a la intersección del sur. Un billete de primera clase para el crucero S.S. Anne brilla en tu bolsillo, pero los montañeros te invitan a atravesar el imponente Túnel Roca.',
    options: [
      {
        id: 'opt-fork-13-a',
        text: 'Embarcarte en la lujosa gala del crucero S.S. Anne.',
        outcomeText: 'Subes por la alfombra roja del S.S. Anne entre aplausos y aristócratas entrenadores.',
        statEffects: { reputation: 10, money: 1000 },
        insertEventIdsOnSelect: ['event-branch-ss-anne-gala']
      },
      {
        id: 'opt-fork-13-b',
        text: 'Atravesar el peligroso y oscuro Túnel Roca con tu equipo.',
        outcomeText: 'Aceptas el reto de la montaña. La oscuridad de las cavernas pondrá a prueba el valor de tus Pokémon.',
        statEffects: { skill: 10, stamina: 10 },
        insertEventIdsOnSelect: ['event-branch-tunel-roca-onix']
      },
      {
        id: 'opt-fork-13-c',
        text: 'Visitar la Casa del Mar del Investigador Bill en el Cabo Celeste.',
        outcomeText: 'Viajas al norte de Ciudad Celeste donde el científico Bill realiza revolucionarios estudios de transferencia Pokémon.',
        statEffects: { bond: 15, skill: 8 },
        specializationRequirement: 'Crianza',
        specializationBonusText: 'Especialidad Crianza',
        insertEventIdsOnSelect: ['event-branch-casa-bill']
      }
    ]
  },
  {
    id: 'event-fork-15',
    title: 'Operaciones Urbanas: ¿Casino Subterráneo o Dojo Karate?',
    category: 'LIFESTYLE',
    age: 15,
    location: 'Ciudad Azulona / Ciudad Azafrán',
    description: 'Llegas al centro neurálgico de Kanto. Los carteles de neón del Casino de Azulona ocultan secretos oscuros, mientras que el tradicional Dojo de Azafrán desafía a los mejores luchadores.',
    options: [
      {
        id: 'opt-fork-15-a',
        text: 'Investigar las operaciones clandestinas bajo el Casino de Azulona.',
        outcomeText: 'Sigues la pista de los sospechosos de traje oscuro y encuentras un pasadizo secreto tras una máquina tragaperras.',
        statEffects: { skill: 12, money: 2000 },
        insertEventIdsOnSelect: ['event-branch-casino-infiltration']
      },
      {
        id: 'opt-fork-15-b',
        text: 'Retar a los Maestros de Artes Marciales en el Dojo Karate de Azafrán.',
        outcomeText: 'Cruzas las puertas de madera del Dojo donde el Gran Maestro Karate te desafía a una prueba de honor.',
        statEffects: { skill: 15, stamina: 10 },
        insertEventIdsOnSelect: ['event-branch-dojo-karate']
      },
      {
        id: 'opt-fork-15-c',
        text: 'Organizar una expedición de captura salvaje en la Zona Safari.',
        outcomeText: 'Preparas 30 Safari Balls especiales y te adentras en la reserva natural de Ciudad Fucsia.',
        statEffects: { bond: 12, reputation: 10 },
        specializationRequirement: 'Captura',
        specializationBonusText: 'Especialidad Captura',
        insertEventIdsOnSelect: ['event-branch-safari-expedition']
      }
    ]
  },
  {
    id: 'event-fork-17',
    title: 'Expedición de Archipiélago y Energía: ¿Islas Espuma o Central Abandonada?',
    category: 'LIFESTYLE',
    age: 17,
    location: 'Mar de Kanto / Ruta 10',
    description: 'Con siete medallas en tu estuche, debes afinar la preparación de tu equipo. Los marineros hablan de cavernas de hielo en las Islas Espuma, mientras que los ingenieros alertan de extrañas descargas en la Central Eléctrica.',
    options: [
      {
        id: 'opt-fork-17-a',
        text: 'Navegar hacia las gélidas cavernas de las Islas Espuma.',
        outcomeText: 'Surcas las frías olas del mar de Kanto y desembarcas frente a los témpanos helados de la caverna.',
        statEffects: { bond: 15, stamina: 15 },
        insertEventIdsOnSelect: ['event-branch-islas-espuma']
      },
      {
        id: 'opt-fork-17-b',
        text: 'Infiltrarte en la misteriosa Central de Energía Abandonada.',
        outcomeText: 'Caminas entre generadores oxidados y cables de alto voltaje donde el aire vibra con electricidad estática.',
        statEffects: { skill: 18, reputation: 12 },
        insertEventIdsOnSelect: ['event-branch-central-energia']
      },
      {
        id: 'opt-fork-17-c',
        text: 'Participar en la carrera de velocidad en la Bici-Ruta 16.',
        outcomeText: 'Pones a prueba la fuerza de tu equipo en un circuito de combate a alta velocidad.',
        statEffects: { skill: 20, stamina: 20 },
        specializationRequirement: 'Combate',
        specializationBonusText: 'Especialidad Combate',
        insertEventIdsOnSelect: ['event-branch-bici-ruta-speed']
      }
    ]
  }
];

export const EXPANDED_REGIONAL_EVENTS: GameEvent[] = [
  {
    id: 'event-branch-bosque-cazabichos',
    title: 'Desafío del Rey Cazabichos en el Bosque Verde',
    category: 'WILD_ENCOUNTER',
    age: 11,
    location: 'Bosque Verde - Claro del Roble',
    description: 'Un joven entrenador con red de mariposas salta a tu paso. "¡Nadie cruza mi claro sin combatir contra mis Pokémon tipo Bicho!"',
    options: [
      {
        id: 'opt-bc-a',
        text: 'Demostrar la velocidad de tu equipo en un combate rápido.',
        statRequirements: { skill: 25 },
        outcomeText: 'Superas velozmente a sus Butterfree. Impresionado, el Cazabichos te regala una Veloz Ball.',
        statEffects: { skill: 8, money: 600 },
        addItemId: 'quick-ball',
        addItemQty: 1,
        isVictory: true
      },
      {
        id: 'opt-bc-b',
        text: 'Ayudarle a catalogar la fauna de insectos y criar a su Beedrill.',
        outcomeText: 'Compartes conocimientos de crianza y te obsequia un Beedrill leal de su colección.',
        statEffects: { bond: 12, reputation: 8 },
        addPokemon: {
          name: 'Beedrill',
          species: 'Beedrill',
          type: 'Bicho / Veneno',
          level: 15,
          stage: 2,
          iconEmoji: '🐝'
        }
      }
    ]
  },
  {
    id: 'event-branch-diglett-cave',
    title: 'El Gran Terremoto en la Cueva Diglett',
    category: 'WILD_ENCOUNTER',
    age: 11,
    location: 'Cueva Diglett - Túnel Profundo',
    description: 'El suelo retumba violentamente. Un Dugtrio salvaje emerge de la tierra creando una grieta que revela minerales brillantes.',
    options: [
      {
        id: 'opt-dc-a',
        text: 'Capturar al Dugtrio veloz antes de que se entierre de nuevo.',
        statRequirements: { skill: 28 },
        outcomeText: '¡Pipi-pip... Clic! Capturas a un Dugtrio veloz que se convierte en la fuerza terrestre de tu equipo.',
        statEffects: { skill: 10, stamina: -5 },
        addPokemon: {
          name: 'Dugtrio',
          species: 'Dugtrio',
          type: 'Tierra',
          level: 18,
          stage: 2,
          iconEmoji: '⛏️'
        }
      },
      {
        id: 'opt-dc-b',
        text: 'Recolectar las Piedras de Arena descubiertas en la grieta.',
        outcomeText: 'Encuentras Pepitas de oro y Pepitas de roca que puedes vender por un valor considerable.',
        statEffects: { money: 2000, stamina: 10 }
      }
    ]
  },
  {
    id: 'event-branch-fossil-merchant',
    title: 'El Mercado Clandestino de Fósiles y Piedras Evolutivas',
    category: 'LIFESTYLE',
    age: 11,
    location: 'Monte Moon - Galería Oeste',
    description: 'Un geólogo ambulante tiene expuestos fósiles marinos antiguos y piedras de evolución centelleantes.',
    options: [
      {
        id: 'opt-fm-a',
        text: 'Comprar un Fósil Hélix misterioso para el futuro.',
        statRequirements: { money: 1000 },
        outcomeText: 'Adquieres la reliquia marina prehistórica conservándola cuidadosamente en tu mochila.',
        statEffects: { money: -1000, reputation: 10 }
      },
      {
        id: 'opt-fm-b',
        text: 'Negociar por una Piedra Fuego para potenciar a tu equipo.',
        statRequirements: { money: 500 },
        outcomeText: 'Tu capacidad de negociación te permite conseguir un mineral evolutivo a excelente precio.',
        statEffects: { money: -500, skill: 10, bond: 10 }
      }
    ]
  },
  {
    id: 'event-branch-ss-anne-gala',
    title: 'Gran Torneo del Capitán a Bordo del S.S. Anne',
    category: 'LEAGUE_TOURNAMENT',
    age: 13,
    location: 'S.S. Anne - Cubierta Principal',
    description: 'El Capitán del barco abre el torneo de la cubierta entre un público enardecido. "¡El ganador recibirá la MO Corte y los honores del barco!"',
    options: [
      {
        id: 'opt-ssa-a',
        text: 'Barrer el torneo con tácticas ofensivas impecables.',
        statRequirements: { skill: 38 },
        outcomeText: 'Derrotas a todos los contendientes. El Capitán te entrega la MO Corte con aplausos clamorosos.',
        statEffects: { skill: 15, reputation: 18, money: 2500 },
        isVictory: true
      },
      {
        id: 'opt-ssa-b',
        text: 'Invitar al Capitán a un duelo de exhibición amistoso.',
        statRequirements: { bond: 35 },
        outcomeText: 'El veterano marino admira el Vínculo con tu equipo y te recompensa con la MO Corte y un abrigo marino.',
        statEffects: { bond: 20, reputation: 15 }
      }
    ]
  },
  {
    id: 'event-branch-tunel-roca-onix',
    title: 'Guardián de Piedra en la Oscuridad del Túnel Roca',
    category: 'WILD_ENCOUNTER',
    age: 13,
    location: 'Túnel Roca - Galería Central',
    description: 'En medio de la penumbra sin luz, un Onix gigante durmiente bloquea el estrecho paso. Sus escamas de roca destellan con dureza.',
    options: [
      {
        id: 'opt-tro-a',
        text: 'Despertarlo con respeto y ganarte su lealtad en combate.',
        statRequirements: { skill: 38 },
        outcomeText: 'Tras un feroz combate en la cueva, Onix baja su cabeza aceptando ser capturado.',
        statEffects: { skill: 12, reputation: 10 },
        addPokemon: {
          name: 'Onix Tenebroso',
          species: 'Onix',
          type: 'Roca / Tierra',
          level: 25,
          stage: 1,
          iconEmoji: '🐍'
        }
      },
      {
        id: 'opt-tro-b',
        text: 'Usar un Incienso Suave para permitirle dormir mientras pasas sigilosamente.',
        outcomeText: 'Cruzas el pasaje sin alterarlo. Demuestras sensibilidad ambiental y respeto por la fauna salvaje.',
        statEffects: { bond: 18, stamina: 10 }
      }
    ]
  },
  {
    id: 'event-branch-casa-bill',
    title: 'El Experimento de Fusión de Bill en el Cabo Celeste',
    category: 'LIFESTYLE',
    age: 13,
    location: 'Casa del Mar - Cabo Celeste',
    description: 'Entras al laboratorio y encuentras a un Clefairy parlante. ¡Es el investigador Bill atrapado accidentalmente en su propia máquina teletransportadora!',
    options: [
      {
        id: 'opt-cb-a',
        text: 'Operar el panel de control del PC para revertir la fusión.',
        statRequirements: { skill: 30 },
        outcomeText: '¡Éxito! Bill regresa a su forma humana agradecido y te regala un Ticket para el S.S. Anne y un Eevee.',
        statEffects: { skill: 10, reputation: 15, money: 1500 },
        addPokemon: {
          name: 'Eevee',
          species: 'Eevee',
          type: 'Normal',
          level: 20,
          stage: 1,
          iconEmoji: '🦊'
        }
      },
      {
        id: 'opt-cb-b',
        text: 'Analizar el software del Teletransportador para aprender su funcionamiento.',
        statRequirements: { skill: 35 },
        outcomeText: 'Bill queda deslumbrado por tu intelecto y te nombra su asistente honorario en Kanto.',
        statEffects: { skill: 15, reputation: 20 }
      }
    ]
  },
  {
    id: 'event-branch-casino-infiltration',
    title: 'Asalto a la Bóveda del Casino de Azulona',
    category: 'VILLAIN_TEAM',
    age: 15,
    location: 'Guarida Subterránea - Ciudad Azulona',
    description: 'Encuentras la puerta acorazada de la bóveda del Team Rocket. Los guardias patrullan con marcadores láser y Pokéballs de asalto.',
    options: [
      {
        id: 'opt-ci-a',
        text: 'Provocar un cortocircuito en los paneles de control y tomar la bóveda.',
        statRequirements: { skill: 45 },
        outcomeText: 'Desarmas la seguridad, recuperas fondos incautados y liberas a un Porygon digital retenido.',
        statEffects: { skill: 18, money: 4000 },
        addPokemon: {
          name: 'Porygon',
          species: 'Porygon',
          type: 'Normal',
          level: 28,
          stage: 1,
          iconEmoji: '👾'
        },
        isVictory: true
      },
      {
        id: 'opt-ci-b',
        text: 'Infiltrarte en silencio y llevarte los planos del Silph Scope.',
        statRequirements: { stamina: 40 },
        outcomeText: 'Consigues los planos para detectar fantasmas y escapas antes de que den la alarma.',
        statEffects: { skill: 15, reputation: 15 }
      }
    ]
  },
  {
    id: 'event-branch-silph-co-azafran',
    title: 'Liberación de Silph S.A. en Ciudad Azafrán: Duelo contra Giovanni',
    category: 'VILLAIN_TEAM',
    age: 16,
    location: 'Silph S.A. - Planta Presidencial (Ciudad Azafrán)',
    description: 'El Team Rocket ha tomado el rascacielos de Silph S.A. en Ciudad Azafrán. Giovanni, el temible líder del Team Rocket, acorrala al Presidente de la compañía para apoderarse del prototipo secreto de la Poké Ball infalible.',
    options: [
      {
        id: 'opt-silph-giovanni-a',
        text: 'Enfrentar directamente a Giovanni en un combate decisivo por el control de Silph S.A.',
        statRequirements: { skill: 50 },
        outcomeText: '¡DERROTAS A GIOVANNI! Tras un intenso combate, Giovanni huye jurando venganza. El agradecido Presidente de Silph S.A. te entrega personalmente el prototipo definitivo: ¡1x Master Ball!',
        statEffects: { skill: 25, reputation: 35, money: 6000 },
        addItemId: 'master-ball',
        addItemQty: 1,
        isVictory: true
      },
      {
        id: 'opt-silph-giovanni-b',
        text: 'Sabotear las líneas de suministro del rascacielos acorralando al Team Rocket.',
        statRequirements: { stamina: 50 },
        outcomeText: 'Irrumpes en el despacho presidencial obligando a Giovanni a huir. El Presidente de Silph S.A. te recompensa con la legendaria ¡1x Master Ball!',
        statEffects: { stamina: 22, reputation: 30, money: 5000 },
        addItemId: 'master-ball',
        addItemQty: 1,
        isVictory: true
      }
    ]
  },
  {
    id: 'event-branch-dojo-karate',
    title: 'El Duelo del Cinturón Negro: Hitmonlee vs Hitmonchan',
    category: 'LEAGUE_TOURNAMENT',
    age: 15,
    location: 'Dojo Karate - Ciudad Azafrán',
    description: 'El Maestro Karate te espera descalzo sobre el tatami. "Si superas mi estilo de combate, podrás elegir a uno de mis discípulos como compañero".',
    options: [
      {
        id: 'opt-dk-a',
        text: 'Elegir las patadas relámpago de Hitmonlee tras ganar el duelo.',
        statRequirements: { skill: 48 },
        outcomeText: 'Derrotas al Maestro con técnica limpia. Te otorga la custodia del ágil Hitmonlee.',
        statEffects: { skill: 20, reputation: 15 },
        addPokemon: {
          name: 'Hitmonlee',
          species: 'Hitmonlee',
          type: 'Lucha',
          level: 30,
          stage: 1,
          iconEmoji: '🦵'
        },
        isVictory: true
      },
      {
        id: 'opt-dk-b',
        text: 'Elegir los puñetazos de fuego y hielo de Hitmonchan.',
        statRequirements: { stamina: 45 },
        outcomeText: 'Tus bloqueos perfectos superan la prueba. Hitmonchan se une con entusiasmo a tu equipo.',
        statEffects: { skill: 20, stamina: 15 },
        addPokemon: {
          name: 'Hitmonchan',
          species: 'Hitmonchan',
          type: 'Lucha',
          level: 30,
          stage: 1,
          iconEmoji: '🥊'
        },
        isVictory: true
      }
    ]
  },
  {
    id: 'event-branch-safari-expedition',
    title: 'Cacería del Dratini Dorado en la Zona Safari',
    category: 'WILD_ENCOUNTER',
    age: 15,
    location: 'Zona Safari - Lago Secreto',
    description: 'Las aguas cristalinas del sector 4 de la reserva destellan. Las guías locales afirman que un rarísimo Dratini nada bajo los lirios.',
    options: [
      {
        id: 'opt-se-a',
        text: 'Usar Cebo de Baya y lanzar una Safari Ball con precisión milimétrica.',
        statRequirements: { skill: 48 },
        outcomeText: '¡Pipi-pip... Clic! Capturas con éxito a un majestuoso Dratini en la reserva.',
        statEffects: { skill: 15, bond: 15 },
        addPokemon: {
          name: 'Dratini Safari',
          species: 'Dratini',
          type: 'Dragón',
          level: 26,
          stage: 1,
          iconEmoji: '🐉'
        }
      },
      {
        id: 'opt-se-b',
        text: 'Explorar la Cabaña del Guardián y encontrar los Dientes de Oro perdidos.',
        outcomeText: 'Devuelves los Dientes de Oro al Guardián. En gratitud te obsequia la MO Surf y 3,000 Pokécupones.',
        statEffects: { reputation: 25, money: 3000 }
      }
    ]
  },
  {
    id: 'event-branch-islas-espuma',
    title: 'Cueva Helada y el Rescate de Lapras en las Islas Espuma',
    category: 'WILD_ENCOUNTER',
    age: 17,
    location: 'Islas Espuma - Caverna Glacial',
    description: 'Las corrientes marinas te arrastran al interior de una cueva de estalactitas heladas. Un bondadoso Lapras intenta guiar a los navegantes perdidos.',
    options: [
      {
        id: 'opt-ie-a',
        text: 'Ofrecerle refugio y compañía en tu equipo de combate.',
        statRequirements: { bond: 55 },
        outcomeText: 'Lapras canta una dulce melodía y se une felizmente a tu equipo para surcar los océanos.',
        statEffects: { bond: 25, stamina: 15 },
        addPokemon: {
          name: 'Lapras',
          species: 'Lapras',
          type: 'Agua / Hielo',
          level: 38,
          stage: 1,
          iconEmoji: '🦕'
        }
      },
      {
        id: 'opt-ie-b',
        text: 'Sincronizar el aura del equipo para soportar las temperaturas bajo cero.',
        statRequirements: { stamina: 55 },
        outcomeText: 'Fortaleces la resistencia física de tu equipo ante las inclemencias más extremas.',
        statEffects: { stamina: 25, bond: 20 }
      }
    ]
  },
  {
    id: 'event-branch-central-energia',
    title: 'Sobrecarga de Alto Voltaje en la Central Abandonada',
    category: 'WILD_ENCOUNTER',
    age: 17,
    location: 'Central de Energía Abandonada',
    description: 'Relámpagos amarillos cruzan las turbinas. Un grupo de Electabuzz y Magneton salvajes genera una tormenta magnética imponente.',
    options: [
      {
        id: 'opt-ce-a',
        text: 'Capturar al poderoso Electabuzz líder de la manada.',
        statRequirements: { skill: 55 },
        outcomeText: 'Tras un electrizante duelo de velocidad, atrapas a Electabuzz con una Ultra Ball.',
        statEffects: { skill: 20, reputation: 15 },
        addPokemon: {
          name: 'Electabuzz',
          species: 'Electabuzz',
          type: 'Eléctrico',
          level: 40,
          stage: 2,
          iconEmoji: '⚡'
        }
      },
      {
        id: 'opt-ce-b',
        text: 'Absorber la energía magnética excedente para recargar tus dispositivos.',
        outcomeText: 'Consigues reparar generadores antiguos y obtienes baterías de alto valor de mercado.',
        statEffects: { money: 4000, skill: 15 }
      }
    ]
  },
  {
    id: 'event-branch-bici-ruta-speed',
    title: 'El Gran Circuito de la Bici-Ruta 16',
    category: 'LEAGUE_TOURNAMENT',
    age: 17,
    location: 'Ruta 16 - Cuesta de la Montaña',
    description: 'La banda de motoristas de Kanto te desafía a una carrera en pendiente pronunciada con combates sobre ruedas.',
    options: [
      {
        id: 'opt-brs-a',
        text: 'Acelerar a fondo y vencer al líder de los motoristas.',
        statRequirements: { skill: 55 },
        outcomeText: 'Cruzas la meta en primer lugar. Ganándote el respeto absoluto de toda la fraternidad urbana.',
        statEffects: { skill: 22, reputation: 25, money: 4000 },
        isVictory: true
      },
      {
        id: 'opt-brs-b',
        text: 'Realizar maniobras acrobáticas con tu Pokémon Volador.',
        statRequirements: { reputation: 50 },
        outcomeText: 'Sorprendes a la multitud con un espectáculo aéreo sensacional.',
        statEffects: { reputation: 30, bond: 15 }
      }
    ]
  }
];

export const MASTER_PROTOCOL_EVENTS: GameEvent[] = [
  {
    id: 'event-master-protocol-100',
    title: 'PROTOCOLO SECLU-100: El Escáner Cuántico del Profesor Oak y la Cumbre de Kanto',
    category: 'LEAGUE_TOURNAMENT',
    age: 28,
    location: 'Laboratorio Central de Pueblo Paleta - Sede Cuántica',
    description: 'El Profesor Oak y el Alto Mando han abierto el Proyecto Transcendente Kanto. Solo los entrenadores con un nivel de maestría excepcional (Habilidad, Vínculo y Popularidad elevadas) pueden desbloquear la transmisión cuántica de datos y sincronizar el 100% de la Pokédex de la región.',
    options: [
      {
        id: 'opt-mp-100-a',
        text: 'Desplegar el Protocolo Maestro 100%: Escáner Cuántico y Sincronización Total de Kanto.',
        statRequirements: { skill: 85, bond: 85, reputation: 85 },
        outcomeText: '¡MISIÓN MAESTRA COMPLETADA! El escáner cuántico de Oak registra los 151 Pokémon de Kanto en tu Pokédex, te concede la Medalla Gran Maestro y convoca a Mew para unirse a tu legado supremo.',
        statEffects: { skill: 30, bond: 30, reputation: 40, money: 10000, legendaryScoreDelta: 15 },
        awardBadgeId: 'badge-master-100',
        addPokemon: {
          name: 'Mew',
          species: 'Mew',
          type: 'Psíquico',
          level: 80,
          stage: 1,
          isLegendary: true,
          isShiny: true,
          iconEmoji: '✨'
        },
        isVictory: true
      },
      {
        id: 'opt-mp-100-b',
        text: 'Contribuir con tus apuntes de campo al archivo estándar de la región.',
        outcomeText: 'Aportas valiosa información al Profesor Oak y te otorga una subvención investigadora de $8,000.',
        statEffects: { money: 8000, skill: 15, reputation: 20 }
      }
    ]
  }
];

export const ALL_EVENTS: GameEvent[] = [
  ...GAME_EVENTS,
  ...BRANCHING_EVENTS,
  ...EXPANDED_REGIONAL_EVENTS,
  ...MASTER_PROTOCOL_EVENTS,
  ...CHAINED_EVENTS
];
