export const TYPE_COLORS: Record<string, { bg: string; text: string; border: string; solidBg: string }> = {
  Planta: { bg: 'bg-emerald-100', text: 'text-emerald-950', border: 'border-emerald-600', solidBg: 'bg-emerald-600 text-white border-emerald-800' },
  Veneno: { bg: 'bg-purple-100', text: 'text-purple-950', border: 'border-purple-600', solidBg: 'bg-purple-700 text-white border-purple-900' },
  Fuego: { bg: 'bg-amber-100', text: 'text-amber-950', border: 'border-amber-600', solidBg: 'bg-orange-600 text-white border-orange-800' },
  Agua: { bg: 'bg-blue-100', text: 'text-blue-950', border: 'border-blue-600', solidBg: 'bg-blue-600 text-white border-blue-800' },
  Volador: { bg: 'bg-indigo-100', text: 'text-indigo-950', border: 'border-indigo-600', solidBg: 'bg-indigo-600 text-white border-indigo-800' },
  Bicho: { bg: 'bg-lime-100', text: 'text-lime-950', border: 'border-lime-600', solidBg: 'bg-lime-700 text-white border-lime-900' },
  Normal: { bg: 'bg-stone-200', text: 'text-stone-900', border: 'border-stone-500', solidBg: 'bg-stone-600 text-white border-stone-800' },
  Eléctrico: { bg: 'bg-yellow-100', text: 'text-yellow-950', border: 'border-yellow-600', solidBg: 'bg-yellow-500 text-gray-950 border-yellow-700' },
  Tierra: { bg: 'bg-amber-200', text: 'text-amber-950', border: 'border-amber-800', solidBg: 'bg-amber-800 text-white border-amber-950' },
  Roca: { bg: 'bg-stone-300', text: 'text-stone-950', border: 'border-stone-800', solidBg: 'bg-stone-700 text-white border-stone-900' },
  Hada: { bg: 'bg-pink-100', text: 'text-pink-950', border: 'border-pink-600', solidBg: 'bg-pink-600 text-white border-pink-800' },
  Lucha: { bg: 'bg-orange-100', text: 'text-orange-950', border: 'border-orange-600', solidBg: 'bg-orange-700 text-white border-orange-900' },
  Psíquico: { bg: 'bg-rose-100', text: 'text-rose-950', border: 'border-rose-600', solidBg: 'bg-rose-600 text-white border-rose-800' },
  Acero: { bg: 'bg-slate-200', text: 'text-slate-900', border: 'border-slate-600', solidBg: 'bg-slate-600 text-white border-slate-800' },
  Hielo: { bg: 'bg-cyan-100', text: 'text-cyan-950', border: 'border-cyan-600', solidBg: 'bg-cyan-600 text-white border-cyan-800' },
  Fantasma: { bg: 'bg-violet-200', text: 'text-violet-950', border: 'border-violet-700', solidBg: 'bg-violet-800 text-white border-violet-950' },
  Dragón: { bg: 'bg-teal-200', text: 'text-teal-950', border: 'border-teal-700', solidBg: 'bg-teal-800 text-white border-teal-950' },
  Estelar: { bg: 'bg-amber-100', text: 'text-amber-950', border: 'border-amber-500', solidBg: 'bg-amber-500 text-gray-950 border-amber-700' },
};

export function getTypeColorStyle(type: string) {
  return TYPE_COLORS[type] || { bg: 'bg-gray-200', text: 'text-gray-900', border: 'border-gray-600', solidBg: 'bg-gray-800 text-white border-gray-900' };
}
