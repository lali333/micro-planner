"use client"
import React, { useState, useEffect, useRef } from 'react';
import { 
  Clock, Trash2, Plus, 
  GripVertical, X, ChevronRight, ChevronDown
} from 'lucide-react';
import { PiPlayThin, PiPlayPauseThin, PiPlayDuotone, PiStarFourThin, PiStarFourDuotone, PiStarFourFill } from "react-icons/pi";
import { TbNorthStar } from "react-icons/tb";
import { LiaFastForwardSolid } from "react-icons/lia";

// --- FONTS & STYLES ---
const FontStyles = () => (
  <style jsx global>{`
    @font-face {
      font-family: 'Marker SD';
      src: url('/fonts/Marker%20SD.ttf') format('truetype');
      font-display: swap;
    }

    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@200&family=Plus+Jakarta+Sans:wght@300;400;500;600;700&family=Orbitron:wght@400;700&family=JetBrains+Mono:wght@400;500;600&display=swap');
    
    body {
      font-family: 'Plus Jakarta Sans', sans-serif;
    }
    
    .font-digital {
      font-family: 'JetBrains Mono', 'Orbitron', monospace;
      letter-spacing: 0.05em;
    }

    .font-steps {
      font-family: 'Inter', 'Plus Jakarta Sans', sans-serif;
      font-weight: 200;
    }

    /* Custom Scrollbar */
    ::-webkit-scrollbar { width: 6px; }
    ::-webkit-scrollbar-track { background: transparent; }
    ::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; }

    /* Smooth Fade In */
    .fade-in { animation: fadeIn 0.5s ease-in-out; }
    @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }

    /* Bullet Journal Backdrop */
    .bullet-page {
      position: fixed;
      inset: 0;
      background-color: #f8f5ed;
      background-image: radial-gradient(circle at 8px 8px, rgba(15, 23, 42, 0.9) 1.25px, transparent 0);
      background-size: 26px 26px;
      z-index: 0;
    }

    .bullet-page::after {
      content: '';
      position: absolute;
      inset: 28px;
      border-radius: 32px;
      border: 1px solid rgba(15, 23, 42, 0.06);
      box-shadow:
        inset 0 0 0 1px rgba(255, 255, 255, 0.7),
        0 30px 80px rgba(15, 23, 42, 0.08);
      pointer-events: none;
    }


    /* Focus Clock */
    .focus-clock {
      position: relative;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: clamp(2.5rem, 8vw, 5rem);
      padding: 0 clamp(3.5rem, 9vw, 6.5rem);
      width: clamp(420px, 80vw, 820px);
    }

    .focus-clock::before,
    .focus-clock::after {
      content: '';
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
      width: clamp(12px, 2vw, 24px);
      height: clamp(10rem, 30vh, 18rem);
      opacity: 0.55;
      border-radius: 0;
    }

    .focus-clock::before {
      left: 0;
      border: 2px solid rgba(255, 255, 255, 0.85);
      border-right: none;
    }

    .focus-clock::after {
      right: 0;
      border: 2px solid rgba(255, 255, 255, 0.85);
      border-left: none;
    }

    .font-marker {
      font-family: 'Marker SD', 'Plus Jakarta Sans', sans-serif;
      letter-spacing: 0.2em;
    }
  `}</style>
);

// --- ASSETS ---
const ALARM_SOUND_URL = 'https://actions.google.com/sounds/v1/alarms/beep_short.ogg';

// --- CHROME LOADER ---
const DOTS = [
  { x: 0, y: -56, size: 9 },
  { x: 0, y: 56, size: 9 },
  { x: -56, y: 0, size: 9 },
  { x: 56, y: 0, size: 9 },
  { x: 0, y: -28, size: 13 },
  { x: 0, y: 28, size: 13 },
  { x: -28, y: 0, size: 13 },
  { x: 28, y: 0, size: 13 },
  { x: 0, y: 0, size: 16 },
  { x: -18, y: -18, size: 7 },
  { x: 18, y: -18, size: 7 },
  { x: -18, y: 18, size: 7 },
  { x: 18, y: 18, size: 7 },
  { x: -10, y: 0, size: 6 },
  { x: 10, y: 0, size: 6 },
  { x: 0, y: -10, size: 6 },
  { x: 0, y: 10, size: 6 },
];

