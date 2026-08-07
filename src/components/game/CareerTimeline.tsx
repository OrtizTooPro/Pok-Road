import React from 'react';
import { useGame } from '../../context/GameContext';
import { History } from 'lucide-react';
import { getBadgeByName, getBadgeById } from '../../data/badges';
import { BadgeIcon } from './BadgeIcon';

export const CareerTimeline: React.FC = () => {
  const { state } = useGame();
  const { historyLog } = state;

  if (historyLog.length === 0) return null;

  return (
    <div className="bg-white border-2 border-gray-800 rounded-md overflow-hidden shadow-md font-mono text-gray-800">
      {/* Header Bar */}
      <div className="bg-red-600 text-white flex items-center justify-between px-3 py-1.5 font-bold tracking-wide border-b-2 border-gray-900">
        <div className="flex items-center space-x-2">
          <History className="w-4 h-4 text-white" />
          <span className="text-xs uppercase">LÍNEA TEMPORAL DE DECISIONES</span>
        </div>
        <span className="text-[10px] bg-red-800 px-2 py-0.5 rounded border border-gray-900 font-bold">
          {historyLog.length} REGISTROS
        </span>
      </div>

      <div className="p-3 sm:p-4 max-h-[500px] lg:max-h-[600px] overflow-y-auto touch-scroll">
        <div className="relative pl-5 space-y-3 border-l-2 border-gray-800">
          {historyLog.slice().reverse().map((log, index) => (
            <div key={index} className="relative group">
              {/* Timeline Dot */}
              <div className="absolute -left-[27px] top-1.5 w-3 h-3 rounded-full bg-red-600 border-2 border-gray-900 shadow"></div>

              <div className="bg-white p-3 rounded-md border-2 border-gray-800 shadow-sm space-y-1.5">
                <div className="flex flex-wrap items-center justify-between gap-1 border-b border-gray-200 pb-1">
                  <span className="text-xs font-black text-red-600 uppercase">EDAD: {log.age} AÑOS</span>
                  <span className="text-[11px] font-bold text-gray-700 truncate max-w-[200px] uppercase">{log.eventTitle}</span>
                </div>

                <p className="text-xs text-gray-900 font-bold italic">
                  "{log.chosenOption}"
                </p>

                <p className="text-xs text-gray-700 leading-relaxed font-medium">
                  {log.summary}
                </p>

                <div className="flex flex-wrap gap-1 text-[10px] pt-1">
                  {log.statChanges.map((change, i) => (
                    <span key={i} className="px-1.5 py-0.5 rounded bg-gray-100 border border-gray-600 text-gray-800 font-bold">
                      {change}
                    </span>
                  ))}
                  {log.badgeEarned && (() => {
                    const badgeObj = getBadgeByName(log.badgeEarned) || getBadgeById(log.badgeEarned);
                    return (
                      <span className="px-1.5 py-0.5 rounded bg-amber-200 border border-amber-800 text-amber-950 font-extrabold flex items-center gap-1">
                        <BadgeIcon
                          badgeId={badgeObj?.id || log.badgeEarned}
                          badgeName={log.badgeEarned}
                          spriteUrl={badgeObj?.spriteUrl}
                          earned={true}
                          size="xs"
                        />
                        <span>MEDALLA: {log.badgeEarned.toUpperCase()}</span>
                      </span>
                    );
                  })()}
                  {log.pokemonAdded && (
                    <span className="px-1.5 py-0.5 rounded bg-emerald-200 border border-emerald-800 text-emerald-900 font-extrabold">
                      + {log.pokemonAdded.toUpperCase()}
                    </span>
                  )}
                  {log.chainedEventUnlocked && (
                    <span className="px-1.5 py-0.5 rounded bg-indigo-100 border border-indigo-800 text-indigo-950 font-extrabold">
                      ⚡ CONSECUENCIA: {log.chainedEventUnlocked.toUpperCase()}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
