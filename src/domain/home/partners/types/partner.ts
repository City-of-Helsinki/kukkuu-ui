export interface Partner {
  name: string;
  icon: string;
  iconClassName?: string;
  altLangIcons?: { [key: string]: string }; // Icons in other languages
  url: {
    fi: string;
    sv?: string;
    en?: string;
  };
}
