import React from 'react';
import { useGame } from '../../context/GameContext';
import { Shield, FileText } from 'lucide-react';

export const Footer: React.FC = () => {
  const { openModal } = useGame();

  return (
    <footer className="bg-white border-t-4 border-gray-900 text-gray-800 text-xs py-6 mt-12 font-mono">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-6">
          {/* Legal Links */}
          <div>
            <h4 className="text-gray-900 font-black text-xs uppercase tracking-wider mb-3">
              Legales
            </h4>
            <ul className="space-y-2 font-bold text-gray-700">
              <li>
                <button onClick={() => openModal('privacy')} className="hover:text-red-600 transition-colors flex items-center space-x-1.5 cursor-pointer">
                  <Shield className="w-3.5 h-3.5" />
                  <span>Política de Privacidad</span>
                </button>
              </li>
              <li>
                <button onClick={() => openModal('terms')} className="hover:text-red-600 transition-colors flex items-center space-x-1.5 cursor-pointer">
                  <FileText className="w-3.5 h-3.5" />
                  <span>Términos de Servicio</span>
                </button>
              </li>
              <li>
                <button onClick={() => openModal('about')} className="hover:text-red-600 transition-colors flex items-center space-x-1.5 cursor-pointer">
                  <span>Acerca del Proyecto</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Contact / Notice */}
          <div>
            <h4 className="text-gray-900 font-black text-xs uppercase tracking-wider mb-3">
              Aviso Legal
            </h4>
            <p className="text-gray-500 text-[11px] leading-relaxed font-medium">
              PokéRoad es una aplicación no oficial creada por fans para fans con fines educativos y de entretenimiento. Pokémon y sus nombres son marcas registradas de Nintendo, Creatures Inc. y GAME FREAK inc.
            </p>
          </div>
        </div>

        <div className="pt-4 border-t-2 border-dotted border-gray-300 flex flex-col sm:flex-row items-center justify-between text-[11px] text-gray-500 font-bold gap-2">
          <p>© 2026 PokéRoad — Todos los derechos reservados.</p>
          <p className="text-red-600">v3.0.0 • PokéDex Summary Edition</p>
        </div>
      </div>
    </footer>
  );
};

