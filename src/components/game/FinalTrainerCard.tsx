import React, { useEffect, useRef, useState } from 'react';
import { useGame } from '../../context/GameContext';
import confetti from 'canvas-confetti';
import { toPng } from 'html-to-image';
import { Trophy, Share2, Download, RotateCcw, Award, Sword, Sparkles, Home, Star, Send, ExternalLink, Copy, Check } from 'lucide-react';
import { REGIONAL_BADGES } from '../../data/badges';
import { getAvatarById } from '../../data/avatars';
import { ACHIEVEMENTS } from '../../data/achievements';
import { findPokemonByName } from '../../data/kantoPokedex';
import { calculateTotalCareerScore } from '../../utils/scoreCalculator';

export const FinalTrainerCard: React.FC = () => {
  const { state, calculateLegacyTier, resetGame, returnToMenu, getEarnedBadges } = useGame();
  const { trainerName, avatarId, specialization, stats, career } = state;
  const currentAvatar = getAvatarById(avatarId);
  const [copiedText, setCopiedText] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  const scoreResult = calculateTotalCareerScore(state);
  const finalRank = calculateLegacyTier(career.legendaryScore);
  const earnedBadges = getEarnedBadges();
  const totalGames = career.victories + career.defeats;
  const winRate = totalGames > 0 ? Math.round((career.victories / totalGames) * 100) : 100;
  const unlockedAchievementIds = career.unlockedAchievements || [];
  const unlockedAchievementsList = ACHIEVEMENTS.filter(a => unlockedAchievementIds.includes(a.id));

  useEffect(() => {
    try {
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 }
      });
    } catch {
      // Ignore
    }
  }, []);

  const getShareableText = () => {
    return `🏆 ¡MI FICHA Y PUNTUACIÓN EN POKÉROAD! 🏆
--------------------------------------------
👤 Entrenador: ${trainerName} (${specialization})
⭐ Rango Titular: ${scoreResult.rankTitle}
🏅 CALIFICACIÓN: RANGO ${scoreResult.rankGrade}
🎯 PUNTUACIÓN TOTAL: ${scoreResult.totalScore.toLocaleString('es-ES')} PTS (${scoreResult.percentageScore}% Maestría)

📊 Atributos y Capital: ${scoreResult.statsPts} Pts
🎖️ Medallas Ganadas (${earnedBadges.length}/8): ${scoreResult.badgesPts} Pts
⚔️ Combates (${career.victories}V / ${career.defeats}D - ${winRate}%): ${scoreResult.battlesPts} Pts
🐲 Equipo y Pokédex: ${scoreResult.pokedexPts} Pts
🗿 Estatua Leyenda (${career.legendaryScore}%): ${scoreResult.legendaryPts} Pts

¿Podrás superar mi marca? ¡Juega gratis en PokéRoad!`;
  };

  const handleNativeShare = async () => {
    const text = getShareableText();
    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share({
          title: `Tarjeta de Entrenador de ${trainerName} - PokéRoad`,
          text: text,
          url: window.location.href
        });
      } catch (err) {
        if ((err as Error).name !== 'AbortError') {
          handleCopySummary();
        }
      }
    } else {
      handleCopySummary();
    }
  };

  const handleShareWhatsApp = () => {
    const text = encodeURIComponent(getShareableText());
    window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
  };

  const handleShareTwitter = () => {
    const text = encodeURIComponent(`🏆 ¡Logré ${scoreResult.totalScore.toLocaleString('es-ES')} PTS en PokéRoad! Rango ${scoreResult.rankGrade} - ${scoreResult.rankTitle} (${earnedBadges.length}/8 Medallas). ¿Te atreves a superar mi puntuación? 🎮⚡`);
    window.open(`https://twitter.com/intent/tweet?text=${text}`, '_blank');
  };

  const handleCopySummary = () => {
    const text = getShareableText();
    navigator.clipboard.writeText(text);
    setCopiedText(true);
    setTimeout(() => setCopiedText(false), 3000);
  };

  const handleDownloadCard = async () => {
    if (!cardRef.current) return;
    try {
      setIsExporting(true);
      const dataUrl = await toPng(cardRef.current, { cacheBust: true, pixelRatio: 2 });
      const link = document.createElement('a');
      link.download = `TrainerCard_${trainerName}_Pokeroad.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error('Error generating image export:', err);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-6 font-mono animate-fade-in text-gray-800">
      {/* Golden Banner */}
      <div className="bg-amber-100 border-2 border-amber-600 rounded-md p-5 text-center shadow-md relative overflow-hidden font-mono">
        <div className="inline-flex items-center space-x-2 px-3 py-0.5 rounded bg-amber-200 border border-amber-700 text-amber-900 mb-2 text-xs font-black">
          <Trophy className="w-4 h-4 text-amber-800" />
          <span>FIN DE LA CARRERA A LOS 30 AÑOS</span>
        </div>

        <h2 className="text-xl sm:text-3xl font-black tracking-tight text-amber-950 uppercase mb-2">
          {finalRank}
        </h2>

        <p className="text-xs text-amber-900 max-w-xl mx-auto leading-relaxed font-bold">
          {career.legendaryScore >= 90
            ? '¡Enhorabuena! Has alcanzado la inmortalidad. Tu estatua de oro presidirá el Salón de la Fama de la Liga Pokémon por generaciones.'
            : 'Has completado una trayectoria notable. La comunidad de entrenadores recordará con respeto tu nombre y tus batallas.'}
        </p>
      </div>

      {/* Primary Share Options Bar */}
      <div className="bg-gradient-to-r from-red-600 via-red-500 to-red-600 border-4 border-gray-900 rounded-md p-5 text-white shadow-xl space-y-3 font-mono">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 border-b border-red-400/40 pb-3">
          <div className="flex items-center space-x-3 text-center sm:text-left">
            <div className="w-10 h-10 rounded-full bg-white text-red-600 flex items-center justify-center font-black text-xl shadow-md shrink-0">
              📢
            </div>
            <div>
              <h3 className="text-base font-black tracking-wide uppercase text-amber-200 drop-shadow">
                ¡COMPARTIR MI RESULTADO Y PUNTUACIÓN!
              </h3>
              <p className="text-xs text-red-100 font-bold">
                Muestra tu récord de {scoreResult.totalScore.toLocaleString('es-ES')} Pts (Rango {scoreResult.rankGrade}) a tus amigos.
              </p>
            </div>
          </div>
          {typeof navigator !== 'undefined' && 'share' in navigator && (
            <button
              onClick={handleNativeShare}
              className="px-4 py-2 bg-amber-400 hover:bg-amber-300 text-gray-900 rounded font-black text-xs uppercase border-2 border-gray-900 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none flex items-center gap-1.5 shrink-0 transition-all cursor-pointer"
            >
              <Share2 className="w-4 h-4" />
              <span>COMPARTIR EN DISPOSITIVO</span>
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 pt-1">
          <button
            onClick={handleShareWhatsApp}
            className="px-3 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded font-extrabold text-xs uppercase border-2 border-gray-900 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none flex items-center justify-center gap-1.5 transition-all cursor-pointer"
          >
            <Send className="w-4 h-4" />
            <span>WHATSAPP</span>
          </button>

          <button
            onClick={handleShareTwitter}
            className="px-3 py-2.5 bg-sky-500 hover:bg-sky-400 text-white rounded font-extrabold text-xs uppercase border-2 border-gray-900 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none flex items-center justify-center gap-1.5 transition-all cursor-pointer"
          >
            <ExternalLink className="w-4 h-4" />
            <span>TWITTER / X</span>
          </button>

          <button
            onClick={handleCopySummary}
            className="px-3 py-2.5 bg-white hover:bg-gray-100 text-gray-900 rounded font-extrabold text-xs uppercase border-2 border-gray-900 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none flex items-center justify-center gap-1.5 transition-all cursor-pointer"
          >
            {copiedText ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
            <span>{copiedText ? '¡COPIADO!' : 'COPIAR TEXTO'}</span>
          </button>

          <button
            onClick={handleDownloadCard}
            disabled={isExporting}
            className="px-3 py-2.5 bg-yellow-400 hover:bg-yellow-300 text-gray-900 rounded font-extrabold text-xs uppercase border-2 border-gray-900 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none flex items-center justify-center gap-1.5 transition-all cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>{isExporting ? 'GENERANDO...' : 'DESCARGAR TARJETA (PNG)'}</span>
          </button>
        </div>
      </div>

      {/* Exportable Trainer Card Component */}
      <div 
        ref={cardRef}
        className="bg-white border-4 border-gray-900 rounded-md p-4 sm:p-6 shadow-2xl text-gray-800 relative space-y-6 font-mono overflow-x-auto touch-scroll"
      >
        {/* Card Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b-2 border-gray-900 pb-5">
          <div className="flex items-center space-x-4">
            <div className="w-14 h-14 bg-gray-50 border-2 border-gray-800 rounded-md relative overflow-hidden flex items-center justify-center shrink-0 shadow-sm">
              <div className="absolute top-0 left-0 right-0 h-1 bg-red-600"></div>
              <img
                src={currentAvatar.spriteUrl}
                alt={currentAvatar.name}
                className="w-12 h-12 object-contain filter drop-shadow pt-1 [image-rendering:pixelated]"
                referrerPolicy="no-referrer"
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.style.display = 'none';
                  const fb = e.currentTarget.parentElement?.querySelector('.avatar-fallback');
                  if (fb) (fb as HTMLElement).style.display = 'flex';
                }}
              />
              <span className="avatar-fallback hidden text-2xl items-center justify-center font-bold">
                {currentAvatar.iconEmoji || '🧢'}
              </span>
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="text-xl font-black text-gray-900 uppercase tracking-tight">{trainerName}</h3>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-gray-200 text-gray-800 border border-gray-600 uppercase">
                  {specialization}
                </span>
              </div>
              <p className="text-xs text-red-600 font-bold mt-0.5 uppercase">
                FICHA OFICIAL DE ENTRENADOR • ID #{Math.floor(100000 + Math.random() * 900000)}
              </p>
            </div>
          </div>

          <div className="bg-amber-50 border-2 border-amber-600 rounded-md p-3 text-center shadow-sm self-stretch sm:self-auto min-w-[160px]">
            <span className="text-[9px] uppercase font-bold text-amber-900 block mb-0.5">ESTATUA LEYENDA</span>
            <div className="text-xl font-black text-amber-900 flex items-center justify-center gap-1">
              <Trophy className="w-5 h-5 text-amber-700" />
              <span>{career.legendaryScore}%</span>
            </div>
          </div>
        </div>

        {/* Global Total Score & Evaluation Banner */}
        <div className={`p-4 sm:p-5 rounded-md border-3 ${scoreResult.gradeColor.border} ${scoreResult.gradeColor.bg} space-y-4 shadow-md`}>
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b-2 border-gray-800/20 pb-4 text-center sm:text-left">
            <div className="flex items-center space-x-3">
              <div className={`w-14 h-14 sm:w-16 sm:h-16 rounded-md ${scoreResult.gradeColor.badgeBg} text-white border-2 border-gray-900 shadow-md flex flex-col items-center justify-center shrink-0`}>
                <span className="text-[9px] font-black uppercase tracking-widest text-amber-100">RANGO</span>
                <span className="text-xl sm:text-2xl font-black tracking-tight drop-shadow">{scoreResult.rankGrade}</span>
              </div>
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-red-600 block">
                  EVALUACIÓN DE CARRERA COMPLETA
                </span>
                <h4 className="text-base sm:text-lg font-black text-gray-900 uppercase">
                  {scoreResult.rankTitle}
                </h4>
                <p className="text-xs text-gray-700 font-bold mt-0.5 leading-snug">
                  {scoreResult.rankDescription}
                </p>
              </div>
            </div>

            <div className="bg-white border-2 border-gray-900 rounded-md p-3 text-center min-w-[150px] shadow-sm">
              <span className="text-[9px] uppercase font-bold text-gray-600 block mb-0.5">PUNTUACIÓN TOTAL</span>
              <span className="text-2xl font-black text-gray-900 block tracking-tight">
                {scoreResult.totalScore.toLocaleString('es-ES')} <span className="text-xs font-extrabold text-red-600">PTS</span>
              </span>
              <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden mt-1.5 border border-gray-400">
                <div 
                  className="bg-red-600 h-full rounded-full transition-all duration-1000"
                  style={{ width: `${scoreResult.percentageScore}%` }}
                ></div>
              </div>
            </div>
          </div>

          {/* Category Breakdown Grid */}
          <div className="space-y-2">
            <h5 className="text-xs font-black uppercase text-gray-800 flex items-center gap-1.5">
              <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
              <span>DESGLOSE DE PUNTOS POR CATEGORÍA:</span>
            </h5>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
              {scoreResult.categories.map((cat, idx) => (
                <div key={idx} className="bg-white p-2.5 rounded border border-gray-800/40 text-xs space-y-1 shadow-sm">
                  <div className="flex items-center justify-between font-extrabold">
                    <span className="flex items-center gap-1.5 text-gray-900 truncate">
                      <span>{cat.icon}</span>
                      <span className="truncate">{cat.title}</span>
                    </span>
                    <span className="text-red-600 font-black shrink-0 ml-1">+{cat.points}</span>
                  </div>
                  <p className="text-[10px] text-gray-600 font-medium leading-tight truncate">
                    {cat.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 bg-gray-50 p-3 rounded-md border-2 border-gray-800">
          <div className="p-2 bg-white border border-gray-800 rounded">
            <span className="text-[9px] text-gray-600 uppercase font-bold block">HABILIDAD</span>
            <span className="text-sm font-black text-amber-800">{stats.skill}/100</span>
          </div>
          <div className="p-2 bg-white border border-gray-800 rounded">
            <span className="text-[9px] text-gray-600 uppercase font-bold block">POPULARIDAD</span>
            <span className="text-sm font-black text-sky-800">{stats.reputation}/100</span>
          </div>
          <div className="p-2 bg-white border border-gray-800 rounded">
            <span className="text-[9px] text-gray-600 uppercase font-bold block">VÍNCULO</span>
            <span className="text-sm font-black text-rose-800">{stats.bond}/100</span>
          </div>
          <div className="p-2 bg-white border border-gray-800 rounded">
            <span className="text-[9px] text-gray-600 uppercase font-bold block">DÍAS EN REGIÓN</span>
            <span className="text-sm font-black text-indigo-800">{career.daysSpent || 1} DÍAS</span>
          </div>
          <div className="p-2 bg-white border border-gray-800 rounded col-span-2 sm:col-span-1">
            <span className="text-[9px] text-gray-600 uppercase font-bold block">POKÉCUPONES</span>
            <span className="text-sm font-black text-emerald-800">${stats.money.toLocaleString('es-ES')}</span>
          </div>
        </div>

        {/* Badges Earned Section */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-xs font-black uppercase text-gray-800 flex items-center gap-1.5">
              <Award className="w-4 h-4 text-red-600" />
              <span>MEDALLAS REGIONALES ({earnedBadges.length}/8)</span>
            </h4>
          </div>
          <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
            {REGIONAL_BADGES.map((badge, idx) => {
              const isEarned = career.badgesWon.includes(badge.id);
              return (
                <div
                  key={badge.id}
                  className={`p-1.5 rounded border-2 text-center flex flex-col items-center justify-center ${
                    isEarned ? 'bg-amber-100 border-amber-600 text-amber-900 font-bold' : 'bg-gray-100 border-gray-300 text-gray-400 opacity-50'
                  }`}
                >
                  <span className="text-xs font-black">{idx + 1}</span>
                  <span className="text-[8px] font-extrabold truncate max-w-full uppercase">{badge.name.replace('Medalla ', '')}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Unlocked Achievements & Trophies Section */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-xs font-black uppercase text-gray-800 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span>LOGROS Y TROFEOS DESBLOQUEADOS ({unlockedAchievementsList.length}/{ACHIEVEMENTS.length})</span>
            </h4>
          </div>
          {unlockedAchievementsList.length === 0 ? (
            <div className="p-3 bg-gray-50 border-2 border-dashed border-gray-300 rounded text-center text-xs text-gray-500 font-bold">
              No se han desbloqueado trofeos especiales en esta carrera.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
              {unlockedAchievementsList.map((ach) => (
                <div
                  key={ach.id}
                  className={`p-2.5 rounded-md border-2 flex items-center space-x-2.5 shadow-sm ${ach.badgeColor}`}
                >
                  <span className="text-2xl shrink-0 filter drop-shadow">{ach.icon}</span>
                  <div className="overflow-hidden">
                    <h5 className="font-black text-xs uppercase truncate leading-snug">{ach.title}</h5>
                    <p className="text-[9px] font-medium leading-tight opacity-95">{ach.description}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Final Team Section */}
        <div>
          <h4 className="text-xs font-black uppercase text-gray-800 mb-2 flex items-center gap-1.5">
            <Sword className="w-4 h-4 text-red-600" />
            <span>EQUIPO POKÉMON EN EL SALÓN DE LA FAMA</span>
          </h4>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
            {career.team.map((mon, idx) => {
              const sprite = mon.spriteUrl || findPokemonByName(mon.species || mon.name)?.sprite;
              return (
                <div key={idx} className="bg-white border-2 border-gray-800 rounded-md p-2 text-center flex flex-col items-center">
                  <div className="w-12 h-12 flex items-center justify-center mb-1">
                    {sprite ? (
                      <img
                        src={sprite}
                        alt={mon.name}
                        className="w-10 h-10 object-contain filter drop-shadow [image-rendering:pixelated]"
                        referrerPolicy="no-referrer"
                      />
                    ) : (
                      <span className="text-xs font-black text-gray-800">{mon.name.slice(0, 3)}</span>
                    )}
                  </div>
                  <span className="font-extrabold text-xs text-gray-900 truncate max-w-full uppercase">{mon.name}</span>
                  <span className="text-[10px] text-red-600 font-black">NVL. {mon.level}</span>
                  <span className="text-[8px] font-bold px-1 py-0.5 mt-1 rounded bg-gray-200 text-gray-800 border border-gray-500 uppercase">{mon.type}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Navigation Action Buttons */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
        <button
          onClick={returnToMenu}
          className="w-full sm:w-auto px-6 py-3 rounded-md font-black bg-gray-900 hover:bg-gray-800 text-white border-2 border-gray-900 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none flex items-center justify-center space-x-2 transition-all text-xs uppercase cursor-pointer"
        >
          <Home className="w-4 h-4 text-yellow-400" />
          <span>MENÚ PRINCIPAL</span>
        </button>

        <button
          onClick={resetGame}
          className="w-full sm:w-auto px-6 py-3 rounded-md font-black bg-red-600 hover:bg-red-700 text-white border-2 border-gray-900 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none flex items-center justify-center space-x-2 transition-all text-xs uppercase cursor-pointer"
        >
          <RotateCcw className="w-4 h-4" />
          <span>INICIAR NUEVA CARRERA</span>
        </button>
      </div>
    </div>
  );
};