const ChromeLoader = () => {
  const [activeDots, setActiveDots] = useState(new Set());

  useEffect(() => {
    const chooseDots = () => {
      const count = Math.max(1, Math.floor(Math.random() * 2) + 1); // 1-2 dots
      const indices = [];
      const available = [...DOTS.keys()];
      while (indices.length < count && available.length) {
        const idx = Math.floor(Math.random() * available.length);
        indices.push(available.splice(idx, 1)[0]);
      }
      setActiveDots(new Set(indices));
    };

    chooseDots();
    const id = setInterval(chooseDots, 600);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center space-y-2 text-center z-50 fade-in">
      <div className="relative w-40 h-40 sm:w-44 sm:h-44 mx-auto">
        {DOTS.map((dot, idx) => {
          const isActive = activeDots.has(idx);
          const scale = isActive ? 1.9 : 1;
          return (
            <div
              key={idx}
              className="absolute rounded-full bg-slate-900 transition-transform duration-500 ease-in-out"
              style={{
                width: dot.size,
                height: dot.size,
                left: '50%',
                top: '50%',
                transform: `translate(${dot.x}px, ${dot.y}px) scale(${scale})`,
                boxShadow: isActive ? '0 0 0 8px rgba(15,23,42,0.06)' : 'none',
              }}
            />
          );
        })}
      </div>
      <p className="text-slate-500 text-xs font-medium tracking-[0.3em] uppercase animate-pulse">Analyzing</p>
    </div>
  );
};

// --- MAIN LOGIC ---

// Remove unused 'task' parameter
const fetchAIPlan = async (task) => {
  const res = await fetch("/api/plan", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ task }),
  });

  if (!res.ok) throw new Error("Gemini request failed");

  return res.json(); // { steps: [...] }
};


const generateId = () => Math.random().toString(36).substr(2, 9);
const normalizeProjects = (projects = []) => projects.map(project => ({
    ...project,
    completed: !!project.completed,
    position: project.position || { x: 0, y: 0 },
    steps: (project.steps || []).map(step => {
        const duration = Number(step.duration) || 0;
        const totalSeconds = duration * 60;
        const rawRemaining = typeof step.remainingSeconds === 'number' 
            ? Math.min(step.remainingSeconds, totalSeconds || 0) 
            : totalSeconds;
        const completed = !!step.completed || rawRemaining === 0;
        const remainingSeconds = completed ? 0 : rawRemaining;
        return { 
            ...step, 
            duration,
            remainingSeconds,
            completed
        };
    })
}));

const getStepProgress = (step) => {
    const totalSeconds = (Number(step.duration) || 0) * 60;
    const remainingSeconds = typeof step.remainingSeconds === 'number' ? step.remainingSeconds : totalSeconds;
    if (!totalSeconds) return 0;
    const progress = 1 - remainingSeconds / totalSeconds;
    return Math.max(0, Math.min(1, progress));
};

