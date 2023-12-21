import useQuery from '../../api/useQuery';
import { LanguageQuery } from '../../api/generatedTypes/graphql';
import RelayList from '../../api/relayList';
import { languagesQuery } from '../queries/LanguageQueries';
import { LanguageNode } from '../types/LanguageQueryTypes';

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
