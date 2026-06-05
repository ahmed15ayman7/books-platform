typedef BilingualText = ({String ar, String en});

String localizedText(BilingualText text, String lang) =>
    lang == 'ar' ? text.ar : text.en;