export default function ModernMicroPlanner() {
  // State
  const [projects, setProjects] = useState([]);
  const [taskInput, setTaskInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [expandedProjectId, setExpandedProjectId] = useState(null);
  
  // Focus State
  const [activeProjectId, setActiveProjectId] = useState(null);
  const [view, setView] = useState('dashboard'); // 'dashboard', 'focus'
  const [focusStepIndex, setFocusStepIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [rewindArmed, setRewindArmed] = useState(false);
  const [draggingProjectId, setDraggingProjectId] = useState(null);
  const dragPositionRef = useRef({ x: 0, y: 0, startX: 0, startY: 0, projectId: null });

  // Drag and Drop State
  const dragItem = useRef(null);
  const dragOverItem = useRef(null);

  const audioRef = useRef(null);
  const inputRef = useRef(null);
  const audioCtxRef = useRef(null);

  // Load/Save
useEffect(() => {
    const saved = localStorage.getItem('modern_planner_v1');
    if (saved) {
        const normalized = normalizeProjects(JSON.parse(saved));
        const activeOnly = normalized.filter(p => !p.completed);
        setProjects(activeOnly);
    }
    audioRef.current = new Audio(ALARM_SOUND_URL);
  }, []);

  useEffect(() => {
    localStorage.setItem('modern_planner_v1', JSON.stringify(projects));
  }, [projects]);


  // --- HANDLERS ---

  const handleGenerate = async () => {
    setIsLoading(true);
    try {
      const result = await fetchAIPlan(taskInput);
      const newProject = {
        id: generateId(),
        title: taskInput,
        completed: false,
        position: { x: 0, y: 0 },
        steps: result.steps.map(s => ({
          ...s, 
          completed: false,
          remainingSeconds: (s.duration || 0) * 60
        })),
        createdAt: Date.now()
      };
      setProjects(prev => {
        const posY = prev.length * 220;
        return [{ ...newProject, position: { x: 0, y: posY } }, ...prev];
      });
      setTaskInput('');
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };



  // Drag Sorting
  const handleSort = () => {
    let _projects = [...projects];
    const draggedItemContent = _projects.splice(dragItem.current, 1)[0];
    _projects.splice(dragOverItem.current, 0, draggedItemContent);
    dragItem.current = null;
    dragOverItem.current = null;
    setProjects(_projects);
  };

  // Free-move task cards
  const handleProjectMouseDown = (projectId) => (e) => {
      if (['INPUT', 'TEXTAREA', 'BUTTON', 'SELECT'].includes(e.target.tagName)) return;
      const project = projects.find(p => p.id === projectId);
      if (!project) return;
      const pos = project.position || { x: 0, y: 0 };
      dragPositionRef.current = { x: pos.x, y: pos.y, startX: e.clientX, startY: e.clientY, projectId };
      setDraggingProjectId(projectId);
  };

  useEffect(() => {
      if (!draggingProjectId) return;

      const handleMove = (e) => {
          const { x, y, startX, startY, projectId } = dragPositionRef.current;
          const dx = e.clientX - startX;
          const dy = e.clientY - startY;
          const nextX = x + dx;
          const nextY = y + dy;
          setProjects(prev => prev.map(p => p.id === projectId ? { ...p, position: { x: nextX, y: nextY } } : p));
      };

      const handleUp = () => {
          setDraggingProjectId(null);
          dragPositionRef.current = { x: 0, y: 0, startX: 0, startY: 0, projectId: null };
      };

      window.addEventListener('mousemove', handleMove);
      window.addEventListener('mouseup', handleUp);
      return () => {
          window.removeEventListener('mousemove', handleMove);
          window.removeEventListener('mouseup', handleUp);
      };
  }, [draggingProjectId]);

  // Editing Logic
  const updateStep = (projId, stepIndex, field, value) => {
    setProjects(prev => prev.map(p => {
        if (p.id !== projId) return p;
        const newSteps = [...p.steps];
        const existingStep = newSteps[stepIndex];

        if (field === 'duration') {
            const newDuration = Number(value) || 0;
            const prevTotal = (existingStep.duration || 0) * 60;
            const newTotal = newDuration * 60;
            const prevRemaining = typeof existingStep.remainingSeconds === 'number' ? existingStep.remainingSeconds : prevTotal;
            const progressRatio = prevTotal ? 1 - prevRemaining / prevTotal : 0;
            const newRemaining = Math.max(0, Math.round(newTotal * (1 - progressRatio)));

            newSteps[stepIndex] = { 
                ...existingStep, 
                duration: newDuration,
                remainingSeconds: newRemaining
            };
        } else {
            newSteps[stepIndex] = { ...existingStep, [field]: value };
        }
        return { ...p, steps: newSteps };
    }));
  };

  const addStep = (projId) => {
      setProjects(prev => prev.map(p => {
          if(p.id !== projId) return p;
          return { 
            ...p, 
            steps: [
              ...p.steps, 
              { title: "New Step", duration: 15, completed: false, remainingSeconds: 15 * 60 }
            ] 
          };
      }));
  };

  // Autosize helper for multiline step inputs
  const autoSizeTextarea = (el) => {
      if (!el) return;
      el.style.height = 'auto';
      el.style.height = `${el.scrollHeight}px`;
  };

  const toggleProjectCompleted = (projId) => {
      setProjects(prev => prev.map(p => p.id === projId ? { ...p, completed: !p.completed } : p));
  };

  // Focus Logic
  const enterFocusMode = (projId) => {
      const proj = projects.find(p => p.id === projId);
      const firstIncomplete = proj.steps.findIndex(s => !s.completed);
      setFocusStepIndex(firstIncomplete !== -1 ? firstIncomplete : 0);
      
      const targetStep = proj.steps[firstIncomplete !== -1 ? firstIncomplete : 0];
      const initialRemaining = typeof targetStep.remainingSeconds === 'number' ? targetStep.remainingSeconds : targetStep.duration * 60;
      setTimeLeft(initialRemaining);
      
      setActiveProjectId(projId);
      setView('focus');
      setIsTimerRunning(true);
  };

  // Reset rewind arming when the focused step changes
  useEffect(() => {
      setRewindArmed(false);
  }, [focusStepIndex, activeProjectId]);

  // Play 3 quick beeps followed by one longer beep when a step ends
  const playStepCompletionSound = () => {
      try {
          const AudioContext = window.AudioContext || window.webkitAudioContext;
          if (!audioCtxRef.current) {
              audioCtxRef.current = new AudioContext();
          }
          const ctx = audioCtxRef.current;
          const startTime = ctx.currentTime;

          const playTone = (frequency, delay, duration, volume = 0.08) => {
              const oscillator = ctx.createOscillator();
              const gainNode = ctx.createGain();
              oscillator.type = 'sine';
              oscillator.frequency.value = frequency;
              oscillator.connect(gainNode);
              gainNode.connect(ctx.destination);
              gainNode.gain.setValueAtTime(volume, startTime + delay);
              gainNode.gain.exponentialRampToValueAtTime(0.0001, startTime + delay + duration);
              oscillator.start(startTime + delay);
              oscillator.stop(startTime + delay + duration);
          };

          // 3 quick beeps
          playTone(880, 0, 0.12);
          playTone(880, 0.18, 0.12);
          playTone(880, 0.36, 0.12);
          // Final longer beep
          playTone(660, 0.6, 0.6, 0.1);
      } catch (err) {
          console.error('AudioContext unavailable, using fallback beep', err);
          audioRef.current?.play();
      }
  };

  // Timer Effect
  useEffect(() => {
    let interval = null;
    if (isTimerRunning && timeLeft > 0) {
        interval = setInterval(() => setTimeLeft(t => t - 1), 1000);
    } else if (timeLeft === 0 && isTimerRunning) {
        setIsTimerRunning(false);
        playStepCompletionSound();
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, timeLeft]);

  // Helpers
  const formatFocusTime = (seconds) => {
      const totalMinutes = Math.floor(seconds / 60);
      const secs = seconds % 60;
      const mins = Math.max(0, totalMinutes);
      return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  const getProjectTotalTime = (steps) => steps.reduce((acc, s) => acc + parseInt(s.duration || 0), 0);

  const handlePrevOrRestart = () => {
      if (!activeProjectId) return;
      const project = projects.find(p => p.id === activeProjectId);
      if (!project) return;
      const currentStep = project.steps[focusStepIndex];
      const totalSeconds = (currentStep?.duration || 0) * 60;
      const elapsed = Math.max(0, totalSeconds - timeLeft);

      const goToPreviousStep = () => {
          if (focusStepIndex === 0) {
              setTimeLeft(totalSeconds);
              setIsTimerRunning(true);
              setRewindArmed(true);
              return;
          }
          const prevIndex = Math.max(0, focusStepIndex - 1);
          const prevStep = project.steps[prevIndex];
          const prevTotal = (prevStep?.duration || 0) * 60;
          const prevRemaining = prevTotal || 0;
          setProjects(prev => prev.map(p => {
              if (p.id !== activeProjectId) return p;
              const updatedSteps = p.steps.map((s, idx) => {
                  if (idx === prevIndex) return { ...s, completed: false, remainingSeconds: prevRemaining };
                  if (idx === focusStepIndex) return { ...s, completed: false, remainingSeconds: totalSeconds };
                  return s;
              });
              return { ...p, steps: updatedSteps };
          }));
          setFocusStepIndex(prevIndex);
          setTimeLeft(prevRemaining);
          setIsTimerRunning(true);
          setRewindArmed(false);
      };

      // If we're early in the step or the rewind was already armed, go to the previous step
      if (elapsed <= 10 || rewindArmed) {
          goToPreviousStep();
          return;
      }

      // First rewind: restart current step and arm the next rewind for jumping back
      setProjects(prev => prev.map(p => {
          if (p.id !== activeProjectId) return p;
          const updatedSteps = p.steps.map((s, idx) => idx === focusStepIndex ? { ...s, completed: false, remainingSeconds: totalSeconds } : s);
          return { ...p, steps: updatedSteps };
      }));
      setTimeLeft(totalSeconds);
      setIsTimerRunning(true);
      setRewindArmed(true);
  };

  // Persist remaining time for current step so dashboards show partial progress
  useEffect(() => {
    if (!activeProjectId || view !== 'focus') return;
    setProjects(prev => prev.map(project => {
        if (project.id !== activeProjectId) return project;
        const updatedSteps = project.steps.map((step, idx) => {
            if (idx !== focusStepIndex) return step;
            const totalSeconds = (step.duration || 0) * 60;
            const bounded = Math.max(0, Math.min(totalSeconds, timeLeft));
            return { ...step, remainingSeconds: bounded };
        });
        return { ...project, steps: updatedSteps };
    }));
  }, [timeLeft, activeProjectId, focusStepIndex, view]);


  // --- RENDER ---

  return (
    <div className="min-h-screen text-slate-800 relative overflow-x-hidden selection:bg-blue-100">
      <FontStyles />

      {/* Bullet journal style background */}
      {view === 'dashboard' && (
        <>
          <div className="bullet-page pointer-events-none" aria-hidden />
          <div className="bullet-margin" aria-hidden />
        </>
      )}

      {/* --- VIEW: DASHBOARD --- */}
      {view === 'dashboard' && (
        <div className="relative z-10 w-full max-w-3xl mx-auto px-8 pt-12 pb-16 min-h-screen flex flex-col">
            
            {/* Header */}
            <div className="mt-12 mb-8 text-center space-y-2">
                <h1 className="text-4xl font-light tracking-tight text-slate-900">
                   plan.ai
                </h1>
                <p className="text-slate-700 text-base font-medium tracking-widest font-marker">task step generator and time estimator</p>
            </div>

            {/* INPUT PILL */}
            <div className="relative group mb-12 z-50">
                {isLoading ? (
                    <div className="flex justify-center items-center py-12">
                        <ChromeLoader />
                    </div>
                ) : (
                    <form
                        onSubmit={async (e) => {
                            e.preventDefault();
                            if (taskInput.trim() && !isLoading) {
                                await handleGenerate();
                            }
                        }}
                        className="transition-all duration-300 hover:shadow-lg rounded-xl shadow-md bg-white/80 backdrop-blur-xl border-2 border-dashed border-black/70 flex items-center gap-3 px-4 py-3"
                        onClick={() => inputRef.current?.focus()}
                    >
                        <button
                            type="submit"
                            disabled={!taskInput.trim() || isLoading}
                            className="flex items-center justify-center w-9 h-9 rounded-lg text-black/80 hover:bg-black/5 transition-all disabled:opacity-40 disabled:cursor-not-allowed flex-shrink-0"
                        >
                            <Plus size={18} strokeWidth={2.5} />
                        </button>
                        <input 
                            ref={inputRef}
                            type="text"
                            value={taskInput}
                            onChange={(e) => setTaskInput(e.target.value)}
                            placeholder="What needs to be done?"
                            className="flex-1 bg-transparent text-lg font-light text-slate-800 placeholder:text-slate-400 outline-none border-none"
                        />
                    </form>
                )}
            </div>

            {/* TASK LIST (Draggable) */}
            <div className="space-y-4 flex-1 pb-20">
                {projects.length === 0 && !isLoading && (
                    <div className="text-center text-slate-300 py-20 font-light">
                        Start by typing a task above
                    </div>
                )}

                {projects.map((project, index) => {
                    return (
                        <div
                            key={project.id}
                            draggable
                            onDragStart={() => (dragItem.current = index)}
                            onDragEnter={() => (dragOverItem.current = index)}
                            onDragEnd={handleSort}
                            onDragOver={(e) => e.preventDefault()}
                            className="bg-white/60 backdrop-blur-md border border-white/50 rounded-3xl shadow-sm hover:shadow-md transition-all group overflow-hidden"
                        >
                            {/* Card Header */}
                            <div className="p-5 flex items-center gap-4">
                                {/* Drag Handle */}
                                <div className="cursor-grab active:cursor-grabbing text-slate-300 hover:text-slate-500">
                                    <GripVertical size={18} />
                                </div>

                                {/* Title & Info */}
                                <div className="flex-1 flex flex-col gap-2">
                                    <div className="flex items-center gap-3">
                                        <input
                                            type="checkbox"
                                            checked={project.completed}
                                            onChange={() => toggleProjectCompleted(project.id)}
                                            onClick={(e) => e.stopPropagation()}
                                            className="w-4 h-4 rounded-sm border-2 border-slate-300 text-slate-700 focus:ring-2 focus:ring-slate-300"
                                            style={{ accentColor: '#000' }}
                                            aria-label="Mark task as complete"
                                        />
                                        <div 
                                            className="cursor-pointer"
                                            onClick={() => setExpandedProjectId(expandedProjectId === project.id ? null : project.id)}
                                        >
                                            <h3 className={`text-lg font-medium ${project.completed ? 'text-slate-400 line-through' : 'text-slate-700'}`}>
                                                {project.title}
                                            </h3>
                                        </div>
                                    </div>

                                    <div className="flex items-center text-xs text-slate-500 font-medium gap-1">
                                        <span className="inline-flex items-center gap-1 whitespace-nowrap">
                                            <Clock size={12} /> <span className="font-semibold text-slate-700">{getProjectTotalTime(project.steps)}</span> min
                                        </span>
                                        <TbNorthStar size={6} className="text-slate-500 flex-shrink-0 ml-2.5" />
                                        <button
                                            type="button"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setExpandedProjectId(expandedProjectId === project.id ? null : project.id);
                                            }}
                                            className="flex items-center justify-center gap-[2px] text-slate-500 hover:text-slate-700 transition-colors h-8 px-1.5 leading-none"
                                        >
                                        <span className="ml-0.5"><span className="font-semibold text-slate-700">{project.steps.length}</span> steps</span>
                                            {expandedProjectId === project.id ? (
                                                <ChevronDown size={14} />
                                            ) : (
                                                <ChevronRight size={14} />
                                            )}
                                        </button>
                                    </div>
                                </div>

                                {/* Actions */}
                                <button 
                                    onClick={() => enterFocusMode(project.id)}
                                    className="w-10 h-10 flex items-center justify-center text-slate-900 hover:text-black transition-all hover:drop-shadow-[0_0_16px_rgba(148,163,184,0.95)] hover:brightness-110"
                                    title="Start Focus Mode"
                                >
                                    <span className="relative flex items-center justify-center w-6 h-6 group/icon">
                                        <PiPlayThin className="text-current transition-opacity duration-150 group-hover/icon:opacity-0" size={20} />
                                        <PiPlayDuotone className="text-current transition-opacity duration-150 opacity-0 group-hover/icon:opacity-100 absolute" size={20} />
                                    </span>
                                </button>
                            </div>

                            {/* Accordion Body */}
                            {expandedProjectId === project.id && (
                                <div className="bg-white/50 border-t border-slate-100 p-5 animate-in slide-in-from-top-2 fade-in duration-200">
                                    <div className="flex items-center justify-between mb-4 px-2">
                                        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Execution Steps</span>
                                        <button onClick={() => addStep(project.id)} className="text-black hover:text-slate-700 text-xs font-bold flex items-center gap-1">
                                            <Plus size={12} /> Add Step
                                        </button>
                                    </div>

                                <div className="space-y-3 relative font-steps">
                                        {/* Vertical Line Connector */}
                                        <div className="absolute left-[15px] top-2 bottom-2 w-[2px] bg-slate-100" />

                                        {project.steps.map((step, stepIdx) => {
                                            const progress = Math.round(getStepProgress(step) * 100);
                                            const minutesLeft = Math.max(0, Math.ceil((step.remainingSeconds ?? step.duration * 60) / 60));
                                            const isActiveFocusStep = view === 'focus' && activeProjectId === project.id && focusStepIndex === stepIdx;
                                            const statusIcon = (() => {
                                                if (step.completed) return <PiStarFourFill className="text-slate-900" size={18} />;
                                                if (isActiveFocusStep || progress > 0) return <PiStarFourDuotone className="text-slate-700" size={18} />;
                                                return <PiStarFourThin className="text-slate-500" size={18} />;
                                            })();

                                            return (
                                                <div key={stepIdx} className="relative pl-8 flex flex-col gap-2 group/step">
                                                    {/* Node */}
                                                    <div className="absolute left-[6px] top-[6px] z-10">
                                                        {statusIcon}
                                                    </div>
                                                    
                                                    <div className="grid grid-cols-1 sm:grid-cols-[minmax(0,1fr)_auto] items-start gap-3 sm:gap-4">
                                                        <div className="flex-1 min-w-[220px] sm:min-w-[280px] max-w-full">
                                                            <textarea
                                                                rows={1}
                                                                className="w-full bg-transparent border-none p-0 text-sm font-medium text-slate-700 focus:ring-0 focus:text-blue-600 placeholder:text-slate-300 resize-none leading-6 overflow-hidden"
                                                                ref={autoSizeTextarea}
                                                                value={step.title}
                                                                onChange={(e) => updateStep(project.id, stepIdx, 'title', e.target.value)}
                                                                onInput={(e) => autoSizeTextarea(e.target)}
                                                            />
                                                        </div>
                                                        
                                                        <div className="flex items-center gap-2 border-2 border-dashed border-black/70 bg-white/80 rounded-md px-3 py-1 shadow-[0_4px_14px_rgba(0,0,0,0.04)] flex-shrink-0">
                                                            <input 
                                                                type="number"
                                                                className="w-12 bg-transparent text-right text-xs font-mono text-slate-700 focus:outline-none appearance-none m-0"
                                                                value={step.duration}
                                                                onChange={(e) => updateStep(project.id, stepIdx, 'duration', e.target.value)}
                                                            />
                                                            <span className="text-[11px] text-slate-600 font-semibold whitespace-nowrap">min</span>
                                                        </div>
                                                    </div>

                                                    <div className="flex flex-col gap-1">
                                                        <div className="h-1.5 rounded-full bg-slate-100 overflow-hidden">
                                                            <div 
                                                                className={`h-full rounded-full transition-all duration-500 ${step.completed ? 'bg-black' : 'bg-slate-400'}`} 
                                                                style={{ width: `${progress}%` }} 
                                                            />
                                                        </div>
                                                        <div className="flex justify-between text-[10px] text-slate-400 uppercase tracking-[0.08em]">
                                                            <span>{progress}% done</span>
                                                            <span>{minutesLeft}m left</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>

                                    <div className="mt-6 flex justify-end">
                                         <button 
                                            onClick={() => setProjects(projects.filter(p => p.id !== project.id))}
                                            className="text-red-400 hover:text-red-600 text-xs flex items-center gap-1 px-3 py-2 hover:bg-red-50 rounded-lg transition-colors"
                                        >
                                            <Trash2 size={14} /> Delete Task
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
      )}


      {/* --- VIEW: FOCUS MODE --- */}
      {view === 'focus' && activeProjectId && (() => {
         const project = projects.find(p => p.id === activeProjectId);
         if (!project) return null;
         const currentStep = project.steps[focusStepIndex];
         const focusTime = formatFocusTime(timeLeft).split(':');
         const focusMinutes = focusTime[0];
         const focusSeconds = focusTime[1];
         const totalSeconds = (currentStep?.duration || 0) * 60 || 0;
         const elapsedSeconds = Math.max(0, totalSeconds - timeLeft);
         const progressRatio = totalSeconds ? Math.min(1, Math.max(0, elapsedSeconds / totalSeconds)) : 0;
         
         return (
            <div className="fixed inset-0 z-50 bg-black text-white flex flex-col">
                <div className="grid grid-cols-[auto_1fr_auto] items-center px-6 md:px-10 py-6 text-[10px] tracking-[0.38em] uppercase text-white/60 gap-3">
                    <button
                        onClick={() => {
                            setIsTimerRunning(false);
                            setView('dashboard');
                        }}
                        className="flex items-center gap-2 text-white/60 hover:text-white transition-colors"
                    >
                        <X size={16} />
                        <span className="hidden sm:inline">Exit</span>
                    </button>
                    <span className="font-semibold text-white/80 truncate max-w-full text-center justify-self-center px-2">{project.title}</span>
                    <span className="w-[120px]" aria-hidden="true" />
                </div>

                <div className="flex-1 flex items-center justify-center">
                    <div className="focus-clock font-digital">
                        <span className="text-white text-[22vw] sm:text-[18vw] md:text-[12rem] font-semibold leading-none tabular-nums">{focusMinutes}</span>
                        <span className="text-white text-[12vw] sm:text-[10vw] md:text-[6rem] font-semibold leading-none tabular-nums">:</span>
                        <span className="text-white text-[22vw] sm:text-[18vw] md:text-[12rem] font-semibold leading-none tabular-nums">{focusSeconds}</span>
                    </div>
                </div>

                <div className="pb-8 flex flex-col items-center gap-4 px-4 text-center">
                    <div className="text-xs uppercase tracking-[0.3em] text-white/60">
                        Step {focusStepIndex + 1} / {project.steps.length}
                    </div>
                    <div className="text-sm md:text-base text-white/80 text-center px-6 max-w-3xl">
                        {currentStep.title}
                    </div>
                    <div className="w-full max-w-3xl px-6 mt-6">
                        <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                            <div 
                                className="h-full bg-white rounded-full transition-all duration-300 ease-linear" 
                                style={{ width: `${progressRatio * 100}%` }} 
                            />
                        </div>
                    </div>

                    <div className="flex items-center justify-center gap-10 mt-6">
                        <button
                            onClick={handlePrevOrRestart}
                            className="text-white/80 hover:text-white transition-transform duration-150 hover:scale-110"
                            aria-label="Previous step or restart"
                        >
                            <LiaFastForwardSolid style={{ transform: 'scaleX(-1)' }} size={30} />
                        </button>

                        <button 
                            onClick={() => setIsTimerRunning(!isTimerRunning)}
                            className="text-white hover:text-white transition-transform duration-150 hover:scale-110"
                            aria-label={isTimerRunning ? 'Pause timer' : 'Start timer'}
                        >
                            <PiPlayPauseThin size={40} className="text-white" />
                        </button>
                        
                        <button 
                            onClick={() => {
                                // Complete step logic
                                const newProjects = projects.map(p => {
                                    if (p.id !== activeProjectId) return p;
                                    const updatedSteps = p.steps.map((s, idx) => idx === focusStepIndex ? { ...s, completed: true, remainingSeconds: 0 } : s);
                                    return { ...p, steps: updatedSteps };
                                });
                                setProjects(newProjects);

                                const updatedProject = newProjects.find(p => p.id === activeProjectId);

                                if (focusStepIndex < updatedProject.steps.length - 1) {
                                    const nextStep = updatedProject.steps[focusStepIndex + 1];
                                    setFocusStepIndex(f => f + 1);
                                    setTimeLeft(typeof nextStep.remainingSeconds === 'number' ? nextStep.remainingSeconds : nextStep.duration * 60);
                                    setIsTimerRunning(true);
                                } else {
                                    setView('dashboard');
                                    setIsTimerRunning(false);
                                }
                            }}
                            className="text-white/80 hover:text-white transition-transform duration-150 hover:scale-110"
                        >
                            <LiaFastForwardSolid size={30} />
                        </button>
                    </div>
                </div>
            </div>
         );
      })()}
    </div>
  );
}
