// @flow

export default [
  {
    table: 'ap',
    label: 'Arten',
    labelSingular: 'Art',
    idField: 'ApArtId',
    parentIdField: 'ProjId',
  },
  {
    table: 'pop',
    label: 'Populationen',
    labelSingular: 'Population',
    idField: 'PopId',
    parentIdField: 'ApArtId',
  },
  {
    table: 'tpop',
    label: 'Teil-Populationen',
    labelSingular: 'Teil-Population',
    idField: 'TPopId',
    parentIdField: 'PopId',
  },
  {
    table: 'tpopkontr',
    label: 'Kontrollen',
    labelSingular: 'Kontrolle',
    idField: 'TPopKontrId',
    parentIdField: 'TPopId',
  },
  {
    table: 'tpopfeldkontr',
    dbTable: 'tpopkontr',
    label: 'Feld-Kontrollen',
    labelSingular: 'Feld-Kontrolle',
    idField: 'TPopKontrId',
    parentIdField: 'TPopId',
  },
  {
    table: 'tpopfreiwkontr',
    dbTable: 'tpopkontr',
    label: 'Freiwilligen-Kontrollen',
    labelSingular: 'Freiwilligen-Kontrolle',
    idField: 'TPopKontrId',
    parentIdField: 'TPopId',
  },
  {
    table: 'tpopkontrzaehl_einheit_werte',
    label: 'none',
    idField: 'ZaehleinheitCode',
    parentIdField: 'none',
    stammdaten: true,
  },
  {
    table: 'tpopkontrzaehl_methode_werte',
    label: 'none',
    idField: 'BeurteilCode',
    parentIdField: 'none',
    stammdaten: true,
  },
  {
    table: 'tpopkontrzaehl',
    label: 'Zählungen',
    labelSingular: 'Zählung',
    idField: 'id',
    parentIdField: 'tpopkontr_id',
  },
  {
    table: 'tpopfreiwkontrzaehl',
    dbTable: 'tpopkontrzaehl',
    label: 'Zählungen',
    labelSingular: 'Zählung',
    idField: 'id',
    parentIdField: 'tpopkontr_id',
  },
  {
    table: 'tpopfeldkontrzaehl',
    dbTable: 'tpopkontrzaehl',
    label: 'Zählungen',
    labelSingular: 'Zählung',
    idField: 'id',
    parentIdField: 'tpopkontr_id',
  },
  {
    table: 'tpopmassn',
    label: 'Massnahmen',
    labelSingular: 'Massnahme',
    idField: 'TPopMassnId',
    parentIdField: 'TPopId',
  },
  {
    table: 'tpopmassn_typ_werte',
    label: 'none',
    idField: 'MassnTypCode',
    parentIdField: 'none',
    stammdaten: true,
  },
  {
    table: 'popmassn_erfbeurt_werte',
    label: 'none',
    idField: 'BeurteilId',
    parentIdField: 'none',
    stammdaten: true,
  },
  {
    table: 'tpopmassn_erfbeurt_werte',
    label: 'none',
    idField: 'BeurteilId',
    parentIdField: 'none',
    stammdaten: true,
  },
  {
    table: 'ziel',
    label: 'AP-Ziele',
    labelSingular: 'AP-Ziel',
    idField: 'ZielId',
    parentIdField: 'ApArtId',
  },
  {
    table: 'ziel_typ_werte',
    label: 'none',
    idField: 'ZieltypId',
    parentIdField: 'none',
    stammdaten: true,
  },
  {
    table: 'zielber',
    label: 'Berichte',
    labelSingular: 'Bericht',
    idField: 'ZielBerId',
    parentIdField: 'ZielId',
  },
  {
    table: 'erfkrit',
    label: 'AP-Erfolgskriterien',
    labelSingular: 'AP-Erfolgskriterium',
    idField: 'ErfkritId',
    parentIdField: 'ApArtId',
  },
  {
    table: 'apber',
    label: 'AP-Berichte',
    labelSingular: 'AP-Bericht',
    idField: 'JBerId',
    parentIdField: 'ApArtId',
  },
  {
    table: 'apberuebersicht',
    label: 'AP-Berichte',
    labelSingular: 'AP-Bericht',
    idField: 'id',
    parentIdField: 'ProjId',
  },
  {
    table: 'ber',
    label: 'Berichte',
    labelSingular: 'Bericht',
    idField: 'BerId',
    parentIdField: 'ApArtId',
  },
  {
    table: 'idealbiotop',
    label: 'Idealbiotop',
    labelSingular: 'Idealbiotop',
    idField: 'IbApArtId',
    parentIdField: 'IbApArtId',
  },
  {
    table: 'assozart',
    label: 'assoziierte Arten',
    labelSingular: 'assoziierte Art',
    idField: 'AaId',
    parentIdField: 'AaApArtId',
  },
  {
    table: 'popber',
    label: 'Kontroll-Berichte',
    labelSingular: 'Kontroll-Bericht',
    idField: 'PopBerId',
    parentIdField: 'PopId',
  },
  {
    table: 'popmassnber',
    label: 'Massnahmen-Berichte',
    labelSingular: 'Massnahmen-Bericht',
    idField: 'PopMassnBerId',
    parentIdField: 'PopId',
  },
  {
    table: 'tpopber',
    label: 'Kontroll-Berichte',
    labelSingular: 'Kontroll-Bericht',
    idField: 'TPopBerId',
    parentIdField: 'TPopId',
  },
  {
    table: 'tpopmassnber',
    label: 'Massnahmen-Berichte',
    labelSingular: 'Massnahmen-Bericht',
    idField: 'TPopMassnBerId',
    parentIdField: 'TPopId',
  },
  {
    table: 'beobzuordnung',
    label: 'none',
    idField: 'BeobId',
    parentIdField: 'TPopId',
  },
  {
    table: 'beobzuordnung',
    label: 'none',
    idField: 'BeobId',
    parentIdField: 'ArtId',
  },
  {
    table: 'beobzuordnung',
    label: 'none',
    idField: 'BeobId',
    parentIdField: 'ArtId',
  },
  {
    table: 'beobart',
    label: 'none',
    idField: 'BeobArtId',
    parentIdField: 'ApArtId',
  },
  {
    table: 'projekt',
    label: 'Projekte',
    labelSingular: 'Projekt',
    idField: 'ProjId',
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
  },
  {
    table: 'ap_bearbstand_werte',
    label: 'none',
    idField: 'DomainCode',
    parentIdField: 'none',
    stammdaten: true,
  },
  {
    table: 'ap_umsetzung_werte',
    label: 'none',
    idField: 'DomainCode',
    parentIdField: 'none',
    stammdaten: true,
  },
  {
    table: 'adresse',
    label: 'none',
    idField: 'AdrId',
    parentIdField: 'none',
  },
  {
    table: 'ap_erfkrit_werte',
    label: 'none',
    idField: 'BeurteilId',
    parentIdField: 'none',
    stammdaten: true,
  },
  {
    table: 'pop_entwicklung_werte',
    label: 'none',
    idField: 'EntwicklungId',
    parentIdField: 'none',
    stammdaten: true,
  },
  {
    table: 'pop_status_werte',
    label: 'none',
    idField: 'HerkunftId',
    parentIdField: 'none',
    stammdaten: true,
  },
  {
    table: 'tpop_apberrelevant_werte',
    label: 'none',
    idField: 'DomainCode',
    parentIdField: 'none',
    stammdaten: true,
  },
  {
    table: 'gemeinde',
    label: 'none',
    idField: 'BfsNr',
    parentIdField: 'none',
    stammdaten: true,
  },
  {
    table: 'tpop_entwicklung_werte',
    label: 'none',
    idField: 'EntwicklungCode',
    parentIdField: 'none',
    stammdaten: true,
  },
  {
    table: 'tpopkontr_idbiotuebereinst_werte',
    label: 'none',
    idField: 'DomainCode',
    parentIdField: 'none',
    stammdaten: true,
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
