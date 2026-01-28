import { useState } from 'react';
import { Volume2, ScanFace, FileText } from 'lucide-react';
import { Modal } from '../ui/Modal';
import { playAudio } from '../../lib/tts';
import type { KanjiWithLevel } from '../../services/materi';

interface KanjiCardProps {
  kanji: KanjiWithLevel;
}

export default function KanjiCard({ kanji }: KanjiCardProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handlePlayAudio = (e: React.MouseEvent) => {
    e.stopPropagation();
    // Prioritize Onyomi if available, else Kunyomi
    const reading = kanji.onyomi || kanji.kunyomi || kanji.character;
    playAudio(reading);
  };

  const handleCardClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsModalOpen(true);
  };

  return (
    <>
      <div
        onClick={handleCardClick}
        className="group relative block cursor-pointer bg-canvas p-8 border-b border-r border-border-line hover:bg-inv-canvas hover:text-inv-ink transition-colors duration-200"
      >
        <div className="absolute top-4 left-4">
             <span className="text-xs font-bold tracking-widest uppercase border border-ink text-ink group-hover:text-inv-ink group-hover:border-inv-ink px-1.5 py-0.5">
               {kanji.jlpt_level || 'N/A'}
             </span>
        </div>

        <div className="flex flex-col items-center gap-6 mt-4">
          {/* Kanji Character */}
          <span className="font-jp text-7xl font-bold text-ink group-hover:text-inv-ink transition-transform duration-300 group-hover:scale-110">
            {kanji.character}
          </span>
          
          <div className="text-center">
             <p className="font-bold text-lg leading-none mb-2">{kanji.meaning}</p>
             <div className="flex gap-4 justify-center text-xs font-jp text-subtle group-hover:text-inv-ink">
                {kanji.onyomi && <span>{kanji.onyomi}</span>}
                {kanji.kunyomi && <span>{kanji.kunyomi}</span>}
             </div>
          </div>
        </div>

        {/* Hover Actions */}
        <div className="absolute content-center gap-2 bottom-4 right-4 flex opacity-0 group-hover:opacity-100 transition-opacity">
           {kanji.categories && (
             <span className="text-[10px] font-bold tracking-widest uppercase text-subtle border border-subtle px-1.5 py-0.5 mr-auto self-center">
               {kanji.categories.name}
             </span>
           )}
           <button onClick={handlePlayAudio} className="p-2 hover:bg-ink hover:text-canvas group-hover:border-inv-ink transition-colors border border-border-line">
              <Volume2 className="w-4 h-4" />
           </button>
        </div>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={`Detail Kanji: ${kanji.character}`}
      >
        <div className="space-y-8 p-4">
          <div className="flex items-start justify-between border-b border-border-line pb-6">
            <div>
               <h3 className="text-6xl font-black font-jp text-ink mb-2">{kanji.character}</h3>
               <p className="text-2xl font-medium text-subtle">{kanji.meaning}</p>
            </div>
            <button
              onClick={() => playAudio(kanji.onyomi || kanji.kunyomi || kanji.character)}
              className="btn-swiss"
            >
              <Volume2 className="w-6 h-6 mr-2" />
              Listen
            </button>
          </div>

          <div className="grid grid-cols-2 gap-px bg-border-line border border-border-line">
             <div className="bg-canvas p-6">
                <h4 className="text-xs font-bold tracking-widest uppercase text-subtle mb-4">Onyomi</h4>
                <div className="flex justify-between items-center">
                    <p className="font-jp text-2xl font-bold">{kanji.onyomi || '-'}</p>
                    {kanji.onyomi && (
                         <button onClick={() => playAudio(kanji.onyomi || '')} className="text-ink hover:text-brand-orange">
                            <Volume2 className="w-4 h-4" />
                         </button>
                    )}
                </div>
             </div>
             <div className="bg-canvas p-6">
                <h4 className="text-xs font-bold tracking-widest uppercase text-subtle mb-4">Kunyomi</h4>
                <div className="flex justify-between items-center">
                    <p className="font-jp text-2xl font-bold">{kanji.kunyomi || '-'}</p>
                    {kanji.kunyomi && (
                         <button onClick={() => playAudio(kanji.kunyomi || '')} className="text-ink hover:text-brand-orange">
                            <Volume2 className="w-4 h-4" />
                         </button>
                    )}
                </div>
             </div>
          </div>

          {kanji.examples && kanji.examples.length > 0 && (
            <div>
              <h4 className="text-xs font-bold tracking-widest uppercase text-subtle mb-4">Contoh Penggunaan</h4>
              <ul className="grid gap-px bg-border-line border border-border-line">
                {kanji.examples.map((ex, idx) => (
                  <li key={idx} className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 bg-canvas hover:bg-surface transition-colors">
                    <span className="font-jp text-xl font-medium">{ex}</span>
                    <button className="text-xs font-bold tracking-widest uppercase border border-ink px-2 py-1 hover:bg-ink hover:text-canvas transition-colors">
                        View Details
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </Modal>
    </>
  );
}
