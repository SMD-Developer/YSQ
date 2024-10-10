import {useState, useEffect} from 'react';
import {LanguageService} from '../service/language_service';
import { Const } from '../../../constants/const_value';

export const useLanguageController = (isBack: boolean) => {
  const [languages, setLanguages] = useState<any[]>([]);
  const [selectionChanged, setSlectionChanged] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  useEffect(() => {
    if (isBack) {
      setDeafultLanguage();
    } else {
      setSelectedId('en');
    }
    const fetchLanguages = async () => {
      try {
        const result = await LanguageService.getLanguages();
        if (result.success) {
          setLanguages(result.data);
        } else {
          setError(result.message || 'Failed to fetch languages');
        }
      } catch (err) {
        setError('Failed to fetch languages');
      } finally {
        setLoading(false);
      }
    };

    fetchLanguages();
  }, [isBack]);

  const selectLanguage = (id: string) => {
    setSelectedId(id);
    setSlectionChanged(true);
  };
  const setDeafultLanguage = async () => {
    var language = await Const.getLaunguageAsyncStorage();
    setSelectedId(language);
  };

  return {
    languages,
    loading,
    error,
    selectedId,
    selectLanguage,
    selectionChanged,
    setSlectionChanged
  };
};
