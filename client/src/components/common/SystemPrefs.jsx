import { useState, useEffect } from "react";

const themes = ["organic", "light", "dark", "cyber", "ocean", "sunset"];

export default function SystemPrefs() {
  const [theme, setTheme] = useState(
    localStorage.getItem("theme") || "organic"
  );

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  const handleThemeChange = (t) => {
    setTheme(t);
  };

  return (
    <div className="glass-card p-8">
      
      {/* Section Title */}
      <h3 className="text-xs font-black uppercase tracking-widest text-text-muted mb-6">
        Environmental Params
      </h3>

      {/* Theme Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {themes.map((t) => (
          <button
            key={t}
            onClick={() => handleThemeChange(t)}
            className={`
              relative px-6 py-4 rounded-xl text-xs font-bold uppercase tracking-widest
              border transition-all duration-300
              
              ${
                theme === t
                  ? "border-brand-primary text-brand-primary bg-brand-primary/10 shadow-lg shadow-brand-primary/10"
                  : "border-white/10 text-text-secondary hover:border-white/30 hover:text-white"
              }
            `}
          >
            {t}

            {/* Active Tick */}
            {theme === t && (
              <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-brand-primary"></span>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}