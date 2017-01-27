/* eslint-disable max-len */
// TODO: parentTable is not used any more, remove

export default [
  {
    database: `apflora`,
    table: `ap`,
    label: `Arten`,
    labelSingular: `Art`,
    idField: `ApArtId`,
    parentTable: `projekt`,
    parentIdField: `ProjId`,
    mutWannField: `MutWann`,
    mutWerField: `MutWer`,
  },
  {
    database: `apflora`,
    table: `pop`,
    label: `Populationen`,
    labelSingular: `Population`,
    idField: `PopId`,
    parentTable: `ap`,
    parentIdField: `ApArtId`,
    mutWannField: `MutWann`,
    mutWerField: `MutWer`,
  },
  {
    database: `apflora`,
    table: `tpop`,
    label: `Teil-Populationen`,
    labelSingular: `Teil-Population`,
    idField: `TPopId`,
    parentTable: `pop`,
    parentIdField: `PopId`,
    mutWannField: `MutWann`,
    mutWerField: `MutWer`,
  },
  {
    database: `apflora`,
    table: `tpopkontr`,
    label: `Kontrollen`,
    labelSingular: `Kontrolle`,
    idField: `TPopKontrId`,
    parentTable: `tpop`,
    parentIdField: `TPopId`,
    mutWannField: `MutWann`,
    mutWerField: `MutWer`,
  },
  {
    database: `apflora`,
    table: `tpopfeldkontr`,
    dbTable: `tpopkontr`,
    label: `Feld-Kontrollen`,
    labelSingular: `Feld-Kontrolle`,
    idField: `TPopKontrId`,
    parentTable: `tpop`,
    parentIdField: `TPopId`,
    mutWannField: `MutWann`,
    mutWerField: `MutWer`,
  },
  {
    database: `apflora`,
    table: `tpopfreiwkontr`,
    dbTable: `tpopkontr`,
    label: `Freiwilligen-Kontrollen`,
    labelSingular: `Freiwilligen-Kontrolle`,
    idField: `TPopKontrId`,
    parentTable: `tpop`,
    parentIdField: `TPopId`,
    mutWannField: `MutWann`,
    mutWerField: `MutWer`,
  },
  {
    database: `apflora`,
    table: `tpopkontrzaehl_einheit_werte`,
    idField: `ZaehleinheitCode`,
    mutWannField: `MutWann`,
    mutWerField: `MutWer`,
  },
  {
    database: `apflora`,
    table: `tpopkontrzaehl_methode_werte`,
    idField: `BeurteilCode`,
    mutWannField: `MutWann`,
    mutWerField: `MutWer`,
  },
  {
    database: `apflora`,
    table: `tpopkontrzaehl`,
    label: `Zählungen`,
    labelSingular: `Zählung`,
    idField: `TPopKontrZaehlId`,
    parentTable: `tpopkontr`,
    parentIdField: `TPopKontrId`,
    mutWannField: `MutWann`,
    mutWerField: `MutWer`,
  },
  {
    database: `apflora`,
    table: `tpopfreiwkontrzaehl`,
    dbTable: `tpopkontrzaehl`,
    label: `Zählungen`,
    labelSingular: `Zählung`,
    idField: `TPopKontrZaehlId`,
    parentTable: `tpopkontr`,
    parentIdField: `TPopKontrId`,
    mutWannField: `MutWann`,
    mutWerField: `MutWer`,
  },
  {
    database: `apflora`,
    table: `tpopfeldkontrzaehl`,
    dbTable: `tpopkontrzaehl`,
    label: `Zählungen`,
    labelSingular: `Zählung`,
    idField: `TPopKontrZaehlId`,
    parentTable: `tpopkontr`,
    parentIdField: `TPopKontrId`,
    mutWannField: `MutWann`,
    mutWerField: `MutWer`,
  },
  {
    database: `apflora`,
    table: `tpopmassn`,
    label: `Massnahmen`,
    labelSingular: `Massnahme`,
    idField: `TPopMassnId`,
    parentTable: `tpop`,
    parentIdField: `TPopId`,
    mutWannField: `MutWann`,
    mutWerField: `MutWer`,
  },
  {
    database: `apflora`,
    table: `tpopmassn_typ_werte`,
    idField: `MassnTypCode`,
    mutWannField: `MutWann`,
    mutWerField: `MutWer`,
  },
  {
    database: `apflora`,
    table: `popmassn_erfbeurt_werte`,
    idField: `BeurteilId`,
    mutWannField: `MutWann`,
    mutWerField: `MutWer`,
  },
  {
    database: `apflora`,
    table: `tpopmassn_erfbeurt_werte`,
    idField: `BeurteilId`,
    mutWannField: `MutWann`,
    mutWerField: `MutWer`,
  },
  {
    database: `apflora`,
    table: `ziel`,
    label: `AP-Ziele`,
    labelSingular: `AP-Ziel`,
    idField: `ZielId`,
    parentTable: `ap`,
    parentIdField: `ApArtId`,
    mutWannField: `MutWann`,
    mutWerField: `MutWer`,
  },
  {
    database: `apflora`,
    table: `ziel_typ_werte`,
    idField: `ZieltypId`,
    mutWannField: `MutWann`,
    mutWerField: `MutWer`,
  },
  {
    database: `apflora`,
    table: `zielber`,
    label: `Berichte`,
    labelSingular: `Bericht`,
    idField: `ZielBerId`,
    parentTable: `ziel`,
    parentIdField: `ZielId`,
    mutWannField: `MutWann`,
    mutWerField: `MutWer`,
  },
  {
    database: `apflora`,
    table: `erfkrit`,
    label: `AP-Erfolgskriterien`,
    labelSingular: `AP-Erfolgskriterium`,
    idField: `ErfkritId`,
    parentTable: `ap`,
    parentIdField: `ApArtId`,
    mutWannField: `MutWann`,
    mutWerField: `MutWer`,
  },
  {
    database: `apflora`,
    table: `apber`,
    label: `AP-Berichte`,
    labelSingular: `AP-Bericht`,
    idField: `JBerId`,
    parentTable: `ap`,
    parentIdField: `ApArtId`,
    mutWannField: `MutWann`,
    mutWerField: `MutWer`,
  },
  {
    database: `apflora`,
    table: `apberuebersicht`,
    label: `AP-Berichte`,
    labelSingular: `AP-Bericht`,
    idField: `JbuJahr`,
    parentTable: `projekt`,
    parentIdField: `ProjId`,
    mutWannField: `MutWann`,
    mutWerField: `MutWer`,
  },
  {
    database: `apflora`,
    table: `ber`,
    label: `Berichte`,
    labelSingular: `Bericht`,
    idField: `BerId`,
    parentTable: `ap`,
    parentIdField: `ApArtId`,
    mutWannField: `MutWann`,
    mutWerField: `MutWer`,
  },
  {
    database: `apflora`,
    table: `idealbiotop`,
    label: `Idealbiotop`,
    labelSingular: `Idealbiotop`,
    idField: `IbApArtId`,
    parentTable: `ap`,
    parentIdField: `IbApArtId`,
    mutWannField: `MutWann`,
    mutWerField: `MutWer`,
  },
  {
    database: `apflora`,
    table: `assozart`,
    label: `assoziierte Arten`,
    labelSingular: `assoziierte Art`,
    idField: `AaId`,
    parentTable: `ap`,
    parentIdField: `AaApArtId`,
    mutWannField: `MutWann`,
    mutWerField: `MutWer`,
  },
  {
    database: `apflora`,
    table: `popber`,
    label: `Kontroll-Berichte`,
    labelSingular: `Kontroll-Bericht`,
    idField: `PopBerId`,
    parentTable: `pop`,
    parentIdField: `PopId`,
    mutWannField: `MutWann`,
    mutWerField: `MutWer`,
  },
  {
    database: `apflora`,
    table: `popmassnber`,
    label: `Massnahmen-Berichte`,
    labelSingular: `Massnahmen-Bericht`,
    idField: `PopMassnBerId`,
    parentTable: `pop`,
    parentIdField: `PopId`,
    mutWannField: `MutWann`,
    mutWerField: `MutWer`,
  },
  {
    database: `apflora`,
    table: `tpopber`,
    label: `Kontroll-Berichte`,
    labelSingular: `Kontroll-Bericht`,
    idField: `TPopBerId`,
    parentTable: `tpop`,
    parentIdField: `TPopId`,
    mutWannField: `MutWann`,
    mutWerField: `MutWer`,
  },
  {
    database: `apflora`,
    table: `tpopmassnber`,
    label: `Massnahmen-Berichte`,
    labelSingular: `Massnahmen-Bericht`,
    idField: `TPopMassnBerId`,
    parentTable: `tpop`,
    parentIdField: `TPopId`,
    mutWannField: `MutWann`,
    mutWerField: `MutWer`,
  },
  {
    database: `apflora`,
    table: `beobzuordnung`,
    idField: `NO_NOTE`,
    parentTable: `tpop`,
    parentIdField: `TPopId`,
    mutWannField: `BeobMutWann`,
    mutWerField: `BeobMutWer`,
  },
  {
    database: `apflora`,
    table: `beobzuordnung`,
    idField: `NO_NOTE`,
    parentTable: ``,
    parentIdField: `NO_NOTE`,
    mutWannField: `BeobMutWann`,
    mutWerField: `BeobMutWer`,
  },
  {
    database: `apflora`,
    table: `beobzuordnung`,
    idField: `NO_NOTE`,
    parentTable: ``,
    parentIdField: `NO_NOTE`,
    mutWannField: `BeobMutWann`,
    mutWerField: `BeobMutWer`,
  },
  {
    database: `apflora`,
    table: `projekt`,
    label: `Projekte`,
    labelSingular: `Projekt`,
    idField: `ProjId`,
    mutWannField: `MutWann`,
    mutWerField: `MutWer`,
  },
  {
    database: `beob`,
    table: `beob_bereitgestellt`,
    idField: `BeobId`,
    parentTable: `beob_bereitgestellt`,
    parentIdField: `NO_ISFS`,
  },
  {
    database: `beob`,
    table: `adb_eigenschaften`,
    idField: `TaxonomieId`,
    mutWannField: null,
    mitWerField: null,
  },
  {
    database: `apflora`,
    table: `ap_bearbstand_werte`,
    idField: `DomainCode`,
    mutWannField: `MutWann`,
    mitWerField: `MutWer`,
  },
  {
    database: `apflora`,
    table: `ap_umsetzung_werte`,
    idField: `DomainCode`,
    mutWannField: `MutWann`,
    mitWerField: `MutWer`,
  },
  {
    database: `apflora`,
    table: `adresse`,
    idField: `AdrId`,
    mutWannField: `MutWann`,
    mitWerField: `MutWer`,
  },
  {
    database: `apflora`,
    table: `ap_erfkrit_werte`,
    idField: `BeurteilId`,
    mutWannField: `MutWann`,
    mitWerField: `MutWer`,
  },
  {
    database: `apflora`,
    table: `pop_entwicklung_werte`,
    idField: `EntwicklungId`,
    mutWannField: `MutWann`,
    mitWerField: `MutWer`,
  },
  {
    database: `apflora`,
    table: `tpop_apberrelevant_werte`,
    idField: `DomainCode`,
    mutWannField: `MutWann`,
    mitWerField: `MutWer`,
  },
  {
    database: `apflora`,
    table: `gemeinde`,
    idField: `BfsNr`,
    mutWannField: `MutWann`,
    mitWerField: `MutWer`,
  },
  {
    database: `apflora`,
    table: `tpop_entwicklung_werte`,
    idField: `EntwicklungCode`,
    mutWannField: `MutWann`,
    mitWerField: `MutWer`,
  },
  {
    database: `apflora`,
    table: `tpopkontr_idbiotuebereinst_werte`,
    idField: `DomainCode`,
    mutWannField: `MutWann`,
    mitWerField: `MutWer`,
  },
  {
    database: `beob`,
    table: `beob_quelle`,
    idField: `id`,
  },
  {
    database: `beob`,
    table: `adb_lr`,
    idField: `id`,
  },
  {
    database: `beob`,
    table: `beob_evab`,
    idField: `NO_NOTE_PROJET`,
  },
  {
    database: `beob`,
    table: `beob_infospezies`,
    idField: `NO_NOTE`,
  },
]
