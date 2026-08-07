import React, { useState } from 'react';
import { useGame } from '../../context/GameContext';
import { STARTER_OPTIONS } from '../../data/starters';
import { TrainerSpecialization } from '../../types';
import { User, Award, ArrowRight, ArrowLeft, Sparkles, Sword, Play, RotateCcw, Trash2, Check, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { findPokemonByName } from '../../data/kantoPokedex';
import { TRAINER_AVATARS, getAvatarById } from '../../data/avatars';

export const CharacterSetup: React.FC = () => {
  const { startGame, continueSavedGame, deleteSavedGame, hasSavedGame, savedGameData } = useGame();
  const [name, setName] = useState('Red');
  const [selectedAvatarId, setSelectedAvatarId] = useState<string>('avatar-red');
  const [specialization, setSpecialization] = useState<TrainerSpecialization>('Combate');
  const [starterId, setStarterId] = useState<string>('starter-fire');
  const [showNewSetup, setShowNewSetup] = useState(!hasSavedGame);
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showStartConfirm, setShowStartConfirm] = useState(false);

  const savedAvatar = savedGameData?.avatarId ? getAvatarById(savedGameData.avatarId) : null;

  const handleOpenNewSetup = () => {
    setCurrentStep(1);
    setShowNewSetup(true);
  };

  const handleGoToStep = (stepNumber: number) => {
    if (!name.trim()) {
      setName('Red');
    }
    setCurrentStep(Math.min(4, Math.max(1, stepNumber)));
  };

  const handleNextStep = () => {
    if (!name.trim()) {
      setName('Red');
    }
    setCurrentStep(prev => Math.min(4, prev + 1));
  };

  const handlePrevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleStartGame = () => {
    const finalName = name.trim() || 'Red';
    if (hasSavedGame) {
      setShowStartConfirm(true);
    } else {
      setShowNewSetup(false);
      startGame(finalName, specialization, starterId, selectedAvatarId);
    }
  };

  const handleConfirmStart = () => {
    setShowStartConfirm(false);
    setShowNewSetup(false);
    startGame(name.trim() || 'Red', specialization, starterId, selectedAvatarId);
  };

  const handleDeleteSaved = () => {
    deleteSavedGame();
    setShowDeleteConfirm(false);
    setCurrentStep(1);
    setShowNewSetup(true);
  };

  const specializationsList: { id: TrainerSpecialization; title: string; desc: string; bonus: string }[] = [
    {
      id: 'Combate',
      title: 'ESPECIALISTA EN COMBATE',
      desc: 'Enfoque táctico directo para dominar gimnasios y torneos de alta presión.',
      bonus: '+10 Habilidad Táctica inicial'
    },
    {
      id: 'Captura',
      title: 'ESPECIALISTA EN CAPTURA',
      desc: 'Gran resistencia física para explorar rutas remotas y rastrear Pokémon raros.',
      bonus: '+10 Resistencia y suerte en avistamientos'
    },
    {
      id: 'Crianza',
      title: 'ESPECIALISTA EN CRIANZA',
      desc: 'Conexión emocional profunda que acelera las evoluciones y la lealtad.',
      bonus: '+15 Vínculo de amistad inicial'
    },
    {
      id: 'Estrategia',
      title: 'ESPECIALISTA EN ESTRATEGIA',
      desc: 'Gestión inteligente de recursos, contratos de patrocinio y popularidad.',
      bonus: '+$1,000 Pokécupones iniciales y +10 Popularidad'
    }
  ];

  const currentAvatarObj = getAvatarById(selectedAvatarId);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 font-mono animate-fade-in text-gray-800">
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white border-2 border-gray-800 rounded-md overflow-hidden shadow-xl"
      >
        {/* Pokédex Device Header Bar */}
        <div className="bg-red-600 text-white font-bold flex items-center justify-between px-4 py-2 border-b-2 border-gray-900">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded-full bg-yellow-300 border border-gray-900 shadow"></div>
            <span className="text-xs uppercase tracking-wider">NUEVO REGISTRO • REGISTRO DE ENTRENADOR</span>
          </div>
          <span className="text-xs bg-red-800 px-2.5 py-0.5 rounded border border-gray-900 font-bold">
            POKÉDEX V3.0
          </span>
        </div>

        <div className="p-6 space-y-6">
          {/* Header Tagline */}
          <div className="text-center space-y-2 border-b-2 border-dotted border-gray-400 pb-5">
            <div className="inline-flex items-center space-x-2 px-3 py-0.5 rounded bg-red-100 text-red-800 border-2 border-red-600 text-xs font-bold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>MODO CARRERA POKÉROAD</span>
            </div>
            <h2 className="text-xl sm:text-3xl font-black tracking-tight text-gray-900 uppercase">
              MENÚ DE INICIO POKÉROAD
            </h2>
            <p className="text-xs text-gray-600 max-w-lg mx-auto font-medium">
              Elige continuar tu aventura guardada anterior o comenzar una nueva carrera de Entrenador Pokémon desde los 10 años.
            </p>
          </div>

          {/* Saved Game Banner if available */}
          {hasSavedGame && savedGameData && (
            <div className="bg-amber-50 border-2 border-gray-900 rounded-md p-4.5 space-y-3.5 shadow-md relative overflow-hidden">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b-2 border-amber-300 pb-2">
                <div className="flex items-center space-x-2">
                  <Play className="w-5 h-5 text-amber-700 animate-pulse shrink-0 fill-amber-700" />
                  <span className="font-black text-xs uppercase tracking-wider text-amber-950">
                    🎮 AVENTURA EN CURSO GUARDADA
                  </span>
                </div>
                <span className="text-[10px] font-black bg-amber-200 text-amber-900 px-2 py-0.5 rounded border border-amber-800 uppercase">
                  PARTIDA GUARDADA
                </span>
              </div>

              <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
                <div className="flex items-center space-x-3.5">
                  <div className="w-16 h-16 rounded-md bg-white border-2 border-gray-900 flex items-center justify-center shrink-0 shadow overflow-hidden relative">
                    {savedAvatar ? (
                      <img
                        src={savedAvatar.spriteUrl}
                        alt={savedGameData.trainerName}
                        className="w-14 h-14 object-contain filter drop-shadow [image-rendering:pixelated]"
                        referrerPolicy="no-referrer"
                      />
                    ) : (
                      <span className="text-2xl">🧢</span>
                    )}
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <h3 className="font-black text-sm text-gray-900 uppercase">
                        {savedGameData.trainerName}
                      </h3>
                      <span className="text-[10px] bg-red-100 text-red-800 font-extrabold px-2 py-0.5 rounded border border-red-300">
                        {savedGameData.specialization}
                      </span>
                    </div>
                    <p className="text-xs text-gray-800 font-bold">
                      Edad: <span className="text-red-700">{savedGameData.career?.age || 10} años</span> • Medallas: <span className="text-amber-800">{savedGameData.career?.badgesWon?.length || 0}/8</span> • Victoria: <span className="text-emerald-800">{savedGameData.career?.victories || 0}</span>
                    </p>
                    <div className="flex items-center gap-1.5 text-xs pt-1 flex-wrap">
                      <span className="text-[10px] text-gray-600 font-extrabold uppercase">EQUIPO:</span>
                      {savedGameData.career?.team?.map((m, i) => {
                        const sprite = m.spriteUrl || findPokemonByName(m.species || m.name)?.sprite;
                        return (
                          <div
                            key={i}
                            title={`${m.name} (Nvl. ${m.level})`}
                            className="w-7 h-7 bg-white rounded border border-gray-400 p-0.5 flex items-center justify-center shrink-0 shadow-xs"
                          >
                            {sprite ? (
                              <img
                                src={sprite}
                                alt={m.name}
                                className="w-6 h-6 object-contain [image-rendering:pixelated]"
                                referrerPolicy="no-referrer"
                              />
                            ) : (
                              <span className="text-[9px] font-extrabold text-gray-800">{m.name.slice(0, 3)}</span>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={continueSavedGame}
                    className="w-full sm:w-auto px-5 py-3 rounded-md font-black text-gray-900 bg-yellow-400 hover:bg-yellow-300 border-2 border-gray-900 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none flex items-center justify-center space-x-2 transition-all uppercase text-xs cursor-pointer"
                  >
                    <Play className="w-4 h-4 fill-current" />
                    <span>CARGAR AVENTURA</span>
                  </button>

                  {!showDeleteConfirm ? (
                    <button
                      type="button"
                      onClick={() => setShowDeleteConfirm(true)}
                      title="Borrar partida guardada"
                      className="w-full sm:w-auto px-3.5 py-3 rounded-md font-bold text-red-700 bg-red-100 hover:bg-red-200 border-2 border-red-800 flex items-center justify-center space-x-1.5 transition-all uppercase text-xs cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4 text-red-700 shrink-0" />
                      <span>BORRAR</span>
                    </button>
                  ) : (
                    <div className="p-2 bg-red-100 border-2 border-red-700 rounded-md flex flex-col sm:flex-row items-center gap-2">
                      <span className="text-[11px] font-extrabold text-red-900 uppercase">¿Confirmar borrado?</span>
                      <div className="flex items-center gap-1.5 w-full sm:w-auto">
                        <button
                          type="button"
                          onClick={handleDeleteSaved}
                          className="px-2.5 py-1 text-xs font-black bg-red-600 hover:bg-red-700 text-white border border-gray-900 rounded uppercase cursor-pointer"
                        >
                          Sí, Borrar
                        </button>
                        <button
                          type="button"
                          onClick={() => setShowDeleteConfirm(false)}
                          className="px-2.5 py-1 text-xs font-black bg-gray-200 hover:bg-gray-300 text-gray-800 border border-gray-800 rounded uppercase cursor-pointer"
                        >
                          Cancelar
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* New Game Setup Launch Banner */}
          <div className="p-5 bg-gradient-to-r from-red-50 via-white to-red-50 border-2 border-gray-900 rounded-md space-y-3 shadow-sm text-center">
            <h3 className="text-sm font-black text-gray-900 uppercase tracking-wide">
              ✨ {hasSavedGame ? '¿INICIAR UNA NUEVA CARRERA DIVERGENTE?' : 'CREACIÓN DE NUEVO ENTRENADOR POKÉROAD'}
            </h3>
            <p className="text-xs text-gray-600 max-w-md mx-auto">
              Configura tu avatar, especialización y Pokémon inicial en un proceso interactivo de 4 pasos.
            </p>
            <button
              type="button"
              onClick={handleOpenNewSetup}
              className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-black text-xs uppercase rounded-md border-2 border-gray-900 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none inline-flex items-center gap-2 transition-all cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-yellow-300" />
              <span>{showNewSetup ? 'CONTINUAR CREACIÓN (ABRIR VENTANA)' : 'NUEVA CARRERA (PASO A PASO)'}</span>
            </button>
          </div>
        </div>
      </motion.div>

      {/* 4-STEP WIZARD POPUP MODAL */}
      <AnimatePresence>
        {showNewSetup && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/70 backdrop-blur-xs font-mono">
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 15 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 15 }}
              transition={{ duration: 0.2 }}
              className="bg-white border-4 border-gray-900 rounded-md max-w-2xl w-full max-h-[92vh] flex flex-col overflow-hidden shadow-2xl text-gray-900 relative"
            >
              {/* Modal Pokédex Header */}
              <div className="bg-gradient-to-r from-red-600 to-red-700 text-white px-4 py-3 border-b-2 border-gray-900 flex items-center justify-between shrink-0">
                <div className="flex items-center space-x-2.5">
                  <div className="w-3.5 h-3.5 rounded-full bg-yellow-300 border border-gray-900 shadow"></div>
                  <div>
                    <span className="text-[10px] font-black uppercase text-yellow-300 tracking-wider block">
                      CREACIÓN DE ENTRENADOR • PASO {currentStep} DE 4
                    </span>
                    <h3 className="text-sm font-black uppercase tracking-tight">
                      {currentStep === 1 && 'PASO 1: NOMBRE DEL ENTRENADOR'}
                      {currentStep === 2 && 'PASO 2: SELECCIÓN DE AVATAR'}
                      {currentStep === 3 && 'PASO 3: ESPECIALIZACIÓN DE CARRERA'}
                      {currentStep === 4 && 'PASO 4: POKÉMON INICIAL Y ATRIBUTOS'}
                    </h3>
                  </div>
                </div>

                {hasSavedGame && (
                  <button
                    type="button"
                    onClick={() => setShowNewSetup(false)}
                    className="p-1.5 rounded bg-red-800 hover:bg-red-900 text-white border border-red-500 transition-colors cursor-pointer"
                    title="Cerrar creación"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>

              {/* Step Progress Bar */}
              <div className="bg-gray-100 border-b-2 border-gray-800 px-4 py-2 flex items-center justify-between gap-1.5 shrink-0 text-[10px] font-black uppercase">
                {[
                  { step: 1, label: '1. NOMBRE' },
                  { step: 2, label: '2. AVATAR' },
                  { step: 3, label: '3. RAMA' },
                  { step: 4, label: '4. INICIAL' }
                ].map((s) => (
                  <button
                    key={s.step}
                    type="button"
                    onClick={() => {
                      if (!name.trim()) setName('Red');
                      setCurrentStep(s.step);
                    }}
                    className={`flex-1 py-1.5 px-1 rounded text-center border transition-all truncate cursor-pointer ${
                      currentStep === s.step
                        ? 'bg-red-600 text-white border-gray-900 font-extrabold shadow-xs'
                        : currentStep > s.step
                        ? 'bg-emerald-100 text-emerald-900 border-emerald-500 font-bold hover:bg-emerald-200'
                        : 'bg-gray-200 text-gray-700 border-gray-300 hover:bg-gray-300'
                    }`}
                  >
                    {s.label}
                  </button>
                ))}
              </div>

              {/* Step Content Container */}
              <div className="flex-1 flex flex-col overflow-hidden">
                <div className="p-4 sm:p-6 overflow-y-auto touch-scroll flex-1 space-y-5 max-h-[60vh] sm:max-h-[68vh] overscroll-contain scroll-smooth pb-8">
                  {/* STEP 1: NAME */}
                  {currentStep === 1 && (
                    <motion.div
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="space-y-4"
                    >
                      <div className="bg-red-50 p-3.5 rounded border-2 border-red-300 text-xs text-red-900 space-y-1">
                        <p className="font-black uppercase flex items-center gap-1.5 text-sm">
                          <User className="w-4 h-4 text-red-600" />
                          <span>Identificación de Entrenador</span>
                        </p>
                        <p className="text-gray-700 leading-relaxed font-medium">
                          Ingresa el nombre con el que serás inscrito oficialmente en la Pokédex de Kanto y en la Liga Pokémon.
                        </p>
                      </div>

                      <div className="space-y-2 pt-2">
                        <label className="text-xs font-black uppercase text-gray-800 flex items-center gap-2">
                          <span>Nombre del personaje:</span>
                        </label>
                        <input
                          type="text"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              e.preventDefault();
                              handleNextStep();
                            }
                          }}
                          placeholder="Ej: RED, ASH, SERENA, SATOSHI..."
                          maxLength={20}
                          autoFocus
                          className="w-full px-4 py-3 rounded bg-white border-2 border-gray-800 text-gray-900 focus:outline-none focus:border-red-600 text-base font-extrabold tracking-wider placeholder-gray-400 shadow-inner"
                          required
                        />
                        <p className="text-[11px] text-gray-500 font-bold">Máximo 20 caracteres.</p>
                      </div>
                    </motion.div>
                  )}

                  {/* STEP 2: AVATAR */}
                  {currentStep === 2 && (
                    <motion.div
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="space-y-4"
                    >
                      <div className="bg-red-50 p-3.5 rounded border-2 border-red-300 text-xs text-red-900 space-y-1">
                        <p className="font-black uppercase flex items-center gap-1.5 text-sm">
                          <User className="w-4 h-4 text-red-600" />
                          <span>Aspecto e Identidad Gráfica</span>
                        </p>
                        <p className="text-gray-700 leading-relaxed font-medium">
                          Elige el sprite de 8-bits clásico que representará a tu personaje en las tarjetas de entrenador y combates.
                        </p>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                        {TRAINER_AVATARS.map((avatar) => (
                          <button
                            type="button"
                            key={avatar.id}
                            onClick={() => setSelectedAvatarId(avatar.id)}
                            className={`p-3.5 rounded-md border-2 text-center transition-all flex flex-col items-center justify-between group cursor-pointer ${
                              selectedAvatarId === avatar.id
                                ? 'bg-red-50 border-red-600 ring-2 ring-red-500 shadow-[3px_3px_0px_0px_rgba(220,38,38,1)]'
                                : 'bg-white border-gray-800 hover:bg-gray-50'
                            }`}
                          >
                            <div className="w-20 h-20 bg-gray-50 border-2 border-gray-800 rounded-md flex items-center justify-center shadow-inner overflow-hidden my-1 relative">
                              <img
                                src={avatar.spriteUrl}
                                alt={avatar.name}
                                className="w-16 h-16 object-contain filter drop-shadow [image-rendering:pixelated] group-hover:scale-110 transition-transform"
                                referrerPolicy="no-referrer"
                                onError={(e) => {
                                  e.currentTarget.onerror = null;
                                  e.currentTarget.style.display = 'none';
                                  const fallbackSpan = e.currentTarget.parentElement?.querySelector('.avatar-fallback');
                                  if (fallbackSpan) (fallbackSpan as HTMLElement).style.display = 'flex';
                                }}
                              />
                              <span className="avatar-fallback hidden text-3xl items-center justify-center font-bold">
                                {avatar.iconEmoji}
                              </span>
                            </div>
                            <div className="w-full pt-1">
                              <h4 className="font-black text-xs text-gray-900 truncate uppercase flex items-center justify-center gap-1">
                                {avatar.name}
                                {selectedAvatarId === avatar.id && <Check className="w-3.5 h-3.5 text-red-600 shrink-0" />}
                              </h4>
                              <span className="text-[10px] text-gray-600 font-bold block truncate">{avatar.title}</span>
                            </div>
                          </button>
                        ))}
                      </div>
                    </motion.div>
                  )}

                  {/* STEP 3: SPECIALIZATION */}
                  {currentStep === 3 && (
                    <motion.div
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="space-y-4"
                    >
                      <div className="bg-red-50 p-3.5 rounded border-2 border-red-300 text-xs text-red-900 space-y-1">
                        <p className="font-black uppercase flex items-center gap-1.5 text-sm">
                          <Award className="w-4 h-4 text-red-600" />
                          <span>Especialización de Entrenador</span>
                        </p>
                        <p className="text-gray-700 leading-relaxed font-medium">
                          Tu especialidad altera tus atributos iniciales y desbloquea decisiones avanzadas durante las rutas de Kanto.
                        </p>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                        {specializationsList.map((spec) => (
                          <button
                            type="button"
                            key={spec.id}
                            onClick={() => setSpecialization(spec.id)}
                            className={`p-3.5 rounded-md border-2 text-left transition-all cursor-pointer ${
                              specialization === spec.id
                                ? 'bg-red-50 border-red-600 shadow-[3px_3px_0px_0px_rgba(220,38,38,1)] ring-1 ring-red-500'
                                : 'bg-white border-gray-800 hover:bg-gray-50'
                            }`}
                          >
                            <div className="flex items-center justify-between mb-1">
                              <h4 className="font-black text-xs text-gray-900 uppercase flex items-center gap-1">
                                {spec.title}
                                {specialization === spec.id && <Check className="w-3.5 h-3.5 text-red-600 shrink-0" />}
                              </h4>
                            </div>
                            <p className="text-[11px] text-gray-600 mb-2 leading-relaxed font-medium">{spec.desc}</p>
                            <span className="text-[10px] font-bold text-red-800 bg-red-100 px-2 py-0.5 rounded border border-red-400 inline-block">
                              {spec.bonus}
                            </span>
                          </button>
                        ))}
                      </div>
                    </motion.div>
                  )}

                  {/* STEP 4: STARTER POKÉMON */}
                  {currentStep === 4 && (
                    <motion.div
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="space-y-4"
                    >
                      <div className="bg-red-50 p-3.5 rounded border-2 border-red-300 text-xs text-red-900 space-y-1">
                        <p className="font-black uppercase flex items-center gap-1.5 text-sm">
                          <Sword className="w-4 h-4 text-red-600" />
                          <span>Elección del Compañero Inicial</span>
                        </p>
                        <p className="text-gray-700 leading-relaxed font-medium">
                          Haz clic en cualquiera de las tarjetas de los 4 iniciales del Prof. Oak para seleccionar a tu primer Pokémon.
                        </p>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                        {STARTER_OPTIONS.map((starter) => {
                          const kantoMatch = findPokemonByName(starter.species);
                          const spriteUrl = starter.initialPokemon.spriteUrl || kantoMatch?.sprite;
                          const isSelected = starterId === starter.id;

                          return (
                            <button
                              type="button"
                              key={starter.id}
                              onClick={() => setStarterId(starter.id)}
                              className={`p-3.5 rounded-md border-3 text-left transition-all flex flex-col justify-between group cursor-pointer relative overflow-hidden ${
                                isSelected
                                  ? 'bg-red-50 border-red-600 shadow-[4px_4px_0px_0px_rgba(220,38,38,1)] ring-2 ring-red-500 scale-[1.01]'
                                  : 'bg-white border-gray-800 hover:bg-gray-50'
                              }`}
                            >
                              <div>
                                <div className="flex items-center justify-between mb-2">
                                  <div className="w-14 h-14 rounded bg-white border-2 border-gray-800 flex items-center justify-center shadow-inner overflow-hidden relative">
                                    {spriteUrl ? (
                                      <img
                                        src={spriteUrl}
                                        alt={starter.name}
                                        className="w-12 h-12 object-contain filter drop-shadow group-hover:scale-110 transition-transform [image-rendering:pixelated]"
                                        referrerPolicy="no-referrer"
                                      />
                                    ) : (
                                      <span className="text-xs font-black text-gray-800">{starter.name.slice(0, 3)}</span>
                                    )}
                                  </div>
                                  <div className="flex flex-col items-end gap-1">
                                    <span className="text-[10px] uppercase px-2 py-0.5 rounded font-black bg-gray-900 text-white">
                                      {starter.type}
                                    </span>
                                    {isSelected && (
                                      <span className="text-[9px] bg-emerald-600 text-white font-black px-2 py-0.5 rounded flex items-center gap-1 uppercase tracking-wider">
                                        <Check className="w-3 h-3" /> SELECCIONADO
                                      </span>
                                    )}
                                  </div>
                                </div>

                                <h4 className="font-black text-sm text-gray-900 uppercase flex items-center gap-1">
                                  {starter.name}
                                  {isSelected && <Check className="w-4 h-4 text-red-600 shrink-0" />}
                                </h4>
                                <p className="text-xs text-gray-600 mt-1 leading-relaxed font-medium">{starter.description}</p>
                              </div>

                              <div className="mt-3 pt-2 border-t-2 border-dotted border-gray-300 flex items-center justify-between">
                                <span className="text-[10px] text-emerald-800 font-extrabold uppercase block">
                                  {starter.bonusText}
                                </span>
                              </div>
                            </button>
                          );
                        })}
                      </div>

                      {/* Selected Starter Detailed Summary */}
                      {(() => {
                        const activeStarter = STARTER_OPTIONS.find(s => s.id === starterId) || STARTER_OPTIONS[0];
                        const kantoMatch = findPokemonByName(activeStarter.species);
                        const spriteUrl = activeStarter.initialPokemon.spriteUrl || kantoMatch?.sprite;

                        return (
                          <div className="bg-amber-50/80 p-3.5 rounded-md border-2 border-amber-500 space-y-2.5 shadow-sm">
                            <div className="flex items-center justify-between border-b border-amber-300 pb-2">
                              <div className="flex items-center space-x-2.5">
                                <div className="w-10 h-10 rounded bg-white border-2 border-gray-900 flex items-center justify-center shrink-0">
                                  {spriteUrl ? (
                                    <img src={spriteUrl} alt={activeStarter.name} className="w-8 h-8 object-contain [image-rendering:pixelated]" referrerPolicy="no-referrer" />
                                  ) : (
                                    <span className="text-xs font-black text-gray-800">{activeStarter.name.slice(0, 3)}</span>
                                  )}
                                </div>
                                <div>
                                  <h4 className="text-xs font-black text-amber-950 uppercase flex items-center gap-1.5">
                                    <span>INICIAL ELEGIDO: {activeStarter.name}</span>
                                    <span className="text-[9px] bg-amber-200 text-amber-900 px-1.5 py-0.2 rounded border border-amber-600 font-bold">
                                      NVL. 5
                                    </span>
                                  </h4>
                                  <p className="text-[10px] text-amber-800 font-bold">
                                    Categoría: {activeStarter.category} • Tipo: {activeStarter.type}
                                  </p>
                                </div>
                              </div>
                              <span className="text-[10px] bg-emerald-100 text-emerald-900 font-black px-2 py-1 rounded border border-emerald-600 uppercase">
                                ✓ LISTO PARA EL VIAJE
                              </span>
                            </div>

                            {/* Evolution Chain Preview */}
                            <div className="space-y-1">
                              <span className="text-[10px] font-black uppercase text-amber-900 block">LÍNEA EVOLUTIVA DE KANTO:</span>
                              <div className="flex items-center gap-2 text-[10px] font-bold bg-white/80 p-2 rounded border border-amber-300 overflow-x-auto">
                                {activeStarter.evolutionStages.map((ev, idx) => (
                                  <React.Fragment key={idx}>
                                    <div className="flex items-center space-x-1 shrink-0">
                                      <span className="font-extrabold text-gray-900 uppercase">{ev.name}</span>
                                      <span className="text-[9px] text-gray-500 font-mono">(Nv. {ev.level})</span>
                                    </div>
                                    {idx < activeStarter.evolutionStages.length - 1 && (
                                      <span className="text-amber-600 font-black shrink-0">➔</span>
                                    )}
                                  </React.Fragment>
                                ))}
                              </div>
                            </div>
                          </div>
                        );
                      })()}

                      {/* Initial Stats Preview Box */}
                      <div className="bg-gray-50 p-3.5 rounded-md border-2 border-gray-800 space-y-1.5 shadow-inner">
                        <h4 className="text-[11px] font-black text-gray-700 uppercase tracking-wider">
                          RESUMEN DE ATRIBUTOS (ENTRENADOR: {name || 'RED'} • {specialization.toUpperCase()}):
                        </h4>
                        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-[11px] font-bold">
                          <div className="p-2 rounded bg-white border border-gray-800 text-amber-800">
                            HABILIDAD: <span className="font-black">{specialization === 'Combate' ? '35' : '25'}</span>
                          </div>
                          <div className="p-2 rounded bg-white border border-gray-800 text-sky-800">
                            POPULARIDAD: <span className="font-black">{specialization === 'Estrategia' ? '20' : '10'}</span>
                          </div>
                          <div className="p-2 rounded bg-white border border-gray-800 text-rose-800">
                            VÍNCULO: <span className="font-black">{specialization === 'Crianza' ? '50' : '35'}</span>
                          </div>
                          <div className="p-2 rounded bg-white border border-gray-800 text-emerald-800">
                            RESISTENCIA: <span className="font-black">{specialization === 'Captura' ? '85' : '75'}</span>
                          </div>
                          <div className="p-2 rounded bg-white border border-gray-800 text-emerald-900 col-span-2 sm:col-span-1">
                            DINERO: <span className="font-black">${specialization === 'Estrategia' ? '2,000' : '1,000'}</span>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </div>

                {/* Footer Controls (Back / Next / Start) */}
                <div className="bg-gray-100 border-t-2 border-gray-800 p-3 sm:p-4 flex items-center justify-between gap-3 shrink-0">
                  {currentStep > 1 ? (
                    <button
                      type="button"
                      onClick={handlePrevStep}
                      className="px-4 py-2.5 bg-gray-200 hover:bg-gray-300 text-gray-900 rounded font-black text-xs uppercase border-2 border-gray-900 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none flex items-center gap-1.5 transition-all cursor-pointer"
                    >
                      <ArrowLeft className="w-4 h-4" />
                      <span>VOLVER A PASO {currentStep - 1}</span>
                    </button>
                  ) : (
                    <div />
                  )}

                  {currentStep < 4 ? (
                    <button
                      type="button"
                      onClick={() => handleGoToStep(currentStep + 1)}
                      className="px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded font-black text-xs uppercase border-2 border-gray-900 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none flex items-center gap-1.5 transition-all cursor-pointer ml-auto"
                    >
                      <span>
                        {currentStep === 1 && 'PASO 2: AVATAR'}
                        {currentStep === 2 && 'PASO 3: ESPECIALIZACIÓN'}
                        {currentStep === 3 && 'PASO 4: ELEGIR INICIAL'}
                      </span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={handleStartGame}
                      className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded font-black text-xs uppercase border-2 border-gray-900 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none flex items-center gap-1.5 transition-all cursor-pointer ml-auto"
                    >
                      <span>¡COMENZAR CARRERA POKÉROAD!</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Overwrite Game Modal Confirmation */}
      {showStartConfirm && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/75 p-4 font-mono backdrop-blur-xs">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white border-4 border-gray-900 rounded-lg max-w-md w-full p-6 space-y-4 shadow-2xl text-gray-900"
          >
            <div className="flex items-center space-x-2 text-red-600 border-b-2 border-gray-900 pb-2">
              <Sparkles className="w-5 h-5 shrink-0" />
              <h3 className="font-black text-base uppercase">¿Sobrescribir Aventura Guardada?</h3>
            </div>
            <div className="space-y-2 text-xs font-bold leading-relaxed text-gray-700">
              <p>
                Tienes una aventura guardada en curso del entrenador <span className="text-red-700 font-extrabold uppercase">{savedGameData?.trainerName}</span>.
              </p>
              <p className="bg-red-50 p-2.5 rounded border border-red-300 text-red-900">
                Al confirmar, comenzarás una nueva travesía como <span className="font-black uppercase">{name || 'RED'}</span> eligiendo a <span className="font-black uppercase">{STARTER_OPTIONS.find(s => s.id === starterId)?.name}</span>.
              </p>
            </div>
            <div className="flex items-center justify-end space-x-3 pt-2">
              <button
                type="button"
                onClick={() => setShowStartConfirm(false)}
                className="px-4 py-2 rounded-md font-bold text-gray-800 bg-gray-200 hover:bg-gray-300 border-2 border-gray-800 text-xs uppercase cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleConfirmStart}
                className="px-4 py-2 rounded-md font-black text-white bg-red-600 hover:bg-red-700 border-2 border-gray-900 text-xs uppercase shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-x-[1px] active:translate-y-[1px] cursor-pointer"
              >
                Sí, Iniciar Aventura
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};
