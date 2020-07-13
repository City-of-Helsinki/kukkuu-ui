import React from 'react';
//import { Dropdown } from 'hds-react';

import fiLang from './fi-languages.json';

interface SpokenLanguageOption {
  [key: string]: string;
}

type SpokenLanguageOptions = SpokenLanguageOption[];

const dataToOptions = (languages: any) => {
  return languages.map((language: any) => {
    return { value: language[0], label: language[1] };
  });
};

const SpokenLanguagesDropdown = () => {
  const languages = dataToOptions(Object.entries(fiLang.languages));
  return (
    <div></div>
    // <Dropdown
    //   options={languages}
    //   filterable={false}
    //   multiselect={false}
    //   selectedOption={['fi']}
    //   label="kotona puhuttu kieliä"
    // />
  );
};

export default SpokenLanguagesDropdown;
