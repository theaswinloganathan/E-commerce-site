import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { cn } from '../../lib/utils';

export default function SizeGuideModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          onClick={onClose}
        />
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          className="bg-white rounded-[2.5rem] max-w-2xl w-full overflow-hidden shadow-2xl relative z-10"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="p-8 md:p-12">
            <div className="flex justify-between items-center mb-10">
              <div>
                <p className="text-[10px] font-black text-brand-400 uppercase tracking-[0.4em] mb-2">Signature Fit</p>
                <h3 className="text-3xl font-serif font-black text-brand-950 uppercase tracking-tight">Size Guide</h3>
              </div>
              <button 
                onClick={onClose}
                className="w-12 h-12 bg-brand-50 rounded-2xl flex items-center justify-center text-brand-950 hover:bg-brand-100 transition-all active:scale-90 shadow-sm"
              >
                <X size={24} />
              </button>
            </div>

            <div className="overflow-x-auto rounded-3xl border-2 border-brand-50">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-brand-950 text-white">
                    <th className="p-5 text-[10px] font-black uppercase tracking-widest border-b border-white/10">Size</th>
                    <th className="p-5 text-[10px] font-black uppercase tracking-widest border-b border-white/10">Chest (in)</th>
                    <th className="p-5 text-[10px] font-black uppercase tracking-widest border-b border-white/10">Waist (in)</th>
                    <th className="p-5 text-[10px] font-black uppercase tracking-widest border-b border-white/10">Hips (in)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-brand-50">
                  {[
                    ["XS", "32", "26", "35"],
                    ["S", "34", "28", "37"],
                    ["M", "36", "30", "39"],
                    ["L", "38", "32", "41"],
                    ["XL", "40", "34", "43"]
                  ].map((row, i) => (
                    <tr key={i} className="hover:bg-brand-50/50 transition-colors">
                      <td className="p-5 font-black text-brand-950 uppercase text-xs">{row[0]}</td>
                      {row.slice(1).map((cell, j) => (
                        <td key={j} className="p-5 font-bold text-brand-500 text-xs">{cell}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="mt-10 p-6 bg-brand-50/50 rounded-2xl border border-brand-100">
              <p className="text-[10px] font-bold text-brand-400 uppercase tracking-widest mb-2">Artisan Tip</p>
              <p className="text-xs text-brand-950 font-medium leading-relaxed italic">
                Our silhouettes are designed for a premium, tailored fit. If you prefer a more relaxed drape, we recommend selecting one size larger.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
