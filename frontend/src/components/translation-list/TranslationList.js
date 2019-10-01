import React from 'react';
import Translation from '../translation/Translation';

const statusMapper = {
  new: 'badge-pending',
  translating: 'badge-pending',
  canceled: 'badge-danger',
  failed: 'badge-danger',
  rejected: 'badge-danger',
  accepted: 'badge-success',
  completed: 'badge-success',
};

const TranslationList = props => {
  const translations = props.translations.map((translation, index) => (
    <Translation
      key={translation.uid}
      status={translation.status}
      badgeClass={statusMapper[translation.status]}
      originalText={translation.text}
      translatedText={translation.translated_text}
      sourceLanguage={translation.source_language}
      targetLanguage={translation.target_language}
    ></Translation>
  ));

  return (
    <div className="flex flex-col bg-gray-100">
      <div className="bg-white px-4 py-3 border border-l-0 border-r-0 text-sm text-gray-600">
        {translations.length} translations
      </div>
      {translations}
    </div>
  );
};

export default TranslationList;
