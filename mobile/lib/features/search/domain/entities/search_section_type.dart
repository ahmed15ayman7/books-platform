enum SearchSectionType {
  all,
  books,
  articles,
  publishers;

  String? get apiValue => switch (this) {
        SearchSectionType.all => null,
        SearchSectionType.books => 'books',
        SearchSectionType.articles => 'articles',
        SearchSectionType.publishers => 'publishers',
      };
}
