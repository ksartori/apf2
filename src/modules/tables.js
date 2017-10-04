// @flow

export default [
  {
    table: 'ap',
    label: 'Arten',
    labelSingular: 'Art',
    idField: 'ApArtId',
    parentIdField: 'ProjId',
    mutWannField: 'MutWann',
    mutWerField: 'MutWer',
  },
  {
    table: 'pop',
    label: 'Populationen',
    labelSingular: 'Population',
    idField: 'PopId',
    parentIdField: 'ApArtId',
    mutWannField: 'MutWann',
    mutWerField: 'MutWer',
  },
  {
    table: 'tpop',
    label: 'Teil-Populationen',
    labelSingular: 'Teil-Population',
    idField: 'TPopId',
    parentIdField: 'PopId',
    mutWannField: 'MutWann',
    mutWerField: 'MutWer',
  },
  {
    table: 'tpopkontr',
    label: 'Kontrollen',
    labelSingular: 'Kontrolle',
    idField: 'TPopKontrId',
    parentIdField: 'TPopId',
    mutWannField: 'MutWann',
    mutWerField: 'MutWer',
  },
  {
    table: 'tpopfeldkontr',
    dbTable: 'tpopkontr',
    label: 'Feld-Kontrollen',
    labelSingular: 'Feld-Kontrolle',
    idField: 'TPopKontrId',
    parentIdField: 'TPopId',
    mutWannField: 'MutWann',
    mutWerField: 'MutWer',
  },
  {
    table: 'tpopfreiwkontr',
    dbTable: 'tpopkontr',
    label: 'Freiwilligen-Kontrollen',
    labelSingular: 'Freiwilligen-Kontrolle',
    idField: 'TPopKontrId',
    parentIdField: 'TPopId',
    mutWannField: 'MutWann',
    mutWerField: 'MutWer',
  },
  {
    table: 'tpopkontrzaehl_einheit_werte',
    label: 'none',
    idField: 'ZaehleinheitCode',
    parentIdField: 'none',
    stammdaten: true,
    mutWannField: 'MutWann',
    mutWerField: 'MutWer',
  },
  {
    table: 'tpopkontrzaehl_methode_werte',
    label: 'none',
    idField: 'BeurteilCode',
    parentIdField: 'none',
    stammdaten: true,
    mutWannField: 'MutWann',
    mutWerField: 'MutWer',
  },
  {
    table: 'tpopkontrzaehl',
    label: 'Zählungen',
    labelSingular: 'Zählung',
    idField: 'TPopKontrZaehlId',
    parentIdField: 'TPopKontrId',
    mutWannField: 'MutWann',
    mutWerField: 'MutWer',
  },
  {
    table: 'tpopfreiwkontrzaehl',
    dbTable: 'tpopkontrzaehl',
    label: 'Zählungen',
    labelSingular: 'Zählung',
    idField: 'TPopKontrZaehlId',
    parentIdField: 'TPopKontrId',
    mutWannField: 'MutWann',
    mutWerField: 'MutWer',
  },
  {
    table: 'tpopfeldkontrzaehl',
    dbTable: 'tpopkontrzaehl',
    label: 'Zählungen',
    labelSingular: 'Zählung',
    idField: 'TPopKontrZaehlId',
    parentIdField: 'TPopKontrId',
    mutWannField: 'MutWann',
    mutWerField: 'MutWer',
  },
  {
    table: 'tpopmassn',
    label: 'Massnahmen',
    labelSingular: 'Massnahme',
    idField: 'TPopMassnId',
    parentIdField: 'TPopId',
    mutWannField: 'MutWann',
    mutWerField: 'MutWer',
  },
  {
    table: 'tpopmassn_typ_werte',
    label: 'none',
    idField: 'MassnTypCode',
    parentIdField: 'none',
    stammdaten: true,
    mutWannField: 'MutWann',
    mutWerField: 'MutWer',
  },
  {
    table: 'popmassn_erfbeurt_werte',
    label: 'none',
    idField: 'BeurteilId',
    parentIdField: 'none',
    stammdaten: true,
    mutWannField: 'MutWann',
    mutWerField: 'MutWer',
  },
  {
    table: 'tpopmassn_erfbeurt_werte',
    label: 'none',
    idField: 'BeurteilId',
    parentIdField: 'none',
    stammdaten: true,
    mutWannField: 'MutWann',
    mutWerField: 'MutWer',
  },
  {
    table: 'ziel',
    label: 'AP-Ziele',
    labelSingular: 'AP-Ziel',
    idField: 'ZielId',
    parentIdField: 'ApArtId',
    mutWannField: 'MutWann',
    mutWerField: 'MutWer',
  },
  {
    table: 'ziel_typ_werte',
    label: 'none',
    idField: 'ZieltypId',
    parentIdField: 'none',
    stammdaten: true,
    mutWannField: 'MutWann',
    mutWerField: 'MutWer',
  },
  {
    table: 'zielber',
    label: 'Berichte',
    labelSingular: 'Bericht',
    idField: 'ZielBerId',
    parentIdField: 'ZielId',
    mutWannField: 'MutWann',
    mutWerField: 'MutWer',
  },
  {
    table: 'erfkrit',
    label: 'AP-Erfolgskriterien',
    labelSingular: 'AP-Erfolgskriterium',
    idField: 'ErfkritId',
    parentIdField: 'ApArtId',
    mutWannField: 'MutWann',
    mutWerField: 'MutWer',
  },
  {
    table: 'apber',
    label: 'AP-Berichte',
    labelSingular: 'AP-Bericht',
    idField: 'JBerId',
    parentIdField: 'ApArtId',
    mutWannField: 'MutWann',
    mutWerField: 'MutWer',
  },
  {
    table: 'apberuebersicht',
    label: 'AP-Berichte',
    labelSingular: 'AP-Bericht',
    idField: 'JbuJahr',
    parentIdField: 'ProjId',
    mutWannField: 'MutWann',
    mutWerField: 'MutWer',
  },
  {
    table: 'ber',
    label: 'Berichte',
    labelSingular: 'Bericht',
    idField: 'BerId',
    parentIdField: 'ApArtId',
    mutWannField: 'MutWann',
    mutWerField: 'MutWer',
  },
  {
    table: 'idealbiotop',
    label: 'Idealbiotop',
    labelSingular: 'Idealbiotop',
    idField: 'IbApArtId',
    parentIdField: 'IbApArtId',
    mutWannField: 'MutWann',
    mutWerField: 'MutWer',
  },
  {
    table: 'assozart',
    label: 'assoziierte Arten',
    labelSingular: 'assoziierte Art',
    idField: 'AaId',
    parentIdField: 'AaApArtId',
    mutWannField: 'MutWann',
    mutWerField: 'MutWer',
  },
  {
    table: 'popber',
    label: 'Kontroll-Berichte',
    labelSingular: 'Kontroll-Bericht',
    idField: 'PopBerId',
    parentIdField: 'PopId',
    mutWannField: 'MutWann',
    mutWerField: 'MutWer',
  },
  {
    table: 'popmassnber',
    label: 'Massnahmen-Berichte',
    labelSingular: 'Massnahmen-Bericht',
    idField: 'PopMassnBerId',
    parentIdField: 'PopId',
    mutWannField: 'MutWann',
    mutWerField: 'MutWer',
  },
  {
    table: 'tpopber',
    label: 'Kontroll-Berichte',
    labelSingular: 'Kontroll-Bericht',
    idField: 'TPopBerId',
    parentIdField: 'TPopId',
    mutWannField: 'MutWann',
    mutWerField: 'MutWer',
  },
  {
    table: 'tpopmassnber',
    label: 'Massnahmen-Berichte',
    labelSingular: 'Massnahmen-Bericht',
    idField: 'TPopMassnBerId',
    parentIdField: 'TPopId',
    mutWannField: 'MutWann',
    mutWerField: 'MutWer',
  },
  {
    table: 'beobzuordnung',
    label: 'none',
    idField: 'BeobId',
    parentIdField: 'TPopId',
    mutWannField: 'BeobMutWann',
    mutWerField: 'BeobMutWer',
  },
  {
    table: 'beobzuordnung',
    label: 'none',
    idField: 'BeobId',
    parentIdField: 'ArtId',
    mutWannField: 'BeobMutWann',
    mutWerField: 'BeobMutWer',
  },
  {
    table: 'beobzuordnung',
    label: 'none',
    idField: 'BeobId',
    parentIdField: 'ArtId',
    mutWannField: 'BeobMutWann',
    mutWerField: 'BeobMutWer',
  },
  {
    table: 'beobart',
    label: 'none',
    idField: 'BeobArtId',
    parentIdField: 'ApArtId',
    mutWannField: 'BeobMutWann',
    mutWerField: 'BeobMutWer',
  },
  {
    table: 'projekt',
    label: 'Projekte',
    labelSingular: 'Projekt',
    idField: 'ProjId',
    mutWannField: 'MutWann',
    mutWerField: 'MutWer',
  },
  {
    table: 'beob',
    label: 'none',
    idField: 'id',
    parentIdField: 'ArtId',
  },
  {
    table: 'adb_eigenschaften',
    label: 'none',
    idField: 'TaxonomieId',
    parentIdField: 'none',
    stammdaten: true,
    mutWannField: null,
    mitWerField: null,
  },
  {
    table: 'ap_bearbstand_werte',
    label: 'none',
    idField: 'DomainCode',
    parentIdField: 'none',
    stammdaten: true,
    mutWannField: 'MutWann',
    mitWerField: 'MutWer',
  },
  {
    table: 'ap_umsetzung_werte',
    label: 'none',
    idField: 'DomainCode',
    parentIdField: 'none',
    stammdaten: true,
    mutWannField: 'MutWann',
    mitWerField: 'MutWer',
  },
  {
    table: 'adresse',
    label: 'none',
    idField: 'AdrId',
    parentIdField: 'none',
    mutWannField: 'MutWann',
    mitWerField: 'MutWer',
  },
  {
    table: 'ap_erfkrit_werte',
    label: 'none',
    idField: 'BeurteilId',
    parentIdField: 'none',
    stammdaten: true,
    mutWannField: 'MutWann',
    mitWerField: 'MutWer',
  },
  {
    table: 'pop_entwicklung_werte',
    label: 'none',
    idField: 'EntwicklungId',
    parentIdField: 'none',
    stammdaten: true,
    mutWannField: 'MutWann',
    mitWerField: 'MutWer',
  },
  {
    table: 'pop_status_werte',
    label: 'none',
    idField: 'HerkunftId',
    parentIdField: 'none',
    stammdaten: true,
    mutWannField: 'MutWann',
    mitWerField: 'MutWer',
  },
  {
    table: 'tpop_apberrelevant_werte',
    label: 'none',
    idField: 'DomainCode',
    parentIdField: 'none',
    stammdaten: true,
    mutWannField: 'MutWann',
    mitWerField: 'MutWer',
  },
  {
    table: 'gemeinde',
    label: 'none',
    idField: 'BfsNr',
    parentIdField: 'none',
    stammdaten: true,
    mutWannField: 'MutWann',
    mitWerField: 'MutWer',
  },
  {
    table: 'tpop_entwicklung_werte',
    label: 'none',
    idField: 'EntwicklungCode',
    parentIdField: 'none',
    stammdaten: true,
    mutWannField: 'MutWann',
    mitWerField: 'MutWer',
  },
  {
    table: 'tpopkontr_idbiotuebereinst_werte',
    label: 'none',
    idField: 'DomainCode',
    parentIdField: 'none',
    stammdaten: true,
    mutWannField: 'MutWann',
    mitWerField: 'MutWer',
  },
  {
    table: 'beob_quelle',
    label: 'none',
    idField: 'id',
    parentIdField: 'none',
    stammdaten: true,
  },
  {
    table: 'adb_lr',
    label: 'none',
    idField: 'Id',
    parentIdField: 'none',
    stammdaten: true,
  },
  {
    table: 'message',
    label: 'none',
    idField: 'id',
    parentIdField: 'none',
  },
]
