export interface TrainerAvatar {
  id: string;
  name: string;
  title: string;
  spriteUrl: string;
  description: string;
  iconEmoji: string;
}

export const TRAINER_AVATARS: TrainerAvatar[] = [
  {
    id: 'avatar-red',
    name: 'Red (Rojo)',
    title: 'Héroe de Kanto (Rojo Fuego)',
    spriteUrl: 'https://play.pokemonshowdown.com/sprites/trainers/red-gen3.png',
    description: 'El legendario entrenador de Pueblo Paleta. Silencioso y enfocado en la victoria.',
    iconEmoji: '🧢'
  },
  {
    id: 'avatar-leaf',
    name: 'Leaf (Verde)',
    title: 'Heroína de Kanto (Verde Hoja)',
    spriteUrl: 'https://play.pokemonshowdown.com/sprites/trainers/leaf-gen3.png',
    description: 'Entrenadora perseverante e intuitiva con un vínculo especial con la naturaleza.',
    iconEmoji: '🧢'
  },
  {
    id: 'avatar-blue',
    name: 'Blue (Azul / Rival)',
    title: 'Ex-Campeón de Kanto',
    spriteUrl: 'https://play.pokemonshowdown.com/sprites/trainers/blue-gen3.png',
    description: 'Rival audaz e hiper-competitivo de temperamento implacable.',
    iconEmoji: '⚡'
  }
];

export function getAvatarById(id: string): TrainerAvatar {
  return (
    TRAINER_AVATARS.find((a) => a.id === id) || TRAINER_AVATARS[0]
  );
}

