import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Flipper } from 'react-flip-toolkit';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { sortByTranslatedText } from '../../utilities';
import LanguageBar from './language-bar/LanguageBar';
import TranslationList from './translation-list/TranslationList';
import TranslatorText from './translator-text/TranslatorText';

const eventSource =
  new EventSource(`${process.env.REACT_APP_FLASK_URL}/translations/stream`) ||
  undefined;

const Translator = () => {
  const [loadingTranslations, setLoadingTranslations] = useState(true);
  const [loadingNewTranslation, setLoadingNewTranslation] = useState(false);
  const [sourceLanguage, setSourceLanguage] = useState('en');
  const [targetLanguage, setTargetLanguage] = useState('es');
  const [translationText, setTranslationText] = useState('');
  const [translationList, setTranslationList] = useState([]);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // Helper function for toasts
  const notify = message => toast(`${message}`, { type: 'error' });

  // Swap target language with source language
  const swapLanguage = () => {
    const source = sourceLanguage;
    const target = targetLanguage;
    setSourceLanguage(target);
    setTargetLanguage(source);
  };

  // Handle text being typed in translation textarea
  const handleTextChange = event => {
    if (event.target.value.length > 5000) {
      return;
    }
    setTranslationText(event.target.value);
  };

  /**
   * Sends a POST request with the submitted translation text to the Unbabel API via the backend
   * Response is a JSON translation, which is then added to the translation list.
   */
  const handleTextSubmit = async event => {
    event.preventDefault();
    if (!translationText) {
      return;
    }
    setLoadingNewTranslation(true);

    try {
      // Get translation from backend
      const response = await axios.post('/translations/', {
        text: translationText,
        source_language: sourceLanguage,
        target_language: targetLanguage,
      });
      const newTranslation = response.data;

      // Reset translation textarea and add translation to list
      setTranslationText('');
      setTranslationList(oldList =>
        [newTranslation, ...oldList].sort(sortByTranslatedText)
      );
    } catch (error) {
      notify('Could not submit translation!');
    }
    setLoadingNewTranslation(false);
  };

  // Allow users to submit text with Enter, but go to a new line with Shift + Enter
  const handleKeyDown = event => {
    if (event.key === 'Enter' && event.shiftKey === false) {
      event.preventDefault();
      handleTextSubmit(event);
    }
  };

  // Clear the translation textarea
  const handleTextClear = event => {
    event.preventDefault();
    if (!translationText) {
      return;
    }
    setTranslationText('');
  };

  /**
   * Sends a DELETE request to the Unbabel API. If successful, then the deleted translation is
   * filtered out from the translation list.
   */
  const deleteTranslation = async translationUid => {
    setDeleteLoading(true);
    const response = await axios.delete(
      `/translations/delete/${translationUid}`
    );

    // Translation was deleted successfully
    if (response.data.message === 'success') {
      setTranslationList(oldList =>
        [...oldList].filter(translation => translation.uid !== translationUid)
      );
    } else {
      // Show toast if translation could not be deleted
      notify('Could not delete translation!');
    }
    setDeleteLoading(false);
  };

  /**
   * Stream recently updated translations with an EventSource interface. Updated translations are
   * subsequently updated in the translation list.
   */
  useEffect(() => {
    // Replace translation in translation list with updated translation
    const upsertTranslations = updatedTranslations => {
      const currentTranslations = [...translationList];
      updatedTranslations.forEach(updatedTranslation => {
        const translationIndex = currentTranslations.findIndex(
          x => x.uid === updatedTranslation.uid
        );
        currentTranslations[translationIndex] = updatedTranslation;
      });
      setTranslationList([...currentTranslations].sort(sortByTranslatedText));
    };

    // Listen to server-sent events
    if (eventSource) {
      eventSource.onmessage = event => {
        upsertTranslations(JSON.parse(event.data));
      };
    }
  }, [translationList]);

  // Fetch the translations already in the database
  useEffect(() => {
    let didCancel = false;

    async function fetchTranslations() {
      try {
        const response = await axios.get('/translations/');
        if (!didCancel) {
          // Ignore if we started fetching something else
          setTranslationList(response.data.sort(sortByTranslatedText));
        }
      } catch (error) {
        // Show toast is translations could not be fetched
        notify('Could not fetch translations!');
      }
    }

    fetchTranslations();
    setLoadingTranslations(false);
    return () => {
      didCancel = true;
    };
  }, []);

  return (
    <React.Fragment>
      <div className="lg:max-w-3xl w-full lg:rounded lg:overflow-hidden lg:mt-10 lg:shadow-xl">
        <LanguageBar
          sourceLanguage={sourceLanguage}
          targetLanguage={targetLanguage}
          onClick={swapLanguage}
        ></LanguageBar>
        <TranslatorText
          translationText={translationText}
          handleChange={handleTextChange}
          handleSubmit={handleTextSubmit}
          handleClear={handleTextClear}
          handleKeyDown={handleKeyDown}
          loading={loadingNewTranslation}
        ></TranslatorText>
      </div>
      <div className="lg:max-w-3xl w-full lg:my-10">
        <Flipper
          flipKey={translationList.map(translation => translation.uid).join('')}
        >
          <TranslationList
            loading={loadingTranslations}
            translations={translationList}
            deleteTranslation={deleteTranslation}
            deleteLoading={deleteLoading}
          ></TranslationList>
        </Flipper>
      </div>
      <ToastContainer
        position="top-center"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnVisibilityChange
        draggable
        pauseOnHover
      />
    </React.Fragment>
  );
};

export default Translator;
