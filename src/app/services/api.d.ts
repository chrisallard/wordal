// Types
export type DictionaryEntry = [
  {
    word: string;
    phonetic: string;
    phonetics: [
      {
        text: string;
        audio: string | undefined;
      }
    ];
    origin: string;
    meanings: [
      {
        partOfSpeach: string;
        definitions: [
          {
            definition: string;
            example: string;
            synonyms: string[];
            antonyms: string[];
          }
        ];
      }
    ];
  }
];
