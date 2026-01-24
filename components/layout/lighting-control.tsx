'use client';

import { useEffect, useState } from 'react';

interface LightingSettings {
  brightness: number;
  contrast: number;
  saturation: number;
  temperature: number;
}

const presets: Record<string, LightingSettings> = {
  dark: { brightness: 75, contrast: 105, saturation: 95, temperature: 5 },
  normal: { brightness: 110, contrast: 105, saturation: 110, temperature: 5 },
  vivid: { brightness: 125, contrast: 115, saturation: 135, temperature: 10 },
  vibrant: { brightness: 135, contrast: 120, saturation: 150, temperature: 12 },
};

export function LightingControl() {
  const [isOpen, setIsOpen] = useState(false);
  const [currentPreset, setCurrentPreset] = useState<string>('normal');
  const [masterValue, setMasterValue] = useState(105);

  useEffect(() => {
    // Load saved settings from localStorage
    const savedPreset = localStorage.getItem('lightingPreset');
    const savedMaster = localStorage.getItem('lightingMaster');
    
    if (savedPreset && presets[savedPreset]) {
      setCurrentPreset(savedPreset);
    } else {
      setCurrentPreset('normal');
    }
    
    if (savedMaster) {
      const value = parseInt(savedMaster, 10);
      setMasterValue(value);
      adjustMaster(value);
    } else {
      // Apply default master value if none saved
      adjustMaster(105);
    }
  }, []);

  const applySettings = (settings: LightingSettings) => {
    const body = document.body;
    if (body) {
      const tempAdjust = settings.temperature;
      const warm = tempAdjust > 0 ? Math.abs(tempAdjust) : 0;
      const cool = tempAdjust < 0 ? Math.abs(tempAdjust) : 0;
      
      const filters = [
        `brightness(${settings.brightness}%)`,
        `contrast(${settings.contrast}%)`,
        `saturate(${settings.saturation}%)`,
      ];

      if (warm > 0) {
        filters.push(`sepia(${warm * 0.3}%)`);
        filters.push(`hue-rotate(${warm * 0.3}deg)`);
      }
      if (cool > 0) {
        filters.push(`sepia(${cool * 0.2}%)`);
        filters.push(`hue-rotate(${-cool * 0.4}deg)`);
      }

      body.style.filter = filters.join(' ');
      body.style.transition = 'filter 0.3s ease';
    }
  };

  const adjustMaster = (value: number) => {
    const basePreset = presets[currentPreset];
    const multiplier = value / 100;
    
    const adjustedSettings: LightingSettings = {
      brightness: Math.max(70, Math.min(160, basePreset.brightness * multiplier)),
      contrast: Math.max(90, Math.min(140, basePreset.contrast * multiplier)),
      saturation: Math.max(85, Math.min(170, basePreset.saturation * multiplier)),
      temperature: basePreset.temperature * multiplier * 0.5,
    };
    
    applySettings(adjustedSettings);
  };

  const handlePresetChange = (preset: string) => {
    // Only update if it's a different preset
    if (preset === currentPreset) {
      // If clicking the same preset, reapply it to ensure consistency
      adjustMaster(masterValue);
      return;
    }
    
    setCurrentPreset(preset);
    localStorage.setItem('lightingPreset', preset);
    // Apply the new preset with current master value
    adjustMaster(masterValue);
  };

  const handleMasterChange = (value: number) => {
    setMasterValue(value);
    adjustMaster(value);
    localStorage.setItem('lightingMaster', value.toString());
  };

  return (
    <div className="relative">
      {/* Main control button - aligned with header */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="group relative flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all duration-300"
        aria-label="Contrôle d'éclairage"
      >
        <span className="text-white/70 text-xs font-light tracking-wider">
          {isOpen ? '×' : 'Light'}
        </span>
      </button>

      {/* Control panel */}
      {isOpen && (
        <div className="absolute top-full right-0 mt-2 w-64 bg-white/5 backdrop-blur-xl border border-white/10 rounded-lg p-5 shadow-lg z-50">
          {/* Header */}
          <div className="mb-5">
            <h3 className="text-white/80 text-xs font-light uppercase tracking-wider mb-4">
              Éclairage
            </h3>
            
            {/* Master slider - increased range */}
            <div className="mb-2">
              <div className="flex items-center justify-between mb-2">
                <label className="text-white/70 text-xs font-light">
                  Intensité
                </label>
                <span className="text-white/50 text-xs">{masterValue}%</span>
              </div>
              <input
                type="range"
                min="80"
                max="150"
                value={masterValue}
                onChange={(e) => handleMasterChange(parseInt(e.target.value, 10))}
                className="w-full h-1 bg-white/10 rounded-full appearance-none cursor-pointer master-slider"
                style={{
                  background: `linear-gradient(to right, rgba(255, 255, 255, 0.3) 0%, rgba(255, 255, 255, 0.3) ${((masterValue - 80) / 70) * 100}%, rgba(255, 255, 255, 0.1) ${((masterValue - 80) / 70) * 100}%, rgba(255, 255, 255, 0.1) 100%)`,
                }}
              />
            </div>
          </div>

          {/* Presets */}
          <div className="space-y-2">
            <button
              type="button"
              onClick={() => handlePresetChange('dark')}
              className={`w-full px-3 py-2 rounded border transition-all duration-300 text-xs font-light ${
                currentPreset === 'dark'
                  ? 'bg-white/10 border-white/20 text-white'
                  : 'bg-transparent border-white/10 text-white/60 hover:bg-white/5 hover:border-white/15 hover:text-white/80'
              }`}
            >
              Sombre
            </button>
            <button
              type="button"
              onClick={() => handlePresetChange('normal')}
              className={`w-full px-3 py-2 rounded border transition-all duration-300 text-xs font-light ${
                currentPreset === 'normal'
                  ? 'bg-white/10 border-white/20 text-white'
                  : 'bg-transparent border-white/10 text-white/60 hover:bg-white/5 hover:border-white/15 hover:text-white/80'
              }`}
            >
              Normal
            </button>
            <button
              type="button"
              onClick={() => handlePresetChange('vivid')}
              className={`w-full px-3 py-2 rounded border transition-all duration-300 text-xs font-light ${
                currentPreset === 'vivid'
                  ? 'bg-white/10 border-white/20 text-white'
                  : 'bg-transparent border-white/10 text-white/60 hover:bg-white/5 hover:border-white/15 hover:text-white/80'
              }`}
            >
              Vif
            </button>
            <button
              type="button"
              onClick={() => handlePresetChange('vibrant')}
              className={`w-full px-3 py-2 rounded border transition-all duration-300 text-xs font-light ${
                currentPreset === 'vibrant'
                  ? 'bg-white/10 border-white/20 text-white'
                  : 'bg-transparent border-white/10 text-white/60 hover:bg-white/5 hover:border-white/15 hover:text-white/80'
              }`}
            >
              Vibrant
            </button>
          </div>

          <style jsx>{`
            .master-slider::-webkit-slider-thumb {
              appearance: none;
              width: 14px;
              height: 14px;
              border-radius: 50%;
              background: white;
              cursor: pointer;
              box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
              transition: all 0.2s ease;
            }
            .master-slider::-webkit-slider-thumb:hover {
              transform: scale(1.2);
              box-shadow: 0 3px 6px rgba(0, 0, 0, 0.3);
            }
            .master-slider::-moz-range-thumb {
              width: 14px;
              height: 14px;
              border-radius: 50%;
              background: white;
              cursor: pointer;
              border: none;
              box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
              transition: all 0.2s ease;
            }
            .master-slider::-moz-range-thumb:hover {
              transform: scale(1.2);
              box-shadow: 0 3px 6px rgba(0, 0, 0, 0.3);
            }
          `}</style>
        </div>
      )}
    </div>
  );
}