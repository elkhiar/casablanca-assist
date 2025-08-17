import React from 'react';
import { Button } from '@/components/ui/button';

type Language = 'ar' | 'fr' | 'darija';

interface LanguageSelectorProps {
  selectedLanguage: Language;
  onLanguageChange: (language: Language) => void;
}

const LanguageSelector: React.FC<LanguageSelectorProps> = ({
  selectedLanguage,
  onLanguageChange
}) => {
  const languages = [
    { code: 'ar' as Language, label: 'العربية', nativeLabel: 'Arabe' },
    { code: 'darija' as Language, label: 'الدارجة', nativeLabel: 'Darija' },
    { code: 'fr' as Language, label: 'Français', nativeLabel: 'Français' }
  ];

  return (
    <div className="flex gap-3 justify-center">
      {languages.map((lang) => (
        <Button
          key={lang.code}
          variant={selectedLanguage === lang.code ? "civic" : "outline"}
          size="sm"
          onClick={() => onLanguageChange(lang.code)}
          className="min-w-[100px] font-medium"
        >
          <span className="block text-sm">{lang.label}</span>
        </Button>
      ))}
    </div>
  );
};

export default LanguageSelector;