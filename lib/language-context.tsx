"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

interface LanguageContextType {
  lang: "en" | "ar";
  setLang: (lang: "en" | "ar") => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({
  children,
  fontSelector,
}: {
  children: React.ReactNode;
  fontSelector: (lang: string) => string;
}) {
  const [lang, setLang] = useState<"en" | "ar">("en");

  // Update direction + font automatically
  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";

    const fontClass = fontSelector(lang);
    document.body.className = fontClass;
  }, [lang, fontSelector]);

  return (
    <LanguageContext.Provider value={{ lang, setLang }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLanguage must be used within LanguageProvider");
  return ctx;
}
