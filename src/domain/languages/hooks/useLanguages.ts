import useQuery from '../../api/useQuery';
import {
  languageQuery as LanguageQuery,
  languageQuery_languages_edges_node as LanguageNode,
} from '../../api/generatedTypes/languageQuery';
import RelayList from '../../api/relayList';
import { languagesQuery } from '../queries/LanguageQueries';

const LanguageList = RelayList<LanguageNode>();

function useLanguages() {
  const { data, ...rest } = useQuery<LanguageQuery>(languagesQuery, {
    useDefaultErrorHandling: true,
  });

  return {
    data,
    ...rest,
    languages: LanguageList(data?.languages),
  };
}

export default useLanguages;
