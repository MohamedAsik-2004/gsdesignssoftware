import React, { useState, useEffect } from 'react';
import { FlexSpecs } from '../types';
import { Calculator, Maximize2, Sparkles, Check } from 'lucide-react';

interface FlexCalculatorProps {
  initialSpecs?: FlexSpecs;
  onChange: (specs: FlexSpecs) => void;
}

export const FlexCalculator: React.FC<FlexCalculatorProps> = ({ initialSpecs, onChange }) => {
  const [widthFt, setWidthFt] = useState<number>(initialSpecs?.widthFt || 10);
  const [heightFt, setHeightFt] = useState<number>(initialSpecs?.heightFt || 4);
  const [ratePerSqFt, setRatePerSqFt] = useState<number>(initialSpecs?.ratePerSqFt || 20);
  const [finishType, setFinishType] = useState<FlexSpecs['finishType']>(initialSpecs?.finishType || 'Normal Flex');
  const [frameIncluded, setFrameIncluded] = useState<boolean>(initialSpecs?.frameIncluded || false);

  const sqFt = widthFt * heightFt;
  const flexBaseCost = sqFt * ratePerSqFt;
  const frameCost = frameIncluded ? sqFt * 12 : 0; // ₹12/sqft for iron frame
  const totalAmount = flexBaseCost + frameCost;

  useEffect(() => {
    onChange({
      widthFt,
      heightFt,
      sqFt,
      ratePerSqFt,
      finishType,
      frameIncluded
    });
  }, [widthFt, heightFt, ratePerSqFt, finishType, frameIncluded]);

  const presetSizes = [
    { w: 6, h: 3, label: '6×3 Banner' },
    { w: 10, h: 4, label: '10×4 Board' },
    { w: 12, h: 6, label: '12×6 Shop Board' },
    { w: 20, h: 10, label: '20×10 Arch' }
  ];

  const finishRates = [
    { name: 'Normal Flex', rate: 18, desc: 'Standard frontlit flex' },
    { name: 'Star Flex', rate: 25, desc: 'Heavy duty outdoor glossy' },
    { name: 'Vinyl Print', rate: 35, desc: 'High res self-adhesive vinyl' },
    { name: 'Backlit Flex', rate: 45, desc: 'Glow sign board flex' },
    { name: 'Cloth Banner', rate: 30, desc: 'Eco fabric banner' }
  ];

  return (
    <div className="bg-slate-900/90 rounded-2xl p-4 sm:p-5 border border-slate-800 space-y-4">
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center">
            <Calculator className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-slate-100">Flex Sq.Ft. Smart Calculator</h4>
            <p className="text-[11px] text-slate-400">Calculates banner area and custom finishes instantly</p>
          </div>
        </div>
        <div className="text-right">
          <span className="text-xs text-slate-400">Total Area</span>
          <p className="text-lg font-extrabold text-amber-400 font-mono">{sqFt} Sq.Ft</p>
        </div>
      </div>

      {/* Preset Quick Buttons */}
      <div>
        <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-1.5">
          Quick Preset Dimensions
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {presetSizes.map(p => (
            <button
              key={p.label}
              type="button"
              onClick={() => {
                setWidthFt(p.w);
                setHeightFt(p.h);
              }}
              className={`p-2 rounded-xl text-xs font-medium border transition-all text-center ${
                widthFt === p.w && heightFt === p.h 
                  ? 'bg-amber-500/20 border-amber-500/60 text-amber-300' 
                  : 'bg-slate-800/60 border-slate-700/60 text-slate-300 hover:bg-slate-800'
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {/* Dimensions Inputs */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div>
          <label className="text-xs text-slate-300 font-medium block mb-1">
            Width (in Feet)
          </label>
          <div className="relative">
            <input 
              type="number"
              min="1"
              max="100"
              value={widthFt}
              onChange={e => setWidthFt(Math.max(1, parseFloat(e.target.value) || 0))}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white font-mono focus:border-amber-500 focus:outline-none"
            />
            <span className="absolute right-3 top-2.5 text-xs text-slate-400">ft</span>
          </div>
        </div>

        <div>
          <label className="text-xs text-slate-300 font-medium block mb-1">
            Height (in Feet)
          </label>
          <div className="relative">
            <input 
              type="number"
              min="1"
              max="100"
              value={heightFt}
              onChange={e => setHeightFt(Math.max(1, parseFloat(e.target.value) || 0))}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white font-mono focus:border-amber-500 focus:outline-none"
            />
            <span className="absolute right-3 top-2.5 text-xs text-slate-400">ft</span>
          </div>
        </div>

        <div>
          <label className="text-xs text-slate-300 font-medium block mb-1">
            Rate / Sq.Ft (₹)
          </label>
          <div className="relative">
            <input 
              type="number"
              min="5"
              value={ratePerSqFt}
              onChange={e => setRatePerSqFt(Math.max(1, parseFloat(e.target.value) || 0))}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm text-amber-400 font-bold font-mono focus:border-amber-500 focus:outline-none"
            />
            <span className="absolute right-3 top-2.5 text-xs text-slate-400">₹/sqft</span>
          </div>
        </div>
      </div>

      {/* Material Finish Type */}
      <div>
        <label className="text-xs text-slate-300 font-medium block mb-1.5">
          Select Material / Finish Quality
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {finishRates.map(f => (
            <button
              key={f.name}
              type="button"
              onClick={() => {
                setFinishType(f.name as FlexSpecs['finishType']);
                setRatePerSqFt(f.rate);
              }}
              className={`p-2 rounded-xl text-left border transition-all ${
                finishType === f.name 
                  ? 'bg-amber-500/15 border-amber-500 text-white' 
                  : 'bg-slate-800/40 border-slate-700/60 text-slate-300 hover:bg-slate-800'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold">{f.name}</span>
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-700 text-amber-300">
                  ₹{f.rate}
                </span>
              </div>
              <span className="text-[10px] text-slate-400 block mt-0.5">{f.desc}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Addons (Frame inclusion) */}
      <div className="pt-2 flex items-center justify-between bg-slate-800/40 p-3 rounded-xl border border-slate-700/50">
        <label className="flex items-center space-x-2.5 cursor-pointer">
          <input 
            type="checkbox"
            checked={frameIncluded}
            onChange={e => setFrameIncluded(e.target.checked)}
            className="w-4 h-4 rounded text-amber-500 focus:ring-amber-500 bg-slate-900 border-slate-700"
          />
          <div>
            <span className="text-xs font-semibold text-slate-200 block">Include 1-inch Square Iron Frame</span>
            <span className="text-[10px] text-slate-400">Adds ₹12 per sq.ft framing charge</span>
          </div>
        </label>
        <span className="text-xs font-mono font-semibold text-amber-400">
          {frameIncluded ? `+ ₹${frameCost}` : 'No Frame'}
        </span>
      </div>
    </div>
  );
};
