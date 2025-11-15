"use client";

import React, { createContext, useContext, useState } from "react";

type Lang = "en" | "ar";

interface FontMap {
  en: string;
  ar: string;
}

interface LangContextType {
  lang: Lang;
  toggleLanguage: () => void;
  fontClass: string;
}

const LanguageContext = createContext<LangContextType>({
  lang: "en",
  toggleLanguage: () => {},
  fontClass: "",
});

export function LanguageProvider({
  children,
  fonts,
}: {
  children: React.ReactNode;
  fonts: FontMap;
}) {
  const [lang, setLang] = useState<Lang>("en");

  const toggleLanguage = () => {
    setLang((prev) => (prev === "en" ? "ar" : "en"));
  };

  return (
    <LanguageContext.Provider
      value={{
        lang,
        toggleLanguage,
        fontClass: fonts[lang],
      }}
    >
      {/* هنا ممكن تخليها div أو ترجع children مباشرة حسب احتياجك */}
      <div className={fonts[lang]}>{children}</div>
    </LanguageContext.Provider>
  );
}

export const useLanguage = () => useContext(LanguageContext);