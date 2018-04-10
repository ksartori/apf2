DROP VIEW IF EXISTS apflora.v_tpopbeob CASCADE;
CREATE OR REPLACE VIEW apflora.v_tpopbeob AS
SELECT
  apflora.tpopbeob.*,
  apflora.beob."ArtId" AS "ApArtId"
FROM
  apflora.tpopbeob
  INNER JOIN
    apflora.beob
    ON apflora.beob.id = apflora.tpopbeob.beob_id;

DROP VIEW IF EXISTS apflora.v_tpop_for_ap CASCADE;
CREATE OR REPLACE VIEW apflora.v_tpop_for_ap AS
SELECT
  apflora.tpop.*,
  apflora.ap."ApArtId" AS "ApArtId"
FROM
  apflora.ap
  INNER JOIN
    apflora.pop
    ON apflora.ap."ApArtId" = apflora.pop."ApArtId"
  INNER JOIN
    apflora.tpop
    ON apflora.pop."PopId" = apflora.tpop."PopId";

DROP VIEW IF EXISTS apflora.v_tpopkoord CASCADE;
CREATE OR REPLACE VIEW apflora.v_tpopkoord AS
SELECT DISTINCT
  apflora.pop."ApArtId",
  apflora.pop."PopId",
  apflora.pop."PopNr",
  apflora.tpop."TPopId",
  apflora.tpop."TPopNr",
  apflora.tpop."TPopXKoord",
  apflora.tpop."TPopYKoord",
  apflora.tpop."TPopApBerichtRelevant"
FROM
  apflora.pop
  INNER JOIN
    apflora.tpop
    ON apflora.pop."PopId" = apflora.tpop."PopId"
WHERE
  apflora.tpop."TPopXKoord" Is Not Null
  AND apflora.tpop."TPopYKoord" Is Not Null;

DROP VIEW IF EXISTS apflora.v_pop_berundmassnjahre CASCADE;
CREATE OR REPLACE VIEW apflora.v_pop_berundmassnjahre AS
SELECT
  apflora.pop."PopId",
  apflora.popber."PopBerJahr" AS "Jahr"
FROM
  apflora.pop
  INNER JOIN
    apflora.popber
    ON apflora.pop."PopId" = apflora.popber."PopId"
UNION DISTINCT SELECT
  apflora.pop."PopId",
  apflora.popmassnber."PopMassnBerJahr" AS "Jahr"
FROM
  apflora.pop
  INNER JOIN
    apflora.popmassnber
    ON apflora.pop."PopId" = apflora.popmassnber."PopId"
ORDER BY
  "Jahr";

DROP VIEW IF EXISTS apflora.v_popmassnber_anzmassn0 CASCADE;
CREATE OR REPLACE VIEW apflora.v_popmassnber_anzmassn0 AS
SELECT
  apflora.popmassnber."PopId",
  apflora.popmassnber."PopMassnBerJahr",
  count(apflora.tpopmassn.id) AS "AnzahlvonTPopMassnId"
FROM
  apflora.popmassnber
  INNER JOIN
    (apflora.tpop
    LEFT JOIN
      apflora.tpopmassn
      ON apflora.tpop."TPopId" = apflora.tpopmassn.tpop_id)
    ON apflora.popmassnber."PopId" = apflora.tpop."PopId"
WHERE
  apflora.tpopmassn.jahr = apflora.popmassnber."PopMassnBerJahr"
  Or apflora.tpopmassn.jahr IS NULL
GROUP BY
  apflora.popmassnber."PopId",
  apflora.popmassnber."PopMassnBerJahr"
ORDER BY
  apflora.popmassnber."PopId",
  apflora.popmassnber."PopMassnBerJahr";

DROP VIEW IF EXISTS apflora.v_massn_jahre CASCADE;
CREATE OR REPLACE VIEW apflora.v_massn_jahre AS
SELECT
  apflora.tpopmassn.jahr
FROM
  apflora.tpopmassn
GROUP BY
  apflora.tpopmassn.jahr
HAVING
  apflora.tpopmassn.jahr BETWEEN 1900 AND 2100
ORDER BY
  apflora.tpopmassn.jahr;

DROP VIEW IF EXISTS apflora.v_ap_anzmassnprojahr0 CASCADE;
CREATE OR REPLACE VIEW apflora.v_ap_anzmassnprojahr0 AS
SELECT
  apflora.ap."ApArtId",
  apflora.tpopmassn.jahr,
  count(apflora.tpopmassn.id) AS "AnzahlvonTPopMassnId"
FROM
  apflora.ap
  INNER JOIN
    ((apflora.pop
    INNER JOIN
      apflora.tpop
      ON apflora.pop."PopId" = apflora.tpop."PopId")
    INNER JOIN
      apflora.tpopmassn
      ON apflora.tpop."TPopId" = apflora.tpopmassn.tpop_id)
    ON apflora.ap."ApArtId" = apflora.pop."ApArtId"
WHERE
  apflora.ap."ApStatus" BETWEEN 1 AND 3
  AND apflora.tpop."TPopApBerichtRelevant" = 1
  AND apflora.pop."PopHerkunft" <> 300
GROUP BY
  apflora.ap."ApArtId",
  apflora.tpopmassn.jahr
HAVING
  apflora.tpopmassn.jahr IS NOT NULL
ORDER BY
  apflora.ap."ApArtId",
  apflora.tpopmassn.jahr;

DROP VIEW IF EXISTS apflora.v_ap_apberrelevant CASCADE;
CREATE OR REPLACE VIEW apflora.v_ap_apberrelevant AS
SELECT
  apflora.ap."ApArtId"
FROM
  apflora.ap
  INNER JOIN
    (apflora.pop
    INNER JOIN
      apflora.tpop
      ON apflora.pop."PopId" = apflora.tpop."PopId")
    ON apflora.ap."ApArtId" = apflora.pop."ApArtId"
WHERE
  apflora.tpop."TPopApBerichtRelevant" = 1
  AND apflora.pop."PopHerkunft" <> 300
GROUP BY
  apflora.ap."ApArtId";

-- wird von v_apber_injahr benutzt. Dieses Wiederum in Access:
DROP VIEW IF EXISTS apflora.v_erstemassnproap CASCADE;
CREATE OR REPLACE VIEW apflora.v_erstemassnproap AS
SELECT
  apflora.ap."ApArtId",
  min(apflora.tpopmassn.jahr) AS "MinvonTPopMassnJahr"
FROM
  ((apflora.ap
  INNER JOIN
    apflora.pop
    ON apflora.ap."ApArtId" = apflora.pop."ApArtId")
  INNER JOIN
    apflora.tpop
    ON apflora.pop."PopId" = apflora.tpop."PopId")
  INNER JOIN
    apflora.tpopmassn
    ON apflora.tpop."TPopId" = apflora.tpopmassn.tpop_id
GROUP BY
  apflora.ap."ApArtId";

DROP VIEW IF EXISTS apflora.v_tpop_verwaist CASCADE;
CREATE OR REPLACE VIEW apflora.v_tpop_verwaist AS
SELECT
  apflora.tpop."TPopGuid" AS "TPop Guid",
  apflora.tpop."TPopNr" AS "TPop Nr",
  apflora.tpop."TPopGemeinde" AS "TPop Gemeinde",
  apflora.tpop."TPopFlurname" AS "TPop Flurname",
  "domPopHerkunft_1"."HerkunftTxt" AS "TPop Status",
  apflora.tpop."TPopBekanntSeit" AS "TPop bekannt seit",
  apflora.tpop."TPopHerkunftUnklar" AS "TPop Status unklar",
  apflora.tpop."TPopHerkunftUnklarBegruendung" AS "TPop Begruendung fuer unklaren Status",
  apflora.tpop."TPopXKoord" AS "TPop X-Koordinaten",
  apflora.tpop."TPopYKoord" AS "TPop Y-Koordinaten",
  apflora.tpop."TPopRadius" AS "TPop Radius (m)",
  apflora.tpop."TPopHoehe" AS "TPop Hoehe ueM",
  apflora.tpop."TPopExposition" AS "TPop Exposition",
  apflora.tpop."TPopKlima" AS "TPop Klima",
  apflora.tpop."TPopNeigung" AS "TPop Hangneigung",
  apflora.tpop."TPopBeschr" AS "TPop Beschreibung",
  apflora.tpop."TPopKatNr" AS "TPop Kataster-Nr",
  apflora.tpop."TPopApBerichtRelevant" AS "TPop fuer AP-Bericht relevant",
  apflora.tpop."TPopEigen" AS "TPop EigentuemerIn",
  apflora.tpop."TPopKontakt" AS "TPop Kontakt vor Ort",
  apflora.tpop."TPopNutzungszone" AS "TPop Nutzungszone",
  apflora.tpop."TPopBewirtschafterIn" AS "TPop BewirtschafterIn",
  apflora.tpop."TPopBewirtschaftung" AS "TPop Bewirtschaftung",
  apflora.tpop."MutWann" AS "Datensatz zuletzt geaendert",
  apflora.tpop."MutWer" AS "Datensatz zuletzt geaendert von"
FROM
  (apflora.pop
  RIGHT JOIN
    apflora.tpop
    ON apflora.pop."PopId" = apflora.tpop."PopId")
  LEFT JOIN
    apflora.pop_status_werte AS "domPopHerkunft_1"
    ON apflora.tpop."TPopHerkunft" = "domPopHerkunft_1"."HerkunftId"
WHERE
  apflora.pop."PopId" IS NULL
ORDER BY
  apflora.tpop."TPopGemeinde",
  apflora.tpop."TPopFlurname",
  apflora.tpop."TPopNr";

DROP VIEW IF EXISTS apflora.v_massn CASCADE;
CREATE OR REPLACE VIEW apflora.v_massn AS
SELECT
  apflora.adb_eigenschaften."TaxonomieId" AS "ApArtId",
  apflora.adb_eigenschaften."Familie",
  apflora.adb_eigenschaften."Artname" AS "AP Art",
  apflora.ap_bearbstand_werte."DomainTxt" AS "AP Status",
  apflora.ap."ApJahr" AS "AP Start im Jahr",
  apflora.ap_umsetzung_werte."DomainTxt" AS "AP Stand Umsetzung",
  apflora.pop."PopId",
  apflora.pop."PopGuid" AS "Pop Guid",
  apflora.pop."PopNr" AS "Pop Nr",
  apflora.pop."PopName" AS "Pop Name",
  pop_status_werte."HerkunftTxt" AS "Pop Status",
  apflora.pop."PopBekanntSeit" AS "Pop bekannt seit",
  apflora.pop."PopHerkunftUnklar" AS "Pop Status unklar",
  apflora.pop."PopHerkunftUnklarBegruendung" AS "Pop Begruendung fuer unklaren Status",
  apflora.pop."PopXKoord" AS "Pop X-Koordinaten",
  apflora.pop."PopYKoord" AS "Pop Y-Koordinaten",
  apflora.tpop."TPopId",
  apflora.tpop."TPopGuid" AS "TPop Guid",
  apflora.tpop."TPopNr" AS "TPop Nr",
  apflora.tpop."TPopGemeinde" AS "TPop Gemeinde",
  apflora.tpop."TPopFlurname" AS "TPop Flurname",
  "domPopHerkunft_1"."HerkunftTxt" AS "TPop Status",
  apflora.tpop."TPopBekanntSeit" AS "TPop bekannt seit",
  apflora.tpop."TPopHerkunftUnklar" AS "TPop Status unklar",
  apflora.tpop."TPopHerkunftUnklarBegruendung" AS "TPop Begruendung fuer unklaren Status",
  apflora.tpop."TPopXKoord" AS "TPop X-Koordinaten",
  apflora.tpop."TPopYKoord" AS "TPop Y-Koordinaten",
  apflora.tpop."TPopRadius" AS "TPop Radius (m)",
  apflora.tpop."TPopHoehe" AS "TPop Hoehe",
  apflora.tpop."TPopExposition" AS "TPop Exposition",
  apflora.tpop."TPopKlima" AS "TPop Klima",
  apflora.tpop."TPopNeigung" AS "TPop Hangneigung",
  apflora.tpop."TPopBeschr" AS "TPop Beschreibung",
  apflora.tpop."TPopKatNr" AS "TPop Kataster-Nr",
  apflora.tpop."TPopApBerichtRelevant" AS "TPop fuer AP-Bericht relevant",
  apflora.tpop."TPopEigen" AS "TPop EigentuemerIn",
  apflora.tpop."TPopKontakt" AS "TPop Kontakt vor Ort",
  apflora.tpop."TPopNutzungszone" AS "TPop Nutzungszone",
  apflora.tpop."TPopBewirtschafterIn" AS "TPop BewirtschafterIn",
  apflora.tpop."TPopBewirtschaftung" AS "TPop Bewirtschaftung",
  apflora.tpopmassn.id,
  apflora.tpopmassn.jahr AS "Massn Jahr",
  apflora.tpopmassn.datum AS "Massn Datum",
  tpopmassn_typ_werte.text AS "Massn Typ",
  apflora.tpopmassn.beschreibung AS "Massn Massnahme",
  apflora.adresse."AdrName" AS "Massn BearbeiterIn",
  apflora.tpopmassn.bemerkungen::char AS "Massn Bemerkungen",
  apflora.tpopmassn.plan_vorhanden AS "Massn Plan vorhanden",
  apflora.tpopmassn.plan_bezeichnung AS "Massn Plan Bezeichnung",
  apflora.tpopmassn.flaeche AS "Massn Flaeche m2",
  apflora.tpopmassn.form AS "Massn Form der Ansiedlung",
  apflora.tpopmassn.pflanzanordnung AS "Massn Pflanzanordnung",
  apflora.tpopmassn.markierung AS "Massn Markierung",
  apflora.tpopmassn.anz_triebe AS "Massn Anz Triebe",
  apflora.tpopmassn.anz_pflanzen AS "Massn Pflanzen",
  apflora.tpopmassn.anz_pflanzstellen AS "Massn Anz Pflanzstellen",
  apflora.tpopmassn.wirtspflanze AS "Massn Wirtspflanze",
  apflora.tpopmassn.herkunft_pop AS "Massn Herkunftspopulation",
  apflora.tpopmassn.sammeldatum AS "Massn Sammeldatum",
  apflora.tpopmassn.changed AS "Datensatz zuletzt geaendert",
  apflora.tpopmassn.changed_by AS "Datensatz zuletzt geaendert von"
FROM
  ((((((apflora.adb_eigenschaften
  INNER JOIN
    apflora.ap ON apflora.adb_eigenschaften."TaxonomieId" = apflora.ap."ApArtId")
    INNER JOIN
      ((apflora.pop
      INNER JOIN
        apflora.tpop
        ON apflora.pop."PopId" = apflora.tpop."PopId")
      INNER JOIN
        (apflora.tpopmassn
        LEFT JOIN
          apflora.tpopmassn_typ_werte
          ON apflora.tpopmassn.typ = tpopmassn_typ_werte.code)
        ON apflora.tpop."TPopId" = apflora.tpopmassn.tpop_id)
    ON apflora.ap."ApArtId" = apflora.pop."ApArtId")
  LEFT JOIN
    apflora.ap_bearbstand_werte
    ON apflora.ap."ApStatus" = apflora.ap_bearbstand_werte."DomainCode")
  LEFT JOIN
    apflora.ap_umsetzung_werte
    ON apflora.ap."ApUmsetzung" = apflora.ap_umsetzung_werte."DomainCode")
  LEFT JOIN
    apflora.pop_status_werte
    ON apflora.pop."PopHerkunft" = pop_status_werte."HerkunftId")
  LEFT JOIN
    apflora.pop_status_werte AS "domPopHerkunft_1"
    ON apflora.tpop."TPopHerkunft" = "domPopHerkunft_1"."HerkunftId")
  LEFT JOIN
    apflora.adresse
    ON apflora.tpopmassn.bearbeiter = apflora.adresse."AdrId"
WHERE
  apflora.adb_eigenschaften."TaxonomieId" > 150
ORDER BY
  apflora.adb_eigenschaften."Artname",
  apflora.pop."PopNr",
  apflora.tpop."TPopNr",
  apflora.tpopmassn.jahr,
  apflora.tpopmassn.datum,
  tpopmassn_typ_werte.text;

DROP VIEW IF EXISTS apflora.v_massn_webgisbun CASCADE;
CREATE OR REPLACE VIEW apflora.v_massn_webgisbun AS
SELECT
  apflora.adb_eigenschaften."TaxonomieId" AS "APARTID",
  apflora.adb_eigenschaften."Artname" AS "APART",
  apflora.pop."PopGuid" AS "POPGUID",
  apflora.pop."PopNr" AS "POPNR",
  apflora.tpop."TPopGuid" AS "TPOPGUID",
  apflora.tpop."TPopNr" AS "TPOPNR",
  apflora.tpop."TPopXKoord" AS "TPOP_X",
  apflora.tpop."TPopYKoord" AS "TPOP_Y",
  apflora.tpopmassn.id AS "MASSNGUID",
  apflora.tpopmassn.jahr AS "MASSNJAHR",
  -- need to convert date
  apflora.tpopmassn.datum AS "MASSNDAT",
  tpopmassn_typ_werte.text AS "MASSTYP",
  apflora.tpopmassn.beschreibung AS "MASSNMASSNAHME",
  apflora.adresse."AdrName" AS "MASSNBEARBEITER",
  apflora.tpopmassn.bemerkungen::char AS "MASSNBEMERKUNG",
  apflora.tpopmassn.plan_vorhanden AS "MASSNPLAN",
  apflora.tpopmassn.plan_bezeichnung AS "MASSPLANBEZ",
  apflora.tpopmassn.flaeche AS "MASSNFLAECHE",
  apflora.tpopmassn.form AS "MASSNFORMANSIEDL",
  apflora.tpopmassn.pflanzanordnung AS "MASSNPFLANZANORDNUNG",
  apflora.tpopmassn.markierung AS "MASSNMARKIERUNG",
  apflora.tpopmassn.anz_triebe AS "MASSNANZTRIEBE",
  apflora.tpopmassn.anz_pflanzen AS "MASSNANZPFLANZEN",
  apflora.tpopmassn.anz_pflanzstellen AS "MASSNANZPFLANZSTELLEN",
  apflora.tpopmassn.wirtspflanze AS "MASSNWIRTSPFLANZEN",
  apflora.tpopmassn.herkunft_pop AS "MASSNHERKUNFTSPOP",
  apflora.tpopmassn.sammeldatum AS "MASSNSAMMELDAT",
  -- need to convert date
  apflora.tpopmassn.changed AS "MASSNCHANGEDAT",
  apflora.tpopmassn.changed_by AS "MASSNCHANGEBY"
FROM
  ((((((apflora.adb_eigenschaften
  INNER JOIN
    apflora.ap ON apflora.adb_eigenschaften."TaxonomieId" = apflora.ap."ApArtId")
    INNER JOIN
      ((apflora.pop
      INNER JOIN
        apflora.tpop
        ON apflora.pop."PopId" = apflora.tpop."PopId")
      INNER JOIN
        (apflora.tpopmassn
        LEFT JOIN
          apflora.tpopmassn_typ_werte
          ON apflora.tpopmassn.typ = tpopmassn_typ_werte.code)
        ON apflora.tpop."TPopId" = apflora.tpopmassn.tpop_id)
    ON apflora.ap."ApArtId" = apflora.pop."ApArtId")
  LEFT JOIN
    apflora.ap_bearbstand_werte
    ON apflora.ap."ApStatus" = apflora.ap_bearbstand_werte."DomainCode")
  LEFT JOIN
    apflora.ap_umsetzung_werte
    ON apflora.ap."ApUmsetzung" = apflora.ap_umsetzung_werte."DomainCode")
  LEFT JOIN
    apflora.pop_status_werte
    ON apflora.pop."PopHerkunft" = pop_status_werte."HerkunftId")
  LEFT JOIN
    apflora.pop_status_werte AS "domPopHerkunft_1"
    ON apflora.tpop."TPopHerkunft" = "domPopHerkunft_1"."HerkunftId")
  LEFT JOIN
    apflora.adresse
    ON apflora.tpopmassn.bearbeiter = apflora.adresse."AdrId"
WHERE
  apflora.adb_eigenschaften."TaxonomieId" > 150
ORDER BY
  apflora.adb_eigenschaften."Artname",
  apflora.pop."PopNr",
  apflora.tpop."TPopNr",
  apflora.tpopmassn.jahr,
  apflora.tpopmassn.datum,
  tpopmassn_typ_werte.text;

DROP VIEW IF EXISTS apflora.v_massn_fuergis_write CASCADE;
CREATE OR REPLACE VIEW apflora.v_massn_fuergis_write AS
SELECT
  apflora.tpopmassn.id AS "tpopmassnid",
  CAST(apflora.tpopmassn.id AS varchar(50)) AS "massnguid",
  apflora.tpopmassn.tpop_id AS "tpopid",
  apflora.tpopmassn.typ AS "tpopmassntyp",
  apflora.tpopmassn.jahr AS "massnjahr",
  apflora.tpopmassn.datum::timestamp AS "massndatum",
  apflora.tpopmassn.bearbeiter AS "tpopmassnbearb",
  apflora.tpopmassn.beschreibung AS "massnmassnahme",
  apflora.tpopmassn.plan_vorhanden AS "massnplanvorhanden",
  apflora.tpopmassn.plan_bezeichnung AS "massnplanbezeichnung",
  apflora.tpopmassn.flaeche AS "massnflaeche",
  apflora.tpopmassn.form AS "massnformderansiedlung",
  apflora.tpopmassn.pflanzanordnung AS "massnpflanzanordnung",
  apflora.tpopmassn.markierung AS "massnmarkierung",
  apflora.tpopmassn.anz_triebe AS "massnanztriebe",
  apflora.tpopmassn.anz_pflanzen AS "massnpflanzen",
  apflora.tpopmassn.anz_pflanzstellen AS "massnanzpflanzstellen",
  apflora.tpopmassn.wirtspflanze AS "massnwirtspflanze",
  apflora.tpopmassn.herkunft_pop AS "massnherkunftspopulation",
  apflora.tpopmassn.sammeldatum AS "massnsammeldatum",
  apflora.tpopmassn.bemerkungen AS "tpopmassnbemtxt",
  apflora.tpopmassn.changed::timestamp AS "massnmutwann",
  apflora.tpopmassn.changed_by AS "massnmutwer"
FROM
  apflora.tpopmassn;

DROP VIEW IF EXISTS apflora.v_massn_fuergis_read CASCADE;
CREATE OR REPLACE VIEW apflora.v_massn_fuergis_read AS
SELECT
  apflora.adb_eigenschaften."TaxonomieId" AS "apartid",
  apflora.adb_eigenschaften."Artname" AS "apart",
  apflora.ap_bearbstand_werte."DomainTxt" AS "apstatus",
  apflora.ap."ApJahr" AS "apstartimjahr",
  apflora.ap_umsetzung_werte."DomainTxt" AS "apstandumsetzung",
  CAST(apflora.pop."PopGuid" AS varchar(50)) AS "popguid",
  apflora.pop."PopNr" AS "popnr",
  apflora.pop."PopName" AS "popname",
  pop_status_werte."HerkunftTxt" AS "popstatus",
  apflora.pop."PopBekanntSeit" AS "popbekanntseit",
  apflora.pop."PopXKoord" AS "popxkoordinaten",
  apflora.pop."PopYKoord" AS "popykoordinaten",
  CAST(apflora.tpop."TPopGuid" AS varchar(50)) AS "tpopguid",
  apflora.tpop."TPopNr" AS "tpopnr",
  apflora.tpop."TPopGemeinde" AS "tpopgemeinde",
  apflora.tpop."TPopFlurname" AS "tpopflurname",
  "domPopHerkunft_1"."HerkunftTxt" AS "tpopstatus",
  apflora.tpop."TPopHerkunftUnklar" AS "tpopstatusunklar",
  apflora.tpop."TPopHerkunftUnklarBegruendung" AS "tpopbegruendungfuerunklarenstatus",
  apflora.tpop."TPopXKoord" AS "tpopxkoordinaten",
  apflora.tpop."TPopYKoord" AS "tpopykoordinaten",
  apflora.tpop."TPopRadius" AS "tpopradius",
  apflora.tpop."TPopHoehe" AS "tpophoehe",
  apflora.tpop."TPopExposition" AS "tpopexposition",
  apflora.tpop."TPopKlima" AS "tpopklima",
  apflora.tpop."TPopNeigung" AS "tpophangneigung",
  apflora.tpop."TPopBeschr" AS "tpopbeschreibung",
  apflora.tpop."TPopKatNr" AS "tpopkatasternr",
  apflora.adresse."AdrName" AS "tpopverantwortlich",
  apflora.tpop."TPopApBerichtRelevant" AS "tpopfuerapberichtrelevant",
  apflora.tpop."TPopBekanntSeit" AS "tpopbekanntseit",
  apflora.tpop."TPopEigen" AS "tpopeigentuemerin",
  apflora.tpop."TPopKontakt" AS "tpopkontaktvorort",
  apflora.tpop."TPopNutzungszone" AS "tpopnutzungszone",
  apflora.tpop."TPopBewirtschafterIn" AS "tpopbewirtschafterin",
  apflora.tpop."TPopBewirtschaftung" AS "tpopbewirtschaftung",
  CAST(apflora.tpopmassn.id AS varchar(50)) AS "massnguid",
  apflora.tpopmassn.jahr AS "massnjahr",
  apflora.tpopmassn.datum::timestamp AS "massndatum",
  tpopmassn_typ_werte.text AS "massntyp",
  apflora.tpopmassn.beschreibung AS "massnmassnahme",
  apflora.adresse."AdrName" AS "massnbearbeiterin",
  apflora.tpopmassn.plan_vorhanden AS "massnplanvorhanden",
  apflora.tpopmassn.plan_bezeichnung AS "massnplanbezeichnung",
  apflora.tpopmassn.flaeche AS "massnflaeche",
  apflora.tpopmassn.form AS "massnformderansiedlung",
  apflora.tpopmassn.pflanzanordnung AS "massnpflanzanordnung",
  apflora.tpopmassn.markierung AS "massnmarkierung",
  apflora.tpopmassn.anz_triebe AS "massnanztriebe",
  apflora.tpopmassn.anz_pflanzen AS "massnpflanzen",
  apflora.tpopmassn.anz_pflanzstellen AS "massnanzpflanzstellen",
  apflora.tpopmassn.wirtspflanze AS "massnwirtspflanze",
  apflora.tpopmassn.herkunft_pop AS "massnherkunftspopulation",
  apflora.tpopmassn.sammeldatum AS "massnsammeldatum",
  apflora.tpopmassn.changed::timestamp AS "massnmutwann",
  apflora.tpopmassn.changed_by AS "massnmutwer"
FROM
  ((((((apflora.adb_eigenschaften
  INNER JOIN
    apflora.ap ON apflora.adb_eigenschaften."TaxonomieId" = apflora.ap."ApArtId")
    INNER JOIN
      ((apflora.pop
      INNER JOIN
        apflora.tpop
        ON apflora.pop."PopId" = apflora.tpop."PopId")
      INNER JOIN
        (apflora.tpopmassn
        LEFT JOIN
          apflora.tpopmassn_typ_werte
          ON apflora.tpopmassn.typ = tpopmassn_typ_werte.code)
        ON apflora.tpop."TPopId" = apflora.tpopmassn.tpop_id)
    ON apflora.ap."ApArtId" = apflora.pop."ApArtId")
  LEFT JOIN
    apflora.ap_bearbstand_werte
    ON apflora.ap."ApStatus" = apflora.ap_bearbstand_werte."DomainCode")
  LEFT JOIN
    apflora.ap_umsetzung_werte
    ON apflora.ap."ApUmsetzung" = apflora.ap_umsetzung_werte."DomainCode")
  LEFT JOIN
    apflora.pop_status_werte
    ON apflora.pop."PopHerkunft" = pop_status_werte."HerkunftId")
  LEFT JOIN
    apflora.pop_status_werte AS "domPopHerkunft_1"
    ON apflora.tpop."TPopHerkunft" = "domPopHerkunft_1"."HerkunftId")
  LEFT JOIN
    apflora.adresse
    ON apflora.tpopmassn.bearbeiter = apflora.adresse."AdrId"
ORDER BY
  apflora.adb_eigenschaften."Artname",
  apflora.pop."PopNr",
  apflora.tpop."TPopNr",
  apflora.tpopmassn.jahr,
  apflora.tpopmassn.datum,
  tpopmassn_typ_werte.text;

DROP VIEW IF EXISTS apflora.v_tpop_anzmassn CASCADE;
CREATE OR REPLACE VIEW apflora.v_tpop_anzmassn AS
SELECT
  apflora.adb_eigenschaften."TaxonomieId" AS "ApArtId",
  apflora.adb_eigenschaften."Familie",
  apflora.adb_eigenschaften."Artname" AS "AP Art",
  apflora.ap_bearbstand_werte."DomainTxt" AS "AP Status",
  apflora.ap."ApJahr" AS "AP Start im Jahr",
  apflora.ap_umsetzung_werte."DomainTxt" AS "AP Stand Umsetzung",
  apflora.pop."PopId",
  apflora.pop."PopGuid" AS "Pop Guid",
  apflora.pop."PopNr" AS "Pop Nr",
  apflora.pop."PopName" AS "Pop Name",
  pop_status_werte."HerkunftTxt" AS "Pop Status",
  apflora.pop."PopBekanntSeit" AS "Pop bekannt seit",
  apflora.pop."PopHerkunftUnklar" AS "Pop Status unklar",
  apflora.pop."PopHerkunftUnklarBegruendung" AS "Pop Begruendung fuer unklaren Status",
  apflora.pop."PopXKoord" AS "Pop X-Koordinaten",
  apflora.pop."PopYKoord" AS "Pop Y-Koordinaten",
  apflora.tpop."TPopId",
  apflora.tpop."TPopGuid" AS "TPop Guid",
  apflora.tpop."TPopNr" AS "TPop Nr",
  apflora.tpop."TPopGemeinde" AS "TPop Gemeinde",
  apflora.tpop."TPopFlurname" AS "TPop Flurname",
  "domPopHerkunft_1"."HerkunftTxt" AS "TPop Status",
  apflora.tpop."TPopBekanntSeit" AS "TPop bekannt seit",
  apflora.tpop."TPopHerkunftUnklar" AS "TPop Status unklar",
  apflora.tpop."TPopHerkunftUnklarBegruendung" AS "TPop Begruendung fuer unklaren Status",
  apflora.tpop."TPopXKoord" AS "TPop X-Koordinaten",
  apflora.tpop."TPopYKoord" AS "TPop Y-Koordinaten",
  apflora.tpop."TPopRadius" AS "TPop Radius (m)",
  apflora.tpop."TPopHoehe" AS "TPop Hoehe",
  apflora.tpop."TPopExposition" AS "TPop Exposition",
  apflora.tpop."TPopKlima" AS "TPop Klima",
  apflora.tpop."TPopNeigung" AS "TPop Hangneigung",
  apflora.tpop."TPopBeschr" AS "TPop Beschreibung",
  apflora.tpop."TPopKatNr" AS "TPop Kataster-Nr",
  apflora.tpop."TPopApBerichtRelevant" AS "TPop fuer AP-Bericht relevant",
  apflora.tpop."TPopEigen" AS "TPop EigentuemerIn",
  apflora.tpop."TPopKontakt" AS "TPop Kontakt vor Ort",
  apflora.tpop."TPopNutzungszone" AS "TPop Nutzungszone",
  apflora.tpop."TPopBewirtschafterIn" AS "TPop BewirtschafterIn",
  apflora.tpop."TPopBewirtschaftung" AS "TPop Bewirtschaftung",
  count(apflora.tpopmassn.id) AS "Anzahl Massnahmen"
FROM
  apflora.adb_eigenschaften
  INNER JOIN
    (((apflora.ap
    INNER JOIN
      ((apflora.pop
      LEFT JOIN
        apflora.pop_status_werte
        ON apflora.pop."PopHerkunft" = pop_status_werte."HerkunftId")
      INNER JOIN
        ((apflora.tpop
        LEFT JOIN
          apflora.tpopmassn
          ON apflora.tpop."TPopId" = apflora.tpopmassn.tpop_id)
        LEFT JOIN
          apflora.pop_status_werte AS "domPopHerkunft_1"
          ON apflora.tpop."TPopHerkunft" = "domPopHerkunft_1"."HerkunftId")
        ON apflora.pop."PopId" = apflora.tpop."PopId")
      ON apflora.ap."ApArtId" = apflora.pop."ApArtId")
    LEFT JOIN
      apflora.ap_bearbstand_werte
      ON apflora.ap."ApStatus" = apflora.ap_bearbstand_werte."DomainCode")
    LEFT JOIN
      apflora.ap_umsetzung_werte
      ON apflora.ap."ApUmsetzung" = apflora.ap_umsetzung_werte."DomainCode")
  ON apflora.adb_eigenschaften."TaxonomieId" = apflora.ap."ApArtId"
GROUP BY
  apflora.adb_eigenschaften."TaxonomieId",
  apflora.adb_eigenschaften."Familie",
  apflora.adb_eigenschaften."Artname",
  apflora.ap_bearbstand_werte."DomainTxt",
  apflora.ap."ApJahr",
  apflora.ap_umsetzung_werte."DomainTxt",
  apflora.pop."PopId",
  apflora.pop."PopGuid",
  apflora.pop."PopNr",
  apflora.pop."PopName",
  pop_status_werte."HerkunftTxt",
  apflora.pop."PopBekanntSeit",
  apflora.pop."PopHerkunftUnklar",
  apflora.pop."PopHerkunftUnklarBegruendung",
  apflora.pop."PopXKoord",
  apflora.pop."PopYKoord",
  apflora.tpop."TPopId",
  apflora.tpop."TPopGuid",
  apflora.tpop."TPopNr",
  apflora.tpop."TPopGemeinde",
  apflora.tpop."TPopFlurname",
  "domPopHerkunft_1"."HerkunftTxt",
  apflora.tpop."TPopBekanntSeit",
  apflora.tpop."TPopHerkunftUnklar",
  apflora.tpop."TPopHerkunftUnklarBegruendung",
  apflora.tpop."TPopXKoord",
  apflora.tpop."TPopYKoord",
  apflora.tpop."TPopRadius",
  apflora.tpop."TPopHoehe",
  apflora.tpop."TPopExposition",
  apflora.tpop."TPopKlima",
  apflora.tpop."TPopNeigung",
  apflora.tpop."TPopBeschr",
  apflora.tpop."TPopKatNr",
  apflora.tpop."TPopApBerichtRelevant",
  apflora.tpop."TPopEigen",
  apflora.tpop."TPopKontakt",
  apflora.tpop."TPopNutzungszone",
  apflora.tpop."TPopBewirtschafterIn",
  apflora.tpop."TPopBewirtschaftung"
ORDER BY
  apflora.adb_eigenschaften."Artname",
  apflora.pop."PopNr",
  apflora.tpop."TPopNr";

DROP VIEW IF EXISTS apflora.v_pop_anzmassn CASCADE;
CREATE OR REPLACE VIEW apflora.v_pop_anzmassn AS
SELECT
  apflora.adb_eigenschaften."TaxonomieId" AS "ApArtId",
  apflora.adb_eigenschaften."Artname" AS "AP Art",
  apflora.ap_bearbstand_werte."DomainTxt" AS "AP Status",
  apflora.ap."ApJahr" AS "AP Start im Jahr",
  apflora.ap_umsetzung_werte."DomainTxt" AS "AP Stand Umsetzung",
  apflora.pop."PopGuid" AS "Pop Guid",
  apflora.pop."PopNr" AS "Pop Nr",
  apflora.pop."PopName" AS "Pop Name",
  pop_status_werte."HerkunftTxt" AS "Pop Status",
  apflora.pop."PopBekanntSeit" AS "Pop bekannt seit",
  apflora.pop."PopHerkunftUnklar" AS "Pop Status unklar",
  apflora.pop."PopHerkunftUnklarBegruendung" AS "Pop Begruendung fuer unklaren Status",
  apflora.pop."PopXKoord" AS "Pop X-Koordinaten",
  apflora.pop."PopYKoord" AS "Pop Y-Koordinaten",
  count(apflora.tpopmassn.id) AS "Anzahl Massnahmen"
FROM
  ((((apflora.adb_eigenschaften
  INNER JOIN
    apflora.ap
    ON apflora.adb_eigenschaften."TaxonomieId" = apflora.ap."ApArtId")
  INNER JOIN
    ((apflora.pop
    LEFT JOIN
      apflora.tpop
      ON apflora.pop."PopId" = apflora.tpop."PopId")
    LEFT JOIN
      apflora.tpopmassn
      ON apflora.tpop."TPopId" = apflora.tpopmassn.tpop_id)
    ON apflora.ap."ApArtId" = apflora.pop."ApArtId")
  LEFT JOIN
    apflora.ap_bearbstand_werte
    ON apflora.ap."ApStatus" = apflora.ap_bearbstand_werte."DomainCode")
  LEFT JOIN
    apflora.ap_umsetzung_werte
    ON apflora.ap."ApUmsetzung" = apflora.ap_umsetzung_werte."DomainCode")
  LEFT JOIN
    apflora.pop_status_werte
    ON apflora.pop."PopHerkunft" = pop_status_werte."HerkunftId"
GROUP BY
  apflora.adb_eigenschaften."TaxonomieId",
  apflora.adb_eigenschaften."Artname",
  apflora.ap_bearbstand_werte."DomainTxt",
  apflora.ap."ApJahr",
  apflora.ap_umsetzung_werte."DomainTxt",
  apflora.pop."PopGuid",
  apflora.pop."PopNr",
  apflora.pop."PopName",
  pop_status_werte."HerkunftTxt",
  apflora.pop."PopHerkunftUnklar",
  apflora.pop."PopHerkunftUnklarBegruendung",
  apflora.pop."PopBekanntSeit",
  apflora.pop."PopXKoord",
  apflora.pop."PopYKoord"
ORDER BY
  apflora.adb_eigenschaften."Artname",
  apflora.pop."PopNr";

DROP VIEW IF EXISTS apflora.v_pop_anzkontr CASCADE;
CREATE OR REPLACE VIEW apflora.v_pop_anzkontr AS
SELECT
  apflora.adb_eigenschaften."TaxonomieId" AS "ApArtId",
  apflora.adb_eigenschaften."Artname" AS "AP Art",
  apflora.ap_bearbstand_werte."DomainTxt" AS "AP Status",
  apflora.ap."ApJahr" AS "AP Start im Jahr",
  apflora.ap_umsetzung_werte."DomainTxt" AS "AP Stand Umsetzung",
  apflora.pop."PopId",
  apflora.pop."PopGuid" AS "Pop Guid",
  apflora.pop."PopNr" AS "Pop Nr",
  apflora.pop."PopName" AS "Pop Name",
  pop_status_werte."HerkunftTxt" AS "Pop Status",
  apflora.pop."PopBekanntSeit" AS "Pop bekannt seit",
  apflora.pop."PopHerkunftUnklar" AS "Pop Status unklar",
  apflora.pop."PopHerkunftUnklarBegruendung" AS "Pop Begruendung fuer unklaren Status",
  apflora.pop."PopXKoord" AS "Pop X-Koordinaten",
  apflora.pop."PopYKoord" AS "Pop Y-Koordinaten",
  count(apflora.tpopkontr."TPopKontrId") AS "Anzahl Kontrollen"
FROM
  ((((apflora.adb_eigenschaften
  INNER JOIN
    apflora.ap
    ON apflora.adb_eigenschaften."TaxonomieId" = apflora.ap."ApArtId")
  INNER JOIN
    ((apflora.pop
    LEFT JOIN
      apflora.tpop
      ON apflora.pop."PopId" = apflora.tpop."PopId")
    LEFT JOIN
      apflora.tpopkontr
      ON apflora.tpop."TPopId" = apflora.tpopkontr."TPopId")
    ON apflora.ap."ApArtId" = apflora.pop."ApArtId")
  LEFT JOIN
    apflora.ap_bearbstand_werte
    ON apflora.ap."ApStatus" = apflora.ap_bearbstand_werte."DomainCode")
  LEFT JOIN
    apflora.ap_umsetzung_werte
    ON apflora.ap."ApUmsetzung" = apflora.ap_umsetzung_werte."DomainCode")
  LEFT JOIN
    apflora.pop_status_werte
    ON apflora.pop."PopHerkunft" = pop_status_werte."HerkunftId"
GROUP BY
  apflora.adb_eigenschaften."TaxonomieId",
  apflora.adb_eigenschaften."Artname",
  apflora.ap_bearbstand_werte."DomainTxt",
  apflora.ap."ApJahr",
  apflora.ap_umsetzung_werte."DomainTxt",
  apflora.pop."PopId",
  apflora.pop."PopGuid",
  apflora.pop."PopNr",
  apflora.pop."PopName",
  pop_status_werte."HerkunftTxt",
  apflora.pop."PopHerkunftUnklar",
  apflora.pop."PopHerkunftUnklarBegruendung",
  apflora.pop."PopBekanntSeit",
  apflora.pop."PopXKoord",
  apflora.pop."PopYKoord"
ORDER BY
  apflora.adb_eigenschaften."Artname",
  apflora.pop."PopNr";

DROP VIEW IF EXISTS apflora.v_ap_anzmassn CASCADE;
CREATE OR REPLACE VIEW apflora.v_ap_anzmassn AS
SELECT
  apflora.adb_eigenschaften."TaxonomieId" AS "ApArtId",
  apflora.adb_eigenschaften."Artname" AS "AP Art",
  apflora.ap_bearbstand_werte."DomainTxt" AS "AP Status",
  apflora.ap."ApJahr" AS "AP Start im Jahr",
  apflora.ap_umsetzung_werte."DomainTxt" AS "AP Stand Umsetzung",
  count(apflora.tpopmassn.id) AS "Anzahl Massnahmen"
FROM
  (((apflora.adb_eigenschaften
  INNER JOIN
    apflora.ap
    ON apflora.adb_eigenschaften."TaxonomieId" = apflora.ap."ApArtId")
  LEFT JOIN
    ((apflora.pop
    LEFT JOIN
      apflora.tpop
      ON apflora.pop."PopId" = apflora.tpop."PopId")
    LEFT JOIN
      apflora.tpopmassn
      ON apflora.tpop."TPopId" = apflora.tpopmassn.tpop_id)
    ON apflora.ap."ApArtId" = apflora.pop."ApArtId")
  LEFT JOIN
    apflora.ap_bearbstand_werte
    ON apflora.ap."ApStatus" = apflora.ap_bearbstand_werte."DomainCode")
  LEFT JOIN
    apflora.ap_umsetzung_werte
    ON apflora.ap."ApUmsetzung" = apflora.ap_umsetzung_werte."DomainCode"
GROUP BY
  apflora.adb_eigenschaften."TaxonomieId",
  apflora.adb_eigenschaften."Artname",
  apflora.ap_bearbstand_werte."DomainTxt",
  apflora.ap."ApJahr",
  apflora.ap_umsetzung_werte."DomainTxt"
ORDER BY
  apflora.adb_eigenschaften."Artname";

DROP VIEW IF EXISTS apflora.v_ap_anzkontr CASCADE;
CREATE OR REPLACE VIEW apflora.v_ap_anzkontr AS
SELECT
  apflora.adb_eigenschaften."TaxonomieId" AS "ApArtId",
  apflora.adb_eigenschaften."Artname" AS "AP Art",
  apflora.ap_bearbstand_werte."DomainTxt" AS "AP Status",
  apflora.ap."ApJahr" AS "AP Start im Jahr",
  apflora.ap_umsetzung_werte."DomainTxt" AS "AP Stand Umsetzung",
  count(apflora.tpopkontr."TPopKontrId") AS "Anzahl Kontrollen"
FROM
  (((apflora.adb_eigenschaften
  INNER JOIN
    apflora.ap
    ON apflora.adb_eigenschaften."TaxonomieId" = apflora.ap."ApArtId")
  LEFT JOIN
    ((apflora.pop
    LEFT JOIN
      apflora.tpop
      ON apflora.pop."PopId" = apflora.tpop."PopId")
    LEFT JOIN
      apflora.tpopkontr
      ON apflora.tpop."TPopId" = apflora.tpopkontr."TPopId")
    ON apflora.ap."ApArtId" = apflora.pop."ApArtId")
  LEFT JOIN
    apflora.ap_bearbstand_werte
    ON apflora.ap."ApStatus" = apflora.ap_bearbstand_werte."DomainCode")
  LEFT JOIN
    apflora.ap_umsetzung_werte
    ON apflora.ap."ApUmsetzung" = apflora.ap_umsetzung_werte."DomainCode"
GROUP BY
  apflora.adb_eigenschaften."TaxonomieId",
  apflora.adb_eigenschaften."Artname",
  apflora.ap_bearbstand_werte."DomainTxt",
  apflora.ap."ApJahr",
  apflora.ap_umsetzung_werte."DomainTxt"
ORDER BY
  apflora.adb_eigenschaften."Artname";

DROP VIEW IF EXISTS apflora.v_pop CASCADE;
CREATE OR REPLACE VIEW apflora.v_pop AS
SELECT
  apflora.adb_eigenschaften."TaxonomieId" AS "ApArtId",
  apflora.adb_eigenschaften."Artname" AS "AP Art",
  apflora.ap_bearbstand_werte."DomainTxt" AS "AP Status",
  apflora.ap."ApJahr" AS "AP Start im Jahr",
  apflora.ap_umsetzung_werte."DomainTxt" AS "AP Stand Umsetzung",
  apflora.pop."PopId",
  apflora.pop."PopGuid" AS "Pop Guid",
  apflora.pop."PopNr" AS "Pop Nr",
  apflora.pop."PopName" AS "Pop Name",
  pop_status_werte."HerkunftTxt" AS "Pop Status",
  apflora.pop."PopBekanntSeit" AS "Pop bekannt seit",
  apflora.pop."PopHerkunftUnklar" AS "Pop Status unklar",
  apflora.pop."PopHerkunftUnklarBegruendung" AS "Pop Begruendung fuer unklaren Status",
  apflora.pop."PopXKoord" AS "Pop X-Koordinaten",
  apflora.pop."PopYKoord" AS "Pop Y-Koordinaten",
  apflora.pop."MutWann" AS "Datensatz zuletzt geaendert",
  apflora.pop."MutWer" AS "Datensatz zuletzt geaendert von"
FROM
  apflora.adb_eigenschaften
  INNER JOIN
    (((apflora.ap
    LEFT JOIN
      apflora.ap_bearbstand_werte
      ON apflora.ap."ApStatus" = apflora.ap_bearbstand_werte."DomainCode")
    LEFT JOIN
      apflora.ap_umsetzung_werte
      ON apflora.ap."ApUmsetzung" = apflora.ap_umsetzung_werte."DomainCode")
    INNER JOIN
      (apflora.pop
      LEFT JOIN
        apflora.pop_status_werte
        ON apflora.pop."PopHerkunft" = pop_status_werte."HerkunftId")
      ON apflora.ap."ApArtId" = apflora.pop."ApArtId")
    ON apflora.adb_eigenschaften."TaxonomieId" = apflora.ap."ApArtId"
ORDER BY
  apflora.adb_eigenschaften."Artname",
  apflora.pop."PopNr";

DROP VIEW IF EXISTS apflora.v_pop_ohnekoord CASCADE;
CREATE OR REPLACE VIEW apflora.v_pop_ohnekoord AS
SELECT
  apflora.adb_eigenschaften."TaxonomieId" AS "ApArtId",
  apflora.adb_eigenschaften."Artname" AS "AP Art",
  apflora.ap_bearbstand_werte."DomainTxt" AS "AP Status",
  apflora.ap."ApJahr" AS "AP Start im Jahr",
  apflora.ap_umsetzung_werte."DomainTxt" AS "AP Stand Umsetzung",
  apflora.pop."PopId",
  apflora.pop."PopGuid" AS "Pop Guid",
  apflora.pop."PopNr" AS "Pop Nr",
  apflora.pop."PopName" AS "Pop Name",
  pop_status_werte."HerkunftTxt" AS "Pop Status",
  apflora.pop."PopBekanntSeit" AS "Pop bekannt seit",
  apflora.pop."PopHerkunftUnklar" AS "Pop Status unklar",
  apflora.pop."PopHerkunftUnklarBegruendung" AS "Pop Begruendung fuer unklaren Status",
  apflora.pop."PopXKoord" AS "Pop X-Koordinaten",
  apflora.pop."PopYKoord" AS "Pop Y-Koordinaten",
  apflora.pop."MutWann" AS "Datensatz zuletzt geaendert",
  apflora.pop."MutWer" AS "Datensatz zuletzt geaendert von"
FROM
  ((((apflora.adb_eigenschaften
  INNER JOIN
    apflora.ap
    ON apflora.adb_eigenschaften."TaxonomieId" = apflora.ap."ApArtId")
  INNER JOIN
    apflora.pop
    ON apflora.ap."ApArtId" = apflora.pop."ApArtId")
  LEFT JOIN
    apflora.ap_bearbstand_werte
    ON apflora.ap."ApStatus" = apflora.ap_bearbstand_werte."DomainCode")
  LEFT JOIN
    apflora.ap_umsetzung_werte
    ON apflora.ap."ApUmsetzung" = apflora.ap_umsetzung_werte."DomainCode")
  LEFT JOIN
    apflora.pop_status_werte
    ON apflora.pop."PopHerkunft" = pop_status_werte."HerkunftId"
WHERE
  apflora.pop."PopXKoord" IS NULL
  OR apflora.pop."PopYKoord" IS NULL
ORDER BY
  apflora.adb_eigenschaften."Artname",
  apflora.pop."PopNr";

DROP VIEW IF EXISTS apflora.v_pop_fuergis_write CASCADE;
CREATE OR REPLACE VIEW apflora.v_pop_fuergis_write AS
SELECT
  apflora.pop."PopId" AS "popid",
  apflora.pop."ApArtId" AS "apartid",
  CAST(apflora.pop."PopGuid" AS varchar(50)) AS "popguid",
  apflora.pop."PopNr" AS "popnr",
  apflora.pop."PopName" AS "popname",
  apflora.pop."PopHerkunft" AS "popherkunft",
  apflora.pop."PopHerkunftUnklar" AS "popherkunftunklar",
  apflora.pop."PopHerkunftUnklarBegruendung" AS "popherkunftunklarbegruendung",
  apflora.pop."PopBekanntSeit" AS "popbekanntseit",
  apflora.pop."PopXKoord" AS "popxkoord",
  apflora.pop."PopYKoord" AS "popykoord",
  apflora.pop."MutWann"::timestamp AS "mutwann",
  apflora.pop."MutWer" AS "mutwer"
FROM
  apflora.pop;

DROP VIEW IF EXISTS apflora.v_pop_fuergis_read CASCADE;
CREATE OR REPLACE VIEW apflora.v_pop_fuergis_read AS
SELECT
  apflora.adb_eigenschaften."TaxonomieId" AS "apartid",
  apflora.adb_eigenschaften."Artname" AS "artname",
  apflora.ap_bearbstand_werte."DomainTxt" AS "apstatus",
  apflora.ap."ApJahr" AS "apjahr",
  apflora.ap_umsetzung_werte."DomainTxt" AS "apumsetzung",
  CAST(apflora.pop."PopGuid" AS varchar(50)) AS "popguid",
  apflora.pop."PopNr" AS "popnr",
  apflora.pop."PopName" AS "popname",
  pop_status_werte."HerkunftTxt" AS "popherkunft",
  apflora.pop."PopBekanntSeit" AS "popbekanntseit",
  apflora.pop."PopHerkunftUnklar" AS "popherkunftunklar",
  apflora.pop."PopHerkunftUnklarBegruendung" AS "popherkunftunklarbegruendung",
  apflora.pop."PopXKoord" AS "popxkoord",
  apflora.pop."PopYKoord" AS "popykoord",
  apflora.pop."MutWann"::timestamp AS "mutwann",
  apflora.pop."MutWer" AS "mutwer"
FROM
  ((((apflora.adb_eigenschaften
  INNER JOIN
    apflora.ap
    ON apflora.adb_eigenschaften."TaxonomieId" = apflora.ap."ApArtId")
  INNER JOIN
    apflora.pop
    ON apflora.ap."ApArtId" = apflora.pop."ApArtId")
  LEFT JOIN
    apflora.ap_bearbstand_werte
    ON apflora.ap."ApStatus" = apflora.ap_bearbstand_werte."DomainCode")
  LEFT JOIN
    apflora.ap_umsetzung_werte
    ON apflora.ap."ApUmsetzung" = apflora.ap_umsetzung_werte."DomainCode")
  LEFT JOIN
    apflora.pop_status_werte
    ON apflora.pop."PopHerkunft" = pop_status_werte."HerkunftId"
WHERE
  apflora.pop."PopXKoord" > 0
  AND apflora.pop."PopYKoord" > 0
ORDER BY
  apflora.adb_eigenschaften."Artname",
  apflora.pop."PopNr";

-- im Gebrauch (Access):
DROP VIEW IF EXISTS apflora.v_pop_verwaist CASCADE;
CREATE OR REPLACE VIEW apflora.v_pop_verwaist AS
SELECT
  apflora.pop."PopGuid" AS "Pop Guid",
  apflora.pop."PopNr" AS "Pop Nr",
  apflora.pop."PopName" AS "Pop Name",
  pop_status_werte."HerkunftTxt" AS "Pop Status",
  apflora.pop."PopBekanntSeit" AS "Pop bekannt seit",
  apflora.pop."PopHerkunftUnklar" AS "Pop Status unklar",
  apflora.pop."PopHerkunftUnklarBegruendung" AS "Pop Begruendung fuer unklaren Status",
  apflora.pop."PopXKoord" AS "Pop X-Koordinaten",
  apflora.pop."PopYKoord" AS "Pop Y-Koordinaten",
  apflora.pop."MutWann" AS "Datensatz zuletzt geaendert",
  apflora.pop."MutWer" AS "Datensatz zuletzt geaendert von",
  apflora.ap."ApArtId"
FROM
  (apflora.ap
  RIGHT JOIN
    apflora.pop
    ON apflora.ap."ApArtId" = apflora.pop."ApArtId")
  LEFT JOIN
    apflora.pop_status_werte
    ON apflora.pop."PopHerkunft" = pop_status_werte."HerkunftId"
WHERE
  apflora.ap."ApArtId" IS NULL
ORDER BY
  apflora.pop."PopName",
  apflora.pop."PopNr";

DROP VIEW IF EXISTS apflora.v_pop_ohnetpop CASCADE;
CREATE OR REPLACE VIEW apflora.v_pop_ohnetpop AS
SELECT
  apflora.adb_eigenschaften."TaxonomieId" AS "ApArtId",
  apflora.adb_eigenschaften."Artname" AS "AP Art",
  apflora.ap_bearbstand_werte."DomainTxt" AS "AP Status",
  apflora.ap."ApJahr" AS "AP Start im Jahr",
  apflora.ap_umsetzung_werte."DomainTxt" AS "AP Stand Umsetzung",
  apflora.pop."PopId",
  apflora.pop."PopGuid" AS "Pop Guid",
  apflora.pop."PopNr" AS "Pop Nr",
  apflora.pop."PopName" AS "Pop Name",
  pop_status_werte."HerkunftTxt" AS "Pop Status",
  apflora.pop."PopBekanntSeit" AS "Pop bekannt seit",
  apflora.pop."PopHerkunftUnklar" AS "Pop Status unklar",
  apflora.pop."PopHerkunftUnklarBegruendung" AS "Pop Begruendung fuer unklaren Status",
  apflora.pop."PopXKoord" AS "Pop X-Koordinaten",
  apflora.pop."PopYKoord" AS "Pop Y-Koordinaten",
  apflora.pop."MutWann" AS "Datensatz zuletzt geaendert",
  apflora.pop."MutWer" AS "Datensatz zuletzt geaendert von"
FROM
  (((((apflora.adb_eigenschaften
  INNER JOIN
    apflora.ap
    ON apflora.adb_eigenschaften."TaxonomieId" = apflora.ap."ApArtId")
  INNER JOIN
    apflora.pop
    ON apflora.ap."ApArtId" = apflora.pop."ApArtId")
  LEFT JOIN
    apflora.ap_bearbstand_werte
    ON apflora.ap."ApStatus" = apflora.ap_bearbstand_werte."DomainCode")
  LEFT JOIN
    apflora.ap_umsetzung_werte
    ON apflora.ap."ApUmsetzung" = apflora.ap_umsetzung_werte."DomainCode")
  LEFT JOIN
    apflora.pop_status_werte
    ON apflora.pop."PopHerkunft" = pop_status_werte."HerkunftId")
  LEFT JOIN
    apflora.tpop
    ON apflora.pop."PopId" = apflora.tpop."PopId"
WHERE
  apflora.tpop."TPopId" IS NULL
ORDER BY
  apflora.adb_eigenschaften."Artname",
  apflora.pop."PopNr";

DROP VIEW IF EXISTS apflora.v_popber CASCADE;
CREATE OR REPLACE VIEW apflora.v_popber AS
SELECT
  apflora.adb_eigenschaften."TaxonomieId" AS "ApArtId",
  apflora.adb_eigenschaften."Artname" AS "AP Art",
  apflora.ap_bearbstand_werte."DomainTxt" AS "AP Status",
  apflora.ap."ApJahr" AS "AP Start im Jahr",
  apflora.ap_umsetzung_werte."DomainTxt" AS "AP Stand Umsetzung",
  apflora.pop."PopGuid" AS "Pop Guid",
  apflora.pop."PopNr" AS "Pop Nr",
  apflora.pop."PopName" AS "Pop Name",
  pop_status_werte."HerkunftTxt" AS "Pop Status",
  apflora.pop."PopBekanntSeit" AS "Pop bekannt seit",
  apflora.pop."PopHerkunftUnklar" AS "Pop Status unklar",
  apflora.pop."PopHerkunftUnklarBegruendung" AS "Pop Begruendung fuer unklaren Status",
  apflora.pop."PopXKoord" AS "Pop X-Koordinaten",
  apflora.pop."PopYKoord" AS "Pop Y-Koordinaten",
  apflora.popber."PopBerId" AS "PopBer Id",
  apflora.popber."PopBerJahr" AS "PopBer Jahr",
  pop_entwicklung_werte."EntwicklungTxt" AS "PopBer Entwicklung",
  apflora.popber."PopBerTxt" AS "PopBer Bemerkungen",
  apflora.popber."MutWann" AS "PopBer MutWann",
  apflora.popber."MutWer" AS "PopBer MutWer"
FROM
  ((((((apflora.adb_eigenschaften
  INNER JOIN
    apflora.ap
    ON apflora.adb_eigenschaften."TaxonomieId" = apflora.ap."ApArtId")
  INNER JOIN
    apflora.pop
    ON apflora.ap."ApArtId" = apflora.pop."ApArtId")
  LEFT JOIN
    apflora.ap_bearbstand_werte
    ON apflora.ap."ApStatus" = apflora.ap_bearbstand_werte."DomainCode")
  LEFT JOIN
    apflora.ap_umsetzung_werte
    ON apflora.ap."ApUmsetzung" = apflora.ap_umsetzung_werte."DomainCode")
  LEFT JOIN
    apflora.pop_status_werte
    ON apflora.pop."PopHerkunft" = pop_status_werte."HerkunftId")
  INNER JOIN
    apflora.popber
    ON apflora.pop."PopId" = apflora.popber."PopId")
  LEFT JOIN
    apflora.pop_entwicklung_werte
    ON apflora.popber."PopBerEntwicklung" = pop_entwicklung_werte."EntwicklungId"
ORDER BY
  apflora.adb_eigenschaften."Artname",
  apflora.pop."PopNr",
  apflora.popber."PopBerJahr",
  pop_entwicklung_werte."EntwicklungTxt";

-- im Gebrauch (Access):
DROP VIEW IF EXISTS apflora.v_popber_verwaist CASCADE;
CREATE OR REPLACE VIEW apflora.v_popber_verwaist AS
SELECT
  apflora.popber."PopBerId" AS "PopBer Id",
  apflora.popber."PopId" AS "PopBer PopId",
  apflora.popber."PopBerJahr" AS "PopBer Jahr",
  pop_entwicklung_werte."EntwicklungTxt" AS "PopBer Entwicklung",
  apflora.popber."PopBerTxt" AS "PopBer Bemerkungen",
  apflora.popber."MutWann" AS "PopBer MutWann",
  apflora.popber."MutWer" AS "PopBer MutWer"
FROM
  (apflora.pop
  RIGHT JOIN
    apflora.popber
    ON apflora.pop."PopId" = apflora.popber."PopId")
  LEFT JOIN
    apflora.pop_entwicklung_werte
    ON apflora.popber."PopBerEntwicklung" = pop_entwicklung_werte."EntwicklungId"
WHERE
  apflora.pop."PopId" IS NULL
ORDER BY
  apflora.popber."PopBerJahr",
  pop_entwicklung_werte."EntwicklungTxt";

DROP VIEW IF EXISTS apflora.v_popmassnber CASCADE;
CREATE OR REPLACE VIEW apflora.v_popmassnber AS
SELECT
  apflora.adb_eigenschaften."TaxonomieId" AS "AP ApArtId",
  apflora.adb_eigenschaften."Artname" AS "AP Art",
  apflora.ap_bearbstand_werte."DomainTxt" AS "AP Status",
  apflora.ap."ApJahr" AS "AP Start im Jahr",
  apflora.ap_umsetzung_werte."DomainTxt" AS "AP Stand Umsetzung",
  apflora.pop."PopGuid" AS "Pop Guid",
  apflora.pop."PopNr" AS "Pop Nr",
  apflora.pop."PopName" AS "Pop Name",
  pop_status_werte."HerkunftTxt" AS "Pop Status",
  apflora.pop."PopBekanntSeit" AS "Pop bekannt seit",
  apflora.pop."PopHerkunftUnklar" AS "Pop Status unklar",
  apflora.pop."PopHerkunftUnklarBegruendung" AS "Pop Begruendung fuer unklaren Status",
  apflora.pop."PopXKoord" AS "Pop X-Koordinaten",
  apflora.pop."PopYKoord" AS "Pop Y-Koordinaten",
  apflora.pop."MutWann" AS "Datensatz zuletzt geaendert",
  apflora.pop."MutWer" AS "Datensatz zuletzt geaendert von",
  apflora.popmassnber."PopMassnBerId" AS "PopMassnBer Id",
  apflora.popmassnber."PopMassnBerJahr" AS "PopMassnBer Jahr",
  tpopmassn_erfbeurt_werte.text AS "PopMassnBer Entwicklung",
  apflora.popmassnber."PopMassnBerTxt" AS "PopMassnBer Interpretation",
  apflora.popmassnber."MutWann" AS "PopMassnBer MutWann",
  apflora.popmassnber."MutWer" AS "PopMassnBer MutWer"
FROM
  ((((((apflora.adb_eigenschaften
  INNER JOIN
    apflora.ap
    ON apflora.adb_eigenschaften."TaxonomieId" = apflora.ap."ApArtId")
  INNER JOIN
    apflora.pop
    ON apflora.ap."ApArtId" = apflora.pop."ApArtId")
  LEFT JOIN
    apflora.ap_bearbstand_werte
    ON apflora.ap."ApStatus" = apflora.ap_bearbstand_werte."DomainCode")
  LEFT JOIN
    apflora.ap_umsetzung_werte
    ON apflora.ap."ApUmsetzung" = apflora.ap_umsetzung_werte."DomainCode")
  LEFT JOIN
    apflora.pop_status_werte
    ON apflora.pop."PopHerkunft" = pop_status_werte."HerkunftId")
  INNER JOIN
    apflora.popmassnber
    ON apflora.pop."PopId" = apflora.popmassnber."PopId")
  LEFT JOIN
    apflora.tpopmassn_erfbeurt_werte
    ON apflora.popmassnber."PopMassnBerErfolgsbeurteilung" = tpopmassn_erfbeurt_werte.code
ORDER BY
  apflora.adb_eigenschaften."Artname",
  apflora.pop."PopNr";

-- im Gebrauch (Access):
DROP VIEW IF EXISTS apflora.v_popmassnber_verwaist CASCADE;
CREATE OR REPLACE VIEW apflora.v_popmassnber_verwaist AS
SELECT
  apflora.popmassnber."PopMassnBerId" AS "PopMassnBer Id",
  apflora.popmassnber."PopId" AS "PopMassnBer PopId",
  apflora.popmassnber."PopMassnBerJahr" AS "PopMassnBer Jahr",
  tpopmassn_erfbeurt_werte.text AS "PopMassnBer Entwicklung",
  apflora.popmassnber."PopMassnBerTxt" AS "PopMassnBer Interpretation",
  apflora.popmassnber."MutWann" AS "PopMassnBer MutWann",
  apflora.popmassnber."MutWer" AS "PopMassnBer MutWer"
FROM
  (apflora.pop
  RIGHT JOIN
    apflora.popmassnber
    ON apflora.pop."PopId" = apflora.popmassnber."PopId")
  LEFT JOIN
    apflora.tpopmassn_erfbeurt_werte
    ON apflora.popmassnber."PopMassnBerErfolgsbeurteilung" = tpopmassn_erfbeurt_werte.code
WHERE
  apflora.pop."PopId" IS NULL
ORDER BY
  apflora.popmassnber."PopMassnBerJahr",
  tpopmassn_erfbeurt_werte.text;

DROP VIEW IF EXISTS apflora.v_tpop CASCADE;
CREATE OR REPLACE VIEW apflora.v_tpop AS
SELECT
  apflora.adb_eigenschaften."TaxonomieId" AS "ApArtId",
  apflora.adb_eigenschaften."Familie",
  apflora.adb_eigenschaften."Artname" AS "AP Art",
  apflora.ap_bearbstand_werte."DomainTxt" AS "AP Status",
  apflora.ap."ApJahr" AS "AP Start im Jahr",
  apflora.ap_umsetzung_werte."DomainTxt" AS "AP Stand Umsetzung",
  apflora.adresse."AdrName" AS "AP verantwortlich",
  apflora.pop."PopId",
  apflora.pop."PopGuid" AS "Pop Guid",
  apflora.pop."PopNr" AS "Pop Nr",
  apflora.pop."PopName" AS "Pop Name",
  pop_status_werte."HerkunftTxt" AS "Pop Status",
  apflora.pop."PopBekanntSeit" AS "Pop bekannt seit",
  apflora.pop."PopHerkunftUnklar" AS "Pop Status unklar",
  apflora.pop."PopHerkunftUnklarBegruendung" AS "Pop Begruendung fuer unklaren Status",
  apflora.pop."PopXKoord" AS "Pop X-Koordinaten",
  apflora.pop."PopYKoord" AS "Pop Y-Koordinaten",
  apflora.tpop."TPopId",
  apflora.tpop."TPopId" AS "TPop ID",
  apflora.tpop."TPopGuid" AS "TPop Guid",
  apflora.tpop."TPopNr" AS "TPop Nr",
  apflora.tpop."TPopGemeinde" AS "TPop Gemeinde",
  apflora.tpop."TPopFlurname" AS "TPop Flurname",
  "domPopHerkunft_1"."HerkunftTxt" AS "TPop Status",
  apflora.tpop."TPopBekanntSeit" AS "TPop bekannt seit",
  apflora.tpop."TPopHerkunftUnklar" AS "TPop Status unklar",
  apflora.tpop."TPopHerkunftUnklarBegruendung" AS "TPop Begruendung fuer unklaren Status",
  apflora.tpop."TPopXKoord" AS "TPop X-Koordinaten",
  apflora.tpop."TPopYKoord" AS "TPop Y-Koordinaten",
  apflora.tpop."TPopRadius" AS "TPop Radius (m)",
  apflora.tpop."TPopHoehe" AS "TPop Hoehe",
  apflora.tpop."TPopExposition" AS "TPop Exposition",
  apflora.tpop."TPopKlima" AS "TPop Klima",
  apflora.tpop."TPopNeigung" AS "TPop Hangneigung",
  apflora.tpop."TPopBeschr" AS "TPop Beschreibung",
  apflora.tpop."TPopKatNr" AS "TPop Kataster-Nr",
  apflora.tpop."TPopApBerichtRelevant" AS "TPop fuer AP-Bericht relevant",
  apflora.tpop."TPopEigen" AS "TPop EigentuemerIn",
  apflora.tpop."TPopKontakt" AS "TPop Kontakt vor Ort",
  apflora.tpop."TPopNutzungszone" AS "TPop Nutzungszone",
  apflora.tpop."TPopBewirtschafterIn" AS "TPop BewirtschafterIn",
  apflora.tpop."TPopBewirtschaftung" AS "TPop Bewirtschaftung",
  apflora.tpop."MutWann" AS "Teilpopulation zuletzt geaendert",
  apflora.tpop."MutWer" AS "Teilpopulation zuletzt geaendert von"
FROM
  ((((((apflora.adb_eigenschaften
  INNER JOIN
    apflora.ap
    ON apflora.adb_eigenschaften."TaxonomieId" = apflora.ap."ApArtId")
  INNER JOIN
    (apflora.pop
    INNER JOIN
      apflora.tpop
      ON apflora.pop."PopId" = apflora.tpop."PopId")
    ON apflora.ap."ApArtId" = apflora.pop."ApArtId")
  LEFT JOIN
    apflora.ap_bearbstand_werte
    ON apflora.ap."ApStatus" = apflora.ap_bearbstand_werte."DomainCode")
  LEFT JOIN
    apflora.ap_umsetzung_werte
    ON apflora.ap."ApUmsetzung" = apflora.ap_umsetzung_werte."DomainCode")
  LEFT JOIN
    apflora.pop_status_werte
    ON apflora.pop."PopHerkunft" = pop_status_werte."HerkunftId")
  LEFT JOIN
    apflora.pop_status_werte AS "domPopHerkunft_1"
    ON apflora.tpop."TPopHerkunft" = "domPopHerkunft_1"."HerkunftId")
  LEFT JOIN
    apflora.adresse
    ON apflora.ap."ApBearb" = apflora.adresse."AdrId"
WHERE
  apflora.adb_eigenschaften."TaxonomieId" > 150
ORDER BY
  apflora.adb_eigenschaften."Artname",
  apflora.pop."PopNr",
  apflora.tpop."TPopNr";

DROP VIEW IF EXISTS apflora.v_tpop_webgisbun CASCADE;
CREATE OR REPLACE VIEW apflora.v_tpop_webgisbun AS
SELECT
  apflora.adb_eigenschaften."TaxonomieId" AS "APARTID",
  apflora.adb_eigenschaften."Artname" AS "APART",
  apflora.ap_bearbstand_werte."DomainTxt" AS "APSTATUS",
  apflora.ap."ApJahr" AS "APSTARTJAHR",
  apflora.ap_umsetzung_werte."DomainTxt" AS "APSTANDUMSETZUNG",
  apflora.pop."PopGuid" AS "POPGUID",
  apflora.pop."PopNr" AS "POPNR",
  apflora.pop."PopName" AS "POPNAME",
  pop_status_werte."HerkunftTxt" AS "POPSTATUS",
  apflora.pop."PopHerkunftUnklar" AS "POPSTATUSUNKLAR",
  apflora.pop."PopHerkunftUnklarBegruendung" AS "POPUNKLARGRUND",
  apflora.pop."PopBekanntSeit" AS "POPBEKANNTSEIT",
  apflora.pop."PopXKoord" AS "POP_X",
  apflora.pop."PopYKoord" AS "POP_Y",
  apflora.tpop."TPopId" AS "TPOPID",
  apflora.tpop."TPopGuid" AS "TPOPGUID",
  apflora.tpop."TPopNr" AS "TPOPNR",
  apflora.tpop."TPopGemeinde" AS "TPOPGEMEINDE",
  apflora.tpop."TPopFlurname" AS "TPOPFLURNAME",
  "domPopHerkunft_1"."HerkunftTxt" AS "TPOPSTATUS",
  apflora.tpop."TPopHerkunftUnklar" AS "TPOPSTATUSUNKLAR",
  apflora.tpop."TPopHerkunftUnklarBegruendung" AS "TPOPUNKLARGRUND",
  apflora.tpop."TPopXKoord" AS "TPOP_X",
  apflora.tpop."TPopYKoord" AS "TPOP_Y",
  apflora.tpop."TPopRadius" AS "TPOPRADIUS",
  apflora.tpop."TPopHoehe" AS "TPOPHOEHE",
  apflora.tpop."TPopExposition" AS "TPOPEXPOSITION",
  apflora.tpop."TPopKlima" AS "TPOPKLIMA",
  apflora.tpop."TPopNeigung" AS "TPOPHANGNEIGUNG",
  apflora.tpop."TPopBeschr" AS "TPOPBESCHREIBUNG",
  apflora.tpop."TPopKatNr" AS "TPOPKATASTERNR",
  apflora.adresse."AdrName" AS "TPOPVERANTWORTLICH",
  apflora.tpop."TPopApBerichtRelevant" AS "TPOPBERICHTSRELEVANZ",
  apflora.tpop."TPopBekanntSeit" AS "TPOPBEKANNTSEIT",
  apflora.tpop."TPopEigen" AS "TPOPEIGENTUEMERIN",
  apflora.tpop."TPopKontakt" AS "TPOPKONTAKT_VO",
  apflora.tpop."TPopNutzungszone" AS "TPOP_NUTZUNGSZONE",
  apflora.tpop."TPopBewirtschafterIn" AS "TPOPBEWIRTSCHAFTER",
  apflora.tpop."TPopBewirtschaftung" AS "TPOPBEWIRTSCHAFTUNG",
  -- TODO: convert
  apflora.tpop."MutWann" AS "TPOPCHANGEDAT",
  apflora.tpop."MutWer" AS "TPOPCHANGEBY"
FROM
  ((((((apflora.adb_eigenschaften
  INNER JOIN
    apflora.ap
    ON apflora.adb_eigenschaften."TaxonomieId" = apflora.ap."ApArtId")
  INNER JOIN
    (apflora.pop
    INNER JOIN
      apflora.tpop
      ON apflora.pop."PopId" = apflora.tpop."PopId")
    ON apflora.ap."ApArtId" = apflora.pop."ApArtId")
  LEFT JOIN
    apflora.ap_bearbstand_werte
    ON apflora.ap."ApStatus" = apflora.ap_bearbstand_werte."DomainCode")
  LEFT JOIN
    apflora.ap_umsetzung_werte
    ON apflora.ap."ApUmsetzung" = apflora.ap_umsetzung_werte."DomainCode")
  LEFT JOIN
    apflora.pop_status_werte
    ON apflora.pop."PopHerkunft" = pop_status_werte."HerkunftId")
  LEFT JOIN
    apflora.pop_status_werte AS "domPopHerkunft_1"
    ON apflora.tpop."TPopHerkunft" = "domPopHerkunft_1"."HerkunftId")
  LEFT JOIN
    apflora.adresse
    ON apflora.ap."ApBearb" = apflora.adresse."AdrId"
WHERE
  apflora.adb_eigenschaften."TaxonomieId" > 150
ORDER BY
  apflora.adb_eigenschaften."Artname",
  apflora.pop."PopNr",
  apflora.tpop."TPopNr";

DROP VIEW IF EXISTS apflora.v_tpop_fuergis_write CASCADE;
CREATE OR REPLACE VIEW apflora.v_tpop_fuergis_write AS
SELECT
  apflora.tpop."TPopId" AS "tpopid",
  apflora.tpop."PopId" AS "popid",
  CAST(apflora.tpop."TPopGuid" AS varchar(50)) AS "tpopguid",
  apflora.tpop."TPopNr" AS "tpopnr",
  apflora.tpop."TPopGemeinde" AS "tpopgemeinde",
  apflora.tpop."TPopFlurname" AS "tpopflurname",
  apflora.tpop."TPopHerkunft" AS "tpopherkunft",
  apflora.tpop."TPopHerkunftUnklar" AS "tpopherkunftunklar",
  apflora.tpop."TPopHerkunftUnklarBegruendung" AS "tpopherkunftunklarbegruendung",
  apflora.tpop."TPopXKoord" AS "tpopxkoord",
  apflora.tpop."TPopYKoord" AS "tpopykoord",
  apflora.tpop."TPopRadius" AS "tpopradius",
  apflora.tpop."TPopHoehe" AS "tpophoehe",
  apflora.tpop."TPopExposition" AS "tpopexposition",
  apflora.tpop."TPopKlima" AS "tpopklima",
  apflora.tpop."TPopNeigung" AS "tpopneigung",
  apflora.tpop."TPopBeschr" AS "tpopbeschr",
  apflora.tpop."TPopKatNr" AS "tpopkatnr",
  apflora.tpop."TPopApBerichtRelevant" AS "tpopapberichtrelevant",
  apflora.tpop."TPopBekanntSeit" AS "tpopbekanntseit",
  apflora.tpop."TPopEigen" AS "tpopeigen",
  apflora.tpop."TPopKontakt" AS "tpopkontakt",
  apflora.tpop."TPopNutzungszone" AS "tpopnutzungszone",
  apflora.tpop."TPopBewirtschafterIn" AS "tpopbewirtschafterin",
  apflora.tpop."TPopBewirtschaftung" AS "tpopbewirtschaftung",
  apflora.tpop."TPopTxt" AS "tpoptxt",
  apflora.tpop."MutWann"::timestamp AS "mutwann",
  apflora.tpop."MutWer" AS "mutwer"
FROM
  apflora.tpop;

DROP VIEW IF EXISTS apflora.v_tpop_fuergis_read CASCADE;
CREATE OR REPLACE VIEW apflora.v_tpop_fuergis_read AS
SELECT
  apflora.ap."ApArtId" AS "apartid",
  apflora.adb_eigenschaften."Artname" AS "artname",
  apflora.ap_bearbstand_werte."DomainTxt" AS "apherkunft",
  apflora.ap."ApJahr" AS "apjahr",
  apflora.ap_umsetzung_werte."DomainTxt" AS "apumsetzung",
  CAST(apflora.pop."PopGuid" AS varchar(50)) AS "popguid",
  apflora.pop."PopNr" AS "popnr",
  apflora.pop."PopName" AS "popname",
  pop_status_werte."HerkunftTxt" AS "popherkunft",
  apflora.pop."PopBekanntSeit" AS "popbekanntseit",
  apflora.pop."PopHerkunftUnklar" AS "popherkunftunklar",
  apflora.pop."PopHerkunftUnklarBegruendung" AS "popherkunftunklarbegruendung",
  CAST(apflora.tpop."TPopGuid" AS varchar(50)) AS "tpopguid",
  apflora.tpop."TPopNr" AS "tpopnr",
  apflora.tpop."TPopGemeinde" AS "tpopgemeinde",
  apflora.tpop."TPopFlurname" AS "tpopflurname",
  "domPopHerkunft_1"."HerkunftTxt" AS "tpopherkunft",
  apflora.tpop."TPopBekanntSeit" AS "tpopbekanntseit",
  apflora.tpop."TPopHerkunftUnklar" AS "tpopherkunftunklar",
  apflora.tpop."TPopHerkunftUnklarBegruendung" AS "tpopherkunftunklarbegruendung",
  apflora.tpop."TPopXKoord" AS "tpopxkoord",
  apflora.tpop."TPopYKoord" AS "tpopykoord",
  apflora.tpop."TPopRadius" AS "tpopradius",
  apflora.tpop."TPopHoehe" AS "tpophoehe",
  apflora.tpop."TPopExposition" AS "tpopexposition",
  apflora.tpop."TPopKlima" AS "tpopklima",
  apflora.tpop."TPopNeigung" AS "tpopneigung",
  apflora.tpop."TPopBeschr" AS "tpopbeschr",
  apflora.tpop."TPopKatNr" AS "tpopkatnr",
  apflora.tpop."TPopApBerichtRelevant" AS "tpopapberichtrelevant",
  apflora.tpop."TPopEigen" AS "tpopeigen",
  apflora.tpop."TPopKontakt" AS "tpopkontakt",
  apflora.tpop."TPopNutzungszone" AS "tpopnutzungszone",
  apflora.tpop."TPopBewirtschafterIn" AS "tpopbewirtschafterin",
  apflora.tpop."TPopBewirtschaftung" AS "tpopbewirtschaftung",
  apflora.tpop."MutWann"::timestamp AS "mutwann",
  apflora.tpop."MutWer" AS "mutwer"
FROM
  (((((apflora.adb_eigenschaften
  INNER JOIN
    apflora.ap
    ON apflora.adb_eigenschaften."TaxonomieId" = apflora.ap."ApArtId")
  INNER JOIN
    (apflora.pop
    INNER JOIN
      apflora.tpop
      ON apflora.pop."PopId" = apflora.tpop."PopId")
    ON apflora.ap."ApArtId" = apflora.pop."ApArtId")
  LEFT JOIN
    apflora.ap_bearbstand_werte
    ON apflora.ap."ApStatus" = apflora.ap_bearbstand_werte."DomainCode")
  LEFT JOIN
    apflora.ap_umsetzung_werte
    ON apflora.ap."ApUmsetzung" = apflora.ap_umsetzung_werte."DomainCode")
  LEFT JOIN
    apflora.pop_status_werte
    ON apflora.pop."PopHerkunft" = pop_status_werte."HerkunftId")
  LEFT JOIN
    apflora.pop_status_werte AS "domPopHerkunft_1"
    ON apflora.tpop."TPopHerkunft" = "domPopHerkunft_1"."HerkunftId"
WHERE
  apflora.tpop."TPopYKoord" > 0
  AND apflora.tpop."TPopXKoord" > 0
ORDER BY
  apflora.adb_eigenschaften."Artname",
  apflora.pop."PopNr",
  apflora.tpop."TPopNr";

-- im Gebrauch durch exportPopVonApOhneStatus.php:
DROP VIEW IF EXISTS apflora.v_pop_vonapohnestatus CASCADE;
CREATE OR REPLACE VIEW apflora.v_pop_vonapohnestatus AS
SELECT
  apflora.ap."ApArtId",
  apflora.adb_eigenschaften."Artname" AS "Art",
  apflora.ap."ApStatus" AS "Bearbeitungsstand AP",
  apflora.pop."PopId",
  apflora.pop."PopNr",
  apflora.pop."PopName",
  apflora.pop."PopHerkunft" AS "Status"
FROM
  apflora.adb_eigenschaften
  INNER JOIN
    (apflora.ap
    INNER JOIN
      apflora.pop
      ON apflora.ap."ApArtId" = apflora.pop."ApArtId")
    ON apflora.adb_eigenschaften."TaxonomieId" = apflora.ap."ApArtId"
WHERE
  apflora.ap."ApStatus" = 3
  AND apflora.pop."PopHerkunft" IS NULL
ORDER BY
  apflora.adb_eigenschaften."Artname",
  apflora.pop."PopNr";

DROP VIEW IF EXISTS apflora.v_apber_zielber CASCADE;
CREATE OR REPLACE VIEW apflora.v_apber_zielber AS
SELECT
  apflora.zielber.*
FROM
  apflora.zielber
  INNER JOIN
    apflora._variable
    ON apflora.zielber.jahr = apflora._variable."JBerJahr";

DROP VIEW IF EXISTS apflora.v_abper_ziel CASCADE;
CREATE OR REPLACE VIEW apflora.v_abper_ziel AS
SELECT
  apflora.ziel.*,
  ziel_typ_werte."ZieltypTxt"
FROM
  apflora._variable
  INNER JOIN
    (apflora.ziel
    INNER JOIN
      apflora.ziel_typ_werte
      ON apflora.ziel."ZielTyp" = ziel_typ_werte."ZieltypId")
    ON apflora._variable."JBerJahr" = apflora.ziel."ZielJahr"
WHERE
  apflora.ziel."ZielTyp" IN(1, 2, 1170775556)
ORDER BY
  apflora.ziel_typ_werte."ZieltypOrd",
  apflora.ziel."ZielBezeichnung";

DROP VIEW IF EXISTS apflora.v_apber_verwaist CASCADE;
CREATE OR REPLACE VIEW apflora.v_apber_verwaist AS
SELECT
  apflora.apber."JBerId" AS "JBer Id",
  apflora.apber."ApArtId" AS "JBer ApArtId",
  apflora.apber."JBerJahr" AS "JBer Jahr",
  apflora.apber."JBerVergleichVorjahrGesamtziel" AS "JBer Vergleich Vorjahr-Gesamtziel",
  ap_erfkrit_werte."BeurteilTxt" AS "JBer Beurteilung",
  apflora.apber."JBerVeraenGegenVorjahr" AS "JBer Veraend zum Vorjahr",
  apflora.apber."JBerAnalyse" AS "JBer Analyse",
  apflora.apber."JBerUmsetzung" AS "JBer Konsequenzen Umsetzung",
  apflora.apber."JBerErfko" AS "JBer Konsequenzen Erfolgskontrolle",
  apflora.apber."JBerATxt" AS "JBer Bemerkungen zu A",
  apflora.apber."JBerBTxt" AS "JBer Bemerkungen zu B",
  apflora.apber."JBerCTxt" AS "JBer Bemerkungen zu C",
  apflora.apber."JBerDTxt" AS "JBer Bemerkungen zu D",
  apflora.apber."JBerDatum" AS "JBer Datum",
  apflora.adresse."AdrName" AS "JBer BearbeiterIn",
  apflora.apber."MutWann" AS "JBer MutWann",
  apflora.apber."MutWer" AS "JBer MutWer"
FROM
  ((apflora.ap
  RIGHT JOIN
    apflora.apber
    ON apflora.ap."ApArtId" = apflora.apber."ApArtId")
  LEFT JOIN
    apflora.adresse
    ON apflora.apber."JBerBearb" = apflora.adresse."AdrId")
  LEFT JOIN
    apflora.ap_erfkrit_werte
    ON apflora.apber."JBerBeurteilung" = ap_erfkrit_werte."BeurteilId"
WHERE
  apflora.ap."ApArtId" IS NULL
ORDER BY
  apflora.apber."ApArtId",
  apflora.apber."JBerJahr",
  apflora.apber."JBerDatum";

DROP VIEW IF EXISTS apflora.v_apber_artd CASCADE;
CREATE OR REPLACE VIEW apflora.v_apber_artd AS
SELECT
  apflora.ap.*,
  apflora.adb_eigenschaften."Artname" AS "Art",
  apflora.apber."JBerId",
  apflora.apber."JBerJahr",
  apflora.apber."JBerVergleichVorjahrGesamtziel",
  apflora.apber."JBerBeurteilung",
  apflora.apber."JBerAnalyse",
  apflora.apber."JBerUmsetzung",
  apflora.apber."JBerErfko",
  apflora.apber."JBerATxt",
  apflora.apber."JBerCAktivApbearb",
  apflora.apber."JBerCVerglAusfPl",
  apflora.apber."JBerBTxt",
  apflora.apber."JBerCTxt",
  apflora.apber."JBerDTxt",
  apflora.apber."JBerDatum",
  apflora.apber."JBerBearb",
  apflora.adresse."AdrName" AS "Bearbeiter",
  ap_erfkrit_werte."BeurteilTxt"
FROM
  (apflora.adb_eigenschaften
  INNER JOIN
    apflora.ap
    ON apflora.adb_eigenschaften."TaxonomieId" = apflora.ap."ApArtId")
  INNER JOIN
    (((apflora.apber
    LEFT JOIN
      apflora.adresse
      ON apflora.apber."JBerBearb" = apflora.adresse."AdrId")
    LEFT JOIN
      apflora.ap_erfkrit_werte
      ON apflora.apber."JBerBeurteilung" = apflora.ap_erfkrit_werte."BeurteilId")
    INNER JOIN
      apflora._variable
      ON apflora.apber."JBerJahr" = apflora._variable."JBerJahr")
    ON apflora.ap."ApArtId" = apflora.apber."ApArtId";

DROP VIEW IF EXISTS apflora.v_pop_massnseitbeginnap CASCADE;
CREATE OR REPLACE VIEW apflora.v_pop_massnseitbeginnap AS
SELECT
  apflora.tpopmassn.tpop_id
FROM
  apflora.ap
  INNER JOIN
    ((apflora.pop
    INNER JOIN
      apflora.tpop
      ON apflora.pop."PopId" = apflora.tpop."PopId")
    INNER JOIN
      apflora.tpopmassn
      ON apflora.tpop."TPopId" = apflora.tpopmassn.tpop_id)
    ON apflora.ap."ApArtId" = apflora.pop."ApArtId"
WHERE
  apflora.tpopmassn.jahr >= apflora.ap."ApJahr"
GROUP BY
  apflora.tpopmassn.tpop_id;

DROP VIEW IF EXISTS apflora.v_apber CASCADE;
CREATE OR REPLACE VIEW apflora.v_apber AS
SELECT
  apflora.ap."ApArtId" AS "ApArtId",
  apflora.apber."JBerId" AS "JBerId",
  apflora.adb_eigenschaften."Artname" AS "Name",
  apflora.apber."JBerJahr" AS "JBerJahr",
  apflora.apber."JBerVergleichVorjahrGesamtziel" AS "JBerVergleichVorjahrGesamtziel",
  ap_erfkrit_werte."BeurteilTxt" AS "JBerBeurteilung",
  apflora.apber."JBerVeraenGegenVorjahr" AS "JBerVeraenGegenVorjahr",
  apflora.apber."JBerAnalyse" AS "JBerAnalyse",
  apflora.apber."JBerUmsetzung" AS "JBerUmsetzung",
  apflora.apber."JBerErfko" AS "JBerErfko",
  apflora.apber."JBerATxt" AS "JBerATxt",
  apflora.apber."JBerBTxt" AS "JBerBTxt",
  apflora.apber."JBerCAktivApbearb" AS "JBerCAktivApbearb",
  apflora.apber."JBerCVerglAusfPl" AS "JBerCVerglAusfPl",
  apflora.apber."JBerCTxt" AS "JBerCTxt",
  apflora.apber."JBerDTxt" AS "JBerDTxt",
  apflora.apber."JBerDatum" AS "JBerDatum",apflora.adresse."AdrName" AS "JBerBearb"
FROM
  apflora.ap
  INNER JOIN
    apflora.adb_eigenschaften
    ON (apflora.ap."ApArtId" = apflora.adb_eigenschaften."TaxonomieId")
  INNER JOIN
    ((apflora.apber
    LEFT JOIN
      apflora.ap_erfkrit_werte
      ON (apflora.apber."JBerBeurteilung" = ap_erfkrit_werte."BeurteilId"))
    LEFT JOIN
      apflora.adresse
      ON (apflora.apber."JBerBearb" = apflora.adresse."AdrId"))
    ON apflora.ap."ApArtId" = apflora.apber."ApArtId"
ORDER BY
  apflora.adb_eigenschaften."Artname";

DROP VIEW IF EXISTS apflora.v_tpop_letztermassnber0 CASCADE;
CREATE OR REPLACE VIEW apflora.v_tpop_letztermassnber0 AS
SELECT
  apflora.pop."ApArtId",
  apflora.tpop."TPopId",
  apflora.tpopmassnber.jahr
FROM
  apflora._variable,
  ((apflora.pop
  INNER JOIN
    apflora.tpop
    ON apflora.pop."PopId" = apflora.tpop."PopId")
  INNER JOIN
    apflora.tpopmassnber
    ON apflora.tpop."TPopId" = apflora.tpopmassnber.tpop_id)
  INNER JOIN
    apflora.tpopmassn
    ON apflora.tpop."TPopId" = apflora.tpopmassn.tpop_id
WHERE
  apflora.tpopmassnber.jahr <= apflora._variable."JBerJahr"
  AND apflora.tpop."TPopApBerichtRelevant" = 1
  AND apflora.tpopmassn.jahr <= apflora._variable."JBerJahr"
  AND apflora.pop."PopHerkunft" <> 300
  AND apflora.tpopmassnber.beurteilung BETWEEN 1 AND 5;

DROP VIEW IF EXISTS apflora.v_tpop_letztertpopber0 CASCADE;
CREATE OR REPLACE VIEW apflora.v_tpop_letztertpopber0 AS
SELECT
  apflora.pop."ApArtId",
  apflora.tpop."TPopId",
  apflora.tpopber.jahr AS "TPopBerJahr"
FROM
  apflora._variable,
  apflora.ap
  INNER JOIN
    (apflora.pop
    INNER JOIN (apflora.tpop
      INNER JOIN
        apflora.tpopber
        ON apflora.tpop."TPopId" = apflora.tpopber.tpop_id)
      ON apflora.pop."PopId" = apflora.tpop."PopId")
    ON apflora.ap."ApArtId" = apflora.pop."ApArtId"
WHERE
  apflora.tpopber.jahr <= apflora._variable."JBerJahr"
  AND apflora.tpop."TPopApBerichtRelevant" = 1
  AND apflora.pop."PopHerkunft" <> 300;

DROP VIEW IF EXISTS apflora.v_pop_letztermassnber0 CASCADE;
CREATE OR REPLACE VIEW apflora.v_pop_letztermassnber0 AS
SELECT
  apflora.pop."ApArtId",
  apflora.pop."PopId",
  apflora.popmassnber."PopMassnBerJahr"
FROM
  apflora._variable,
  ((apflora.pop
  INNER JOIN
    apflora.popmassnber
    ON apflora.pop."PopId" = apflora.popmassnber."PopId")
  INNER JOIN
    apflora.tpop
    ON apflora.pop."PopId" = apflora.tpop."PopId")
  INNER JOIN
    apflora.tpopmassn
    ON apflora.tpop."TPopId" = apflora.tpopmassn.tpop_id
WHERE
  apflora.popmassnber."PopMassnBerJahr" <= apflora._variable."JBerJahr"
  AND apflora.tpop."TPopApBerichtRelevant" = 1
  AND apflora.tpopmassn.jahr <= apflora._variable."JBerJahr"
  AND apflora.pop."PopHerkunft" <> 300;

-- dieser view ist für den Bericht gedacht - daher letzter popber vor jBerJahr
DROP VIEW IF EXISTS apflora.v_pop_letzterpopber0 CASCADE;
CREATE OR REPLACE VIEW apflora.v_pop_letzterpopber0 AS
SELECT
  apflora.pop."ApArtId",
  apflora.pop."PopId",
  apflora.popber."PopBerJahr"
FROM
  apflora._variable,
  (apflora.pop
  INNER JOIN
    apflora.popber
    ON apflora.pop."PopId" = apflora.popber."PopId")
  INNER JOIN
    apflora.tpop
    ON apflora.pop."PopId" = apflora.tpop."PopId"
WHERE
  apflora.popber."PopBerJahr" <= apflora._variable."JBerJahr"
  AND apflora.tpop."TPopApBerichtRelevant" = 1
  AND apflora.pop."PopHerkunft" <> 300;

-- dieser view ist für die Qualitätskontrolle gedacht - daher letzter popber überhaupt
DROP VIEW IF EXISTS apflora.v_pop_letzterpopber0_overall CASCADE;
CREATE OR REPLACE VIEW apflora.v_pop_letzterpopber0_overall AS
SELECT
  apflora.popber."PopId",
  max(apflora.popber."PopBerJahr") AS "PopBerJahr"
FROM
  apflora.popber
WHERE
  apflora.popber."PopBerJahr" IS NOT NULL
GROUP BY
  apflora.popber."PopId";

DROP VIEW IF EXISTS apflora.v_pop_letzterpopbermassn CASCADE;
CREATE OR REPLACE VIEW apflora.v_pop_letzterpopbermassn AS
SELECT
  apflora.popmassnber."PopId",
  max(apflora.popmassnber."PopMassnBerJahr") AS "PopMassnBerJahr"
FROM
  apflora.popmassnber
WHERE
  apflora.popmassnber."PopMassnBerJahr" IS NOT NULL
GROUP BY
  apflora.popmassnber."PopId";

-- dieser view ist für die Qualitätskontrolle gedacht - daher letzter tpopber überhaupt
DROP VIEW IF EXISTS apflora.v_tpop_letztertpopber0_overall CASCADE;
CREATE OR REPLACE VIEW apflora.v_tpop_letztertpopber0_overall AS
SELECT
  tpop_id AS "TPopId",
  max(jahr) AS "TPopBerJahr"
FROM
  apflora.tpopber
WHERE
  jahr IS NOT NULL
GROUP BY
  tpop_id;

DROP VIEW IF EXISTS apflora.v_tpop_mitapaberohnestatus CASCADE;
CREATE OR REPLACE VIEW apflora.v_tpop_mitapaberohnestatus AS
SELECT
  apflora.adb_eigenschaften."Artname" AS "Art",
  apflora.ap_bearbstand_werte."DomainTxt" AS "Bearbeitungsstand AP",
  apflora.pop."PopNr",
  apflora.pop."PopName",
  pop_status_werte."HerkunftTxt" AS "Status Population",
  apflora.tpop."TPopNr",
  apflora.tpop."TPopFlurname",
  apflora.tpop."TPopHerkunft" AS "Status Teilpopulation"
FROM
  (apflora.ap_bearbstand_werte
  INNER JOIN
    (apflora.adb_eigenschaften
    INNER JOIN
      apflora.ap
      ON apflora.adb_eigenschaften."TaxonomieId" = apflora.ap."ApArtId")
    ON apflora.ap_bearbstand_werte."DomainCode" = apflora.ap."ApStatus")
  INNER JOIN
    ((apflora.pop
    INNER JOIN
      apflora.pop_status_werte
      ON apflora.pop."PopHerkunft" = pop_status_werte."HerkunftId")
    INNER JOIN
      apflora.tpop
      ON apflora.pop."PopId" = apflora.tpop."PopId")
    ON apflora.ap."ApArtId" = apflora.pop."ApArtId"
WHERE
  apflora.tpop."TPopHerkunft" IS NULL
  AND apflora.ap."ApStatus" = 3
ORDER BY
  apflora.adb_eigenschaften."Artname",
  apflora.pop."PopNr";

DROP VIEW IF EXISTS apflora.v_tpop_ohnebekanntseit CASCADE;
CREATE OR REPLACE VIEW apflora.v_tpop_ohnebekanntseit AS
SELECT
  apflora.adb_eigenschaften."Artname" AS "Art",
  apflora.ap_bearbstand_werte."DomainTxt" AS "ApStatus_",
  apflora.pop."PopNr",
  apflora.pop."PopName",
  apflora.tpop."TPopNr",
  apflora.tpop."TPopGemeinde",
  apflora.tpop."TPopFlurname",
  apflora.tpop."TPopBekanntSeit"
FROM
  ((apflora.adb_eigenschaften
  INNER JOIN
    apflora.ap
    ON apflora.adb_eigenschaften."TaxonomieId" = apflora.ap."ApArtId")
  INNER JOIN
    apflora.ap_bearbstand_werte
    ON apflora.ap."ApStatus" = apflora.ap_bearbstand_werte."DomainCode")
  INNER JOIN
    (apflora.pop
    INNER JOIN
      apflora.tpop
      ON apflora.pop."PopId" = apflora.tpop."PopId")
    ON apflora.ap."ApArtId" = apflora.pop."ApArtId"
WHERE
  apflora.tpop."TPopBekanntSeit" IS NULL
  AND apflora.ap."ApStatus" BETWEEN 1 AND 3
ORDER BY
  apflora.adb_eigenschaften."Artname",
  apflora.pop."PopNr",
  apflora.pop."PopName",
  apflora.tpop."TPopNr",
  apflora.tpop."TPopGemeinde",
  apflora.tpop."TPopFlurname";

DROP VIEW IF EXISTS apflora.v_tpop_ohnekoord CASCADE;
CREATE OR REPLACE VIEW apflora.v_tpop_ohnekoord AS
SELECT
  apflora.adb_eigenschaften."Artname" AS "Art",
  apflora.ap_bearbstand_werte."DomainTxt" AS "ApStatus_",
  apflora.pop."PopNr",
  apflora.pop."PopName",
  apflora.tpop."TPopNr",
  apflora.tpop."TPopGemeinde",
  apflora.tpop."TPopFlurname",
  apflora.tpop."TPopXKoord",
  apflora.tpop."TPopYKoord"
FROM
  ((apflora.adb_eigenschaften
  INNER JOIN
    apflora.ap
    ON apflora.adb_eigenschaften."TaxonomieId" = apflora.ap."ApArtId")
  INNER JOIN
    apflora.ap_bearbstand_werte
    ON apflora.ap."ApStatus" = apflora.ap_bearbstand_werte."DomainCode")
  INNER JOIN
    (apflora.pop
    INNER JOIN
      apflora.tpop
      ON apflora.pop."PopId" = apflora.tpop."PopId")
    ON apflora.ap."ApArtId" = apflora.pop."ApArtId"
WHERE
  (apflora.tpop."TPopXKoord" IS NULL
  AND apflora.ap."ApStatus" BETWEEN 1 AND 3)
  OR (
    apflora.tpop."TPopYKoord" IS NULL
    AND apflora.ap."ApStatus" BETWEEN 1 AND 3
  )
ORDER BY
  apflora.adb_eigenschaften."Artname",
  apflora.pop."PopNr",
  apflora.pop."PopName",
  apflora.tpop."TPopNr",
  apflora.tpop."TPopGemeinde",
  apflora.tpop."TPopFlurname";

DROP VIEW IF EXISTS apflora.v_tpopber_letzterber CASCADE;
CREATE OR REPLACE VIEW apflora.v_tpopber_letzterber AS
SELECT
  apflora.tpopber.tpop_id AS "TPopId",
  max(apflora.tpopber.jahr) AS "MaxvonTPopBerJahr"
FROM
  apflora.tpopber
GROUP BY
  apflora.tpopber.tpop_id;

DROP VIEW IF EXISTS apflora.v_ap_ausw CASCADE;
CREATE OR REPLACE VIEW apflora.v_ap_ausw AS
SELECT
  apflora.ap."ApArtId",
  apflora.adb_eigenschaften."Artname" AS "Art",
  apflora.ap_bearbstand_werte."DomainTxt" AS "Bearbeitungsstand AP",
  apflora.ap."ApJahr" AS "Start AP im Jahr",
  apflora.ap_umsetzung_werte."DomainTxt" AS "Stand Umsetzung AP",
  apflora.adresse."AdrName" AS "Verantwortlich",
  apflora.ap."MutWann" AS "Letzte Aenderung",
  apflora.ap."MutWer" AS "Letzte(r) Bearbeiter(in)"
FROM
  (((apflora.adb_eigenschaften
  INNER JOIN
    apflora.ap
    ON apflora.adb_eigenschaften."TaxonomieId" = apflora.ap."ApArtId")
  INNER JOIN
    apflora.ap_bearbstand_werte
    ON apflora.ap."ApStatus" = apflora.ap_bearbstand_werte."DomainCode")
  LEFT JOIN
    apflora.ap_umsetzung_werte
    ON apflora.ap."ApUmsetzung" = apflora.ap_umsetzung_werte."DomainCode")
  LEFT JOIN
    apflora.adresse
    ON apflora.ap."ApBearb" = apflora.adresse."AdrId"
WHERE
  apflora.ap."ApStatus" BETWEEN 1 AND 3
ORDER BY
  apflora.adb_eigenschaften."Artname";

DROP VIEW IF EXISTS apflora.v_ap CASCADE;
CREATE OR REPLACE VIEW apflora.v_ap AS
SELECT
  apflora.ap."ApArtId",
  apflora.adb_eigenschaften."Artname" AS "AP Art",
  apflora.ap_bearbstand_werte."DomainTxt" AS "AP Bearbeitungsstand",
  apflora.ap."ApJahr" AS "AP Start im Jahr",
  apflora.ap_umsetzung_werte."DomainTxt" AS "AP Stand Umsetzung",
  apflora.adresse."AdrName" AS "AP verantwortlich",
  apflora.ap."MutWann" AS "AP Letzte Aenderung",
  apflora.ap."MutWer" AS "AP Letzte(r) Bearbeiter(in)"
FROM
  (((apflora.adb_eigenschaften
  INNER JOIN
    apflora.ap
    ON apflora.adb_eigenschaften."TaxonomieId" = apflora.ap."ApArtId")
  LEFT JOIN
    apflora.ap_bearbstand_werte
    ON apflora.ap."ApStatus" = apflora.ap_bearbstand_werte."DomainCode")
  LEFT JOIN
    apflora.ap_umsetzung_werte
    ON apflora.ap."ApUmsetzung" = apflora.ap_umsetzung_werte."DomainCode")
  LEFT JOIN
    apflora.adresse
    ON apflora.ap."ApBearb" = apflora.adresse."AdrId"
ORDER BY
  apflora.adb_eigenschaften."Artname";

DROP VIEW IF EXISTS apflora.v_idealbiotop CASCADE;
CREATE OR REPLACE VIEW apflora.v_idealbiotop AS
SELECT
  apflora.ap."ApArtId" AS "AP ApArtId",
  apflora.adb_eigenschaften."Artname" AS "AP Art",
  apflora.ap_bearbstand_werte."DomainTxt" AS "AP Bearbeitungsstand",
  apflora.ap."ApJahr" AS "AP Start im Jahr",
  apflora.ap_umsetzung_werte."DomainTxt" AS "AP Stand Umsetzung",
  apflora.adresse."AdrName" AS "AP verantwortlich",
  apflora.ap."MutWann" AS "AP Letzte Aenderung",
  apflora.ap."MutWer" AS "AP Letzte(r) Bearbeiter(in)",
  apflora.idealbiotop."IbApArtId" AS "Ib ApArtId",
  apflora.idealbiotop."IbErstelldatum" AS "Ib Erstelldatum",
  apflora.idealbiotop."IbHoehenlage" AS "Ib Hoehenlage",
  apflora.idealbiotop."IbRegion" AS "Ib Region",
  apflora.idealbiotop."IbExposition" AS "Ib Exposition",
  apflora.idealbiotop."IbBesonnung" AS "Ib Besonnung",
  apflora.idealbiotop."IbHangneigung" AS "Ib Hangneigung",
  apflora.idealbiotop."IbBodenTyp" AS "Ib Bodentyp",
  apflora.idealbiotop."IbBodenKalkgehalt" AS "Ib Boden Kalkgehalt",
  apflora.idealbiotop."IbBodenDurchlaessigkeit" AS "Ib Boden Durchlaessigkeit",
  apflora.idealbiotop."IbBodenHumus" AS "Ib Boden Humus",
  apflora.idealbiotop."IbBodenNaehrstoffgehalt" AS "Ib Boden Naehrstoffgehalt",
  apflora.idealbiotop."IbWasserhaushalt" AS "Ib Wasserhaushalt",
  apflora.idealbiotop."IbKonkurrenz" AS "Ib Konkurrenz",
  apflora.idealbiotop."IbMoosschicht" AS "Ib Moosschicht",
  apflora.idealbiotop."IbKrautschicht" AS "Ib Krautschicht",
  apflora.idealbiotop."IbStrauchschicht" AS "Ib Strauchschicht",
  apflora.idealbiotop."IbBaumschicht" AS "Ib Baumschicht",
  apflora.idealbiotop."IbBemerkungen" AS "Ib Bemerkungen",
  apflora.idealbiotop."MutWann" AS "Ib MutWann",
  apflora.idealbiotop."MutWer" AS "Ib MutWer"
FROM
  apflora.idealbiotop
  LEFT JOIN
    ((((apflora.adb_eigenschaften
    RIGHT JOIN
      apflora.ap
      ON apflora.adb_eigenschaften."TaxonomieId" = apflora.ap."ApArtId")
    LEFT JOIN
      apflora.ap_bearbstand_werte
      ON apflora.ap."ApStatus" = apflora.ap_bearbstand_werte."DomainCode")
    LEFT JOIN
      apflora.ap_umsetzung_werte
      ON apflora.ap."ApUmsetzung" = apflora.ap_umsetzung_werte."DomainCode")
    LEFT JOIN
      apflora.adresse
      ON apflora.ap."ApBearb" = apflora.adresse."AdrId")
    ON apflora.idealbiotop."IbApArtId" = apflora.ap."ApArtId"
ORDER BY
  apflora.adb_eigenschaften."Artname",
  apflora.idealbiotop."IbErstelldatum";

DROP VIEW IF EXISTS apflora.v_idealbiotop_verwaist CASCADE;
CREATE OR REPLACE VIEW apflora.v_idealbiotop_verwaist AS
SELECT
  apflora.ap."ApArtId" AS "AP ApArtId",
  apflora.idealbiotop."IbApArtId" AS "Ib ApArtId",
  apflora.idealbiotop."IbErstelldatum" AS "Ib Erstelldatum",
  apflora.idealbiotop."IbHoehenlage" AS "Ib Hoehenlage",
  apflora.idealbiotop."IbRegion" AS "Ib Region",
  apflora.idealbiotop."IbExposition" AS "Ib Exposition",
  apflora.idealbiotop."IbBesonnung" AS "Ib Besonnung",
  apflora.idealbiotop."IbHangneigung" AS "Ib Hangneigung",
  apflora.idealbiotop."IbBodenTyp" AS "Ib Bodentyp",
  apflora.idealbiotop."IbBodenKalkgehalt" AS "Ib Boden Kalkgehalt",
  apflora.idealbiotop."IbBodenDurchlaessigkeit" AS "Ib Boden Durchlaessigkeit",
  apflora.idealbiotop."IbBodenHumus" AS "Ib Boden Humus",
  apflora.idealbiotop."IbBodenNaehrstoffgehalt" AS "Ib Boden Naehrstoffgehalt",
  apflora.idealbiotop."IbWasserhaushalt" AS "Ib Wasserhaushalt",
  apflora.idealbiotop."IbKonkurrenz" AS "Ib Konkurrenz",
  apflora.idealbiotop."IbMoosschicht" AS "Ib Moosschicht",
  apflora.idealbiotop."IbKrautschicht" AS "Ib Krautschicht",
  apflora.idealbiotop."IbStrauchschicht" AS "Ib Strauchschicht",
  apflora.idealbiotop."IbBaumschicht" AS "Ib Baumschicht",
  apflora.idealbiotop."IbBemerkungen" AS "Ib Bemerkungen",
  apflora.idealbiotop."MutWann" AS "Ib MutWann",
  apflora.idealbiotop."MutWer" AS "Ib MutWer"
FROM
  apflora.idealbiotop
  LEFT JOIN
    ((((apflora.adb_eigenschaften
    RIGHT JOIN
      apflora.ap
      ON apflora.adb_eigenschaften."TaxonomieId" = apflora.ap."ApArtId")
    LEFT JOIN
      apflora.ap_bearbstand_werte
      ON apflora.ap."ApStatus" = apflora.ap_bearbstand_werte."DomainCode")
    LEFT JOIN
      apflora.ap_umsetzung_werte
      ON apflora.ap."ApUmsetzung" = apflora.ap_umsetzung_werte."DomainCode")
    LEFT JOIN
      apflora.adresse
      ON apflora.ap."ApBearb" = apflora.adresse."AdrId")
    ON apflora.idealbiotop."IbApArtId" = apflora.ap."ApArtId"
WHERE
  apflora.ap."ApArtId" IS NULL
ORDER BY
  apflora.idealbiotop."IbErstelldatum";

DROP VIEW IF EXISTS apflora.v_ber CASCADE;
CREATE OR REPLACE VIEW apflora.v_ber AS
SELECT
  apflora.ap."ApArtId" AS "AP Id",
  apflora.adb_eigenschaften."Artname" AS "AP Art",
  apflora.ap_bearbstand_werte."DomainTxt" AS "AP Bearbeitungsstand",
  apflora.ap."ApJahr" AS "AP Start im Jahr",
  apflora.ap_umsetzung_werte."DomainTxt" AS "AP Stand Umsetzung",
  apflora.adresse."AdrName" AS "AP verantwortlich",
  apflora.ber.id AS "Ber Id",
  apflora.ber.ap_id AS "Ber ApId",
  apflora.ber.autor AS "Ber Autor",
  apflora.ber.jahr AS "Ber Jahr",
  apflora.ber.titel AS "Ber Titel",
  apflora.ber.url AS "Ber URL",
  apflora.ber.changed AS "Ber MutWann",
  apflora.ber.changed_by AS "Ber MutWer"
FROM
  ((((apflora.adb_eigenschaften
  RIGHT JOIN
    apflora.ap
    ON apflora.adb_eigenschaften."TaxonomieId" = apflora.ap."ApArtId")
  LEFT JOIN
    apflora.ap_bearbstand_werte
    ON apflora.ap."ApStatus" = apflora.ap_bearbstand_werte."DomainCode")
  LEFT JOIN
    apflora.ap_umsetzung_werte
    ON apflora.ap."ApUmsetzung" = apflora.ap_umsetzung_werte."DomainCode")
  LEFT JOIN
    apflora.adresse
    ON apflora.ap."ApBearb" = apflora.adresse."AdrId")
  RIGHT JOIN
    apflora.ber
    ON apflora.ap."ApArtId" = apflora.ber.ap_id
ORDER BY
  apflora.adb_eigenschaften."Artname";

DROP VIEW IF EXISTS apflora.v_ber_verwaist CASCADE;
CREATE OR REPLACE VIEW apflora.v_ber_verwaist AS
SELECT
  apflora.ap."ApArtId" AS "AP Id",
  apflora.ber.id AS "Ber Id",
  apflora.ber.ap_id AS "Ber ApId",
  apflora.ber.autor AS "Ber Autor",
  apflora.ber.jahr AS "Ber Jahr",
  apflora.ber.titel AS "Ber Titel",
  apflora.ber.url AS "Ber URL",
  apflora.ber.changed AS "Ber MutWann",
  apflora.ber.changed_by AS "Ber MutWer"
FROM
  ((((apflora.adb_eigenschaften
  RIGHT JOIN
    apflora.ap
    ON apflora.adb_eigenschaften."TaxonomieId" = apflora.ap."ApArtId")
  LEFT JOIN
    apflora.ap_bearbstand_werte
    ON apflora.ap."ApStatus" = apflora.ap_bearbstand_werte."DomainCode")
  LEFT JOIN
    apflora.ap_umsetzung_werte
    ON apflora.ap."ApUmsetzung" = apflora.ap_umsetzung_werte."DomainCode")
  LEFT JOIN
    apflora.adresse
    ON apflora.ap."ApBearb" = apflora.adresse."AdrId")
  RIGHT JOIN
    apflora.ber
    ON apflora.ap."ApArtId" = apflora.ber.ap_id
WHERE
  apflora.ap."ApArtId" IS NULL
ORDER BY
  apflora.adb_eigenschaften."Artname";

DROP VIEW IF EXISTS apflora.v_assozart CASCADE;
CREATE OR REPLACE VIEW apflora.v_assozart AS
SELECT
  apflora.ap."ApArtId",
  apflora.adb_eigenschaften."Artname" AS "AP Art",
  apflora.ap_bearbstand_werte."DomainTxt" AS "AP Bearbeitungsstand",
  apflora.ap."ApJahr" AS "AP Start im Jahr",
  apflora.ap_umsetzung_werte."DomainTxt" AS "AP Stand Umsetzung",
  apflora.adresse."AdrName" AS "AP verantwortlich",
  apflora.assozart.id AS "AA Id",
  "ArtenDb_Arteigenschaften_1"."Artname" AS "AA Art",
  apflora.assozart.bemerkungen AS "AA Bemerkungen",
  apflora.assozart.changed AS "AA MutWann",
  apflora.assozart.changed_by AS "AA MutWer"
FROM
  apflora.adb_eigenschaften AS "ArtenDb_Arteigenschaften_1"
  RIGHT JOIN
    (((((apflora.adb_eigenschaften
    RIGHT JOIN
      apflora.ap
      ON apflora.adb_eigenschaften."TaxonomieId" = apflora.ap."ApArtId")
    LEFT JOIN
      apflora.ap_bearbstand_werte
      ON apflora.ap."ApStatus" = apflora.ap_bearbstand_werte."DomainCode")
    LEFT JOIN
      apflora.ap_umsetzung_werte
      ON apflora.ap."ApUmsetzung" = apflora.ap_umsetzung_werte."DomainCode")
    LEFT JOIN
      apflora.adresse
      ON apflora.ap."ApBearb" = apflora.adresse."AdrId")
    RIGHT JOIN
      apflora.assozart
      ON apflora.ap."ApArtId" = apflora.assozart.ap_id)
    ON "ArtenDb_Arteigenschaften_1"."GUID" = apflora.assozart.ae_id
ORDER BY
  apflora.adb_eigenschaften."Artname";

DROP VIEW IF EXISTS apflora.v_assozart_verwaist CASCADE;
CREATE OR REPLACE VIEW apflora.v_assozart_verwaist AS
SELECT
  apflora.ap."ApArtId" AS "AP ApArtId",
  apflora.assozart.id AS "AA Id",
  apflora.assozart.ap_id AS "AA ApArtId",
  "ArtenDb_Arteigenschaften_1"."Artname" AS "AA Art",
  apflora.assozart.bemerkungen AS "AA Bemerkungen",
  apflora.assozart.changed AS "AA MutWann",
  apflora.assozart.changed_by AS "AA MutWer"
FROM
  apflora.adb_eigenschaften AS "ArtenDb_Arteigenschaften_1"
  RIGHT JOIN
    (((((apflora.adb_eigenschaften
    RIGHT JOIN
      apflora.ap
      ON apflora.adb_eigenschaften."TaxonomieId" = apflora.ap."ApArtId")
    LEFT JOIN
      apflora.ap_bearbstand_werte
      ON apflora.ap."ApStatus" = apflora.ap_bearbstand_werte."DomainCode")
    LEFT JOIN
      apflora.ap_umsetzung_werte
      ON apflora.ap."ApUmsetzung" = apflora.ap_umsetzung_werte."DomainCode")
    LEFT JOIN
      apflora.adresse
      ON apflora.ap."ApBearb" = apflora.adresse."AdrId")
    RIGHT JOIN
      apflora.assozart
      ON apflora.ap."ApArtId" = apflora.assozart.ap_id)
    ON "ArtenDb_Arteigenschaften_1"."GUID" = apflora.assozart.ae_id
WHERE
  apflora.ap."ApArtId" IS NULL
ORDER BY
  apflora.adb_eigenschaften."Artname";

DROP VIEW IF EXISTS apflora.v_ap_ohnepop CASCADE;
CREATE OR REPLACE VIEW apflora.v_ap_ohnepop AS
SELECT
  apflora.ap."ApArtId",
  apflora.adb_eigenschaften."Artname" AS "Art",
  apflora.ap_bearbstand_werte."DomainTxt" AS "Bearbeitungsstand AP",
  apflora.ap."ApJahr" AS "Start AP im Jahr",
  apflora.ap_umsetzung_werte."DomainTxt" AS "Stand Umsetzung AP",
  apflora.adresse."AdrName" AS "Verantwortlich",
  apflora.pop."ApArtId" AS "Population"
FROM
  ((((apflora.adb_eigenschaften
  INNER JOIN
    apflora.ap
    ON apflora.adb_eigenschaften."TaxonomieId" = apflora.ap."ApArtId")
  INNER JOIN
    apflora.ap_bearbstand_werte
    ON apflora.ap."ApStatus" = apflora.ap_bearbstand_werte."DomainCode")
  LEFT JOIN
    apflora.ap_umsetzung_werte
    ON apflora.ap."ApUmsetzung" = apflora.ap_umsetzung_werte."DomainCode")
  LEFT JOIN
    apflora.adresse
    ON apflora.ap."ApBearb" = apflora.adresse."AdrId")
  LEFT JOIN
    apflora.pop
    ON apflora.ap."ApArtId" = apflora.pop."ApArtId"
WHERE
  apflora.pop."ApArtId" IS NULL
ORDER BY
  apflora.adb_eigenschaften."Artname";

DROP VIEW IF EXISTS apflora.v_ap_anzkontrinjahr CASCADE;
CREATE OR REPLACE VIEW apflora.v_ap_anzkontrinjahr AS
SELECT
  apflora.ap."ApArtId",
  apflora.adb_eigenschaften."Artname",
  apflora.tpopkontr."TPopKontrId",
  apflora.tpopkontr."TPopKontrJahr"
FROM
  (apflora.ap
  INNER JOIN
    apflora.adb_eigenschaften
    ON apflora.ap."ApArtId" = apflora.adb_eigenschaften."TaxonomieId")
  INNER JOIN
    (apflora.pop
    INNER JOIN
      (apflora.tpop
      INNER JOIN
        apflora.tpopkontr
        ON apflora.tpop."TPopId" = apflora.tpopkontr."TPopId")
      ON apflora.pop."PopId" = apflora.tpop."PopId")
    ON apflora.ap."ApArtId" = apflora.pop."ApArtId"
WHERE
  apflora.ap."ApStatus" BETWEEN 1 AND 3
GROUP BY
  apflora.ap."ApArtId",
  apflora.adb_eigenschaften."Artname",
  apflora.tpopkontr."TPopKontrId",
  apflora.tpopkontr."TPopKontrJahr";

DROP VIEW IF EXISTS apflora.v_erfkrit CASCADE;
CREATE OR REPLACE VIEW apflora.v_erfkrit AS
SELECT
  apflora.ap."ApArtId" AS "AP Id",
  apflora.adb_eigenschaften."Artname" AS "AP Art",
  apflora.ap_bearbstand_werte."DomainTxt" AS "AP Status",
  apflora.ap."ApJahr" AS "AP Start im Jahr",
  apflora.ap_umsetzung_werte."DomainTxt" AS "AP Stand Umsetzung",
  apflora.adresse."AdrName" AS "AP verantwortlich",
  apflora.erfkrit.id AS "ErfKrit Id",
  apflora.erfkrit.id AS "ErfKrit ApId",
  ap_erfkrit_werte."BeurteilTxt" AS "ErfKrit Beurteilung",
  apflora.erfkrit.kriterien AS "ErfKrit Kriterien",
  apflora.erfkrit.changed AS "ErfKrit MutWann",
  apflora.erfkrit.changed_by AS "ErfKrit MutWer"
FROM
  (((((apflora.adb_eigenschaften
  RIGHT JOIN
    apflora.ap
    ON apflora.adb_eigenschaften."TaxonomieId" = apflora.ap."ApArtId")
  LEFT JOIN
    apflora.ap_bearbstand_werte
    ON apflora.ap."ApStatus" = apflora.ap_bearbstand_werte."DomainCode")
  LEFT JOIN
    apflora.ap_umsetzung_werte
    ON apflora.ap."ApUmsetzung" = apflora.ap_umsetzung_werte."DomainCode")
  LEFT JOIN
    apflora.adresse
    ON apflora.ap."ApBearb" = apflora.adresse."AdrId")
  RIGHT JOIN
    apflora.erfkrit
    ON apflora.ap."ApArtId" = apflora.erfkrit.ap_id)
  LEFT JOIN
    apflora.ap_erfkrit_werte
    ON apflora.erfkrit.erfolg = ap_erfkrit_werte."BeurteilId"
ORDER BY
  apflora.adb_eigenschaften."Artname";

DROP VIEW IF EXISTS apflora.v_erfktit_verwaist CASCADE;
CREATE OR REPLACE VIEW apflora.v_erfktit_verwaist AS
SELECT
  apflora.ap."ApArtId" AS "AP Id",
  apflora.erfkrit.id AS "ErfKrit Id",
  apflora.erfkrit.id AS "ErfKrit ApId",
  ap_erfkrit_werte."BeurteilTxt" AS "ErfKrit Beurteilung",
  apflora.erfkrit.kriterien AS "ErfKrit Kriterien",
  apflora.erfkrit.changed AS "ErfKrit MutWann",
  apflora.erfkrit.changed_by AS "ErfKrit MutWer"
FROM
  (((((apflora.adb_eigenschaften
  RIGHT JOIN
    apflora.ap
    ON apflora.adb_eigenschaften."TaxonomieId" = apflora.ap."ApArtId")
  LEFT JOIN
    apflora.ap_bearbstand_werte
    ON apflora.ap."ApStatus" = apflora.ap_bearbstand_werte."DomainCode")
  LEFT JOIN
    apflora.ap_umsetzung_werte
    ON apflora.ap."ApUmsetzung" = apflora.ap_umsetzung_werte."DomainCode")
  LEFT JOIN
    apflora.adresse
    ON apflora.ap."ApBearb" = apflora.adresse."AdrId")
  RIGHT JOIN
    apflora.erfkrit
    ON apflora.ap."ApArtId" = apflora.erfkrit.ap_id)
  LEFT JOIN
    apflora.ap_erfkrit_werte
    ON apflora.erfkrit.erfolg = ap_erfkrit_werte."BeurteilId"
WHERE
  apflora.ap."ApArtId" IS NULL
ORDER BY
  apflora.ap_erfkrit_werte."BeurteilTxt",
  apflora.erfkrit.kriterien;

DROP VIEW IF EXISTS apflora.v_ap_tpopmassnjahr0 CASCADE;
CREATE OR REPLACE VIEW apflora.v_ap_tpopmassnjahr0 AS
SELECT
  apflora.ap."ApArtId",
  apflora.adb_eigenschaften."Artname",
  apflora.tpopmassn.id,
  apflora.tpopmassn.jahr
FROM
  (apflora.ap
  INNER JOIN
    apflora.adb_eigenschaften
    ON apflora.ap."ApArtId" = apflora.adb_eigenschaften."TaxonomieId")
  INNER JOIN
    ((apflora.pop
    INNER JOIN
      apflora.tpop
      ON apflora.pop."PopId" = apflora.tpop."PopId")
    INNER JOIN
      apflora.tpopmassn
      ON apflora.tpop."TPopId" = apflora.tpopmassn.tpop_id)
    ON apflora.ap."ApArtId" = apflora.pop."ApArtId"
WHERE
  apflora.ap."ApStatus" BETWEEN 1 AND 3
GROUP BY
  apflora.ap."ApArtId",
  apflora.adb_eigenschaften."Artname",
  apflora.tpopmassn.id,
  apflora.tpopmassn.jahr;

DROP VIEW IF EXISTS apflora.v_auswapbearbmassninjahr0 CASCADE;
CREATE OR REPLACE VIEW apflora.v_auswapbearbmassninjahr0 AS
SELECT
  apflora.adresse."AdrName",
  apflora.adb_eigenschaften."Artname" AS "Art",
  apflora.pop."PopNr",
  apflora.pop."PopName",
  apflora.tpop."TPopNr",
  apflora.tpop."TPopGemeinde",
  apflora.tpop."TPopFlurname",
  apflora.tpopmassn.jahr,
  tpopmassn_typ_werte.text AS typ,
  apflora.tpopmassn.beschreibung,
  apflora.tpopmassn.datum,
  apflora.tpopmassn.bemerkungen,
  apflora.tpopmassn.plan_vorhanden,
  apflora.tpopmassn.plan_bezeichnung,
  apflora.tpopmassn.flaeche,
  apflora.tpopmassn.markierung,
  apflora.tpopmassn.anz_triebe,
  apflora.tpopmassn.anz_pflanzen,
  apflora.tpopmassn.anz_pflanzstellen,
  apflora.tpopmassn.wirtspflanze,
  apflora.tpopmassn.herkunft_pop,
  apflora.tpopmassn.sammeldatum,
  apflora.tpopmassn.form,
  apflora.tpopmassn.pflanzanordnung
FROM
  (apflora.adb_eigenschaften
  INNER JOIN
    apflora.ap
    ON apflora.adb_eigenschaften."TaxonomieId" = apflora.ap."ApArtId")
  INNER JOIN
    ((apflora.pop
    INNER JOIN
      apflora.tpop
      ON apflora.pop."PopId" = apflora.tpop."PopId")
    INNER JOIN
      ((apflora.tpopmassn
      LEFT JOIN
        apflora.adresse
        ON apflora.tpopmassn.bearbeiter = apflora.adresse."AdrId")
      INNER JOIN
        apflora.tpopmassn_typ_werte
        ON apflora.tpopmassn.typ = tpopmassn_typ_werte.code)
      ON apflora.tpop."TPopId" = apflora.tpopmassn.tpop_id)
    ON apflora.ap."ApArtId" = apflora.pop."ApArtId"
WHERE
  apflora.ap."ApStatus" BETWEEN 1 AND 3
ORDER BY
  apflora.adresse."AdrName",
  apflora.adb_eigenschaften."Artname",
  apflora.pop."PopNr",
  apflora.pop."PopName",
  apflora.tpop."TPopNr",
  apflora.tpop."TPopGemeinde",
  apflora.tpop."TPopFlurname";

DROP VIEW IF EXISTS apflora.v_ap_mitmassninjahr0 CASCADE;
CREATE OR REPLACE VIEW apflora.v_ap_mitmassninjahr0 AS
SELECT
  apflora.adb_eigenschaften."Artname" AS "Art",
  apflora.pop."PopNr",
  apflora.pop."PopName",
  apflora.tpop."TPopNr",
  apflora.tpop."TPopGemeinde",
  apflora.tpop."TPopFlurname",
  apflora.tpopmassn.jahr,
  tpopmassn_typ_werte.text AS typ,
  apflora.tpopmassn.beschreibung,
  apflora.tpopmassn.datum,
  apflora.adresse."AdrName" AS bearbeiter,
  apflora.tpopmassn.bemerkungen,
  apflora.tpopmassn.plan_vorhanden,
  apflora.tpopmassn.plan_bezeichnung,
  apflora.tpopmassn.flaeche,
  apflora.tpopmassn.markierung,
  apflora.tpopmassn.anz_triebe,
  apflora.tpopmassn.anz_pflanzen,
  apflora.tpopmassn.anz_pflanzstellen,
  apflora.tpopmassn.wirtspflanze,
  apflora.tpopmassn.herkunft_pop,
  apflora.tpopmassn.sammeldatum,
  apflora.tpopmassn.form,
  apflora.tpopmassn.pflanzanordnung
FROM
  (apflora.adb_eigenschaften
  INNER JOIN
    apflora.ap
    ON apflora.adb_eigenschaften."TaxonomieId" = apflora.ap."ApArtId")
  INNER JOIN
    ((apflora.pop
    INNER JOIN
      apflora.tpop
      ON apflora.pop."PopId" = apflora.tpop."PopId")
    INNER JOIN
      ((apflora.tpopmassn
      INNER JOIN
        apflora.tpopmassn_typ_werte
        ON apflora.tpopmassn.typ = tpopmassn_typ_werte.code)
      LEFT JOIN
        apflora.adresse
        ON apflora.tpopmassn.bearbeiter = apflora.adresse."AdrId")
      ON apflora.tpop."TPopId" = apflora.tpopmassn.tpop_id)
    ON apflora.ap."ApArtId" = apflora.pop."ApArtId"
WHERE
  apflora.ap."ApStatus" BETWEEN 1 AND 3
ORDER BY
  apflora.adb_eigenschaften."Artname",
  apflora.pop."PopNr",
  apflora.pop."PopName",
  apflora.tpop."TPopNr",
  apflora.tpop."TPopGemeinde",
  apflora.tpop."TPopFlurname";

DROP VIEW IF EXISTS apflora.v_tpopmassnber_fueraktap0 CASCADE;
CREATE OR REPLACE VIEW apflora.v_tpopmassnber_fueraktap0 AS
SELECT
  apflora.ap."ApArtId",
  apflora.adb_eigenschaften."Artname" AS "Art",
  apflora.ap_bearbstand_werte."DomainTxt" AS "Aktionsplan-Status",
  apflora.ap."ApJahr" AS "Aktionsplan-Jahr",
  apflora.ap_umsetzung_werte."DomainTxt" AS "Aktionsplan-Umsetzung",
  apflora.pop."PopNr" AS "Population-Nr",
  apflora.pop."PopName" AS "Population-Name",
  pop_status_werte."HerkunftTxt" AS "Population-Herkunft",
  apflora.pop."PopBekanntSeit" AS "Population - bekannt seit",
  apflora.tpop."TPopNr" AS "Teilpopulation-Nr",
  apflora.tpop."TPopGemeinde" AS "Teilpopulation-Gemeinde",
  apflora.tpop."TPopFlurname" AS "Teilpopulation-Flurname",
  apflora.tpop."TPopXKoord" AS "Teilpopulation-X-Koodinate",
  apflora.tpop."TPopYKoord" AS "Teilpopulation-Y-Koordinate",
  apflora.tpop."TPopRadius" AS "Teilpopulation-Radius",
  apflora.tpop."TPopHoehe" AS "Teilpopulation-Hoehe",
  apflora.tpop."TPopBeschr" AS "Teilpopulation-Beschreibung",
  apflora.tpop."TPopKatNr" AS "Teilpopulation-Kataster-Nr",
  "domPopHerkunft_1"."HerkunftTxt" AS "Teilpopulation-Herkunft",
  apflora.tpop."TPopHerkunftUnklar" AS "Teilpopulation - Herkunft unklar",
  apflora.tpop."TPopHerkunftUnklarBegruendung" AS "Teilpopulation - Herkunft unklar Begruendung",
  apflora.tpop_apberrelevant_werte."DomainTxt" AS "Teilpopulation - Fuer Bericht relevant",
  apflora.tpop."TPopBekanntSeit" AS "Teilpopulation - bekannt seit",
  apflora.tpop."TPopEigen" AS "Teilpopulation-Eigentuemer",
  apflora.tpop."TPopKontakt" AS "Teilpopulation-Kontakt",
  apflora.tpop."TPopNutzungszone" AS "Teilpopulation-Nutzungszone",
  apflora.tpop."TPopBewirtschafterIn" AS "Teilpopulation-Bewirtschafter",
  apflora.tpop."TPopBewirtschaftung" AS "Teilpopulation-Bewirtschaftung",
  apflora.tpop."TPopTxt" AS "Teilpopulation-Bemerkungen",
  apflora.tpopmassnber.jahr AS "Massnahmenbericht-Jahr",
  tpopmassn_erfbeurt_werte.text AS "Massnahmenbericht-Erfolgsberuteilung",
  apflora.tpopmassnber.bemerkungen AS "Massnahmenbericht-Interpretation"
FROM
  (((apflora.adb_eigenschaften
  INNER JOIN
    apflora.ap
    ON apflora.adb_eigenschaften."TaxonomieId" = apflora.ap."ApArtId")
  LEFT JOIN
    apflora.ap_bearbstand_werte
    ON apflora.ap."ApStatus" = apflora.ap_bearbstand_werte."DomainCode")
  LEFT JOIN
    apflora.ap_umsetzung_werte
    ON apflora.ap."ApUmsetzung" = apflora.ap_umsetzung_werte."DomainCode")
  INNER JOIN
    (((apflora.pop
    LEFT JOIN
      apflora.pop_status_werte
      ON apflora.pop."PopHerkunft" = pop_status_werte."HerkunftId")
    INNER JOIN
      ((apflora.tpop
      LEFT JOIN
        apflora.pop_status_werte
        AS "domPopHerkunft_1" ON apflora.tpop."TPopHerkunft" = "domPopHerkunft_1"."HerkunftId")
      LEFT JOIN
        apflora.tpop_apberrelevant_werte
        ON apflora.tpop."TPopApBerichtRelevant"  = apflora.tpop_apberrelevant_werte."DomainCode")
      ON apflora.pop."PopId" = apflora.tpop."PopId")
    INNER JOIN
      (apflora.tpopmassnber
      INNER JOIN
        apflora.tpopmassn_erfbeurt_werte
        ON apflora.tpopmassnber.beurteilung = tpopmassn_erfbeurt_werte.code)
      ON apflora.tpop."TPopId" = apflora.tpopmassnber.tpop_id)
    ON apflora.ap."ApArtId" = apflora.pop."ApArtId"
ORDER BY
  apflora.adb_eigenschaften."Artname",
  apflora.pop."PopNr",
  apflora.tpop."TPopNr",
  apflora.tpopmassnber.jahr;

DROP VIEW IF EXISTS apflora.v_tpopmassn_0 CASCADE;
CREATE OR REPLACE VIEW apflora.v_tpopmassn_0 AS
SELECT
  apflora.ap."ApArtId",
  apflora.adb_eigenschaften."Artname" AS "Art",
  apflora.ap_bearbstand_werte."DomainTxt" AS "Aktionsplan Bearbeitungsstand",
  apflora.pop."PopId",
  apflora.pop."PopNr",
  apflora.pop."PopName",
  apflora.tpop."TPopId",
  apflora.tpop."TPopNr",
  apflora.tpop."TPopFlurname",
  apflora.tpopmassn.id,
  apflora.tpopmassn.jahr AS "Jahr",
  tpopmassn_typ_werte.text AS "Massnahme",
  apflora.tpopmassn.beschreibung,
  apflora.tpopmassn.datum,
  apflora.adresse."AdrName" AS bearbeiter,
  apflora.tpopmassn.bemerkungen,
  apflora.tpopmassn.plan_vorhanden,
  apflora.tpopmassn.plan_bezeichnung,
  apflora.tpopmassn.flaeche,
  apflora.tpopmassn.markierung,
  apflora.tpopmassn.anz_triebe,
  apflora.tpopmassn.anz_pflanzen,
  apflora.tpopmassn.anz_pflanzstellen,
  apflora.tpopmassn.wirtspflanze,
  apflora.tpopmassn.herkunft_pop,
  apflora.tpopmassn.sammeldatum,
  apflora.tpopmassn.form,
  apflora.tpopmassn.pflanzanordnung
FROM
  ((apflora.adb_eigenschaften
  INNER JOIN
    apflora.ap
    ON apflora.adb_eigenschaften."TaxonomieId" = apflora.ap."ApArtId")
  LEFT JOIN
    apflora.ap_bearbstand_werte
    ON apflora.ap."ApStatus" = apflora.ap_bearbstand_werte."DomainCode")
  INNER JOIN
    ((apflora.pop
    INNER JOIN
      apflora.tpop
      ON apflora.pop."PopId" = apflora.tpop."PopId")
    INNER JOIN
      ((apflora.tpopmassn
      LEFT JOIN
        apflora.tpopmassn_typ_werte
        ON apflora.tpopmassn.typ = tpopmassn_typ_werte.code)
      LEFT JOIN
        apflora.adresse
        ON apflora.tpopmassn.bearbeiter = apflora.adresse."AdrId")
      ON apflora.tpop."TPopId" = apflora.tpopmassn.tpop_id)
    ON apflora.ap."ApArtId" = apflora.pop."ApArtId"
ORDER BY
  apflora.adb_eigenschaften."Artname",
  apflora.pop."PopNr",
  apflora.tpop."TPopNr",
  apflora.tpopmassn.jahr,
  tpopmassn_typ_werte.text;

DROP VIEW IF EXISTS apflora.v_tpopmassn_fueraktap0 CASCADE;
CREATE OR REPLACE VIEW apflora.v_tpopmassn_fueraktap0 AS
SELECT
  apflora.ap."ApArtId",
  apflora.adb_eigenschaften."Artname" AS "Art",
  apflora.ap_bearbstand_werte."DomainTxt" AS "Aktionsplan-Status",
  apflora.ap."ApJahr" AS "Aktionsplan-Jahr",
  apflora.ap_umsetzung_werte."DomainTxt" AS "Aktionsplan-Umsetzung",
  apflora.pop."PopId",
  apflora.pop."PopNr" AS "Population-Nr",
  apflora.pop."PopName" AS "Population-Name",
  pop_status_werte."HerkunftTxt" AS "Population-Herkunft",
  apflora.pop."PopBekanntSeit" AS "Population - bekannt seit",
  apflora.tpop."TPopId",
  apflora.tpop."TPopNr" AS "Teilpopulation-Nr",
  apflora.tpop."TPopGemeinde" AS "Teilpopulation-Gemeinde",
  apflora.tpop."TPopFlurname" AS "Teilpopulation-Flurname",
  apflora.tpop."TPopXKoord" AS "Teilpopulation-X-Koodinate",
  apflora.tpop."TPopYKoord" AS "Teilpopulation-Y-Koordinate",
  apflora.tpop."TPopRadius" AS "Teilpopulation-Radius",
  apflora.tpop."TPopHoehe" AS "Teilpopulation-Höhe",
  apflora.tpop."TPopBeschr" AS "Teilpopulation-Beschreibung",
  apflora.tpop."TPopKatNr" AS "Teilpopulation-Kataster-Nr",
  "domPopHerkunft_1"."HerkunftTxt" AS "Teilpopulation-Herkunft",
  apflora.tpop."TPopHerkunftUnklar" AS "Teilpopulation - Herkunft unklar",
  apflora.tpop."TPopHerkunftUnklarBegruendung" AS "Teilpopulation - Herkunft unklar Begruendung",
  apflora.tpop_apberrelevant_werte."DomainTxt" AS "Teilpopulation - Fuer Bericht relevant",
  apflora.tpop."TPopBekanntSeit" AS "Teilpopulation - bekannt seit",
  apflora.tpop."TPopEigen" AS "Teilpopulation-Eigentuemer",
  apflora.tpop."TPopKontakt" AS "Teilpopulation-Kontakt",
  apflora.tpop."TPopNutzungszone" AS "Teilpopulation-Nutzungszone",
  apflora.tpop."TPopBewirtschafterIn" AS "Teilpopulation-Bewirtschafter",
  apflora.tpop."TPopBewirtschaftung" AS "Teilpopulation-Bewirtschaftung",
  apflora.tpop."TPopTxt" AS "Teilpopulation-Bemerkungen",
  apflora.tpopmassn.id,
  tpopmassn_typ_werte.text AS "Massnahme-Typ",
  apflora.tpopmassn.beschreibung AS "Massnahme-Beschreibung",
  apflora.tpopmassn.datum AS "Massnahme-Datum",
  apflora.adresse."AdrName" AS "Massnahme-BearbeiterIn",
  apflora.tpopmassn.bemerkungen AS "Massnahme-Bemerkungen",
  apflora.tpopmassn.plan_vorhanden AS "Massnahme-Plan",
  apflora.tpopmassn.plan_bezeichnung AS "Massnahme-Planbezeichnung",
  apflora.tpopmassn.flaeche AS "Massnahme-Flaeche",
  apflora.tpopmassn.markierung AS "Massnahme-Markierung",
  apflora.tpopmassn.anz_triebe AS "Massnahme - Ansiedlung Anzahl Triebe",
  apflora.tpopmassn.anz_pflanzen AS "Massnahme - Ansiedlung Anzahl Pflanzen",
  apflora.tpopmassn.anz_pflanzstellen AS "Massnahme - Ansiedlung Anzahl Pflanzstellen",
  apflora.tpopmassn.wirtspflanze AS "Massnahme - Ansiedlung Wirtspflanzen",
  apflora.tpopmassn.herkunft_pop AS "Massnahme - Ansiedlung Herkunftspopulation",
  apflora.tpopmassn.sammeldatum AS "Massnahme - Ansiedlung Sammeldatum",
  apflora.tpopmassn.form AS "Massnahme - Ansiedlung Form",
  apflora.tpopmassn.pflanzanordnung AS "Massnahme - Ansiedlung Pflanzordnung"
FROM
  (apflora.adb_eigenschaften
  INNER JOIN
    ((apflora.ap
    LEFT JOIN
      apflora.ap_bearbstand_werte
      ON apflora.ap."ApStatus" = apflora.ap_bearbstand_werte."DomainCode")
    LEFT JOIN
      apflora.ap_umsetzung_werte
      ON apflora.ap."ApUmsetzung" = apflora.ap_umsetzung_werte."DomainCode")
    ON apflora.adb_eigenschaften."TaxonomieId" = apflora.ap."ApArtId")
  INNER JOIN
    (((apflora.pop
    LEFT JOIN
      apflora.pop_status_werte
      ON apflora.pop."PopHerkunft" = pop_status_werte."HerkunftId")
    INNER JOIN
      ((apflora.tpop
      LEFT JOIN
        apflora.pop_status_werte AS "domPopHerkunft_1"
        ON apflora.tpop."TPopHerkunft" = "domPopHerkunft_1"."HerkunftId")
      LEFT JOIN
        apflora.tpop_apberrelevant_werte
        ON apflora.tpop."TPopApBerichtRelevant"  = apflora.tpop_apberrelevant_werte."DomainCode")
      ON apflora.pop."PopId" = apflora.tpop."PopId")
    INNER JOIN
      ((apflora.tpopmassn
      LEFT JOIN
        apflora.tpopmassn_typ_werte
        ON apflora.tpopmassn.typ = tpopmassn_typ_werte.code)
      LEFT JOIN
        apflora.adresse
        ON apflora.tpopmassn.bearbeiter = apflora.adresse."AdrId")
      ON apflora.tpop."TPopId" = apflora.tpopmassn.tpop_id)
    ON apflora.ap."ApArtId" = apflora.pop."ApArtId"
ORDER BY
  apflora.adb_eigenschaften."Artname",
  apflora.pop."PopNr",
  apflora.tpop."TPopNr",
  tpopmassn_typ_werte.text;

DROP VIEW IF EXISTS apflora.v_tpopkontr_nachflurname CASCADE;
CREATE OR REPLACE VIEW apflora.v_tpopkontr_nachflurname AS
SELECT
  apflora.ap."ApArtId",
  apflora.pop."PopId",
  apflora.tpop."TPopId",
  apflora.tpop."TPopGemeinde" AS "Gemeinde",
  apflora.tpop."TPopFlurname" AS "Flurname aus Teilpopulation",
  apflora.ap_bearbstand_werte."DomainTxt" AS "Bearbeitungsstand AP",
  apflora.adb_eigenschaften."Artname" AS "Art",
  apflora.pop."PopNr",
  apflora.tpop."TPopNr",
  apflora.tpopkontr."TPopKontrJahr" AS "Jahr",
  apflora.tpopkontr."TPopKontrTyp" AS "Kontrolltyp",
  apflora.tpopkontr."TPopKontrDatum",
  apflora.adresse."AdrName" AS "TPopKontrBearb",
  apflora.tpopkontr."TPopKontrJungpfl",
  apflora.tpopkontr."TPopKontrVitalitaet",
  apflora.tpopkontr."TPopKontrUeberleb",
  apflora.tpopkontr."TPopKontrEntwicklung",
  apflora.tpopkontr."TPopKontrUrsach",
  apflora.tpopkontr."TPopKontrUrteil",
  apflora.tpopkontr."TPopKontrAendUms",
  apflora.tpopkontr."TPopKontrAendKontr",
  apflora.tpopkontr."TPopKontrTxt",
  apflora.tpopkontr."TPopKontrLeb",
  apflora.tpopkontr."TPopKontrFlaeche",
  apflora.tpopkontr."TPopKontrLebUmg",
  apflora.tpopkontr."TPopKontrStrauchschicht",
  apflora.tpopkontr."TPopKontrBodenTyp",
  apflora.tpopkontr."TPopKontrBodenAbtrag",
  apflora.tpopkontr."TPopKontrWasserhaushalt",
  apflora.tpopkontr."TPopKontrHandlungsbedarf",
  apflora.tpopkontr."TPopKontrUebFlaeche",
  apflora.tpopkontr."TPopKontrPlan",
  apflora.tpopkontr."TPopKontrVeg",
  apflora.tpopkontr."TPopKontrNaBo",
  apflora.tpopkontr."TPopKontrUebPfl",
  apflora.tpopkontr."TPopKontrJungPflJN",
  apflora.tpopkontr."TPopKontrVegHoeMax",
  apflora.tpopkontr."TPopKontrVegHoeMit",
  apflora.tpopkontr."TPopKontrGefaehrdung",
  apflora.tpopkontrzaehl.id,
  apflora.tpopkontrzaehl.anzahl,
  apflora.tpopkontrzaehl_einheit_werte.text AS einheit,
  apflora.tpopkontrzaehl_methode_werte.text AS methode
FROM
  ((((((apflora.adb_eigenschaften
  INNER JOIN
    apflora.ap
    ON apflora.adb_eigenschaften."TaxonomieId" = apflora.ap."ApArtId")
  INNER JOIN
    (apflora.pop
    INNER JOIN
      (apflora.tpop
      INNER JOIN
        apflora.tpopkontr
        ON apflora.tpop."TPopId" = apflora.tpopkontr."TPopId")
      ON apflora.pop."PopId" = apflora.tpop."PopId")
    ON apflora.ap."ApArtId" = apflora.pop."ApArtId")
  LEFT JOIN
    apflora.ap_bearbstand_werte
    ON apflora.ap."ApStatus" = apflora.ap_bearbstand_werte."DomainCode")
  LEFT JOIN
    apflora.adresse
    ON apflora.tpopkontr."TPopKontrBearb" = apflora.adresse."AdrId")
  LEFT JOIN
    apflora.tpopkontrzaehl
    ON apflora.tpopkontr."TPopKontrId" = apflora.tpopkontrzaehl.tpopkontr_id)
  LEFT JOIN
    apflora.tpopkontrzaehl_einheit_werte
    ON apflora.tpopkontrzaehl.einheit = apflora.tpopkontrzaehl_einheit_werte.code)
  LEFT JOIN
    apflora.tpopkontrzaehl_methode_werte
    ON apflora.tpopkontrzaehl.methode = apflora.tpopkontrzaehl_methode_werte.code
WHERE
  apflora.tpopkontr."TPopKontrTyp" NOT IN ('Ziel', 'Zwischenziel')
ORDER BY
  apflora.tpop."TPopGemeinde",
  apflora.tpop."TPopFlurname",
  apflora.adb_eigenschaften."Artname",
  apflora.pop."PopNr",
  apflora.tpop."TPopNr",
  apflora.tpopkontr."TPopKontrJahr",
  apflora.tpopkontr."TPopKontrTyp";

DROP VIEW IF EXISTS apflora.v_apber_b1rpop CASCADE;
CREATE OR REPLACE VIEW apflora.v_apber_b1rpop AS
SELECT
  apflora.pop."ApArtId",
  apflora.pop."PopId"
FROM
  apflora._variable,
  (apflora.pop
  INNER JOIN
    apflora.popber
    ON apflora.pop."PopId" = apflora.popber."PopId")
  INNER JOIN
    apflora.tpop
    ON apflora.pop."PopId" = apflora.tpop."PopId"
WHERE
  apflora.tpop."TPopApBerichtRelevant" = 1
  AND apflora.pop."PopHerkunft" <> 300
  AND apflora.popber."PopBerJahr" <= apflora._variable."JBerJahr"
  AND apflora.popber."PopBerEntwicklung" in (1, 2, 3, 4, 8)
GROUP BY
  apflora.pop."ApArtId",
  apflora.pop."PopId";

DROP VIEW IF EXISTS apflora.v_apber_b1rtpop CASCADE;
CREATE OR REPLACE VIEW apflora.v_apber_b1rtpop AS
SELECT
  apflora.pop."ApArtId",
  apflora.tpopber.tpop_id AS "TPopId"
FROM
  apflora._variable,
  apflora.pop
  INNER JOIN
    (apflora.tpop
    INNER JOIN
      apflora.tpopber
      ON apflora.tpop."TPopId" = apflora.tpopber.tpop_id)
    ON apflora.pop."PopId" = apflora.tpop."PopId"
WHERE
  apflora.tpop."TPopApBerichtRelevant" = 1
  AND apflora.pop."PopHerkunft" <> 300
  AND apflora.tpop."TPopHerkunft" <> 300
  AND apflora.tpopber.jahr <= apflora._variable."JBerJahr"
  AND apflora.tpopber.entwicklung in (1, 2, 3, 4, 8)
GROUP BY
  apflora.pop."ApArtId",
  apflora.tpopber.tpop_id;

DROP VIEW IF EXISTS apflora.v_apber_c1rtpop CASCADE;
CREATE OR REPLACE VIEW apflora.v_apber_c1rtpop AS
SELECT
  apflora.pop."ApArtId",
  apflora.tpop."TPopId"
FROM
  apflora._variable,
  (apflora.pop
  INNER JOIN
    apflora.tpop
    ON apflora.pop."PopId" = apflora.tpop."PopId")
  INNER JOIN
    apflora.tpopmassn
    ON apflora.tpop."TPopId" = apflora.tpopmassn.tpop_id
WHERE
  apflora.tpopmassn.jahr <= apflora._variable."JBerJahr"
  AND apflora.tpop."TPopApBerichtRelevant" = 1
  AND apflora.pop."PopHerkunft" <> 300
  AND apflora.tpop."TPopHerkunft" <> 300
GROUP BY
  apflora.pop."ApArtId",
  apflora.tpop."TPopId";

DROP VIEW IF EXISTS apflora.v_apber_a3lpop CASCADE;
CREATE OR REPLACE VIEW apflora.v_apber_a3lpop AS
SELECT
  apflora.pop."ApArtId",
  apflora.pop."PopId"
FROM
  (apflora.pop
  INNER JOIN
    apflora.tpop
    ON apflora.pop."PopId" = apflora.tpop."PopId")
  INNER JOIN
    apflora.ap
    ON apflora.pop."ApArtId" = apflora.ap."ApArtId"
WHERE
  apflora.pop."PopHerkunft" IN (200, 210)
  AND apflora.tpop."TPopApBerichtRelevant" = 1
  AND (
    apflora.pop."PopBekanntSeit" < apflora.ap."ApJahr"
    OR apflora.pop."PopBekanntSeit" IS Null
    OR apflora.ap."ApJahr" IS NULL
  )
GROUP BY
  apflora.pop."ApArtId",
  apflora.pop."PopId";

DROP VIEW IF EXISTS apflora.v_apber_a4lpop CASCADE;
CREATE OR REPLACE VIEW apflora.v_apber_a4lpop AS
SELECT
  apflora.pop."ApArtId",
  apflora.pop."PopId"
FROM
  (apflora.pop
  INNER JOIN
    apflora.tpop
    ON apflora.pop."PopId" = apflora.tpop."PopId")
  INNER JOIN
    apflora.ap
    ON apflora.pop."ApArtId" = apflora.ap."ApArtId"
WHERE
  apflora.pop."PopHerkunft" IN (200, 210)
  AND apflora.tpop."TPopApBerichtRelevant" = 1
  AND apflora.pop."PopBekanntSeit" >= apflora.ap."ApJahr"
GROUP BY
  apflora.pop."ApArtId",
  apflora.pop."PopId";

DROP VIEW IF EXISTS apflora.v_apber_a5lpop CASCADE;
CREATE OR REPLACE VIEW apflora.v_apber_a5lpop AS
SELECT
  apflora.pop."ApArtId",
  apflora.pop."PopId"
FROM
  apflora.pop
  INNER JOIN
    apflora.tpop
    ON apflora.pop."PopId" = apflora.tpop."PopId"
WHERE
  apflora.pop."PopHerkunft" = 201
  AND apflora.tpop."TPopApBerichtRelevant" = 1
GROUP BY
  apflora.pop."ApArtId",
  apflora.pop."PopId";

DROP VIEW IF EXISTS apflora.v_apber_a10lpop CASCADE;
CREATE OR REPLACE VIEW apflora.v_apber_a10lpop AS
SELECT
  apflora.pop."ApArtId",
  apflora.pop."PopId"
FROM
  apflora.pop
  INNER JOIN
    apflora.tpop
    ON apflora.pop."PopId" = apflora.tpop."PopId"
WHERE
  apflora.pop."PopHerkunft" = 300
GROUP BY
  apflora.pop."ApArtId",
  apflora.pop."PopId";

DROP VIEW IF EXISTS apflora.v_apber_a8lpop CASCADE;
CREATE OR REPLACE VIEW apflora.v_apber_a8lpop AS
SELECT
  apflora.pop."ApArtId",
  apflora.pop."PopId"
FROM
  (apflora.pop
  INNER JOIN
    apflora.tpop
    ON apflora.pop."PopId" = apflora.tpop."PopId")
  INNER JOIN
    apflora.ap
    ON apflora.pop."ApArtId" = apflora.ap."ApArtId"
WHERE
  (
    apflora.pop."PopHerkunft" = 101
    OR (
      apflora.pop."PopHerkunft" = 211
      AND (
        apflora.pop."PopBekanntSeit" < apflora.ap."ApJahr"
        OR apflora.pop."PopBekanntSeit" IS NULL
        OR apflora.ap."ApJahr" IS NULL
      )
    )
  )
  AND apflora.tpop."TPopApBerichtRelevant" = 1
GROUP BY
  apflora.pop."ApArtId",
  apflora.pop."PopId";

DROP VIEW IF EXISTS apflora.v_apber_a9lpop CASCADE;
CREATE OR REPLACE VIEW apflora.v_apber_a9lpop AS
SELECT
  apflora.pop."ApArtId",
  apflora.pop."PopId"
FROM
  (apflora.pop
  INNER JOIN
    apflora.tpop
    ON apflora.pop."PopId" = apflora.tpop."PopId")
  INNER JOIN
    apflora.ap
    ON apflora.pop."ApArtId" = apflora.ap."ApArtId"
WHERE
  apflora.pop."PopHerkunft" IN (202, 211)
  AND apflora.tpop."TPopApBerichtRelevant" = 1
  AND apflora.pop."PopBekanntSeit" >= apflora.ap."ApJahr"
GROUP BY
  apflora.pop."ApArtId",
  apflora.pop."PopId";

DROP VIEW IF EXISTS apflora.v_apbera1ltpop CASCADE;
CREATE OR REPLACE VIEW apflora.v_apbera1ltpop AS
SELECT
  apflora.pop."ApArtId",
  apflora.tpop."TPopId"
FROM
  apflora.pop
  INNER JOIN
    apflora.tpop
    ON apflora.pop."PopId" = apflora.tpop."PopId"
WHERE
  apflora.tpop."TPopApBerichtRelevant" = 1
  AND apflora.pop."PopHerkunft" IS NOT NULL
  AND apflora.pop."PopHerkunft" <> 300
  AND apflora.tpop."TPopHerkunft" <> 300
  AND apflora.tpop."TPopHerkunft" IS NOT NULL
GROUP BY
  apflora.pop."ApArtId",
  apflora.tpop."TPopId";

DROP VIEW IF EXISTS apflora.v_apber_a2ltpop CASCADE;
CREATE OR REPLACE VIEW apflora.v_apber_a2ltpop AS
SELECT
  apflora.pop."ApArtId",
  apflora.tpop."TPopId"
FROM
  apflora.pop
  INNER JOIN
    apflora.tpop
    ON apflora.pop."PopId" = apflora.tpop."PopId"
WHERE
  apflora.pop."PopHerkunft" NOT IN (300)
  AND apflora.tpop."TPopHerkunft" = 100
  AND apflora.tpop."TPopApBerichtRelevant" = 1
GROUP BY
  apflora.pop."ApArtId",
  apflora.tpop."TPopId";

DROP VIEW IF EXISTS apflora.v_apber_a3ltpop CASCADE;
CREATE OR REPLACE VIEW apflora.v_apber_a3ltpop AS
SELECT
  apflora.pop."ApArtId",
  apflora.tpop."TPopId"
FROM
  apflora.ap
  INNER JOIN
    (apflora.pop
    INNER JOIN
      apflora.tpop
      ON apflora.pop."PopId" = apflora.tpop."PopId")
    ON apflora.pop."ApArtId" = apflora.ap."ApArtId"
WHERE
  apflora.pop."PopHerkunft" NOT IN (300)
  AND apflora.tpop."TPopHerkunft" IN (200, 210)
  AND apflora.tpop."TPopApBerichtRelevant" = 1
  AND (
    apflora.tpop."TPopBekanntSeit" < apflora.ap."ApJahr"
    OR apflora.tpop."TPopBekanntSeit" IS NULL
    OR apflora.ap."ApJahr" IS NULL
  )
GROUP BY
  apflora.pop."ApArtId",
  apflora.tpop."TPopId";

DROP VIEW IF EXISTS apflora.v_apber_a4ltpop CASCADE;
CREATE OR REPLACE VIEW apflora.v_apber_a4ltpop AS
SELECT
  apflora.pop."ApArtId",
  apflora.tpop."TPopId"
FROM
  apflora.ap
  INNER JOIN
    (apflora.pop
    INNER JOIN
      apflora.tpop
      ON apflora.pop."PopId" = apflora.tpop."PopId")
    ON apflora.pop."ApArtId" = apflora.ap."ApArtId"
WHERE
  apflora.pop."PopHerkunft" NOT IN (300)
  AND apflora.tpop."TPopHerkunft" IN (200, 210)
  AND apflora.tpop."TPopApBerichtRelevant" = 1
  AND apflora.tpop."TPopBekanntSeit" >= apflora.ap."ApJahr"
GROUP BY
  apflora.pop."ApArtId",
  apflora.tpop."TPopId";

DROP VIEW IF EXISTS apflora.v_apber_a5ltpop CASCADE;
CREATE OR REPLACE VIEW apflora.v_apber_a5ltpop AS
SELECT
  apflora.pop."ApArtId",
  apflora.tpop."TPopId"
FROM
  apflora.pop
  INNER JOIN
    apflora.tpop
    ON apflora.pop."PopId" = apflora.tpop."PopId"
WHERE
  apflora.tpop."TPopHerkunft" = 201
  AND apflora.tpop."TPopApBerichtRelevant" = 1
GROUP BY
  apflora.pop."ApArtId",
  apflora.tpop."TPopId";

DROP VIEW IF EXISTS apflora.v_apber_a10ltpop CASCADE;
CREATE OR REPLACE VIEW apflora.v_apber_a10ltpop AS
SELECT
  apflora.pop."ApArtId",
  apflora.tpop."TPopId"
FROM
  apflora.pop
  INNER JOIN
    apflora.tpop
    ON apflora.pop."PopId" = apflora.tpop."PopId"
WHERE
  apflora.tpop."TPopHerkunft" = 300
GROUP BY
  apflora.pop."ApArtId",
  apflora.tpop."TPopId";

DROP VIEW IF EXISTS apflora.v_apber_a8ltpop CASCADE;
CREATE OR REPLACE VIEW apflora.v_apber_a8ltpop AS
SELECT
  apflora.pop."ApArtId",
  apflora.tpop."TPopId"
FROM
  (apflora.pop
  INNER JOIN
    apflora.tpop
    ON apflora.pop."PopId" = apflora.tpop."PopId")
  INNER JOIN
    apflora.ap
    ON apflora.pop."ApArtId" = apflora.ap."ApArtId"
WHERE
  apflora.pop."PopHerkunft" NOT IN (300)
  AND (
    apflora.tpop."TPopHerkunft" = 101
    OR (
      apflora.tpop."TPopHerkunft" = 211
      AND (
        apflora.tpop."TPopBekanntSeit" < apflora.ap."ApJahr"
        OR apflora.tpop."TPopBekanntSeit" IS NULL
        OR apflora.ap."ApJahr" IS NULL
      )
    )
  )
  AND apflora.tpop."TPopApBerichtRelevant" = 1
GROUP BY
  apflora.pop."ApArtId",
  apflora.tpop."TPopId";

DROP VIEW IF EXISTS apflora.v_apber_a9ltpop CASCADE;
CREATE OR REPLACE VIEW apflora.v_apber_a9ltpop AS
SELECT
  apflora.pop."ApArtId",
  apflora.tpop."TPopId"
FROM
  (apflora.pop
  INNER JOIN
    apflora.tpop
    ON apflora.pop."PopId" = apflora.tpop."PopId")
  INNER JOIN
    apflora.ap
    ON apflora.pop."ApArtId" = apflora.ap."ApArtId"
WHERE
  apflora.pop."PopHerkunft" NOT IN (300)
  AND apflora.tpop."TPopHerkunft" IN (202, 211)
  AND apflora.tpop."TPopApBerichtRelevant" = 1
  AND apflora.tpop."TPopBekanntSeit" >= apflora.ap."ApJahr"
GROUP BY
  apflora.pop."ApArtId",
  apflora.tpop."TPopId";

DROP VIEW IF EXISTS apflora.v_apber_b1lpop CASCADE;
CREATE OR REPLACE VIEW apflora.v_apber_b1lpop AS
SELECT
  apflora.pop."ApArtId",
  apflora.pop."PopId"
FROM
  (apflora.pop
  INNER JOIN
    (apflora.popber
    INNER JOIN
      apflora._variable
      ON apflora.popber."PopBerJahr" = apflora._variable."JBerJahr")
    ON apflora.pop."PopId" = apflora.popber."PopId")
  INNER JOIN
    apflora.tpop
    ON apflora.pop."PopId" = apflora.tpop."PopId"
WHERE
  apflora.tpop."TPopApBerichtRelevant" = 1
  AND apflora.pop."PopHerkunft" <> 300
GROUP BY
  apflora.pop."ApArtId",
  apflora.pop."PopId";

DROP VIEW IF EXISTS apflora.v_apber_b2lpop CASCADE;
CREATE OR REPLACE VIEW apflora.v_apber_b2lpop AS
SELECT
  apflora.pop."ApArtId",
  apflora.pop."PopId"
FROM
  (apflora.pop
  INNER JOIN
    (apflora.popber
    INNER JOIN
      apflora._variable
      ON apflora.popber."PopBerJahr" = apflora._variable."JBerJahr")
    ON apflora.pop."PopId" = apflora.popber."PopId")
  INNER JOIN
    apflora.tpop
    ON apflora.pop."PopId" = apflora.tpop."PopId"
WHERE
  apflora.popber."PopBerEntwicklung" = 3
  AND apflora.tpop."TPopApBerichtRelevant" = 1
  AND apflora.pop."PopHerkunft" <> 300
GROUP BY
  apflora.pop."ApArtId",
  apflora.pop."PopId";

DROP VIEW IF EXISTS apflora.v_apber_b3lpop CASCADE;
CREATE OR REPLACE VIEW apflora.v_apber_b3lpop AS
SELECT
  apflora.pop."ApArtId",
  apflora.pop."PopId"
FROM
  (apflora.pop
  INNER JOIN
    (apflora.popber
    INNER JOIN
      apflora._variable
      ON apflora.popber."PopBerJahr" = apflora._variable."JBerJahr")
    ON apflora.pop."PopId" = apflora.popber."PopId")
  INNER JOIN
    apflora.tpop
    ON apflora.pop."PopId" = apflora.tpop."PopId"
WHERE
  apflora.popber."PopBerEntwicklung" = 2
  AND apflora.tpop."TPopApBerichtRelevant" = 1
  AND apflora.pop."PopHerkunft" <> 300
GROUP BY
  apflora.pop."ApArtId",
  apflora.pop."PopId";

DROP VIEW IF EXISTS apflora.v_apber_b4lpop CASCADE;
CREATE OR REPLACE VIEW apflora.v_apber_b4lpop AS
SELECT
  apflora.pop."ApArtId",
  apflora.pop."PopId"
FROM
  (apflora.pop
  INNER JOIN
    (apflora.popber
    INNER JOIN
      apflora._variable
      ON apflora.popber."PopBerJahr" = apflora._variable."JBerJahr")
    ON apflora.pop."PopId" = apflora.popber."PopId")
  INNER JOIN
    apflora.tpop
    ON apflora.pop."PopId" = apflora.tpop."PopId"
WHERE
  apflora.popber."PopBerEntwicklung" = 1
  AND apflora.tpop."TPopApBerichtRelevant" = 1
  AND apflora.pop."PopHerkunft" <> 300
GROUP BY
  apflora.pop."ApArtId",
  apflora.pop."PopId";

DROP VIEW IF EXISTS apflora.v_apber_b5lpop CASCADE;
CREATE OR REPLACE VIEW apflora.v_apber_b5lpop AS
SELECT
  apflora.pop."ApArtId",
  apflora.pop."PopId"
FROM
  (apflora.pop
  INNER JOIN
    (apflora.popber
    INNER JOIN
      apflora._variable
      ON apflora.popber."PopBerJahr" = apflora._variable."JBerJahr")
    ON apflora.pop."PopId" = apflora.popber."PopId")
  INNER JOIN
    apflora.tpop
    ON apflora.pop."PopId" = apflora.tpop."PopId"
WHERE
  apflora.popber."PopBerEntwicklung" = 4
  AND apflora.tpop."TPopApBerichtRelevant" = 1
  AND apflora.pop."PopHerkunft" <> 300
GROUP BY
  apflora.pop."ApArtId",
  apflora.pop."PopId";

DROP VIEW IF EXISTS apflora.v_apber_b6lpop CASCADE;
CREATE OR REPLACE VIEW apflora.v_apber_b6lpop AS
SELECT
  apflora.pop."ApArtId",
  apflora.pop."PopId"
FROM
  (apflora.pop
  INNER JOIN
    (apflora.popber
    INNER JOIN
      apflora._variable
      ON apflora.popber."PopBerJahr" = apflora._variable."JBerJahr")
    ON apflora.pop."PopId" = apflora.popber."PopId")
  INNER JOIN
    apflora.tpop
    ON apflora.pop."PopId" = apflora.tpop."PopId"
WHERE
  apflora.popber."PopBerEntwicklung" = 8
  AND apflora.tpop."TPopApBerichtRelevant" = 1
  AND apflora.pop."PopHerkunft" <> 300
GROUP BY
  apflora.pop."ApArtId",
  apflora.pop."PopId";

DROP VIEW IF EXISTS apflora.v_apber_b7lpop CASCADE;
CREATE OR REPLACE VIEW apflora.v_apber_b7lpop AS
SELECT
  apflora.pop."ApArtId",
  apflora.pop."PopId"
FROM
  apflora.pop
  INNER JOIN
    apflora.tpop
    ON apflora.pop."PopId" = apflora.tpop."PopId"
WHERE
  apflora.tpop."TPopApBerichtRelevant" = 1
  AND apflora.pop."PopHerkunft" <> 300
GROUP BY
  apflora.pop."ApArtId",
  apflora.pop."PopId";

DROP VIEW IF EXISTS apflora.v_apber_b1ltpop CASCADE;
CREATE OR REPLACE VIEW apflora.v_apber_b1ltpop AS
SELECT
  apflora.pop."ApArtId",
  apflora.tpop."TPopId"
FROM
  apflora.pop
  INNER JOIN
    (apflora.tpop
    INNER JOIN
      (apflora.tpopber
      INNER JOIN
        apflora._variable
        ON apflora.tpopber.jahr = apflora._variable."JBerJahr")
      ON apflora.tpop."TPopId" = apflora.tpopber.tpop_id)
    ON apflora.pop."PopId" = apflora.tpop."PopId"
WHERE
  apflora.tpop."TPopApBerichtRelevant" = 1
  AND apflora.pop."PopHerkunft" <> 300
  AND apflora.tpop."TPopHerkunft" <> 300
GROUP BY
  apflora.pop."ApArtId",
  apflora.tpop."TPopId";

DROP VIEW IF EXISTS apflora.v_apber_b2ltpop CASCADE;
CREATE OR REPLACE VIEW apflora.v_apber_b2ltpop AS
SELECT
  apflora.pop."ApArtId",
  apflora.tpop."TPopId"
FROM
  apflora.pop
  INNER JOIN
    (apflora.tpop
    INNER JOIN
      (apflora.tpopber
      INNER JOIN
        apflora._variable
        ON apflora.tpopber.jahr = apflora._variable."JBerJahr")
      ON apflora.tpop."TPopId" = apflora.tpopber.tpop_id)
    ON apflora.pop."PopId" = apflora.tpop."PopId"
WHERE
  apflora.tpopber.entwicklung = 3
  AND apflora.tpop."TPopApBerichtRelevant" = 1
  AND apflora.pop."PopHerkunft" <> 300
  AND apflora.tpop."TPopHerkunft" <> 300
GROUP BY
  apflora.pop."ApArtId",
  apflora.tpop."TPopId";

DROP VIEW IF EXISTS apflora.v_apber_b3ltpop CASCADE;
CREATE OR REPLACE VIEW apflora.v_apber_b3ltpop AS
SELECT
  apflora.pop."ApArtId",
  apflora.tpop."TPopId"
FROM
  apflora.pop
  INNER JOIN
    (apflora.tpop
    INNER JOIN
      (apflora.tpopber
      INNER JOIN
        apflora._variable
        ON apflora.tpopber.jahr = apflora._variable."JBerJahr")
      ON apflora.tpop."TPopId" = apflora.tpopber.tpop_id)
    ON apflora.pop."PopId" = apflora.tpop."PopId"
WHERE
  apflora.tpopber.entwicklung = 2
  AND apflora.tpop."TPopApBerichtRelevant" = 1
  AND apflora.pop."PopHerkunft" <> 300
  AND apflora.tpop."TPopHerkunft" <> 300
GROUP BY
  apflora.pop."ApArtId",
  apflora.tpop."TPopId";

DROP VIEW IF EXISTS apflora.v_apber_b4ltpop CASCADE;
CREATE OR REPLACE VIEW apflora.v_apber_b4ltpop AS
SELECT
  apflora.pop."ApArtId",
  apflora.tpop."TPopId"
FROM
  apflora.pop
  INNER JOIN
    (apflora.tpop
    INNER JOIN
      (apflora.tpopber
      INNER JOIN
        apflora._variable
        ON apflora.tpopber.jahr = apflora._variable."JBerJahr")
      ON apflora.tpop."TPopId" = apflora.tpopber.tpop_id)
    ON apflora.pop."PopId" = apflora.tpop."PopId"
WHERE
  apflora.tpopber.entwicklung = 1
  AND apflora.tpop."TPopApBerichtRelevant" = 1
  AND apflora.pop."PopHerkunft" <> 300
  AND apflora.tpop."TPopHerkunft" <> 300
GROUP BY
  apflora.pop."ApArtId",
  apflora.tpop."TPopId";

DROP VIEW IF EXISTS apflora.v_apber_b5ltpop CASCADE;
CREATE OR REPLACE VIEW apflora.v_apber_b5ltpop AS
SELECT
  apflora.pop."ApArtId",
  apflora.tpop."TPopId"
FROM
  apflora.pop
  INNER JOIN
    (apflora.tpop
    INNER JOIN
      (apflora.tpopber
      INNER JOIN
        apflora._variable
        ON apflora.tpopber.jahr = apflora._variable."JBerJahr")
      ON apflora.tpop."TPopId" = apflora.tpopber.tpop_id)
    ON apflora.pop."PopId" = apflora.tpop."PopId"
WHERE
  apflora.tpopber.entwicklung = 4
  AND apflora.tpop."TPopApBerichtRelevant" = 1
  AND apflora.pop."PopHerkunft" <> 300
  AND apflora.tpop."TPopHerkunft" <> 300
GROUP BY
  apflora.pop."ApArtId",
  apflora.tpop."TPopId";

DROP VIEW IF EXISTS apflora.v_apber_b6ltpop CASCADE;
CREATE OR REPLACE VIEW apflora.v_apber_b6ltpop AS
SELECT
  apflora.pop."ApArtId",
  apflora.tpop."TPopId"
FROM
  apflora.pop
  INNER JOIN
    (apflora.tpop
    INNER JOIN
      (apflora.tpopber
      INNER JOIN
        apflora._variable
        ON apflora.tpopber.jahr = apflora._variable."JBerJahr")
      ON apflora.tpop."TPopId" = apflora.tpopber.tpop_id)
    ON apflora.pop."PopId" = apflora.tpop."PopId"
WHERE
  apflora.tpopber.entwicklung = 8
  AND apflora.tpop."TPopApBerichtRelevant" = 1
  AND apflora.pop."PopHerkunft" <> 300
  AND apflora.tpop."TPopHerkunft" <> 300
GROUP BY
  apflora.pop."ApArtId",
  apflora.tpop."TPopId";

DROP VIEW IF EXISTS apflora.v_apber_b7ltpop CASCADE;
CREATE OR REPLACE VIEW apflora.v_apber_b7ltpop AS
SELECT
  apflora.pop."ApArtId",
  apflora.tpop."TPopId"
FROM
  apflora.pop
  INNER JOIN
    apflora.tpop
    ON apflora.pop."PopId" = apflora.tpop."PopId"
WHERE
  apflora.tpop."TPopApBerichtRelevant" = 1
  AND apflora.pop."PopHerkunft" <> 300
  AND apflora.tpop."TPopHerkunft" <> 300
GROUP BY
  apflora.pop."ApArtId",
  apflora.tpop."TPopId";

DROP VIEW IF EXISTS apflora.v_apber_c1lpop CASCADE;
CREATE OR REPLACE VIEW apflora.v_apber_c1lpop AS
SELECT
  apflora.pop."ApArtId",
  apflora.pop."PopId"
FROM
  (apflora.pop
  INNER JOIN
    apflora.tpop
    ON apflora.pop."PopId" = apflora.tpop."PopId")
  INNER JOIN
    (apflora.tpopmassn
    INNER JOIN
      apflora._variable
      ON apflora.tpopmassn.jahr = apflora._variable."JBerJahr")
    ON apflora.tpop."TPopId" = apflora.tpopmassn.tpop_id
WHERE
  apflora.tpop."TPopApBerichtRelevant" = 1
  AND apflora.pop."PopHerkunft" <> 300
GROUP BY
  apflora.pop."ApArtId",
  apflora.pop."PopId";

DROP VIEW IF EXISTS apflora.v_apber_c1ltpop CASCADE;
CREATE OR REPLACE VIEW apflora.v_apber_c1ltpop AS
SELECT
  apflora.pop."ApArtId",
  apflora.tpop."TPopId"
FROM
  ((apflora.pop
  INNER JOIN
    apflora.tpop
    ON apflora.pop."PopId" = apflora.tpop."PopId")
  INNER JOIN
    apflora.tpopmassn
    ON apflora.tpop."TPopId" = apflora.tpopmassn.tpop_id)
  INNER JOIN
    apflora._variable
    ON apflora.tpopmassn.jahr = apflora._variable."JBerJahr"
WHERE
  apflora.tpop."TPopApBerichtRelevant" = 1
  AND apflora.pop."PopHerkunft" <> 300
  AND apflora.tpop."TPopHerkunft" <> 300
GROUP BY
  apflora.pop."ApArtId",
  apflora.tpop."TPopId";

-- wird das benutz??
DROP VIEW IF EXISTS apflora.v_auswanzprotpopangezartbestjahr0 CASCADE;
CREATE OR REPLACE VIEW apflora.v_auswanzprotpopangezartbestjahr0 AS
SELECT
  apflora.ap."ApArtId",
  apflora.pop."PopId",
  apflora.tpop."TPopId",
  apflora.tpopkontr."TPopKontrId",
  apflora.adb_eigenschaften."Artname",
  apflora.pop."PopNr",
  apflora.pop."PopName",
  apflora.pop_status_werte."HerkunftTxt" AS "PopHerkunft",
  apflora.tpop."TPopNr",
  apflora.tpop."TPopGemeinde",
  apflora.tpop."TPopFlurname",
  "domPopHerkunft_1"."HerkunftTxt" AS "TPopHerkunft",
  apflora.tpopkontr."TPopKontrTyp",
  apflora.tpopkontr."TPopKontrJahr",
  apflora.tpopkontr."TPopKontrDatum",
  apflora.adresse."AdrName" AS "TPopKontrBearb",
  apflora.tpopkontrzaehl.anzahl,
  apflora.tpopkontrzaehl_einheit_werte.text AS einheit,
  apflora.tpopkontrzaehl_methode_werte.text AS methode,
  apflora.tpopkontr."TPopKontrJungpfl",
  apflora.tpopkontr."TPopKontrVitalitaet",
  apflora.tpopkontr."TPopKontrUeberleb",
  apflora.tpop_entwicklung_werte."EntwicklungTxt" AS "TPopKontrEntwicklung",
  apflora.tpopkontr."TPopKontrUrsach",
  apflora.tpopkontr."TPopKontrUrteil",
  apflora.tpopkontr."TPopKontrAendUms",
  apflora.tpopkontr."TPopKontrAendKontr",
  apflora.tpopkontr."TPopKontrTxt",
  apflora.tpopkontr."TPopKontrLeb",
  apflora.tpopkontr."TPopKontrFlaeche",
  apflora.tpopkontr."TPopKontrLebUmg",
  apflora.tpopkontr."TPopKontrStrauchschicht",
  apflora.tpopkontr."TPopKontrBodenTyp",
  apflora.tpopkontr."TPopKontrBodenAbtrag",
  apflora.tpopkontr."TPopKontrWasserhaushalt",
  apflora.tpopkontr."TPopKontrHandlungsbedarf",
  apflora.tpopkontr."TPopKontrUebFlaeche",
  apflora.tpopkontr."TPopKontrPlan",
  apflora.tpopkontr."TPopKontrVeg",
  apflora.tpopkontr."TPopKontrNaBo",
  apflora.tpopkontr."TPopKontrUebPfl",
  apflora.tpopkontr."TPopKontrJungPflJN",
  apflora.tpopkontr."TPopKontrVegHoeMax",
  apflora.tpopkontr."TPopKontrVegHoeMit",
  apflora.tpopkontr."TPopKontrGefaehrdung",
  apflora.tpopkontr."TPopKontrMutDat"
FROM
  (((((((apflora.adb_eigenschaften
  INNER JOIN
    (((apflora.ap
    INNER JOIN
      apflora.pop
      ON apflora.ap."ApArtId" = apflora.pop."ApArtId")
    INNER JOIN
      apflora.tpop
      ON apflora.pop."PopId" = apflora.tpop."PopId")
    INNER JOIN
      apflora.tpopkontr
      ON apflora.tpop."TPopId" = apflora.tpopkontr."TPopId")
    ON apflora.adb_eigenschaften."TaxonomieId" = apflora.ap."ApArtId")
  LEFT JOIN
    apflora.pop_status_werte
    ON apflora.pop."PopHerkunft" = apflora.pop_status_werte."HerkunftId")
  LEFT JOIN
    apflora.pop_status_werte AS "domPopHerkunft_1"
    ON apflora.tpop."TPopHerkunft" = "domPopHerkunft_1"."HerkunftId")
  LEFT JOIN
    apflora.adresse
    ON apflora.tpopkontr."TPopKontrBearb" = apflora.adresse."AdrId")
  LEFT JOIN
    apflora.tpop_entwicklung_werte
    ON apflora.tpopkontr."TPopKontrEntwicklung" = apflora.tpop_entwicklung_werte."EntwicklungCode")
  INNER JOIN
    apflora.tpopkontrzaehl
    ON apflora.tpopkontr."TPopKontrId" = apflora.tpopkontrzaehl.tpopkontr_id)
  INNER JOIN
    apflora.tpopkontrzaehl_methode_werte
    ON apflora.tpopkontrzaehl.methode = apflora.tpopkontrzaehl_methode_werte.code)
  LEFT JOIN
    apflora.tpopkontrzaehl_einheit_werte
    ON apflora.tpopkontrzaehl.einheit = apflora.tpopkontrzaehl_einheit_werte.code;

DROP VIEW IF EXISTS apflora.v_popber_angezapbestjahr0 CASCADE;
CREATE OR REPLACE VIEW apflora.v_popber_angezapbestjahr0 AS
SELECT
  apflora.ap."ApArtId",
  apflora.pop."PopId",
  apflora.popber."PopBerId",
  apflora.adb_eigenschaften."Artname",
  apflora.pop."PopNr",
  apflora.pop."PopName",
  pop_status_werte."HerkunftTxt" AS "PopHerkunft",
  apflora.popber."PopBerJahr",
  pop_entwicklung_werte."EntwicklungTxt" AS "PopBerEntwicklung",
  apflora.popber."PopBerTxt"
FROM
  ((apflora.adb_eigenschaften
  INNER JOIN
    ((apflora.ap
    INNER JOIN
      apflora.pop
      ON apflora.ap."ApArtId" = apflora.pop."ApArtId")
    INNER JOIN
      apflora.popber
      ON apflora.pop."PopId" = apflora.popber."PopId")
    ON apflora.adb_eigenschaften."TaxonomieId" = apflora.ap."ApArtId")
  LEFT JOIN
    apflora.pop_status_werte
    ON apflora.pop."PopHerkunft" = pop_status_werte."HerkunftId")
  LEFT JOIN
    apflora.pop_entwicklung_werte
    ON apflora.popber."PopBerEntwicklung" = pop_entwicklung_werte."EntwicklungId";

DROP VIEW IF EXISTS apflora.v_ziel CASCADE;
CREATE OR REPLACE VIEW apflora.v_ziel AS
SELECT
  apflora.ap."ApArtId" AS "AP Id",
  apflora.adb_eigenschaften."Artname" AS "AP Art",
  apflora.ap_bearbstand_werte."DomainTxt" AS "AP Status",
  apflora.ap."ApJahr" AS "AP Start im Jahr",
  apflora.ap_umsetzung_werte."DomainTxt" AS "AP Stand Umsetzung",
  apflora.adresse."AdrName" AS "AP verantwortlich",
  apflora.ziel."ZielId" AS "Ziel Id",
  apflora.ziel."ApArtId" AS "Ziel ApId",
  apflora.ziel."ZielJahr" AS "Ziel Jahr",
  ziel_typ_werte."ZieltypTxt" AS "Ziel Typ",
  apflora.ziel."ZielBezeichnung" AS "Ziel Beschreibung"
FROM
  (((((apflora.adb_eigenschaften
  RIGHT JOIN
    apflora.ap
    ON apflora.adb_eigenschaften."TaxonomieId" = apflora.ap."ApArtId")
  LEFT JOIN
    apflora.ap_bearbstand_werte
    ON apflora.ap."ApStatus" = apflora.ap_bearbstand_werte."DomainCode")
  LEFT JOIN
    apflora.ap_umsetzung_werte
    ON apflora.ap."ApUmsetzung" = apflora.ap_umsetzung_werte."DomainCode")
  LEFT JOIN
    apflora.adresse
    ON apflora.ap."ApBearb" = apflora.adresse."AdrId")
  RIGHT JOIN
    apflora.ziel
    ON apflora.ap."ApArtId" = apflora.ziel."ApArtId")
  LEFT JOIN
    apflora.ziel_typ_werte
    ON apflora.ziel."ZielTyp" = ziel_typ_werte."ZieltypId"
WHERE
  apflora.ziel."ZielTyp" IN (1, 2, 1170775556)
ORDER BY
  apflora.adb_eigenschaften."Artname",
  apflora.ziel."ZielJahr",
  ziel_typ_werte."ZieltypTxt",
  apflora.ziel."ZielTyp";

DROP VIEW IF EXISTS apflora.v_ziel_verwaist CASCADE;
CREATE OR REPLACE VIEW apflora.v_ziel_verwaist AS
SELECT
  apflora.ap."ApArtId" AS "AP Id",
  apflora.ziel."ZielId" AS "Ziel Id",
  apflora.ziel."ApArtId" AS "Ziel ApId",
  apflora.ziel."ZielJahr" AS "Ziel Jahr",
  ziel_typ_werte."ZieltypTxt" AS "Ziel Typ",
  apflora.ziel."ZielBezeichnung" AS "Ziel Beschreibung"
FROM
  (((((apflora.adb_eigenschaften
  RIGHT JOIN
    apflora.ap
    ON apflora.adb_eigenschaften."TaxonomieId" = apflora.ap."ApArtId")
  LEFT JOIN
    apflora.ap_bearbstand_werte
    ON apflora.ap."ApStatus" = apflora.ap_bearbstand_werte."DomainCode")
  LEFT JOIN
    apflora.ap_umsetzung_werte
    ON apflora.ap."ApUmsetzung" = apflora.ap_umsetzung_werte."DomainCode")
  LEFT JOIN
    apflora.adresse
    ON apflora.ap."ApBearb" = apflora.adresse."AdrId")
  RIGHT JOIN
    apflora.ziel
    ON apflora.ap."ApArtId" = apflora.ziel."ApArtId")
  LEFT JOIN
    apflora.ziel_typ_werte
    ON apflora.ziel."ZielTyp" = ziel_typ_werte."ZieltypId"
WHERE
  apflora.ap."ApArtId" IS NULL
ORDER BY
  apflora.ziel."ZielJahr",
  ziel_typ_werte."ZieltypTxt",
  apflora.ziel."ZielTyp";

DROP VIEW IF EXISTS apflora.v_zielber CASCADE;
CREATE OR REPLACE VIEW apflora.v_zielber AS
SELECT
  apflora.ap."ApArtId" AS "AP Id",
  apflora.adb_eigenschaften."Artname" AS "AP Art",
  apflora.ap_bearbstand_werte."DomainTxt" AS "AP Status",
  apflora.ap."ApJahr" AS "AP Start im Jahr",
  apflora.ap_umsetzung_werte."DomainTxt" AS "AP Stand Umsetzung",
  apflora.adresse."AdrName" AS "AP verantwortlich",
  apflora.ziel."ZielId" AS "Ziel Id",
  apflora.ziel."ZielJahr" AS "Ziel Jahr",
  ziel_typ_werte."ZieltypTxt" AS "Ziel Typ",
  apflora.ziel."ZielBezeichnung" AS "Ziel Beschreibung",
  apflora.zielber.id AS "ZielBer Id",
  apflora.zielber.id AS "ZielBer ZielId",
  apflora.zielber.jahr AS "ZielBer Jahr",
  apflora.zielber.erreichung AS "ZielBer Erreichung",
  apflora.zielber.bemerkungen AS "ZielBer Bemerkungen",
  apflora.zielber.changed AS "ZielBer MutWann",
  apflora.zielber.changed_by AS "ZielBer MutWer"
FROM
  ((((((apflora.adb_eigenschaften
  RIGHT JOIN
    apflora.ap
    ON apflora.adb_eigenschaften."TaxonomieId" = apflora.ap."ApArtId")
  LEFT JOIN
    apflora.ap_bearbstand_werte
    ON apflora.ap."ApStatus" = apflora.ap_bearbstand_werte."DomainCode")
  LEFT JOIN
    apflora.ap_umsetzung_werte
    ON apflora.ap."ApUmsetzung" = apflora.ap_umsetzung_werte."DomainCode")
  LEFT JOIN
    apflora.adresse
    ON apflora.ap."ApBearb" = apflora.adresse."AdrId")
  RIGHT JOIN
    apflora.ziel
    ON apflora.ap."ApArtId" = apflora.ziel."ApArtId")
  LEFT JOIN
    apflora.ziel_typ_werte
    ON apflora.ziel."ZielTyp" = ziel_typ_werte."ZieltypId")
  RIGHT JOIN
    apflora.zielber
    ON apflora.ziel."ZielId" = apflora.zielber.ziel_id
ORDER BY
  apflora.adb_eigenschaften."Artname",
  apflora.ziel."ZielJahr",
  ziel_typ_werte."ZieltypTxt",
  apflora.ziel."ZielTyp",
  apflora.zielber.jahr;

DROP VIEW IF EXISTS apflora.v_zielber_verwaist CASCADE;
CREATE OR REPLACE VIEW apflora.v_zielber_verwaist AS
SELECT
  apflora.ap."ApArtId" AS "AP Id",
  apflora.ziel."ZielId" AS "Ziel Id",
  apflora.zielber.id AS "ZielBer Id",
  apflora.zielber.id AS "ZielBer ZielId",
  apflora.zielber.jahr AS "ZielBer Jahr",
  apflora.zielber.erreichung AS "ZielBer Erreichung",
  apflora.zielber.bemerkungen AS "ZielBer Bemerkungen",
  apflora.zielber.changed AS "ZielBer MutWann",
  apflora.zielber.changed_by AS "ZielBer MutWer"
FROM
  ((((((apflora.adb_eigenschaften
  RIGHT JOIN
    apflora.ap
    ON apflora.adb_eigenschaften."TaxonomieId" = apflora.ap."ApArtId")
  LEFT JOIN
    apflora.ap_bearbstand_werte
    ON apflora.ap."ApStatus" = apflora.ap_bearbstand_werte."DomainCode")
  LEFT JOIN
    apflora.ap_umsetzung_werte
    ON apflora.ap."ApUmsetzung" = apflora.ap_umsetzung_werte."DomainCode")
  LEFT JOIN
    apflora.adresse
    ON apflora.ap."ApBearb" = apflora.adresse."AdrId")
  RIGHT JOIN
    apflora.ziel
    ON apflora.ap."ApArtId" = apflora.ziel."ApArtId")
  LEFT JOIN
    apflora.ziel_typ_werte
    ON apflora.ziel."ZielTyp" = ziel_typ_werte."ZieltypId")
  RIGHT JOIN
    apflora.zielber
    ON apflora.ziel."ZielId" = apflora.zielber.ziel_id
WHERE
  apflora.ziel."ZielId" IS NULL
ORDER BY
  apflora.ziel."ZielTyp",
  apflora.zielber.jahr;

DROP VIEW IF EXISTS apflora.v_bertpopfuerangezeigteap0 CASCADE;
CREATE OR REPLACE VIEW apflora.v_bertpopfuerangezeigteap0 AS
SELECT
  apflora.ap."ApArtId",
  apflora.pop."PopId",
  apflora.tpop."TPopId",
  apflora.adb_eigenschaften."Artname",
  apflora.ap_bearbstand_werte."DomainTxt" AS "ApStatus",
  apflora.ap."ApJahr",
  apflora.ap_umsetzung_werte."DomainTxt" AS "ApUmsetzung",
  apflora.pop."PopNr",
  apflora.pop."PopName",
  pop_status_werte."HerkunftTxt" AS "PopHerkunft",
  apflora.pop."PopBekanntSeit",
  apflora.tpop."TPopNr",
  apflora.tpop."TPopGemeinde",
  apflora.tpop."TPopFlurname",
  apflora.tpop."TPopXKoord",
  apflora.tpop."TPopYKoord",
  apflora.tpop."TPopBekanntSeit",
  "domPopHerkunft_1"."HerkunftTxt" AS "TPopHerkunft",
  apflora.tpop."TPopApBerichtRelevant"
FROM
  ((((apflora.adb_eigenschaften
  INNER JOIN
    ((apflora.ap
    INNER JOIN
      apflora.pop
      ON apflora.ap."ApArtId" = apflora.pop."ApArtId")
    INNER JOIN
      apflora.tpop
      ON apflora.pop."PopId" = apflora.tpop."PopId")
    ON apflora.adb_eigenschaften."TaxonomieId" = apflora.ap."ApArtId")
  LEFT JOIN
    apflora.ap_bearbstand_werte
    ON apflora.ap."ApStatus" = apflora.ap_bearbstand_werte."DomainCode")
  LEFT JOIN
    apflora.ap_umsetzung_werte
    ON apflora.ap."ApUmsetzung" = apflora.ap_umsetzung_werte."DomainCode")
  LEFT JOIN
    apflora.pop_status_werte
    ON apflora.pop."PopHerkunft" = pop_status_werte."HerkunftId")
  LEFT JOIN
    apflora.pop_status_werte
    AS "domPopHerkunft_1" ON apflora.tpop."TPopHerkunft" = "domPopHerkunft_1"."HerkunftId";

DROP VIEW IF EXISTS apflora.v_tpopkontr CASCADE;
CREATE OR REPLACE VIEW apflora.v_tpopkontr AS
SELECT
  apflora.adb_eigenschaften."TaxonomieId" AS "ApArtId",
  apflora.adb_eigenschaften."Familie",
  apflora.adb_eigenschaften."Artname" AS "AP Art",
  apflora.ap_bearbstand_werte."DomainTxt" AS "AP Status",
  apflora.ap."ApJahr" AS "AP Start im Jahr",
  apflora.ap_umsetzung_werte."DomainTxt" AS "AP Stand Umsetzung",
  "tblAdresse_1"."AdrName" AS "AP verantwortlich",
  apflora.pop."PopId",
  apflora.pop."PopGuid" AS "Pop Guid",
  apflora.pop."PopNr" AS "Pop Nr",
  apflora.pop."PopName" AS "Pop Name",
  apflora.pop_status_werte."HerkunftTxt" AS "Pop Herkunft",
  apflora.pop."PopBekanntSeit" AS "Pop bekannt seit",
  apflora.tpop."TPopId" AS "TPop ID",
  apflora.tpop."TPopGuid" AS "TPop Guid",
  apflora.tpop."TPopNr" AS "TPop Nr",
  apflora.tpop."TPopGemeinde" AS "TPop Gemeinde",
  apflora.tpop."TPopFlurname" AS "TPop Flurname",
  "domPopHerkunft_1"."HerkunftTxt" AS "TPop Status",
  apflora.tpop."TPopBekanntSeit" AS "TPop bekannt seit",
  apflora.tpop."TPopHerkunftUnklar" AS "TPop Status unklar",
  apflora.tpop."TPopHerkunftUnklarBegruendung" AS "TPop Begruendung fuer unklaren Status",
  apflora.tpop."TPopXKoord" AS "TPop X-Koordinaten",
  apflora.tpop."TPopYKoord" AS "TPop Y-Koordinaten",
  apflora.tpop."TPopRadius" AS "TPop Radius m",
  apflora.tpop."TPopHoehe" AS "TPop Hoehe",
  apflora.tpop."TPopExposition" AS "TPop Exposition",
  apflora.tpop."TPopKlima" AS "TPop Klima",
  apflora.tpop."TPopNeigung" AS "TPop Hangneigung",
  apflora.tpop."TPopBeschr" AS "TPop Beschreibung",
  apflora.tpop."TPopKatNr" AS "TPop Kataster-Nr",
  apflora.tpop."TPopApBerichtRelevant" AS "TPop fuer AP-Bericht relevant",
  apflora.tpop."TPopEigen" AS "TPop EigentuemerIn",
  apflora.tpop."TPopKontakt" AS "TPop Kontakt vor Ort",
  apflora.tpop."TPopNutzungszone" AS "TPop Nutzungszone",
  apflora.tpop."TPopBewirtschafterIn" AS "TPop BewirtschafterIn",
  apflora.tpop."TPopBewirtschaftung" AS "TPop Bewirtschaftung",
  apflora.tpopkontr."TPopKontrId",
  apflora.tpopkontr."TPopId",
  apflora.tpopkontr."TPopKontrGuid" AS "Kontr Guid",
  apflora.tpopkontr."TPopKontrJahr" AS "Kontr Jahr",
  apflora.tpopkontr."TPopKontrDatum" AS "Kontr Datum",
  apflora.tpopkontr_typ_werte."DomainTxt" AS "Kontr Typ",
  apflora.adresse."AdrName" AS "Kontr BearbeiterIn",
  apflora.tpopkontr."TPopKontrUeberleb" AS "Kontr Ueberlebensrate",
  apflora.tpopkontr."TPopKontrVitalitaet" AS "Kontr Vitalitaet",
  apflora.pop_entwicklung_werte."EntwicklungTxt" AS "Kontr Entwicklung",
  apflora.tpopkontr."TPopKontrUrsach" AS "Kontr Ursachen",
  apflora.tpopkontr."TPopKontrUrteil" AS "Kontr Erfolgsbeurteilung",
  apflora.tpopkontr."TPopKontrAendUms" AS "Kontr Aenderungs-Vorschlaege Umsetzung",
  apflora.tpopkontr."TPopKontrAendKontr" AS "Kontr Aenderungs-Vorschlaege Kontrolle",
  apflora.tpop."TPopXKoord" AS "Kontr X-Koord",
  apflora.tpop."TPopYKoord" AS "Kontr Y-Koord",
  apflora.tpopkontr."TPopKontrTxt" AS "Kontr Bemerkungen",
  apflora.tpopkontr."TPopKontrLeb" AS "Kontr Lebensraum Delarze",
  apflora.tpopkontr."TPopKontrLebUmg" AS "Kontr angrenzender Lebensraum Delarze",
  apflora.tpopkontr."TPopKontrVegTyp" AS "Kontr Vegetationstyp",
  apflora.tpopkontr."TPopKontrKonkurrenz" AS "Kontr Konkurrenz",
  apflora.tpopkontr."TPopKontrMoosschicht" AS "Kontr Moosschicht",
  apflora.tpopkontr."TPopKontrKrautschicht" AS "Kontr Krautschicht",
  apflora.tpopkontr."TPopKontrStrauchschicht" AS "Kontr Strauchschicht",
  apflora.tpopkontr."TPopKontrBaumschicht" AS "Kontr Baumschicht",
  apflora.tpopkontr."TPopKontrBodenTyp" AS "Kontr Bodentyp",
  apflora.tpopkontr."TPopKontrBodenKalkgehalt" AS "Kontr Boden Kalkgehalt",
  apflora.tpopkontr."TPopKontrBodenDurchlaessigkeit" AS "Kontr Boden Durchlaessigkeit",
  apflora.tpopkontr."TPopKontrBodenHumus" AS "Kontr Boden Humusgehalt",
  apflora.tpopkontr."TPopKontrBodenNaehrstoffgehalt" AS "Kontr Boden Naehrstoffgehalt",
  apflora.tpopkontr."TPopKontrBodenAbtrag" AS "Kontr Oberbodenabtrag",
  apflora.tpopkontr."TPopKontrWasserhaushalt" AS "Kontr Wasserhaushalt",
  apflora.tpopkontr_idbiotuebereinst_werte."DomainTxt" AS "Kontr Uebereinstimmung mit Idealbiotop",
  apflora.tpopkontr."TPopKontrHandlungsbedarf" AS "Kontr Handlungsbedarf",
  apflora.tpopkontr."TPopKontrUebFlaeche" AS "Kontr Ueberpruefte Flaeche",
  apflora.tpopkontr."TPopKontrFlaeche" AS "Kontr Flaeche der Teilpopulation m2",
  apflora.tpopkontr."TPopKontrPlan" AS "Kontr auf Plan eingezeichnet",
  apflora.tpopkontr."TPopKontrVeg" AS "Kontr Deckung durch Vegetation",
  apflora.tpopkontr."TPopKontrNaBo" AS "Kontr Deckung nackter Boden",
  apflora.tpopkontr."TPopKontrUebPfl" AS "Kontr Deckung durch ueberpruefte Art",
  apflora.tpopkontr."TPopKontrJungPflJN" AS "Kontr auch junge Pflanzen",
  apflora.tpopkontr."TPopKontrVegHoeMax" AS "Kontr maximale Veg-hoehe cm",
  apflora.tpopkontr."TPopKontrVegHoeMit" AS "Kontr mittlere Veg-hoehe cm",
  apflora.tpopkontr."TPopKontrGefaehrdung" AS "Kontr Gefaehrdung",
  apflora.tpopkontr."MutWann" AS "Kontrolle zuletzt geaendert",
  apflora.tpopkontr."MutWer" AS "Kontrolle zuletzt geaendert von",
  array_to_string(array_agg(apflora.tpopkontrzaehl.anzahl), ', ') AS "Zaehlungen Anzahlen",
  string_agg(apflora.tpopkontrzaehl_einheit_werte.text, ', ') AS "Zaehlungen Einheiten",
  string_agg(apflora.tpopkontrzaehl_methode_werte.text, ', ') AS "Zaehlungen Methoden"
FROM
  apflora.pop_status_werte AS "domPopHerkunft_1"
  RIGHT JOIN
    (((((((apflora.adb_eigenschaften
    INNER JOIN
      apflora.ap
      ON apflora.adb_eigenschaften."TaxonomieId" = apflora.ap."ApArtId")
    INNER JOIN
      (apflora.pop
      INNER JOIN
        (apflora.tpop
        INNER JOIN
          ((((((apflora.tpopkontr
          LEFT JOIN
            apflora.tpopkontr_typ_werte
            ON apflora.tpopkontr."TPopKontrTyp" = apflora.tpopkontr_typ_werte."DomainTxt")
          LEFT JOIN
            apflora.adresse
            ON apflora.tpopkontr."TPopKontrBearb" = apflora.adresse."AdrId")
          LEFT JOIN
            apflora.pop_entwicklung_werte
            ON apflora.tpopkontr."TPopKontrEntwicklung" = apflora.pop_entwicklung_werte."EntwicklungId")
          LEFT JOIN
            apflora.tpopkontrzaehl
            ON apflora.tpopkontr."TPopKontrId" = apflora.tpopkontrzaehl.tpopkontr_id)
          LEFT JOIN
            apflora.tpopkontrzaehl_einheit_werte
            ON apflora.tpopkontrzaehl.einheit = apflora.tpopkontrzaehl_einheit_werte.code)
          LEFT JOIN
            apflora.tpopkontrzaehl_methode_werte
            ON apflora.tpopkontrzaehl.methode = apflora.tpopkontrzaehl_methode_werte.code)
          ON apflora.tpop."TPopId" = apflora.tpopkontr."TPopId")
        ON apflora.pop."PopId" = apflora.tpop."PopId")
      ON apflora.ap."ApArtId" = apflora.pop."ApArtId")
    LEFT JOIN
      apflora.ap_bearbstand_werte
      ON apflora.ap."ApStatus" = apflora.ap_bearbstand_werte."DomainCode")
    LEFT JOIN
      apflora.ap_umsetzung_werte
      ON apflora.ap."ApUmsetzung" = apflora.ap_umsetzung_werte."DomainCode")
    LEFT JOIN
      apflora.pop_status_werte
      ON apflora.pop."PopHerkunft" = apflora.pop_status_werte."HerkunftId")
    LEFT JOIN
      apflora.tpopkontr_idbiotuebereinst_werte
      ON apflora.tpopkontr."TPopKontrIdealBiotopUebereinst" = apflora.tpopkontr_idbiotuebereinst_werte."DomainCode")
  LEFT JOIN
    apflora.adresse AS "tblAdresse_1"
    ON apflora.ap."ApBearb" = "tblAdresse_1"."AdrId")
  ON "domPopHerkunft_1"."HerkunftId" = apflora.tpop."TPopHerkunft"
WHERE
  apflora.adb_eigenschaften."TaxonomieId" > 150
GROUP BY
  apflora.adb_eigenschaften."TaxonomieId",
  apflora.adb_eigenschaften."Familie",
  apflora.adb_eigenschaften."Artname",
  apflora.ap_bearbstand_werte."DomainTxt",
  apflora.ap."ApJahr",
  apflora.ap_umsetzung_werte."DomainTxt",
  "tblAdresse_1"."AdrName",
  apflora.pop."PopId",
  apflora.pop."PopGuid",
  apflora.pop."PopNr",
  apflora.pop."PopName",
  apflora.pop_status_werte."HerkunftTxt",
  apflora.pop."PopBekanntSeit",
  apflora.tpop."TPopId",
  apflora.tpop."TPopGuid",
  apflora.tpop."TPopNr",
  apflora.tpop."TPopGemeinde",
  apflora.tpop."TPopFlurname",
  "domPopHerkunft_1"."HerkunftTxt",
  apflora.tpop."TPopBekanntSeit",
  apflora.tpop."TPopHerkunftUnklar",
  apflora.tpop."TPopHerkunftUnklarBegruendung",
  apflora.tpop."TPopXKoord",
  apflora.tpop."TPopYKoord",
  apflora.tpop."TPopRadius",
  apflora.tpop."TPopHoehe",
  apflora.tpop."TPopExposition",
  apflora.tpop."TPopKlima",
  apflora.tpop."TPopNeigung",
  apflora.tpop."TPopBeschr",
  apflora.tpop."TPopKatNr",
  apflora.tpop."TPopApBerichtRelevant",
  apflora.tpop."TPopEigen",
  apflora.tpop."TPopKontakt",
  apflora.tpop."TPopNutzungszone",
  apflora.tpop."TPopBewirtschafterIn",
  apflora.tpop."TPopBewirtschaftung",
  apflora.tpopkontr."TPopKontrId",
  apflora.tpopkontr."TPopId",
  apflora.tpopkontr."TPopKontrGuid",
  apflora.tpopkontr."TPopKontrJahr",
  apflora.tpopkontr."TPopKontrDatum",
  apflora.tpopkontr_typ_werte."DomainTxt",
  apflora.adresse."AdrName",
  apflora.tpopkontr."TPopKontrUeberleb",
  apflora.tpopkontr."TPopKontrVitalitaet",
  apflora.pop_entwicklung_werte."EntwicklungTxt",
  apflora.tpopkontr."TPopKontrUrsach",
  apflora.tpopkontr."TPopKontrUrteil",
  apflora.tpopkontr."TPopKontrAendUms",
  apflora.tpopkontr."TPopKontrAendKontr",
  apflora.tpop."TPopXKoord",
  apflora.tpop."TPopYKoord",
  apflora.tpopkontr."TPopKontrTxt",
  apflora.tpopkontr."TPopKontrLeb",
  apflora.tpopkontr."TPopKontrLebUmg",
  apflora.tpopkontr."TPopKontrVegTyp",
  apflora.tpopkontr."TPopKontrKonkurrenz",
  apflora.tpopkontr."TPopKontrMoosschicht",
  apflora.tpopkontr."TPopKontrKrautschicht",
  apflora.tpopkontr."TPopKontrStrauchschicht",
  apflora.tpopkontr."TPopKontrBaumschicht",
  apflora.tpopkontr."TPopKontrBodenTyp",
  apflora.tpopkontr."TPopKontrBodenKalkgehalt",
  apflora.tpopkontr."TPopKontrBodenDurchlaessigkeit",
  apflora.tpopkontr."TPopKontrBodenHumus",
  apflora.tpopkontr."TPopKontrBodenNaehrstoffgehalt",
  apflora.tpopkontr."TPopKontrBodenAbtrag",
  apflora.tpopkontr."TPopKontrWasserhaushalt",
  apflora.tpopkontr_idbiotuebereinst_werte."DomainTxt",
  apflora.tpopkontr."TPopKontrHandlungsbedarf",
  apflora.tpopkontr."TPopKontrUebFlaeche",
  apflora.tpopkontr."TPopKontrFlaeche",
  apflora.tpopkontr."TPopKontrPlan",
  apflora.tpopkontr."TPopKontrVeg",
  apflora.tpopkontr."TPopKontrNaBo",
  apflora.tpopkontr."TPopKontrUebPfl",
  apflora.tpopkontr."TPopKontrJungPflJN",
  apflora.tpopkontr."TPopKontrVegHoeMax",
  apflora.tpopkontr."TPopKontrVegHoeMit",
  apflora.tpopkontr."TPopKontrGefaehrdung",
  apflora.tpopkontr."MutWann",
  apflora.tpopkontr."MutWer"
ORDER BY
  apflora.adb_eigenschaften."Artname",
  apflora.pop."PopNr",
  apflora.tpop."TPopNr";

DROP VIEW IF EXISTS apflora.v_tpopkontr_webgisbun CASCADE;
CREATE OR REPLACE VIEW apflora.v_tpopkontr_webgisbun AS
SELECT
  apflora.adb_eigenschaften."TaxonomieId" AS "APARTID",
  apflora.adb_eigenschaften."Artname" AS "APART",
  apflora.pop."PopGuid" AS "POPGUID",
  apflora.pop."PopNr" AS "POPNR",
  apflora.tpop."TPopGuid" AS "TPOPGUID",
  apflora.tpop."TPopNr" AS "TPOPNR",
  apflora.tpopkontr."TPopKontrId" AS "TPOPKONTRID",
  apflora.tpopkontr."TPopKontrGuid" AS "KONTRGUID",
  apflora.tpopkontr."TPopKontrJahr" AS "KONTRJAHR",
  --TODO: convert?
  apflora.tpopkontr."TPopKontrDatum" AS "KONTRDAT",
  apflora.tpopkontr_typ_werte."DomainTxt" AS "KONTRTYP",
  apflora.adresse."AdrName" AS "KONTRBEARBEITER",
  apflora.tpopkontr."TPopKontrUeberleb" AS "KONTRUEBERLEBENSRATE",
  apflora.tpopkontr."TPopKontrVitalitaet" AS "KONTRVITALITAET",
  apflora.pop_entwicklung_werte."EntwicklungTxt" AS "KONTRENTWICKLUNG",
  apflora.tpopkontr."TPopKontrUrsach" AS "KONTRURSACHEN",
  apflora.tpopkontr."TPopKontrUrteil" AS "KONTRERFOLGBEURTEIL",
  apflora.tpopkontr."TPopKontrAendUms" AS "KONTRAENDUMSETZUNG",
  apflora.tpopkontr."TPopKontrAendKontr" AS "KONTRAENDKONTROLLE",
  apflora.tpop."TPopXKoord" AS "KONTR_X",
  apflora.tpop."TPopYKoord" AS "KONTR_Y",
  apflora.tpopkontr."TPopKontrTxt" AS "KONTRBEMERKUNGEN",
  apflora.tpopkontr."TPopKontrLeb" AS "KONTRLRMDELARZE",
  apflora.tpopkontr."TPopKontrLebUmg" AS "KONTRDELARZEANGRENZ",
  apflora.tpopkontr."TPopKontrVegTyp" AS "KONTRVEGTYP",
  apflora.tpopkontr."TPopKontrKonkurrenz" AS "KONTRKONKURRENZ",
  apflora.tpopkontr."TPopKontrMoosschicht" AS "KONTRMOOSE",
  apflora.tpopkontr."TPopKontrKrautschicht" AS "KONTRKRAUTSCHICHT",
  apflora.tpopkontr."TPopKontrStrauchschicht" AS "KONTRSTRAUCHSCHICHT",
  apflora.tpopkontr."TPopKontrBaumschicht" AS "KONTRBAUMSCHICHT",
  apflora.tpopkontr."TPopKontrBodenTyp" AS "KONTRBODENTYP",
  apflora.tpopkontr."TPopKontrBodenKalkgehalt" AS "KONTRBODENKALK",
  apflora.tpopkontr."TPopKontrBodenDurchlaessigkeit" AS "KONTRBODENDURCHLAESSIGK",
  apflora.tpopkontr."TPopKontrBodenHumus" AS "KONTRBODENHUMUS",
  apflora.tpopkontr."TPopKontrBodenNaehrstoffgehalt" AS "KONTRBODENNAEHRSTOFF",
  apflora.tpopkontr."TPopKontrBodenAbtrag" AS "KONTROBERBODENABTRAG",
  apflora.tpopkontr."TPopKontrWasserhaushalt" AS "KONTROBODENWASSERHAUSHALT",
  apflora.tpopkontr_idbiotuebereinst_werte."DomainTxt" AS "KONTRUEBEREINSTIMMUNIDEAL",
  apflora.tpopkontr."TPopKontrHandlungsbedarf" AS "KONTRHANDLUNGSBEDARF",
  apflora.tpopkontr."TPopKontrUebFlaeche" AS "KONTRUEBERPRUFTFLAECHE",
  apflora.tpopkontr."TPopKontrFlaeche" AS "KONTRFLAECHETPOP",
  apflora.tpopkontr."TPopKontrPlan" AS "KONTRAUFPLAN",
  apflora.tpopkontr."TPopKontrVeg" AS "KONTRDECKUNGVEG",
  apflora.tpopkontr."TPopKontrNaBo" AS "KONTRDECKUNGBODEN",
  apflora.tpopkontr."TPopKontrUebPfl" AS "KONTRDECKUNGART",
  apflora.tpopkontr."TPopKontrJungPflJN" AS "KONTRJUNGEPLANZEN",
  apflora.tpopkontr."TPopKontrVegHoeMax" AS "KONTRMAXHOEHEVEG",
  apflora.tpopkontr."TPopKontrVegHoeMit" AS "KONTRMITTELHOEHEVEG",
  apflora.tpopkontr."TPopKontrGefaehrdung" AS "KONTRGEFAEHRDUNG",
  -- TODO: convert
  apflora.tpopkontr."MutWann" AS "KONTRCHANGEDAT",
  apflora.tpopkontr."MutWer" AS "KONTRCHANGEBY",
  string_agg(apflora.tpopkontrzaehl_einheit_werte.text, ', ') AS "ZAEHLEINHEITEN",
  array_to_string(array_agg(apflora.tpopkontrzaehl.anzahl), ', ') AS "ANZAHLEN",
  string_agg(apflora.tpopkontrzaehl_methode_werte.text, ', ') AS "METHODEN"
FROM
  apflora.pop_status_werte AS "domPopHerkunft_1"
  RIGHT JOIN
    (((((((apflora.adb_eigenschaften
    INNER JOIN
      apflora.ap
      ON apflora.adb_eigenschaften."TaxonomieId" = apflora.ap."ApArtId")
    INNER JOIN
      (apflora.pop
      INNER JOIN
        (apflora.tpop
        INNER JOIN
          ((((((apflora.tpopkontr
          LEFT JOIN
            apflora.tpopkontr_typ_werte
            ON apflora.tpopkontr."TPopKontrTyp" = apflora.tpopkontr_typ_werte."DomainTxt")
          LEFT JOIN
            apflora.adresse
            ON apflora.tpopkontr."TPopKontrBearb" = apflora.adresse."AdrId")
          LEFT JOIN
            apflora.pop_entwicklung_werte
            ON apflora.tpopkontr."TPopKontrEntwicklung" = apflora.pop_entwicklung_werte."EntwicklungId")
          LEFT JOIN
            apflora.tpopkontrzaehl
            ON apflora.tpopkontr."TPopKontrId" = apflora.tpopkontrzaehl.tpopkontr_id)
          LEFT JOIN
            apflora.tpopkontrzaehl_einheit_werte
            ON apflora.tpopkontrzaehl.einheit = apflora.tpopkontrzaehl_einheit_werte.code)
          LEFT JOIN
            apflora.tpopkontrzaehl_methode_werte
            ON apflora.tpopkontrzaehl.methode = apflora.tpopkontrzaehl_methode_werte.code)
          ON apflora.tpop."TPopId" = apflora.tpopkontr."TPopId")
        ON apflora.pop."PopId" = apflora.tpop."PopId")
      ON apflora.ap."ApArtId" = apflora.pop."ApArtId")
    LEFT JOIN
      apflora.ap_bearbstand_werte
      ON apflora.ap."ApStatus" = apflora.ap_bearbstand_werte."DomainCode")
    LEFT JOIN
      apflora.ap_umsetzung_werte
      ON apflora.ap."ApUmsetzung" = apflora.ap_umsetzung_werte."DomainCode")
    LEFT JOIN
      apflora.pop_status_werte
      ON apflora.pop."PopHerkunft" = apflora.pop_status_werte."HerkunftId")
    LEFT JOIN
      apflora.tpopkontr_idbiotuebereinst_werte
      ON apflora.tpopkontr."TPopKontrIdealBiotopUebereinst" = apflora.tpopkontr_idbiotuebereinst_werte."DomainCode")
  LEFT JOIN
    apflora.adresse AS "tblAdresse_1"
    ON apflora.ap."ApBearb" = "tblAdresse_1"."AdrId")
  ON "domPopHerkunft_1"."HerkunftId" = apflora.tpop."TPopHerkunft"
WHERE
  apflora.adb_eigenschaften."TaxonomieId" > 150
GROUP BY
  apflora.adb_eigenschaften."TaxonomieId",
  apflora.adb_eigenschaften."Artname",
  apflora.pop."PopGuid",
  apflora.pop."PopNr",
  apflora.tpop."TPopId",
  apflora.tpop."TPopGuid",
  apflora.tpop."TPopNr",
  apflora.tpopkontr."TPopKontrId",
  apflora.tpopkontr."TPopId",
  apflora.tpopkontr."TPopKontrGuid",
  apflora.tpopkontr."TPopKontrJahr",
  apflora.tpopkontr."TPopKontrDatum",
  apflora.tpopkontr_typ_werte."DomainTxt",
  apflora.adresse."AdrName",
  apflora.tpopkontr."TPopKontrUeberleb",
  apflora.tpopkontr."TPopKontrVitalitaet",
  apflora.pop_entwicklung_werte."EntwicklungTxt",
  apflora.tpopkontr."TPopKontrUrsach",
  apflora.tpopkontr."TPopKontrUrteil",
  apflora.tpopkontr."TPopKontrAendUms",
  apflora.tpopkontr."TPopKontrAendKontr",
  apflora.tpop."TPopXKoord",
  apflora.tpop."TPopYKoord",
  apflora.tpopkontr."TPopKontrTxt",
  apflora.tpopkontr."TPopKontrLeb",
  apflora.tpopkontr."TPopKontrLebUmg",
  apflora.tpopkontr."TPopKontrVegTyp",
  apflora.tpopkontr."TPopKontrKonkurrenz",
  apflora.tpopkontr."TPopKontrMoosschicht",
  apflora.tpopkontr."TPopKontrKrautschicht",
  apflora.tpopkontr."TPopKontrStrauchschicht",
  apflora.tpopkontr."TPopKontrBaumschicht",
  apflora.tpopkontr."TPopKontrBodenTyp",
  apflora.tpopkontr."TPopKontrBodenKalkgehalt",
  apflora.tpopkontr."TPopKontrBodenDurchlaessigkeit",
  apflora.tpopkontr."TPopKontrBodenHumus",
  apflora.tpopkontr."TPopKontrBodenNaehrstoffgehalt",
  apflora.tpopkontr."TPopKontrBodenAbtrag",
  apflora.tpopkontr."TPopKontrWasserhaushalt",
  apflora.tpopkontr_idbiotuebereinst_werte."DomainTxt",
  apflora.tpopkontr."TPopKontrHandlungsbedarf",
  apflora.tpopkontr."TPopKontrUebFlaeche",
  apflora.tpopkontr."TPopKontrFlaeche",
  apflora.tpopkontr."TPopKontrPlan",
  apflora.tpopkontr."TPopKontrVeg",
  apflora.tpopkontr."TPopKontrNaBo",
  apflora.tpopkontr."TPopKontrUebPfl",
  apflora.tpopkontr."TPopKontrJungPflJN",
  apflora.tpopkontr."TPopKontrVegHoeMax",
  apflora.tpopkontr."TPopKontrVegHoeMit",
  apflora.tpopkontr."TPopKontrGefaehrdung",
  apflora.tpopkontr."MutWann",
  apflora.tpopkontr."MutWer"
ORDER BY
  apflora.adb_eigenschaften."Artname",
  apflora.pop."PopNr",
  apflora.tpop."TPopNr";

DROP VIEW IF EXISTS apflora.v_tpopkontr_letztesjahr CASCADE;
CREATE OR REPLACE VIEW apflora.v_tpopkontr_letztesjahr AS
SELECT
  apflora.tpop."TPopId",
  max(apflora.tpopkontr."TPopKontrJahr") AS "MaxTPopKontrJahr",
  count(apflora.tpopkontr."TPopKontrId") AS "AnzTPopKontr"
FROM
  apflora.tpop
  LEFT JOIN
    apflora.tpopkontr
    ON apflora.tpop."TPopId" = apflora.tpopkontr."TPopId"
WHERE
  (
    apflora.tpopkontr."TPopKontrTyp" NOT IN ('Ziel', 'Zwischenziel')
    AND apflora.tpopkontr."TPopKontrJahr" IS NOT NULL
  )
  OR (
    apflora.tpopkontr."TPopKontrTyp" IS NULL
    AND apflora.tpopkontr."TPopKontrJahr" IS NULL
  )
GROUP BY
  apflora.tpop."TPopId";

DROP VIEW IF EXISTS apflora.v_tpopkontr_letzteid CASCADE;
CREATE OR REPLACE VIEW apflora.v_tpopkontr_letzteid AS
SELECT
  apflora.v_tpopkontr_letztesjahr."TPopId",
  max(apflora.tpopkontr."TPopKontrId") AS "MaxTPopKontrId",
  max(apflora.v_tpopkontr_letztesjahr."AnzTPopKontr") AS "AnzTPopKontr"
FROM
  apflora.tpopkontr
  INNER JOIN
    apflora.v_tpopkontr_letztesjahr
    ON
      (apflora.v_tpopkontr_letztesjahr."MaxTPopKontrJahr" = apflora.tpopkontr."TPopKontrJahr")
      AND (apflora.tpopkontr."TPopId" = apflora.v_tpopkontr_letztesjahr."TPopId")
GROUP BY
  apflora.v_tpopkontr_letztesjahr."TPopId";

DROP VIEW IF EXISTS apflora.v_tpop_letzteKontrId CASCADE;
CREATE OR REPLACE VIEW apflora.v_tpop_letzteKontrId AS
SELECT
  apflora.tpop."TPopId",
  apflora.v_tpopkontr_letzteid."MaxTPopKontrId",
  apflora.v_tpopkontr_letzteid."AnzTPopKontr"
FROM
  apflora.tpop
  LEFT JOIN
    apflora.v_tpopkontr_letzteid
    ON apflora.tpop."TPopId" = apflora.v_tpopkontr_letzteid."TPopId";

DROP VIEW IF EXISTS apflora.v_tpopber_letzteid CASCADE;
CREATE OR REPLACE VIEW apflora.v_tpopber_letzteid AS
SELECT
  apflora.tpopkontr."TPopId",
  (
    select id
    from apflora.tpopber
    where tpop_id = apflora.tpopkontr."TPopId"
    order by changed desc
    limit 1
  ) AS "MaxTPopBerId",
  max(apflora.tpopber.jahr) AS "MaxTPopBerJahr",
  count(apflora.tpopber.id) AS "AnzTPopBer"
FROM
  apflora.tpopkontr
  INNER JOIN
    apflora.tpopber
    ON apflora.tpopkontr."TPopId" = apflora.tpopber.tpop_id
WHERE
  apflora.tpopkontr."TPopKontrTyp" NOT IN ('Ziel', 'Zwischenziel')
  AND apflora.tpopber.jahr IS NOT NULL
GROUP BY
  apflora.tpopkontr."TPopId";

DROP VIEW IF EXISTS apflora.v_tpopkontr_fuergis_write CASCADE;
CREATE OR REPLACE VIEW apflora.v_tpopkontr_fuergis_write AS
SELECT
  apflora.tpopkontr."TPopKontrId" AS tpopkontrid,
  apflora.tpopkontr."TPopId" AS tpopid,
  CAST(apflora.tpopkontr."TPopKontrGuid" AS varchar(50)) AS tpopkontrguid,
  apflora.tpopkontr."TPopKontrTyp" AS tpopkontrtyp,
  apflora.tpopkontr."TPopKontrJahr" AS tpopkontrjahr,
  apflora.tpopkontr."TPopKontrDatum"::timestamp AS tpopkontrdatum,
  apflora.tpopkontr."TPopKontrBearb" AS tpopkontrbearb,
  apflora.tpopkontr."TPopKontrJungpfl" AS tpopkontrjungpfl,
  apflora.tpopkontr."TPopKontrUeberleb" AS tpopkontrueberleb,
  apflora.tpopkontr."TPopKontrEntwicklung" AS tpopkontrentwicklung,
  apflora.tpopkontr."TPopKontrVitalitaet" AS tpopkontrvitalitaet,
  apflora.tpopkontr."TPopKontrUrsach" AS tpopkontrursach,
  apflora.tpopkontr."TPopKontrUrteil" AS tpopkontrurteil,
  apflora.tpopkontr."TPopKontrAendUms" AS tpopkontraendums,
  apflora.tpopkontr."TPopKontrAendKontr" AS tpopkontraendkontr,
  apflora.tpopkontr."TPopKontrLeb" AS tpopkontrleb,
  apflora.tpopkontr."TPopKontrFlaeche" AS tpopkontrflaeche,
  apflora.tpopkontr."TPopKontrLebUmg" AS tpopkontrlebumg,
  apflora.tpopkontr."TPopKontrVegTyp" AS tpopkontrvegtyp,
  apflora.tpopkontr."TPopKontrKonkurrenz" AS tpopkontrkonkurrenz,
  apflora.tpopkontr."TPopKontrMoosschicht" AS tpopkontrmoosschicht,
  apflora.tpopkontr."TPopKontrKrautschicht" AS tpopkontrkrautschicht,
  apflora.tpopkontr."TPopKontrStrauchschicht" AS tpopkontrstrauchschicht,
  apflora.tpopkontr."TPopKontrBaumschicht" AS tpopkontrbaumschicht,
  apflora.tpopkontr."TPopKontrBodenTyp" AS tpopkontrbodentyp,
  apflora.tpopkontr."TPopKontrBodenKalkgehalt" AS tpopkontrbodenkalkgehalt,
  apflora.tpopkontr."TPopKontrBodenDurchlaessigkeit" AS tpopkontrbodendurchlaessigkeit,
  apflora.tpopkontr."TPopKontrBodenHumus" AS tpopkontrbodenhumus,
  apflora.tpopkontr."TPopKontrBodenNaehrstoffgehalt" AS tpopkontrbodennaehrstoffgehalt,
  apflora.tpopkontr."TPopKontrBodenAbtrag" AS tpopkontrbodenabtrag,
  apflora.tpopkontr."TPopKontrWasserhaushalt" AS tpopkontrwasserhaushalt,
  apflora.tpopkontr."TPopKontrIdealBiotopUebereinst" AS tpopkontridealbiotopuebereinst,
  apflora.tpopkontr."TPopKontrUebFlaeche" AS tpopkontruebflaeche,
  apflora.tpopkontr."TPopKontrPlan" AS tpopkontrplan,
  apflora.tpopkontr."TPopKontrVeg" AS tpopkontrveg,
  apflora.tpopkontr."TPopKontrNaBo" AS tpopkontrnabo,
  apflora.tpopkontr."TPopKontrUebPfl" AS tpopkontruebpfl,
  apflora.tpopkontr."TPopKontrJungPflJN" AS tpopkontrjungpfljn,
  apflora.tpopkontr."TPopKontrVegHoeMax" AS tpopkontrveghoemax,
  apflora.tpopkontr."TPopKontrVegHoeMit" AS tpopkontrveghoemit,
  apflora.tpopkontr."TPopKontrGefaehrdung" AS tpopkontrgefaehrdung,
  apflora.tpopkontr."TPopKontrTxt" AS tpopkontrtxt,
  apflora.tpopkontr."MutWann"::timestamp AS mutwann,
  apflora.tpopkontr."MutWer" AS mutwer
FROM
  apflora.tpopkontr;

DROP VIEW IF EXISTS apflora.v_tpopkontr_fuergis_read CASCADE;
CREATE OR REPLACE VIEW apflora.v_tpopkontr_fuergis_read AS
SELECT
  apflora.ap."ApArtId" AS apartid,
  apflora.adb_eigenschaften."Artname" AS artname,
  apflora.ap_bearbstand_werte."DomainTxt" AS apherkunft,
  apflora.ap."ApJahr" AS apjahr,
  apflora.ap_umsetzung_werte."DomainTxt" AS apumsetzung,
  CAST(apflora.pop."PopGuid" AS varchar(50)) AS popguid,
  apflora.pop."PopNr" AS popnr,
  apflora.pop."PopName" AS popname,
  apflora.pop_status_werte."HerkunftTxt" AS popherkunft,
  apflora.pop."PopBekanntSeit" AS popbekanntseit,
  CAST(apflora.tpop."TPopGuid" AS varchar(50)) AS tpopguid,
  apflora.tpop."TPopNr" AS tpopnr,
  apflora.tpop."TPopGemeinde" AS tpopgemeinde,
  apflora.tpop."TPopFlurname" AS tpopflurname,
  apflora.tpop."TPopXKoord" AS tpopxkoord,
  apflora.tpop."TPopYKoord" AS tpopykoord,
  apflora.tpop."TPopBekanntSeit" AS tpopbekanntseit,
  CAST(apflora.tpopkontr."TPopKontrGuid" AS varchar(50)) AS tpopkontrguid,
  apflora.tpopkontr."TPopKontrJahr" AS tpopkontrjahr,
  apflora.tpopkontr."TPopKontrDatum"::timestamp AS tpopkontrdatum,
  apflora.tpopkontr_typ_werte."DomainTxt" AS tpopkontrtyp,
  apflora.adresse."AdrName" AS tpopkontrbearb,
  apflora.tpopkontr."TPopKontrUeberleb" AS tpopkontrueberleb,
  apflora.tpopkontr."TPopKontrVitalitaet" AS tpopkontrvitalitaet,
  apflora.pop_entwicklung_werte."EntwicklungTxt" AS tpopkontrentwicklung,
  apflora.tpopkontr."TPopKontrUrsach" AS tpopkontrursach,
  apflora.tpopkontr."TPopKontrUrteil" AS tpopkontrurteil,
  apflora.tpopkontr."TPopKontrAendUms" AS tpopkontraendums,
  apflora.tpopkontr."TPopKontrAendKontr" AS tpopkontraendkontr,
  apflora.tpopkontr."TPopKontrLeb" AS tpopkontrleb,
  apflora.tpopkontr."TPopKontrFlaeche" AS tpopkontrflaeche,
  apflora.tpopkontr."TPopKontrLebUmg" AS tpopkontrlebumg,
  apflora.tpopkontr."TPopKontrVegTyp" AS tpopkontrvegtyp,
  apflora.tpopkontr."TPopKontrKonkurrenz" AS tpopkontrkonkurrenz,
  apflora.tpopkontr."TPopKontrMoosschicht" AS tpopkontrmoosschicht,
  apflora.tpopkontr."TPopKontrKrautschicht" AS tpopkontrkrautschicht,
  apflora.tpopkontr."TPopKontrStrauchschicht" AS tpopkontrstrauchschicht,
  apflora.tpopkontr."TPopKontrBaumschicht" AS tpopkontrbaumschicht,
  apflora.tpopkontr."TPopKontrBodenTyp" AS tpopkontrbodentyp,
  apflora.tpopkontr."TPopKontrBodenKalkgehalt" AS tpopkontrbodenkalkgehalt,
  apflora.tpopkontr."TPopKontrBodenDurchlaessigkeit" AS tpopkontrbodendurchlaessigkeit,
  apflora.tpopkontr."TPopKontrBodenHumus" AS tpopkontrbodenhumus,
  apflora.tpopkontr."TPopKontrBodenNaehrstoffgehalt" AS tpopkontrbodennaehrstoffgehalt,
  apflora.tpopkontr."TPopKontrBodenAbtrag" AS tpopkontrbodenabtrag,
  apflora.tpopkontr."TPopKontrWasserhaushalt" AS tpopkontrwasserhaushalt,
  apflora.tpopkontr_idbiotuebereinst_werte."DomainTxt" AS tpopkontridealbiotopuebereinst,
  apflora.tpopkontr."TPopKontrUebFlaeche" AS tpopkontruebflaeche,
  apflora.tpopkontr."TPopKontrPlan" AS tpopkontrplan,
  apflora.tpopkontr."TPopKontrVeg" AS tpopkontrveg,
  apflora.tpopkontr."TPopKontrNaBo" AS tpopkontrnabo,
  apflora.tpopkontr."TPopKontrUebPfl" AS tpopkontruebpfl,
  apflora.tpopkontr."TPopKontrJungPflJN" AS tpopkontrjungpfljn,
  apflora.tpopkontr."TPopKontrVegHoeMax" AS tpopkontrveghoemax,
  apflora.tpopkontr."TPopKontrVegHoeMit" AS tpopkontrveghoemit,
  apflora.tpopkontr."TPopKontrGefaehrdung" AS tpopkontrgefaehrdung,
  apflora.tpopkontr."MutWann"::timestamp AS mutwann,
  apflora.tpopkontr."MutWer" AS mutwer
FROM
  (((((apflora.adb_eigenschaften
  INNER JOIN
    apflora.ap
    ON apflora.adb_eigenschaften."TaxonomieId" = apflora.ap."ApArtId")
  INNER JOIN
    (apflora.pop
    INNER JOIN
      (apflora.tpop
      INNER JOIN
        (((apflora.tpopkontr
        LEFT JOIN
          apflora.tpopkontr_typ_werte
          ON apflora.tpopkontr."TPopKontrTyp" = apflora.tpopkontr_typ_werte."DomainTxt")
        LEFT JOIN
          apflora.adresse
          ON apflora.tpopkontr."TPopKontrBearb" = apflora.adresse."AdrId")
        LEFT JOIN
          apflora.pop_entwicklung_werte
          ON apflora.tpopkontr."TPopKontrEntwicklung" = apflora.pop_entwicklung_werte."EntwicklungId")
        ON apflora.tpop."TPopId" = apflora.tpopkontr."TPopId")
      ON apflora.pop."PopId" = apflora.tpop."PopId")
    ON apflora.ap."ApArtId" = apflora.pop."ApArtId")
  LEFT JOIN
    apflora.ap_bearbstand_werte
    ON apflora.ap."ApStatus" = apflora.ap_bearbstand_werte."DomainCode")
  LEFT JOIN
    apflora.ap_umsetzung_werte
    ON apflora.ap."ApUmsetzung" = apflora.ap_umsetzung_werte."DomainCode")
  LEFT JOIN
    apflora.pop_status_werte
    ON apflora.pop."PopHerkunft" = apflora.pop_status_werte."HerkunftId")
  LEFT JOIN
    apflora.tpopkontr_idbiotuebereinst_werte
    ON apflora.tpopkontr."TPopKontrIdealBiotopUebereinst" = apflora.tpopkontr_idbiotuebereinst_werte."DomainCode"
ORDER BY
  apflora.adb_eigenschaften."Artname",
  apflora.pop."PopNr",
  apflora.tpop."TPopNr",
  apflora.tpopkontr."TPopKontrJahr",
  apflora.tpopkontr."TPopKontrDatum";


DROP VIEW IF EXISTS apflora.v_tpopkontr_verwaist CASCADE;
CREATE OR REPLACE VIEW apflora.v_tpopkontr_verwaist AS
SELECT
  apflora.tpopkontr."TPopKontrGuid" AS "Kontr Guid",
  apflora.tpopkontr."TPopKontrJahr" AS "Kontr Jahr",
  apflora.tpopkontr."TPopKontrDatum" AS "Kontr Datum",
  apflora.tpopkontr_typ_werte."DomainTxt" AS "Kontr Typ",
  apflora.adresse."AdrName" AS "Kontr BearbeiterIn",
  apflora.tpopkontr."TPopKontrUeberleb" AS "Kontr Ueberlebensrate",
  apflora.tpopkontr."TPopKontrVitalitaet" AS "Kontr Vitalitaet",
  apflora.pop_entwicklung_werte."EntwicklungTxt" AS "Kontr Entwicklung",
  apflora.tpopkontr."TPopKontrUrsach" AS "Kontr Ursachen",
  apflora.tpopkontr."TPopKontrUrteil" AS "Kontr Erfolgsbeurteilung",
  apflora.tpopkontr."TPopKontrAendUms" AS "Kontr Aenderungs-Vorschlaege Umsetzung",
  apflora.tpopkontr."TPopKontrAendKontr" AS "Kontr Aenderungs-Vorschlaege Kontrolle",
  apflora.tpop."TPopXKoord" AS "Kontr X-Koord",
  apflora.tpop."TPopYKoord" AS "Kontr Y-Koord",
  apflora.tpopkontr."TPopKontrTxt" AS "Kontr Bemerkungen",
  apflora.tpopkontr."TPopKontrLeb" AS "Kontr Lebensraum Delarze",
  apflora.tpopkontr."TPopKontrLebUmg" AS "Kontr angrenzender Lebensraum Delarze",
  apflora.tpopkontr."TPopKontrVegTyp" AS "Kontr Vegetationstyp",
  apflora.tpopkontr."TPopKontrKonkurrenz" AS "Kontr Konkurrenz",
  apflora.tpopkontr."TPopKontrMoosschicht" AS "Kontr Moosschicht",
  apflora.tpopkontr."TPopKontrKrautschicht" AS "Kontr Krautschicht",
  apflora.tpopkontr."TPopKontrStrauchschicht" AS "Kontr Strauchschicht",
  apflora.tpopkontr."TPopKontrBaumschicht" AS "Kontr Baumschicht",
  apflora.tpopkontr."TPopKontrBodenTyp" AS "Kontr Bodentyp",
  apflora.tpopkontr."TPopKontrBodenKalkgehalt" AS "Kontr Boden Kalkgehalt",
  apflora.tpopkontr."TPopKontrBodenDurchlaessigkeit" AS "Kontr Boden Durchlaessigkeit",
  apflora.tpopkontr."TPopKontrBodenHumus" AS "Kontr Boden Humusgehalt",
  apflora.tpopkontr."TPopKontrBodenNaehrstoffgehalt" AS "Kontr Boden Naehrstoffgehalt",
  apflora.tpopkontr."TPopKontrBodenAbtrag" AS "Kontr Oberbodenabtrag",
  apflora.tpopkontr."TPopKontrWasserhaushalt" AS "Kontr Wasserhaushalt",
  apflora.tpopkontr_idbiotuebereinst_werte."DomainTxt" AS "Kontr Uebereinstimmung mit Idealbiotop",
  apflora.tpopkontr."TPopKontrHandlungsbedarf" AS "Kontr Handlungsbedarf",
  apflora.tpopkontr."TPopKontrUebFlaeche" AS "Kontr Ueberpruefte Flaeche",
  apflora.tpopkontr."TPopKontrFlaeche" AS "Kontr Flaeche der Teilpopulation m2",
  apflora.tpopkontr."TPopKontrPlan" AS "Kontr auf Plan eingezeichnet",
  apflora.tpopkontr."TPopKontrVeg" AS "Kontr Deckung durch Vegetation",
  apflora.tpopkontr."TPopKontrNaBo" AS "Kontr Deckung nackter Boden",
  apflora.tpopkontr."TPopKontrUebPfl" AS "Kontr Deckung durch ueberpruefte Art",
  apflora.tpopkontr."TPopKontrJungPflJN" AS "Kontr auch junge Pflanzen",
  apflora.tpopkontr."TPopKontrVegHoeMax" AS "Kontr maximale Veg-hoehe cm",
  apflora.tpopkontr."TPopKontrVegHoeMit" AS "Kontr mittlere Veg-hoehe cm",
  apflora.tpopkontr."TPopKontrGefaehrdung" AS "Kontr Gefaehrdung",
  apflora.tpopkontr."MutWann" AS "Datensatz zuletzt geaendert",
  apflora.tpopkontr."MutWer" AS "Datensatz zuletzt geaendert von"
FROM
  (apflora.tpop
  RIGHT JOIN
    (((apflora.tpopkontr
    LEFT JOIN
      apflora.tpopkontr_typ_werte
      ON apflora.tpopkontr."TPopKontrTyp" = apflora.tpopkontr_typ_werte."DomainTxt")
    LEFT JOIN
      apflora.adresse
      ON apflora.tpopkontr."TPopKontrBearb" = apflora.adresse."AdrId")
    LEFT JOIN
      apflora.pop_entwicklung_werte
      ON apflora.tpopkontr."TPopKontrEntwicklung" = apflora.pop_entwicklung_werte."EntwicklungId")
    ON apflora.tpop."TPopId" = apflora.tpopkontr."TPopId")
  LEFT JOIN
    apflora.tpopkontr_idbiotuebereinst_werte
    ON apflora.tpopkontr."TPopKontrIdealBiotopUebereinst" = apflora.tpopkontr_idbiotuebereinst_werte."DomainCode"
WHERE
  apflora.tpop."TPopId" IS NULL;

DROP VIEW IF EXISTS apflora.v_beob CASCADE;
CREATE OR REPLACE VIEW apflora.v_beob AS
SELECT
  apflora.beob.id,
  apflora.beob_quelle.name AS "Quelle",
  beob."IdField",
  beob.data->>(SELECT "IdField" FROM apflora.beob WHERE id = beob2.id) AS "OriginalId",
  apflora.beob."ArtId",
  apflora.adb_eigenschaften."Artname",
  apflora.pop."PopId",
  apflora.pop."PopGuid",
  apflora.pop."PopNr",
  apflora.tpop."TPopId",
  apflora.tpop."TPopGuid",
  apflora.tpop."TPopNr",
  apflora.beob."X",
  apflora.beob."Y",
  CASE
    WHEN
      apflora.beob."X" > 0
      AND apflora.tpop."TPopXKoord" > 0
      AND apflora.beob."Y" > 0
      AND apflora.tpop."TPopYKoord" > 0
    THEN
      round(
        sqrt(
          power((apflora.beob."X" - apflora.tpop."TPopXKoord"), 2) +
          power((apflora.beob."Y" - apflora.tpop."TPopYKoord"), 2)
        )
      )
    ELSE
      NULL
  END AS "Distanz zur Teilpopulation (m)",
  apflora.beob."Datum",
  apflora.beob."Autor",
  apflora.tpopbeob.nicht_zuordnen,
  apflora.tpopbeob.bemerkungen,
  apflora.tpopbeob.changed,
  apflora.tpopbeob.changed_by
FROM
  ((((apflora.beob
  INNER JOIN
    apflora.beob AS beob2
    ON beob2.id = beob.id)
  INNER JOIN
    apflora.ap
    ON apflora.ap."ApArtId" = apflora.beob."ArtId")
  INNER JOIN
    apflora.adb_eigenschaften
    ON apflora.beob."ArtId" = apflora.adb_eigenschaften."TaxonomieId")
  INNER JOIN
    apflora.beob_quelle
    ON beob."QuelleId" = beob_quelle.id)
  LEFT JOIN
    apflora.tpopbeob
    LEFT JOIN
      apflora.tpop
      ON apflora.tpop."TPopId" = apflora.tpopbeob.tpop_id
      LEFT JOIN
        apflora.pop
        ON apflora.pop."PopId" = apflora.tpop."PopId"
    ON apflora.tpopbeob.beob_id = apflora.beob.id
WHERE
  apflora.beob."ArtId" > 150
ORDER BY
  apflora.adb_eigenschaften."Artname" ASC,
  apflora.pop."PopNr" ASC,
  apflora.tpop."TPopNr" ASC,
  apflora.beob."Datum" DESC;

DROP VIEW IF EXISTS apflora.v_beob__mit_data CASCADE;
CREATE OR REPLACE VIEW apflora.v_beob__mit_data AS
SELECT
  apflora.beob.id,
  apflora.beob_quelle.name AS "Quelle",
  beob."IdField",
  beob.data->>(SELECT "IdField" FROM apflora.beob WHERE id = beob2.id) AS "OriginalId",
  apflora.beob."ArtId",
  apflora.adb_eigenschaften."Artname",
  apflora.pop."PopId",
  apflora.pop."PopGuid",
  apflora.pop."PopNr",
  apflora.tpop."TPopId",
  apflora.tpop."TPopGuid",
  apflora.tpop."TPopNr",
  apflora.beob."X",
  apflora.beob."Y",
  CASE
    WHEN
      apflora.beob."X" > 0
      AND apflora.tpop."TPopXKoord" > 0
      AND apflora.beob."Y" > 0
      AND apflora.tpop."TPopYKoord" > 0
    THEN
      round(
        sqrt(
          power((apflora.beob."X" - apflora.tpop."TPopXKoord"), 2) +
          power((apflora.beob."Y" - apflora.tpop."TPopYKoord"), 2)
        )
      )
    ELSE
      NULL
  END AS "Distanz zur Teilpopulation (m)",
  apflora.beob."Datum",
  apflora.beob."Autor",
  apflora.tpopbeob.nicht_zuordnen,
  apflora.tpopbeob.bemerkungen,
  apflora.tpopbeob.changed,
  apflora.tpopbeob.changed_by,
  apflora.beob.data AS "Originaldaten"
FROM
  ((((apflora.beob
  INNER JOIN
    apflora.beob AS beob2
    ON beob2.id = beob.id)
  INNER JOIN
    apflora.ap
    ON apflora.ap."ApArtId" = apflora.beob."ArtId")
  INNER JOIN
    apflora.adb_eigenschaften
    ON apflora.beob."ArtId" = apflora.adb_eigenschaften."TaxonomieId")
  INNER JOIN
    apflora.beob_quelle
    ON beob."QuelleId" = beob_quelle.id)
  LEFT JOIN
    apflora.tpopbeob
    LEFT JOIN
      apflora.tpop
      ON apflora.tpop."TPopId" = apflora.tpopbeob.tpop_id
      LEFT JOIN
        apflora.pop
        ON apflora.pop."PopId" = apflora.tpop."PopId"
    ON apflora.tpopbeob.beob_id = apflora.beob.id
WHERE
  apflora.beob."ArtId" > 150
ORDER BY
  apflora.adb_eigenschaften."Artname" ASC,
  apflora.pop."PopNr" ASC,
  apflora.tpop."TPopNr" ASC,
  apflora.beob."Datum" DESC;

DROP VIEW IF EXISTS apflora.v_tpopkontr_maxanzahl CASCADE;
CREATE OR REPLACE VIEW apflora.v_tpopkontr_maxanzahl AS
SELECT
  apflora.tpopkontr."TPopKontrId",
  max(apflora.tpopkontrzaehl.anzahl) AS anzahl
FROM
  apflora.tpopkontr
  INNER JOIN
    apflora.tpopkontrzaehl
    ON apflora.tpopkontr."TPopKontrId" = apflora.tpopkontrzaehl.tpopkontr_id
GROUP BY
  apflora.tpopkontr."TPopKontrId"
ORDER BY
  apflora.tpopkontr."TPopKontrId";

-- v_exportevab_beob is in viewsGenerieren2 because dependant on v_tpopkontr_maxanzahl

DROP VIEW IF EXISTS apflora.v_exportevab_zeit CASCADE;
CREATE OR REPLACE VIEW apflora.v_exportevab_zeit AS
SELECT
  apflora.tpop."TPopGuid" AS "fkOrt",
  apflora.tpopkontr."ZeitGuid" AS "idZeitpunkt",
  CASE
    WHEN apflora.tpopkontr."TPopKontrDatum" IS NOT NULL
    THEN to_char(apflora.tpopkontr."TPopKontrDatum", 'DD.MM.YYYY')
    ELSE
      concat(
        '01.01.',
        apflora.tpopkontr."TPopKontrJahr"
      )
  END AS "Datum",
  CASE
    WHEN apflora.tpopkontr."TPopKontrDatum" IS NOT NULL
    THEN 'T'::varchar(10)
    ELSE 'J'::varchar(10)
  END AS "fkGenauigkeitDatum",
  CASE
    WHEN apflora.tpopkontr."TPopKontrDatum" IS NOT NULL
    THEN 'P'::varchar(10)
    ELSE 'X'::varchar(10)
  END AS "fkGenauigkeitDatumZDSF",
  substring(apflora.tpopkontr."TPopKontrMoosschicht" from 1 for 10) AS "COUV_MOUSSES",
  substring(apflora.tpopkontr."TPopKontrKrautschicht" from 1 for 10) AS "COUV_HERBACEES",
  substring(apflora.tpopkontr."TPopKontrStrauchschicht" from 1 for 10) AS "COUV_BUISSONS",
  substring(apflora.tpopkontr."TPopKontrBaumschicht" from 1 for 10) AS "COUV_ARBRES"
FROM
  apflora.ap
  INNER JOIN
    (apflora.pop
    INNER JOIN
      ((apflora.tpop
      LEFT JOIN
        apflora.pop_status_werte AS "tpopHerkunft"
        ON apflora.tpop."TPopHerkunft" = "tpopHerkunft"."HerkunftId")
      INNER JOIN
        ((apflora.tpopkontr
        INNER JOIN
          apflora.v_tpopkontr_maxanzahl
          ON apflora.v_tpopkontr_maxanzahl."TPopKontrId" = apflora.tpopkontr."TPopKontrId")
        LEFT JOIN
          apflora.adresse
          ON apflora.tpopkontr."TPopKontrBearb" = apflora.adresse."AdrId")
        ON apflora.tpop."TPopId" = apflora.tpopkontr."TPopId")
      ON apflora.pop."PopId" = apflora.tpop."PopId")
    ON apflora.ap."ApArtId" = apflora.pop."ApArtId"
WHERE
  -- keine Testarten
  apflora.ap."ApArtId" > 150
  AND apflora.ap."ApArtId" < 1000000
  -- nur Kontrollen, deren Teilpopulationen Koordinaten besitzen
  AND apflora.tpop."TPopXKoord" IS NOT NULL
  AND apflora.tpop."TPopYKoord" IS NOT NULL
  AND apflora.tpopkontr."TPopKontrTyp" IN ('Ausgangszustand', 'Zwischenbeurteilung', 'Freiwilligen-Erfolgskontrolle')
  -- keine Ansaatversuche
  AND apflora.tpop."TPopHerkunft" <> 201
  -- nur wenn Kontrolljahr existiert
  AND apflora.tpopkontr."TPopKontrJahr" IS NOT NULL
  -- keine Kontrollen aus dem aktuellen Jahr - die wurden ev. noch nicht verifiziert
  AND apflora.tpopkontr."TPopKontrJahr" <> date_part('year', CURRENT_DATE)
  -- nur wenn erfasst ist, seit wann die TPop bekannt ist
  AND apflora.tpop."TPopBekanntSeit" IS NOT NULL
  AND (
    -- die Teilpopulation ist ursprünglich
    apflora.tpop."TPopHerkunft" IN (100, 101)
    -- oder bei Ansiedlungen: die Art war mindestens 5 Jahre vorhanden
    OR (apflora.tpopkontr."TPopKontrJahr" - apflora.tpop."TPopBekanntSeit") > 5
  )
  AND apflora.tpop."TPopFlurname" IS NOT NULL
  AND apflora.ap."ApGuid" IN (Select "idProjekt" FROM apflora.v_exportevab_projekt)
  AND apflora.pop."PopGuid" IN (SELECT "idRaum" FROM apflora.v_exportevab_raum)
  AND apflora.tpop."TPopGuid" IN (SELECT "idOrt" FROM apflora.v_exportevab_ort);

DROP VIEW IF EXISTS apflora.v_exportevab_ort CASCADE;
CREATE OR REPLACE VIEW apflora.v_exportevab_ort AS
SELECT
  -- include TPopGuid to enable later views to include only tpop included here
  apflora.tpop."TPopGuid",
  apflora.pop."PopGuid" AS "fkRaum",
  apflora.tpop."TPopGuid" AS "idOrt",
  substring(
    concat(
      apflora.tpop."TPopFlurname",
      CASE
        WHEN apflora.tpop."TPopNr" IS NOT NULL
        THEN concat(' (Nr. ', apflora.tpop."TPopNr", ')')
        ELSE ''
      END
    ) from 1 for 40
  ) AS "Name",
  to_char(current_date, 'DD.MM.YYYY') AS "Erfassungsdatum",
  '{7C71B8AF-DF3E-4844-A83B-55735F80B993}'::UUID AS "fkAutor",
  substring(max(apflora.evab_typologie."TYPO") from 1 for 9)::varchar(10) AS "fkLebensraumtyp",
  1 AS "fkGenauigkeitLage",
  1 AS "fkGeometryType",
  CASE
    WHEN apflora.tpop."TPopHoehe" IS NOT NULL
    THEN apflora.tpop."TPopHoehe"
    ELSE 0
  END AS "obergrenzeHoehe",
  4 AS "fkGenauigkeitHoehe",
  apflora.tpop."TPopXKoord" AS "X",
  apflora.tpop."TPopYKoord" AS "Y",
  substring(apflora.tpop."TPopGemeinde" from 1 for 25) AS "NOM_COMMUNE",
  substring(apflora.tpop."TPopFlurname" from 1 for 255) AS "DESC_LOCALITE",
  max(apflora.tpopkontr."TPopKontrLebUmg") AS "ENV",
  CASE
    WHEN apflora.tpop."TPopHerkunft" IS NOT NULL
    THEN
      concat(
        'Status: ',
        "tpopHerkunft"."HerkunftTxt",
        CASE
          WHEN apflora.tpop."TPopBekanntSeit" IS NOT NULL
          THEN
            concat(
              '; Bekannt seit: ',
              apflora.tpop."TPopBekanntSeit"
            )
          ELSE ''
        END
      )
    ELSE ''
  END AS "Bemerkungen"
FROM
  apflora.ap
  INNER JOIN
    (apflora.pop
    INNER JOIN
      ((apflora.tpop
      LEFT JOIN
        apflora.pop_status_werte
        AS "tpopHerkunft" ON apflora.tpop."TPopHerkunft" = "tpopHerkunft"."HerkunftId")
      INNER JOIN
        (((apflora.tpopkontr
        INNER JOIN
          apflora.v_tpopkontr_maxanzahl
          ON apflora.v_tpopkontr_maxanzahl."TPopKontrId" = apflora.tpopkontr."TPopKontrId")
        LEFT JOIN
          apflora.adresse
          ON apflora.tpopkontr."TPopKontrBearb" = apflora.adresse."AdrId")
        LEFT JOIN apflora.evab_typologie
          ON apflora.tpopkontr."TPopKontrLeb" = apflora.evab_typologie."TYPO")
        ON apflora.tpop."TPopId" = apflora.tpopkontr."TPopId")
      ON apflora.pop."PopId" = apflora.tpop."PopId")
    ON apflora.ap."ApArtId" = apflora.pop."ApArtId"
WHERE
  -- keine Testarten
  apflora.ap."ApArtId" > 150
  AND apflora.ap."ApArtId" < 1000000
  -- nur Kontrollen, deren Teilpopulationen Koordinaten besitzen
  AND apflora.tpop."TPopXKoord" IS NOT NULL
  AND apflora.tpop."TPopYKoord" IS NOT NULL
  AND apflora.tpopkontr."TPopKontrTyp" IN ('Ausgangszustand', 'Zwischenbeurteilung', 'Freiwilligen-Erfolgskontrolle')
  -- keine Ansaatversuche
  AND apflora.tpop."TPopHerkunft" <> 201
  -- nur wenn Kontrolljahr existiert
  AND apflora.tpopkontr."TPopKontrJahr" IS NOT NULL
  -- keine Kontrollen aus dem aktuellen Jahr - die wurden ev. noch nicht verifiziert
  AND apflora.tpopkontr."TPopKontrJahr" <> date_part('year', CURRENT_DATE)
  -- nur wenn erfasst ist, seit wann die TPop bekannt ist
  AND apflora.tpop."TPopBekanntSeit" IS NOT NULL
  AND (
    -- die Teilpopulation ist ursprünglich
    apflora.tpop."TPopHerkunft" IN (100, 101)
    -- oder bei Ansiedlungen: die Art war mindestens 5 Jahre vorhanden
    OR (apflora.tpopkontr."TPopKontrJahr" - apflora.tpop."TPopBekanntSeit") > 5
  )
  AND apflora.tpop."TPopFlurname" IS NOT NULL
  AND apflora.ap."ApGuid" IN (Select "idProjekt" FROM apflora.v_exportevab_projekt)
  AND apflora.pop."PopGuid" IN (SELECT "idRaum" FROM apflora.v_exportevab_raum)
GROUP BY
  apflora.pop."PopGuid",
  apflora.tpop."TPopGuid",
  apflora.tpop."TPopNr",
  apflora.tpop."TPopBekanntSeit",
  apflora.tpop."TPopFlurname",
  apflora.tpop."TPopHerkunft",
  "tpopHerkunft"."HerkunftTxt",
  apflora.tpop."TPopHoehe",
  apflora.tpop."TPopXKoord",
  apflora.tpop."TPopYKoord",
  apflora.tpop."TPopGemeinde",
  apflora.tpop."TPopFlurname";

DROP VIEW IF EXISTS apflora.v_exportevab_raum CASCADE;
CREATE OR REPLACE VIEW apflora.v_exportevab_raum AS
SELECT
  apflora.ap."ApGuid" AS "fkProjekt",
  apflora.pop."PopGuid" AS "idRaum",
  concat(
    apflora.pop."PopName",
    CASE
      WHEN apflora.pop."PopNr" IS NOT NULL
      THEN concat(' (Nr. ', apflora.pop."PopNr", ')')
      ELSE ''
    END
  ) AS "Name",
  to_char(current_date, 'DD.MM.YYYY') AS "Erfassungsdatum",
  '{7C71B8AF-DF3E-4844-A83B-55735F80B993}'::UUID AS "fkAutor",
  CASE
    WHEN apflora.pop."PopHerkunft" IS NOT NULL
    THEN
      concat(
        'Status: ',
        "popHerkunft"."HerkunftTxt",
        CASE
          WHEN apflora.pop."PopBekanntSeit" IS NOT NULL
          THEN
            concat(
              '; Bekannt seit: ',
              apflora.pop."PopBekanntSeit"
            )
          ELSE ''
        END
      )
    ELSE ''
  END AS "Bemerkungen"
FROM
  apflora.ap
  INNER JOIN
    ((apflora.pop
    LEFT JOIN
      apflora.pop_status_werte AS "popHerkunft"
      ON apflora.pop."PopHerkunft" = "popHerkunft"."HerkunftId")
    INNER JOIN
      (apflora.tpop
      INNER JOIN
        ((apflora.tpopkontr
        INNER JOIN
          apflora.v_tpopkontr_maxanzahl
          ON apflora.v_tpopkontr_maxanzahl."TPopKontrId" = apflora.tpopkontr."TPopKontrId")
        LEFT JOIN
          apflora.adresse
          ON apflora.tpopkontr."TPopKontrBearb" = apflora.adresse."AdrId")
        ON apflora.tpop."TPopId" = apflora.tpopkontr."TPopId")
      ON apflora.pop."PopId" = apflora.tpop."PopId")
    ON apflora.ap."ApArtId" = apflora.pop."ApArtId"
WHERE
  -- keine Testarten
  apflora.ap."ApArtId" > 150
  AND apflora.ap."ApArtId" < 1000000
  -- nur Kontrollen, deren Teilpopulationen Koordinaten besitzen
  AND apflora.tpop."TPopXKoord" IS NOT NULL
  AND apflora.tpop."TPopYKoord" IS NOT NULL
  AND apflora.tpopkontr."TPopKontrTyp" IN ('Ausgangszustand', 'Zwischenbeurteilung', 'Freiwilligen-Erfolgskontrolle')
  -- keine Ansaatversuche
  AND apflora.tpop."TPopHerkunft" <> 201
  -- nur wenn Kontrolljahr existiert
  AND apflora.tpopkontr."TPopKontrJahr" IS NOT NULL
  -- keine Kontrollen aus dem aktuellen Jahr - die wurden ev. noch nicht verifiziert
  AND apflora.tpopkontr."TPopKontrJahr" <> date_part('year', CURRENT_DATE)
  -- nur wenn erfasst ist, seit wann die TPop bekannt ist
  AND apflora.tpop."TPopBekanntSeit" IS NOT NULL
  AND (
    -- die Teilpopulation ist ursprünglich
    apflora.tpop."TPopHerkunft" IN (100, 101)
    -- oder bei Ansiedlungen: die Art war mindestens 5 Jahre vorhanden
    OR (apflora.tpopkontr."TPopKontrJahr" - apflora.tpop."TPopBekanntSeit") > 5
  )
  AND apflora.tpop."TPopFlurname" IS NOT NULL
  -- ensure all idProjekt are contained in higher level
  AND apflora.ap."ApGuid" IN (Select "idProjekt" FROM apflora.v_exportevab_projekt)
GROUP BY
  apflora.ap."ApGuid",
  apflora.pop."PopGuid",
  apflora.pop."PopName",
  apflora.pop."PopNr",
  apflora.pop."PopHerkunft",
  "popHerkunft"."HerkunftTxt",
  apflora.pop."PopBekanntSeit";

DROP VIEW IF EXISTS apflora.v_exportevab_projekt CASCADE;
CREATE OR REPLACE VIEW apflora.v_exportevab_projekt AS
SELECT
  apflora.ap."ApGuid" AS "idProjekt",
  concat('AP Flora ZH: ', apflora.adb_eigenschaften."Artname") AS "Name",
  CASE
    WHEN apflora.ap."ApJahr" IS NOT NULL
    THEN concat('01.01.', apflora.ap."ApJahr")
    ELSE to_char(current_date, 'DD.MM.YYYY')
  END AS "Eroeffnung",
  '{7C71B8AF-DF3E-4844-A83B-55735F80B993}'::UUID AS "fkAutor",
  concat(
    'Aktionsplan: ',
    apflora.ap_bearbstand_werte."DomainTxt",
    CASE
      WHEN apflora.ap."ApJahr" IS NOT NULL
      THEN concat('; Start im Jahr: ', apflora.ap."ApJahr")
      ELSE ''
    END,
    CASE
      WHEN apflora.ap."ApUmsetzung" IS NOT NULL
      THEN concat('; Stand Umsetzung: ', apflora.ap_umsetzung_werte."DomainTxt")
      ELSE ''
    END,
    ''
  ) AS "Bemerkungen"
FROM
  (((apflora.ap
  INNER JOIN
    apflora.ap_bearbstand_werte
    ON apflora.ap."ApStatus" = apflora.ap_bearbstand_werte."DomainCode")
  LEFT JOIN
    apflora.ap_umsetzung_werte
    ON apflora.ap."ApUmsetzung" = apflora.ap_umsetzung_werte."DomainCode")
  INNER JOIN
    apflora.adb_eigenschaften
    ON apflora.ap."ApArtId" = apflora.adb_eigenschaften."TaxonomieId")
  INNER JOIN
    ((apflora.pop
    LEFT JOIN
      apflora.pop_status_werte AS "popHerkunft"
      ON apflora.pop."PopHerkunft" = "popHerkunft"."HerkunftId")
    INNER JOIN
      (apflora.tpop
      INNER JOIN
        ((apflora.tpopkontr
        INNER JOIN
          apflora.v_tpopkontr_maxanzahl
          ON apflora.v_tpopkontr_maxanzahl."TPopKontrId" = apflora.tpopkontr."TPopKontrId")
        LEFT JOIN
          apflora.adresse
          ON apflora.tpopkontr."TPopKontrBearb" = apflora.adresse."AdrId")
        ON apflora.tpop."TPopId" = apflora.tpopkontr."TPopId")
      ON apflora.pop."PopId" = apflora.tpop."PopId")
    ON apflora.ap."ApArtId" = apflora.pop."ApArtId"
WHERE
  -- keine Testarten
  apflora.ap."ApArtId" > 150
  AND apflora.ap."ApArtId" < 1000000
  -- nur Kontrollen, deren Teilpopulationen Koordinaten besitzen
  AND apflora.tpop."TPopXKoord" IS NOT NULL
  AND apflora.tpop."TPopYKoord" IS NOT NULL
  AND apflora.tpopkontr."TPopKontrTyp" IN ('Ausgangszustand', 'Zwischenbeurteilung', 'Freiwilligen-Erfolgskontrolle')
  -- keine Ansaatversuche
  AND apflora.tpop."TPopHerkunft" <> 201
  -- nur wenn Kontrolljahr existiert
  AND apflora.tpopkontr."TPopKontrJahr" IS NOT NULL
  -- keine Kontrollen aus dem aktuellen Jahr - die wurden ev. noch nicht verifiziert
  AND apflora.tpopkontr."TPopKontrJahr" <> date_part('year', CURRENT_DATE)
  -- nur wenn erfasst ist, seit wann die TPop bekannt ist
  AND apflora.tpop."TPopBekanntSeit" IS NOT NULL
  AND (
    -- die Teilpopulation ist ursprünglich
    apflora.tpop."TPopHerkunft" IN (100, 101)
    -- oder bei Ansiedlungen: die Art war mindestens 5 Jahre vorhanden
    OR (apflora.tpopkontr."TPopKontrJahr" - apflora.tpop."TPopBekanntSeit") > 5
  )
  AND apflora.tpop."TPopFlurname" IS NOT NULL
GROUP BY
  apflora.adb_eigenschaften."Artname",
  apflora.ap."ApGuid",
  apflora.ap."ApJahr",
  apflora.ap."ApUmsetzung",
  apflora.ap_bearbstand_werte."DomainTxt",
  apflora.ap_umsetzung_werte."DomainTxt";

DROP VIEW IF EXISTS apflora.v_tpopmassnber CASCADE;
CREATE OR REPLACE VIEW apflora.v_tpopmassnber AS
SELECT
  apflora.adb_eigenschaften."TaxonomieId" AS "ApArtId",
  apflora.adb_eigenschaften."Artname" AS "AP Art",
  apflora.ap_bearbstand_werte."DomainTxt" AS "AP Status",
  apflora.ap."ApJahr" AS "AP Start im Jahr",
  apflora.ap_umsetzung_werte."DomainTxt" AS "AP Stand Umsetzung",
  apflora.pop."PopId",
  apflora.pop."PopGuid" AS "Pop Guid",
  apflora.pop."PopNr" AS "Pop Nr",
  apflora.pop."PopName" AS "Pop Name",
  pop_status_werte."HerkunftTxt" AS "Pop Status",
  apflora.pop."PopBekanntSeit" AS "Pop bekannt seit",
  apflora.pop."PopHerkunftUnklar" AS "Pop Status unklar",
  apflora.pop."PopHerkunftUnklarBegruendung" AS "Pop Begruendung fuer unklaren Status",
  apflora.pop."PopXKoord" AS "Pop X-Koordinaten",
  apflora.pop."PopYKoord" AS "Pop Y-Koordinaten",
  apflora.tpop."TPopId",
  apflora.tpop."TPopId" AS "TPop ID",
  apflora.tpop."TPopGuid" AS "TPop Guid",
  apflora.tpop."TPopNr" AS "TPop Nr",
  apflora.tpop."TPopGemeinde" AS "TPop Gemeinde",
  apflora.tpop."TPopFlurname" AS "TPop Flurname",
  "tpopHerkunft"."HerkunftTxt" AS "TPop Status",
  apflora.tpop."TPopBekanntSeit" AS "TPop bekannt seit",
  apflora.tpop."TPopHerkunftUnklar" AS "TPop Status unklar",
  apflora.tpop."TPopHerkunftUnklarBegruendung" AS "TPop Begruendung fuer unklaren Status",
  apflora.tpop."TPopXKoord" AS "TPop X-Koordinaten",
  apflora.tpop."TPopYKoord" AS "TPop Y-Koordinaten",
  apflora.tpop."TPopRadius" AS "TPop Radius (m)",
  apflora.tpop."TPopHoehe" AS "TPop Hoehe",
  apflora.tpop."TPopExposition" AS "TPop Exposition",
  apflora.tpop."TPopKlima" AS "TPop Klima",
  apflora.tpop."TPopNeigung" AS "TPop Hangneigung",
  apflora.tpop."TPopBeschr" AS "TPop Beschreibung",
  apflora.tpop."TPopKatNr" AS "TPop Kataster-Nr",
  apflora.tpop."TPopApBerichtRelevant" AS "TPop fuer AP-Bericht relevant",
  apflora.tpop."TPopEigen" AS "TPop EigentuemerIn",
  apflora.tpop."TPopKontakt" AS "TPop Kontakt vor Ort",
  apflora.tpop."TPopNutzungszone" AS "TPop Nutzungszone",
  apflora.tpop."TPopBewirtschafterIn" AS "TPop BewirtschafterIn",
  apflora.tpop."TPopBewirtschaftung" AS "TPop Bewirtschaftung",
  apflora.tpopmassnber.id AS "TPopMassnBer Id",
  apflora.tpopmassnber.jahr AS "TPopMassnBer Jahr",
  tpopmassn_erfbeurt_werte.text AS "TPopMassnBer Entwicklung",
  apflora.tpopmassnber.bemerkungen AS "TPopMassnBer Interpretation",
  apflora.tpopmassnber.changed AS "TPopMassnBer MutWann",
  apflora.tpopmassnber.changed_by AS "TPopMassnBer MutWer"
FROM
  apflora.adb_eigenschaften
  INNER JOIN
    (((apflora.ap
    LEFT JOIN
      apflora.ap_bearbstand_werte
      ON apflora.ap."ApStatus" = apflora.ap_bearbstand_werte."DomainCode")
    LEFT JOIN
      apflora.ap_umsetzung_werte
      ON apflora.ap."ApUmsetzung" = apflora.ap_umsetzung_werte."DomainCode")
    INNER JOIN
      ((apflora.pop
      LEFT JOIN
        apflora.pop_status_werte
        ON apflora.pop."PopHerkunft" = pop_status_werte."HerkunftId")
      INNER JOIN
        ((apflora.tpop
        LEFT JOIN
          apflora.pop_status_werte AS "tpopHerkunft"
          ON apflora.tpop."TPopHerkunft" = "tpopHerkunft"."HerkunftId")
        INNER JOIN
          (apflora.tpopmassnber
          LEFT JOIN
            apflora.tpopmassn_erfbeurt_werte
            ON apflora.tpopmassnber.beurteilung = tpopmassn_erfbeurt_werte.code)
          ON apflora.tpop."TPopId" = apflora.tpopmassnber.tpop_id)
        ON apflora.pop."PopId" = apflora.tpop."PopId")
      ON apflora.ap."ApArtId" = apflora.pop."ApArtId")
    ON apflora.adb_eigenschaften."TaxonomieId" = apflora.ap."ApArtId"
ORDER BY
  apflora.adb_eigenschaften."Artname",
  apflora.pop."PopNr",
  apflora.tpop."TPopNr",
  apflora.tpopmassnber.jahr;

-- ::numeric is needed or else all koordinates are same value!!!
DROP VIEW IF EXISTS apflora.v_tpop_kml CASCADE;
CREATE OR REPLACE VIEW apflora.v_tpop_kml AS
SELECT
  apflora.adb_eigenschaften."Artname" AS "Art",
  concat(
    apflora.pop."PopNr",
    '/',
    apflora.tpop."TPopNr"
  ) AS "Label",
  substring(
    concat(
      'Population: ',
      apflora.pop."PopNr",
      ' ',
      apflora.pop."PopName",
      '<br /> Teilpopulation: ',
      apflora.tpop."TPopNr",
      ' ',
      apflora.tpop."TPopGemeinde",
      ' ',
      apflora.tpop."TPopFlurname"
    )
    from 1 for 225
  ) AS "Inhalte",
  round(
    (
      (
        2.6779094
        + (4.728982 * ((apflora.tpop."TPopXKoord" - 600000)::numeric / 1000000))
        + (0.791484 * ((apflora.tpop."TPopXKoord" - 600000)::numeric / 1000000) * ((apflora.tpop."TPopYKoord" - 200000)::numeric / 1000000))
        + (0.1306 * ((apflora.tpop."TPopXKoord" - 600000)::numeric / 1000000) * ((apflora.tpop."TPopYKoord" - 200000)::numeric / 1000000) * ((apflora.tpop."TPopYKoord" - 200000)::numeric / 1000000))
        - (0.0436 * ((apflora.tpop."TPopXKoord" - 600000)::numeric / 1000000) * ((apflora.tpop."TPopXKoord" - 600000)::numeric / 1000000) * ((apflora.tpop."TPopXKoord" - 600000)::numeric / 1000000))
      ) * 100 / 36
    )::numeric, 10
  ) AS "Laengengrad",
  round(
    (
      (
        16.9023892
        + (3.238272 * ((apflora.tpop."TPopYKoord" - 200000)::numeric / 1000000))
        - (0.270978 * ((apflora.tpop."TPopXKoord" - 600000)::numeric / 1000000) * ((apflora.tpop."TPopXKoord" - 600000)::numeric / 1000000))
        - (0.002528 * ((apflora.tpop."TPopYKoord" - 200000)::numeric / 1000000) * ((apflora.tpop."TPopYKoord" - 200000)::numeric / 1000000))
        - (0.0447 * ((apflora.tpop."TPopXKoord" - 600000)::numeric / 1000000) * ((apflora.tpop."TPopXKoord" - 600000)::numeric / 1000000) * ((apflora.tpop."TPopYKoord" - 200000)::numeric / 1000000))
        - (0.014 * ((apflora.tpop."TPopYKoord" - 200000)::numeric / 1000000) * ((apflora.tpop."TPopYKoord" - 200000)::numeric / 1000000) * ((apflora.tpop."TPopYKoord" - 200000)::numeric / 1000000))
      ) * 100 / 36
    )::numeric, 10
  ) AS "Breitengrad",
  concat(
    'http://www.apflora.ch/Projekte/1/Arten/',
    apflora.ap."ApArtId",
    '/Populationen/',
    apflora.pop."PopId",
    '/Teil-Populationen/',
    apflora.tpop."TPopId"
  ) AS url
FROM
  (apflora.adb_eigenschaften
  INNER JOIN
    apflora.ap
    ON apflora.adb_eigenschaften."TaxonomieId" = apflora.ap."ApArtId")
  INNER JOIN
    (apflora.pop
    INNER JOIN
      apflora.tpop
      ON apflora.pop."PopId" = apflora.tpop."PopId")
    ON apflora.ap."ApArtId" = apflora.pop."ApArtId"
WHERE
  apflora.tpop."TPopYKoord" > 40000
  AND apflora.tpop."TPopYKoord" < 350000
  AND apflora.tpop."TPopXKoord" > 400000
  AND apflora.tpop."TPopXKoord" < 900000
ORDER BY
  apflora.adb_eigenschaften."Artname",
  apflora.pop."PopNr",
  apflora.pop."PopName",
  apflora.tpop."TPopNr",
  apflora.tpop."TPopGemeinde",
  apflora.tpop."TPopFlurname";

-- ::numeric is needed or else all koordinates are same value!!!
DROP VIEW IF EXISTS apflora.v_tpop_kmlnamen CASCADE;
CREATE OR REPLACE VIEW apflora.v_tpop_kmlnamen AS
SELECT
  apflora.adb_eigenschaften."Artname" AS "Art",
  concat(
    apflora.adb_eigenschaften."Artname",
    ' ',
    apflora.pop."PopNr",
    '/',
    apflora.tpop."TPopNr"
  ) AS "Label",
  substring(
    concat(
      'Population: ',
      apflora.pop."PopNr",
      ' ',
      apflora.pop."PopName",
      '<br /> Teilpopulation: ',
      apflora.tpop."TPopNr",
      ' ',
      apflora.tpop."TPopGemeinde",
      ' ',
      apflora.tpop."TPopFlurname")
    from 1 for 225
  ) AS "Inhalte",
  round(
    (
      (
        2.6779094
        + (4.728982 * ((apflora.tpop."TPopXKoord" - 600000)::numeric / 1000000))
        + (0.791484 * ((apflora.tpop."TPopXKoord" - 600000)::numeric / 1000000) * ((apflora.tpop."TPopYKoord" - 200000)::numeric / 1000000))
        + (0.1306 * ((apflora.tpop."TPopXKoord" - 600000)::numeric / 1000000) * ((apflora.tpop."TPopYKoord" - 200000)::numeric / 1000000) * ((apflora.tpop."TPopYKoord" - 200000)::numeric / 1000000))
        - (0.0436 * ((apflora.tpop."TPopXKoord" - 600000)::numeric / 1000000) * ((apflora.tpop."TPopXKoord" - 600000)::numeric / 1000000) * ((apflora.tpop."TPopXKoord" - 600000)::numeric / 1000000))
       ) * 100 / 36
    )::numeric, 10
  ) AS "Laengengrad",
  round(
    (
      (
        16.9023892
        + (3.238272 * ((apflora.tpop."TPopYKoord" - 200000)::numeric / 1000000))
        - (0.270978 * ((apflora.tpop."TPopXKoord" - 600000)::numeric / 1000000) * ((apflora.tpop."TPopXKoord" - 600000)::numeric / 1000000))
        - (0.002528 * ((apflora.tpop."TPopYKoord" - 200000)::numeric / 1000000) * ((apflora.tpop."TPopYKoord" - 200000)::numeric / 1000000))
        - (0.0447 * ((apflora.tpop."TPopXKoord" - 600000)::numeric / 1000000) * ((apflora.tpop."TPopXKoord" - 600000)::numeric / 1000000) * ((apflora.tpop."TPopYKoord" - 200000)::numeric / 1000000))
        - (0.014 * ((apflora.tpop."TPopYKoord" - 200000)::numeric / 1000000) * ((apflora.tpop."TPopYKoord" - 200000)::numeric / 1000000) * ((apflora.tpop."TPopYKoord" - 200000)::numeric / 1000000))
       ) * 100 / 36
    )::numeric, 10
  ) AS "Breitengrad",
  concat(
    'http://www.apflora.ch/Projekte/1/Arten/',
    apflora.ap."ApArtId",
    '/Populationen/',
    apflora.pop."PopId",
    '/Teil-Populationen/',
    apflora.tpop."TPopId"
  ) AS url
FROM
  (apflora.adb_eigenschaften
  INNER JOIN
    apflora.ap
    ON apflora.adb_eigenschaften."TaxonomieId" = apflora.ap."ApArtId")
  INNER JOIN
    (apflora.pop
    INNER JOIN
      apflora.tpop
      ON apflora.pop."PopId" = apflora.tpop."PopId")
    ON apflora.ap."ApArtId" = apflora.pop."ApArtId"
WHERE
  apflora.tpop."TPopYKoord" > 40000
  AND apflora.tpop."TPopYKoord" < 350000
  AND apflora.tpop."TPopXKoord" > 400000
  AND apflora.tpop."TPopXKoord" < 900000
ORDER BY
  apflora.adb_eigenschaften."Artname",
  apflora.pop."PopNr",
  apflora.pop."PopName",
  apflora.tpop."TPopNr",
  apflora.tpop."TPopGemeinde",
  apflora.tpop."TPopFlurname";

-- ::numeric is needed or else all koordinates are same value!!!
DROP VIEW IF EXISTS apflora.v_pop_kml CASCADE;
CREATE OR REPLACE VIEW apflora.v_pop_kml AS
SELECT
  apflora.adb_eigenschaften."Artname" AS "Art",
  apflora.pop."PopNr" AS "Label",
  substring(
    concat('Population: ', apflora.pop."PopNr", ' ', apflora.pop."PopName")
    from 1 for 225
  ) AS "Inhalte",
  round(
    (
      (
        2.6779094
        + (4.728982 * ((apflora.pop."PopXKoord" - 600000)::numeric / 1000000))
        + (0.791484 * ((apflora.pop."PopXKoord" - 600000)::numeric / 1000000) * ((apflora.pop."PopYKoord" - 200000)::numeric / 1000000))
        + (0.1306 * ((apflora.pop."PopXKoord" - 600000)::numeric / 1000000) * ((apflora.pop."PopYKoord" - 200000)::numeric / 1000000) * ((apflora.pop."PopYKoord" - 200000)::numeric / 1000000))
        - (0.0436 * ((apflora.pop."PopXKoord" - 600000)::numeric / 1000000) * ((apflora.pop."PopXKoord" - 600000)::numeric / 1000000) * ((apflora.pop."PopXKoord" - 600000)::numeric / 1000000))
      ) * 100 / 36
    )::numeric, 10
  ) AS "Laengengrad",
  round(
    (
      (
        16.9023892
        + (3.238272 * ((apflora.pop."PopYKoord" - 200000)::numeric / 1000000))
        - (0.270978 * ((apflora.pop."PopXKoord" - 600000)::numeric / 1000000) * ((apflora.pop."PopXKoord" - 600000)::numeric / 1000000))
        - (0.002528 * ((apflora.pop."PopYKoord" - 200000)::numeric / 1000000) * ((apflora.pop."PopYKoord" - 200000)::numeric / 1000000))
        - (0.0447 * ((apflora.pop."PopXKoord" - 600000)::numeric / 1000000) * ((apflora.pop."PopXKoord" - 600000)::numeric / 1000000) * ((apflora.pop."PopYKoord" - 200000)::numeric / 1000000))
        - (0.014 * ((apflora.pop."PopYKoord" - 200000)::numeric / 1000000) * ((apflora.pop."PopYKoord" - 200000)::numeric / 1000000) * ((apflora.pop."PopYKoord" - 200000)::numeric / 1000000))
      ) * 100 / 36
    )::numeric, 10
  ) AS "Breitengrad",
  concat(
    'http://www.apflora.ch/Projekte/1/Arten/',
    apflora.ap."ApArtId",
    '/Populationen/',
    apflora.pop."PopId"
  ) AS url
FROM
  apflora.adb_eigenschaften
  INNER JOIN
    (apflora.ap
    INNER JOIN
      apflora.pop
      ON apflora.ap."ApArtId" = apflora.pop."ApArtId")
    ON apflora.adb_eigenschaften."TaxonomieId" = apflora.ap."ApArtId"
WHERE
  apflora.pop."PopYKoord" > 40000
  AND apflora.pop."PopYKoord" < 350000
  AND apflora.pop."PopXKoord" > 400000
  AND apflora.pop."PopXKoord" < 900000
ORDER BY
  apflora.adb_eigenschaften."Artname",
  apflora.pop."PopNr",
  apflora.pop."PopName";

-- -- ::numeric is needed or else all koordinates are same value!!!
DROP VIEW IF EXISTS apflora.v_pop_kmlnamen CASCADE;
CREATE OR REPLACE VIEW apflora.v_pop_kmlnamen AS
SELECT
  apflora.adb_eigenschaften."Artname" AS "Art",
  concat(
    apflora.adb_eigenschaften."Artname",
    ' ',
    apflora.pop."PopNr"
  ) AS "Label",
  substring(
    concat('Population: ', apflora.pop."PopNr", ' ', apflora.pop."PopName")
    from 1 for 225
  ) AS "Inhalte",
  round(
    (
      (
        2.6779094
        + (4.728982 * ((apflora.pop."PopXKoord" - 600000)::numeric / 1000000))
        + (0.791484 * ((apflora.pop."PopXKoord" - 600000)::numeric / 1000000) * ((apflora.pop."PopYKoord" - 200000)::numeric / 1000000))
        + (0.1306 * ((apflora.pop."PopXKoord" - 600000)::numeric / 1000000) * ((apflora.pop."PopYKoord" - 200000)::numeric / 1000000) * ((apflora.pop."PopYKoord" - 200000)::numeric / 1000000))
        - (0.0436 * ((apflora.pop."PopXKoord" - 600000)::numeric / 1000000) * ((apflora.pop."PopXKoord" - 600000)::numeric / 1000000) * ((apflora.pop."PopXKoord" - 600000)::numeric / 1000000))
      ) * 100 / 36
    )::numeric, 10
  ) AS "Laengengrad",
  round(
    (
      (
        16.9023892
        + (3.238272 * ((apflora.pop."PopYKoord" - 200000)::numeric / 1000000))
        - (0.270978 * ((apflora.pop."PopXKoord" - 600000)::numeric / 1000000) * ((apflora.pop."PopXKoord" - 600000)::numeric / 1000000))
        - (0.002528 * ((apflora.pop."PopYKoord" - 200000)::numeric / 1000000) * ((apflora.pop."PopYKoord" - 200000)::numeric / 1000000))
        - (0.0447 * ((apflora.pop."PopXKoord" - 600000)::numeric / 1000000) * ((apflora.pop."PopXKoord" - 600000)::numeric / 1000000) * ((apflora.pop."PopYKoord" - 200000)::numeric / 1000000))
        - (0.014 * ((apflora.pop."PopYKoord" - 200000)::numeric / 1000000) * ((apflora.pop."PopYKoord" - 200000)::numeric / 1000000) * ((apflora.pop."PopYKoord" - 200000)::numeric / 1000000))
      ) * 100 / 36
    )::numeric, 10
  ) AS "Breitengrad",
  concat(
    'http://www.apflora.ch/Projekte/1/Arten/',
    apflora.ap."ApArtId",
    '/Populationen/',
    apflora.pop."PopId"
  ) AS url
FROM
  apflora.adb_eigenschaften
  INNER JOIN
    (apflora.ap
    INNER JOIN
      apflora.pop
      ON apflora.ap."ApArtId" = apflora.pop."ApArtId")
    ON apflora.adb_eigenschaften."TaxonomieId" = apflora.ap."ApArtId"
WHERE
  apflora.pop."PopYKoord" > 40000
  AND apflora.pop."PopYKoord" < 350000
  AND apflora.pop."PopXKoord" > 400000
  AND apflora.pop."PopXKoord" < 900000
ORDER BY
  apflora.adb_eigenschaften."Artname",
  apflora.pop."PopNr",
  apflora.pop."PopName";

DROP VIEW IF EXISTS apflora.v_kontrzaehl_anzproeinheit CASCADE;
CREATE OR REPLACE VIEW apflora.v_kontrzaehl_anzproeinheit AS
SELECT
  apflora.adb_eigenschaften."TaxonomieId" AS "ApArtId",
  apflora.adb_eigenschaften."Artname" AS "AP Art",
  apflora.ap_bearbstand_werte."DomainTxt" AS "AP Status",
  apflora.ap."ApJahr" AS "AP Start im Jahr",
  apflora.ap_umsetzung_werte."DomainTxt" AS "AP Stand Umsetzung",
  "tblAdresse_1"."AdrName" AS "AP verantwortlich",
  apflora.pop."PopId",
  apflora.pop."PopGuid" AS "Pop Guid",
  apflora.pop."PopNr" AS "Pop Nr",
  apflora.pop."PopName" AS "Pop Name",
  apflora.pop_status_werte."HerkunftTxt" AS "Pop Herkunft",
  apflora.pop."PopBekanntSeit" AS "Pop bekannt seit",
  apflora.tpop."TPopId" AS "TPop ID",
  apflora.tpop."TPopGuid" AS "TPop Guid",
  apflora.tpop."TPopNr" AS "TPop Nr",
  apflora.tpop."TPopGemeinde" AS "TPop Gemeinde",
  apflora.tpop."TPopFlurname" AS "TPop Flurname",
  "tpopHerkunft"."HerkunftTxt" AS "TPop Status",
  apflora.tpop."TPopBekanntSeit" AS "TPop bekannt seit",
  apflora.tpop."TPopHerkunftUnklar" AS "TPop Status unklar",
  apflora.tpop."TPopHerkunftUnklarBegruendung" AS "TPop Begruendung fuer unklaren Status",
  apflora.tpop."TPopXKoord" AS "TPop X-Koordinaten",
  apflora.tpop."TPopYKoord" AS "TPop Y-Koordinaten",
  apflora.tpop."TPopRadius" AS "TPop Radius m",
  apflora.tpop."TPopHoehe" AS "TPop Hoehe",
  apflora.tpop."TPopExposition" AS "TPop Exposition",
  apflora.tpop."TPopKlima" AS "TPop Klima",
  apflora.tpop."TPopNeigung" AS "TPop Hangneigung",
  apflora.tpop."TPopBeschr" AS "TPop Beschreibung",
  apflora.tpop."TPopKatNr" AS "TPop Kataster-Nr",
  apflora.tpop."TPopApBerichtRelevant" AS "TPop fuer AP-Bericht relevant",
  apflora.tpop."TPopEigen" AS "TPop EigentuemerIn",
  apflora.tpop."TPopKontakt" AS "TPop Kontakt vor Ort",
  apflora.tpop."TPopNutzungszone" AS "TPop Nutzungszone",
  apflora.tpop."TPopBewirtschafterIn" AS "TPop BewirtschafterIn",
  apflora.tpop."TPopBewirtschaftung" AS "TPop Bewirtschaftung",
  apflora.tpopkontr."TPopKontrId",
  apflora.tpopkontr."TPopId",
  apflora.tpopkontr."TPopKontrGuid" AS "Kontr Guid",
  apflora.tpopkontr."TPopKontrJahr" AS "Kontr Jahr",
  apflora.tpopkontr."TPopKontrDatum" AS "Kontr Datum",
  apflora.tpopkontr_typ_werte."DomainTxt" AS "Kontr Typ",
  apflora.adresse."AdrName" AS "Kontr BearbeiterIn",
  apflora.tpopkontr."TPopKontrUeberleb" AS "Kontr Ueberlebensrate",
  apflora.tpopkontr."TPopKontrVitalitaet" AS "Kontr Vitalitaet",
  apflora.pop_entwicklung_werte."EntwicklungTxt" AS "Kontr Entwicklung",
  apflora.tpopkontr."TPopKontrUrsach" AS "Kontr Ursachen",
  apflora.tpopkontr."TPopKontrUrteil" AS "Kontr Erfolgsbeurteilung",
  apflora.tpopkontr."TPopKontrAendUms" AS "Kontr Aenderungs-Vorschlaege Umsetzung",
  apflora.tpopkontr."TPopKontrAendKontr" AS "Kontr Aenderungs-Vorschlaege Kontrolle",
  apflora.tpop."TPopXKoord" AS "Kontr X-Koord",
  apflora.tpop."TPopYKoord" AS "Kontr Y-Koord",
  apflora.tpopkontr."TPopKontrTxt" AS "Kontr Bemerkungen",
  apflora.tpopkontr."TPopKontrLeb" AS "Kontr Lebensraum Delarze",
  apflora.tpopkontr."TPopKontrLebUmg" AS "Kontr angrenzender Lebensraum Delarze",
  apflora.tpopkontr."TPopKontrVegTyp" AS "Kontr Vegetationstyp",
  apflora.tpopkontr."TPopKontrKonkurrenz" AS "Kontr Konkurrenz",
  apflora.tpopkontr."TPopKontrMoosschicht" AS "Kontr Moosschicht",
  apflora.tpopkontr."TPopKontrKrautschicht" AS "Kontr Krautschicht",
  apflora.tpopkontr."TPopKontrStrauchschicht" AS "Kontr Strauchschicht",
  apflora.tpopkontr."TPopKontrBaumschicht" AS "Kontr Baumschicht",
  apflora.tpopkontr."TPopKontrBodenTyp" AS "Kontr Bodentyp",
  apflora.tpopkontr."TPopKontrBodenKalkgehalt" AS "Kontr Boden Kalkgehalt",
  apflora.tpopkontr."TPopKontrBodenDurchlaessigkeit" AS "Kontr Boden Durchlaessigkeit",
  apflora.tpopkontr."TPopKontrBodenHumus" AS "Kontr Boden Humusgehalt",
  apflora.tpopkontr."TPopKontrBodenNaehrstoffgehalt" AS "Kontr Boden Naehrstoffgehalt",
  apflora.tpopkontr."TPopKontrBodenAbtrag" AS "Kontr Oberbodenabtrag",
  apflora.tpopkontr."TPopKontrWasserhaushalt" AS "Kontr Wasserhaushalt",
  apflora.tpopkontr_idbiotuebereinst_werte."DomainTxt" AS "Kontr Uebereinstimmung mit Idealbiotop",
  apflora.tpopkontr."TPopKontrHandlungsbedarf" AS "Kontr Handlungsbedarf",
  apflora.tpopkontr."TPopKontrUebFlaeche" AS "Kontr Ueberpruefte Flaeche",
  apflora.tpopkontr."TPopKontrFlaeche" AS "Kontr Flaeche der Teilpopulation m2",
  apflora.tpopkontr."TPopKontrPlan" AS "Kontr auf Plan eingezeichnet",
  apflora.tpopkontr."TPopKontrVeg" AS "Kontr Deckung durch Vegetation",
  apflora.tpopkontr."TPopKontrNaBo" AS "Kontr Deckung nackter Boden",
  apflora.tpopkontr."TPopKontrUebPfl" AS "Kontr Deckung durch ueberpruefte Art",
  apflora.tpopkontr."TPopKontrJungPflJN" AS "Kontr auch junge Pflanzen",
  apflora.tpopkontr."TPopKontrVegHoeMax" AS "Kontr maximale Veg-hoehe cm",
  apflora.tpopkontr."TPopKontrVegHoeMit" AS "Kontr mittlere Veg-hoehe cm",
  apflora.tpopkontr."TPopKontrGefaehrdung" AS "Kontr Gefaehrdung",
  apflora.tpopkontr."MutWann" AS "Kontrolle zuletzt geaendert",
  apflora.tpopkontr."MutWer" AS "Kontrolle zuletzt geaendert von",
  apflora.tpopkontrzaehl.id AS "Zaehlung id",
  apflora.tpopkontrzaehl_einheit_werte.text AS "Zaehlung einheit",
  apflora.tpopkontrzaehl_methode_werte.text AS "Zaehlung Methode",
  apflora.tpopkontrzaehl.anzahl AS "Zaehlung Anzahl"
FROM
  apflora.adb_eigenschaften
  INNER JOIN
    ((((apflora.ap
    LEFT JOIN
      apflora.adresse AS "tblAdresse_1"
      ON apflora.ap."ApBearb" = "tblAdresse_1"."AdrId")
    LEFT JOIN
      apflora.ap_bearbstand_werte
      ON apflora.ap."ApStatus" = apflora.ap_bearbstand_werte."DomainCode")
    LEFT JOIN
      apflora.ap_umsetzung_werte
      ON apflora.ap."ApUmsetzung" = apflora.ap_umsetzung_werte."DomainCode")
    INNER JOIN
      ((apflora.pop
      LEFT JOIN
        apflora.pop_status_werte
        ON apflora.pop."PopHerkunft" = apflora.pop_status_werte."HerkunftId")
      INNER JOIN
        ((apflora.tpop
        LEFT JOIN
          apflora.pop_status_werte AS "tpopHerkunft"
          ON "tpopHerkunft"."HerkunftId" = apflora.tpop."TPopHerkunft")
        INNER JOIN
          (((((apflora.tpopkontr
          LEFT JOIN
            apflora.tpopkontr_idbiotuebereinst_werte
            ON apflora.tpopkontr."TPopKontrIdealBiotopUebereinst" = apflora.tpopkontr_idbiotuebereinst_werte."DomainCode")
          LEFT JOIN
            apflora.tpopkontr_typ_werte
            ON apflora.tpopkontr."TPopKontrTyp" = apflora.tpopkontr_typ_werte."DomainTxt")
          LEFT JOIN
            apflora.adresse
            ON apflora.tpopkontr."TPopKontrBearb" = apflora.adresse."AdrId")
          LEFT JOIN
            apflora.pop_entwicklung_werte
            ON apflora.tpopkontr."TPopKontrEntwicklung" = apflora.pop_entwicklung_werte."EntwicklungId")
          LEFT JOIN
            ((apflora.tpopkontrzaehl
            LEFT JOIN
              apflora.tpopkontrzaehl_einheit_werte
              ON apflora.tpopkontrzaehl.einheit = apflora.tpopkontrzaehl_einheit_werte.code)
            LEFT JOIN
              apflora.tpopkontrzaehl_methode_werte
              ON apflora.tpopkontrzaehl.methode = apflora.tpopkontrzaehl_methode_werte.code)
            ON apflora.tpopkontr."TPopKontrId" = apflora.tpopkontrzaehl.tpopkontr_id)
          ON apflora.tpop."TPopId" = apflora.tpopkontr."TPopId")
        ON apflora.pop."PopId" = apflora.tpop."PopId")
      ON apflora.ap."ApArtId" = apflora.pop."ApArtId")
    ON apflora.adb_eigenschaften."TaxonomieId" = apflora.ap."ApArtId"
WHERE
  apflora.adb_eigenschaften."TaxonomieId" > 150
ORDER BY
  apflora.adb_eigenschaften."Artname",
  apflora.pop."PopNr",
  apflora.tpop."TPopNr",
  apflora.tpopkontr."TPopKontrJahr",
  apflora.tpopkontr."TPopKontrDatum";

DROP VIEW IF EXISTS apflora.v_tpopber CASCADE;
CREATE OR REPLACE VIEW apflora.v_tpopber AS
SELECT
  apflora.adb_eigenschaften."TaxonomieId" AS "ApArtId",
  apflora.adb_eigenschaften."Artname" AS "AP Art",
  apflora.ap_bearbstand_werte."DomainTxt" AS "AP Status",
  apflora.ap."ApJahr" AS "AP Start im Jahr",
  apflora.ap_umsetzung_werte."DomainTxt" AS "AP Stand Umsetzung",
  apflora.pop."PopId",
  apflora.pop."PopGuid" AS "Pop Guid",
  apflora.pop."PopNr" AS "Pop Nr",
  apflora.pop."PopName" AS "Pop Name",
  pop_status_werte."HerkunftTxt" AS "Pop Status",
  apflora.pop."PopBekanntSeit" AS "Pop bekannt seit",
  apflora.pop."PopHerkunftUnklar" AS "Pop Status unklar",
  apflora.pop."PopHerkunftUnklarBegruendung" AS "Pop Begruendung fuer unklaren Status",
  apflora.pop."PopXKoord" AS "Pop X-Koordinaten",
  apflora.pop."PopYKoord" AS "Pop Y-Koordinaten",
  apflora.tpop."TPopId",
  apflora.tpop."TPopId" AS "TPop ID",
  apflora.tpop."TPopGuid" AS "TPop Guid",
  apflora.tpop."TPopNr" AS "TPop Nr",
  apflora.tpop."TPopGemeinde" AS "TPop Gemeinde",
  apflora.tpop."TPopFlurname" AS "TPop Flurname",
  "tpopHerkunft"."HerkunftTxt" AS "TPop Status",
  apflora.tpop."TPopBekanntSeit" AS "TPop bekannt seit",
  apflora.tpop."TPopHerkunftUnklar" AS "TPop Status unklar",
  apflora.tpop."TPopHerkunftUnklarBegruendung" AS "TPop Begruendung fuer unklaren Status",
  apflora.tpop."TPopXKoord" AS "TPop X-Koordinaten",
  apflora.tpop."TPopYKoord" AS "TPop Y-Koordinaten",
  apflora.tpop."TPopRadius" AS "TPop Radius (m)",
  apflora.tpop."TPopHoehe" AS "TPop Hoehe",
  apflora.tpop."TPopExposition" AS "TPop Exposition",
  apflora.tpop."TPopKlima" AS "TPop Klima",
  apflora.tpop."TPopNeigung" AS "TPop Hangneigung",
  apflora.tpop."TPopBeschr" AS "TPop Beschreibung",
  apflora.tpop."TPopKatNr" AS "TPop Kataster-Nr",
  apflora.tpop."TPopApBerichtRelevant" AS "TPop fuer AP-Bericht relevant",
  apflora.tpop."TPopEigen" AS "TPop EigentuemerIn",
  apflora.tpop."TPopKontakt" AS "TPop Kontakt vor Ort",
  apflora.tpop."TPopNutzungszone" AS "TPop Nutzungszone",
  apflora.tpop."TPopBewirtschafterIn" AS "TPop BewirtschafterIn",
  apflora.tpop."TPopBewirtschaftung" AS "TPop Bewirtschaftung",
  apflora.tpopber.id AS "TPopBer Id",
  apflora.tpopber.jahr AS "TPopBer Jahr",
  pop_entwicklung_werte."EntwicklungTxt" AS "TPopBer Entwicklung",
  apflora.tpopber.bemerkungen AS "TPopBer Bemerkungen",
  apflora.tpopber.changed AS "TPopBer MutWann",
  apflora.tpopber.changed_by AS "TPopBer MutWer"
FROM
  apflora.adb_eigenschaften
  INNER JOIN
    (((apflora.ap
    LEFT JOIN
      apflora.ap_bearbstand_werte
      ON apflora.ap."ApStatus" = apflora.ap_bearbstand_werte."DomainCode")
    LEFT JOIN
      apflora.ap_umsetzung_werte
      ON apflora.ap."ApUmsetzung" = apflora.ap_umsetzung_werte."DomainCode")
    INNER JOIN
      ((apflora.pop
      LEFT JOIN
        apflora.pop_status_werte
        ON apflora.pop."PopHerkunft" = pop_status_werte."HerkunftId")
      INNER JOIN
        ((apflora.tpop
        LEFT JOIN
          apflora.pop_status_werte AS "tpopHerkunft"
          ON apflora.tpop."TPopHerkunft" = "tpopHerkunft"."HerkunftId")
        RIGHT JOIN
          (apflora.tpopber
          LEFT JOIN
            apflora.pop_entwicklung_werte
            ON apflora.tpopber.entwicklung = pop_entwicklung_werte."EntwicklungId")
          ON apflora.tpop."TPopId" = apflora.tpopber.tpop_id)
        ON apflora.pop."PopId" = apflora.tpop."PopId")
      ON apflora.ap."ApArtId" = apflora.pop."ApArtId")
    ON apflora.adb_eigenschaften."TaxonomieId" = apflora.ap."ApArtId"
ORDER BY
  apflora.adb_eigenschaften."Artname",
  apflora.pop."PopNr",
  apflora.tpop."TPopNr",
  apflora.tpopber.jahr,
  pop_entwicklung_werte."EntwicklungTxt";

DROP VIEW IF EXISTS apflora.v_tpop_berjahrundmassnjahr CASCADE;
CREATE OR REPLACE VIEW apflora.v_tpop_berjahrundmassnjahr AS
SELECT
  apflora.tpop."TPopId",
  apflora.tpopber.jahr as "Jahr"
FROM
  apflora.tpop
  INNER JOIN apflora.tpopber ON apflora.tpop."TPopId" = apflora.tpopber.tpop_id
UNION DISTINCT SELECT
  apflora.tpop."TPopId",
  apflora.tpopmassnber.jahr as "Jahr"
FROM
  apflora.tpop
  INNER JOIN
    apflora.tpopmassnber
    ON apflora.tpop."TPopId" = apflora.tpopmassnber.tpop_id
ORDER BY
  "Jahr";

DROP VIEW IF EXISTS apflora.v_tpop_kontrjahrundberjahrundmassnjahr CASCADE;
CREATE OR REPLACE VIEW apflora.v_tpop_kontrjahrundberjahrundmassnjahr AS
SELECT
  apflora.tpop."TPopId",
  apflora.tpopber.jahr AS "Jahr"
FROM
  apflora.tpop
  INNER JOIN apflora.tpopber ON apflora.tpop."TPopId" = apflora.tpopber.tpop_id
UNION DISTINCT SELECT
  apflora.tpop."TPopId",
  apflora.tpopmassnber.jahr AS "Jahr"
FROM
  apflora.tpop
  INNER JOIN
    apflora.tpopmassnber
    ON apflora.tpop."TPopId" = apflora.tpopmassnber.tpop_id
UNION DISTINCT SELECT
  apflora.tpop."TPopId",
  apflora.tpopkontr."TPopKontrJahr" AS "Jahr"
FROM
  apflora.tpop
  INNER JOIN apflora.tpopkontr ON apflora.tpop."TPopId" = apflora.tpopkontr."TPopId"
ORDER BY
  "Jahr";

/*diese Abfrage noetig, weil in Access die "NO_NOTE" zw. beobzuordnung (Text) und beob_infospezies (Zahl) nicht verbunden werden kann*/
DROP VIEW IF EXISTS apflora.v_beobzuordnung_infospeziesapanzmut CASCADE;
CREATE OR REPLACE VIEW apflora.v_beobzuordnung_infospeziesapanzmut AS
SELECT
  apflora.adb_eigenschaften."Artname" AS "Art",
  apflora.tpopbeob.changed_by,
  apflora.tpopbeob.changed,
  count(apflora.tpopbeob.beob_id) AS "AnzMut",
  'tblBeobZuordnung_Infospezies' AS "Tabelle"
FROM
  ((apflora.ap
  INNER JOIN
    apflora.adb_eigenschaften
    ON apflora.ap."ApArtId" = apflora.adb_eigenschaften."TaxonomieId")
  INNER JOIN
    apflora.beob
    ON apflora.ap."ApArtId" = apflora.beob."ArtId")
  INNER JOIN
    apflora.tpopbeob
    ON apflora.beob.id = apflora.tpopbeob.beob_id
WHERE
  
GROUP BY
  apflora.adb_eigenschaften."Artname",
  apflora.tpopbeob.changed_by,
  apflora.tpopbeob.changed;

DROP VIEW IF EXISTS apflora.v_datenstruktur CASCADE;
CREATE OR REPLACE VIEW apflora.v_datenstruktur AS
SELECT
  information_schema.tables.table_schema AS "Tabelle: Schema",
  information_schema.tables.table_name AS "Tabelle: Name",
  dsql2('select count(*) from "'||information_schema.tables.table_schema||'"."'||information_schema.tables.table_name||'"') AS "Tabelle: Anzahl Datensaetze",
  -- information_schema.tables.table_comment AS "Tabelle: Bemerkungen",
  information_schema.columns.column_name AS "Feld: Name",
  information_schema.columns.column_default AS "Feld: Standardwert",
  information_schema.columns.data_type AS "Feld: Datentyp",
  information_schema.columns.is_nullable AS "Feld: Nullwerte"
  -- information_schema.columns.column_comment AS "Feld: Bemerkungen"
FROM
  information_schema.tables
  INNER JOIN
    information_schema.columns
    ON information_schema.tables.table_name = information_schema.columns.table_name
    AND information_schema.tables.table_schema = information_schema.columns.table_schema
WHERE
  information_schema.tables.table_schema IN ('apflora', 'beob')
ORDER BY
  information_schema.tables.table_schema,
  information_schema.tables.table_name,
  information_schema.columns.column_name;

DROP VIEW IF EXISTS apflora.v_apbera1lpop CASCADE;
CREATE OR REPLACE VIEW apflora.v_apbera1lpop AS
SELECT
  apflora.pop."ApArtId",
  apflora.pop."PopId"
FROM
  apflora.pop
  INNER JOIN
    apflora.tpop
    ON apflora.pop."PopId" = apflora.tpop."PopId"
WHERE
  apflora.tpop."TPopApBerichtRelevant" = 1
  AND apflora.pop."PopHerkunft" <> 300
GROUP BY
  apflora.pop."ApArtId",
  apflora.pop."PopId";

DROP VIEW IF EXISTS apflora.v_apber_a2lpop CASCADE;
CREATE OR REPLACE VIEW apflora.v_apber_a2lpop AS
SELECT
  apflora.pop."ApArtId",
  apflora.pop."PopId"
FROM
  apflora.pop
  INNER JOIN
    apflora.tpop
    ON apflora.pop."PopId" = apflora.tpop."PopId"
WHERE
  apflora.pop."PopHerkunft" = 100
  AND apflora.tpop."TPopApBerichtRelevant" = 1
GROUP BY
  apflora.pop."ApArtId",
  apflora.pop."PopId";

DROP VIEW IF EXISTS apflora.v_tpop_ohneapberichtrelevant CASCADE;
CREATE OR REPLACE VIEW apflora.v_tpop_ohneapberichtrelevant AS
SELECT
  apflora.adb_eigenschaften."Artname",
  apflora.pop."PopNr",
  apflora.pop."PopName",
  apflora.tpop."TPopId",
  apflora.tpop."TPopNr",
  apflora.tpop."TPopGemeinde",
  apflora.tpop."TPopFlurname",
  apflora.tpop."TPopApBerichtRelevant"
FROM
  apflora.adb_eigenschaften
  INNER JOIN
    (apflora.ap
    INNER JOIN
      (apflora.pop
      INNER JOIN
        apflora.tpop
        ON apflora.tpop."PopId" = apflora.pop."PopId")
      ON apflora.pop."ApArtId" = apflora.ap."ApArtId")
    ON apflora.adb_eigenschaften."TaxonomieId" = apflora.ap."ApArtId"
WHERE
  apflora.tpop."TPopApBerichtRelevant" IS NULL
  AND 
ORDER BY
  apflora.adb_eigenschaften."Artname",
  apflora.pop."PopNr",
  apflora.tpop."TPopNr";

DROP VIEW IF EXISTS apflora.v_qk2_tpop_popnrtpopnrmehrdeutig CASCADE;
CREATE OR REPLACE VIEW apflora.v_qk2_tpop_popnrtpopnrmehrdeutig AS
SELECT
  apflora.projekt."ProjId",
  apflora.ap."ApArtId",
  'Teilpopulation: Die TPop.-Nr. ist mehrdeutig:'::text AS hw,
  ARRAY['Projekte', 1 , 'Arten', apflora.ap."ApArtId", 'Populationen', apflora.pop."PopId", 'Teil-Populationen', apflora.tpop."TPopId"]::text[] AS url,
  ARRAY[concat('Population (Nr.): ', apflora.pop."PopNr"), concat('Teil-Population (Nr.): ', apflora.tpop."TPopNr")]::text[] AS text
FROM
  apflora.projekt
  INNER JOIN
    apflora.ap
    INNER JOIN
      apflora.pop
      INNER JOIN
        apflora.tpop
        ON apflora.tpop."PopId" = apflora.pop."PopId"
      ON apflora.pop."ApArtId" = apflora.ap."ApArtId"
    ON apflora.projekt."ProjId" = apflora.ap."ProjId"
WHERE
  apflora.tpop."PopId" IN (
    SELECT DISTINCT "PopId"
    FROM apflora.tpop
    GROUP BY "PopId", "TPopNr"
    HAVING COUNT(*) > 1
  ) AND
  apflora.tpop."TPopNr" IN (
    SELECT "TPopNr"
    FROM apflora.tpop
    GROUP BY "PopId", "TPopNr"
    HAVING COUNT(*) > 1
  )
ORDER BY
  apflora.projekt."ProjId",
  apflora.ap."ApArtId",
  apflora.pop."PopNr",
  apflora.tpop."TPopNr";

DROP VIEW IF EXISTS apflora.v_qk2_pop_popnrmehrdeutig CASCADE;
CREATE OR REPLACE VIEW apflora.v_qk2_pop_popnrmehrdeutig AS
SELECT
  apflora.projekt."ProjId",
  apflora.ap."ApArtId",
  'Population: Die Nr. ist mehrdeutig:'::text AS hw,
  ARRAY['Projekte', 1 , 'Arten', apflora.ap."ApArtId", 'Populationen', apflora.pop."PopId"]::text[] AS url,
  ARRAY[concat('Population (Nr.): ', apflora.pop."PopNr")]::text[] AS text
FROM
  apflora.projekt
  INNER JOIN
    apflora.ap
    INNER JOIN
      apflora.pop
      ON apflora.pop."ApArtId" = apflora.ap."ApArtId"
    ON apflora.projekt."ProjId" = apflora.ap."ProjId"
WHERE
  apflora.pop."ApArtId" IN (
    SELECT DISTINCT "ApArtId"
    FROM apflora.pop
    GROUP BY "ApArtId", "PopNr"
    HAVING COUNT(*) > 1
  ) AND
  apflora.pop."PopNr" IN (
    SELECT DISTINCT "PopNr"
    FROM apflora.pop
    GROUP BY "ApArtId", "PopNr"
    HAVING COUNT(*) > 1
  )
ORDER BY
  apflora.projekt."ProjId",
  apflora.ap."ApArtId",
  apflora.pop."PopNr";

DROP VIEW IF EXISTS apflora.v_qk2_pop_ohnekoord CASCADE;
CREATE OR REPLACE VIEW apflora.v_qk2_pop_ohnekoord AS
SELECT
  apflora.ap."ProjId",
  apflora.ap."ApArtId",
  'Population: Mindestens eine Koordinate fehlt:'::text AS hw,
  ARRAY['Projekte', 1 , 'Arten', apflora.ap."ApArtId", 'Populationen', apflora.pop."PopId"]::text[] AS url,
  ARRAY[concat('Population (Nr.): ', apflora.pop."PopNr")]::text[] AS text
FROM
  apflora.ap
  INNER JOIN
    apflora.pop
    ON apflora.ap."ApArtId" = apflora.pop."ApArtId"
WHERE
  apflora.pop."PopXKoord" IS NULL
  OR apflora.pop."PopYKoord" IS NULL
ORDER BY
  apflora.ap."ApArtId",
  apflora.pop."PopNr";

DROP VIEW IF EXISTS apflora.v_qk2_pop_ohnepopnr CASCADE;
CREATE OR REPLACE VIEW apflora.v_qk2_pop_ohnepopnr AS
SELECT
  apflora.ap."ProjId",
  apflora.ap."ApArtId",
  'Population ohne Nr.:'::text AS hw,
  ARRAY['Projekte', 1 , 'Arten', apflora.ap."ApArtId", 'Populationen', apflora.pop."PopId"]::text[] AS url,
  ARRAY[concat('Population (Name): ', apflora.pop."PopName")]::text[] AS text
FROM
  apflora.ap
  INNER JOIN
    apflora.pop
    ON apflora.ap."ApArtId" = apflora.pop."ApArtId"
WHERE
  apflora.pop."PopNr" IS NULL
ORDER BY
  apflora.ap."ApArtId",
  apflora.pop."PopName";

DROP VIEW IF EXISTS apflora.v_qk2_pop_ohnepopname CASCADE;
CREATE OR REPLACE VIEW apflora.v_qk2_pop_ohnepopname AS
SELECT
  apflora.ap."ProjId",
  apflora.ap."ApArtId",
  'Population ohne Name:'::text AS hw,
  ARRAY['Projekte', 1 , 'Arten', apflora.ap."ApArtId", 'Populationen', apflora.pop."PopId"]::text[] AS url,
  ARRAY[concat('Population: ', apflora.pop."PopNr")]::text[] AS text
FROM
  apflora.ap
  INNER JOIN
    apflora.pop
    ON apflora.ap."ApArtId" = apflora.pop."ApArtId"
WHERE
  apflora.pop."PopName" IS NULL
ORDER BY
  apflora.ap."ApArtId",
  apflora.pop."PopNr";

DROP VIEW IF EXISTS apflora.v_qk2_pop_ohnepopstatus CASCADE;
CREATE OR REPLACE VIEW apflora.v_qk2_pop_ohnepopstatus AS
SELECT
  apflora.ap."ProjId",
  apflora.ap."ApArtId",
  'Population ohne Status:'::text AS hw,
  ARRAY['Projekte', 1 , 'Arten', apflora.ap."ApArtId", 'Populationen', apflora.pop."PopId"]::text[] AS url,
  ARRAY[concat('Population (Nr.): ', apflora.pop."PopNr")]::text[] AS text
FROM
  apflora.ap
  INNER JOIN
    apflora.pop
    ON apflora.ap."ApArtId" = apflora.pop."ApArtId"
WHERE
  apflora.pop."PopHerkunft" IS NULL
ORDER BY
  apflora.ap."ApArtId",
  apflora.pop."PopNr";

DROP VIEW IF EXISTS apflora.v_qk2_pop_ohnebekanntseit CASCADE;
CREATE OR REPLACE VIEW apflora.v_qk2_pop_ohnebekanntseit AS
SELECT
  apflora.ap."ProjId",
  apflora.ap."ApArtId",
  'Population ohne "bekannt seit":'::text AS hw,
  ARRAY['Projekte', 1 , 'Arten', apflora.ap."ApArtId", 'Populationen', apflora.pop."PopId"]::text[] AS url,
  ARRAY[concat('Population (Nr.): ', apflora.pop."PopNr")]::text[] AS text
FROM
  apflora.ap
  INNER JOIN
    apflora.pop
    ON apflora.ap."ApArtId" = apflora.pop."ApArtId"
WHERE
  apflora.pop."PopBekanntSeit" IS NULL
ORDER BY
  apflora.ap."ApArtId",
  apflora.pop."PopNr";

DROP VIEW IF EXISTS apflora.v_qk2_pop_mitstatusunklarohnebegruendung CASCADE;
CREATE OR REPLACE VIEW apflora.v_qk2_pop_mitstatusunklarohnebegruendung AS
SELECT
  apflora.ap."ProjId",
  apflora.ap."ApArtId",
  'Population mit "Status unklar", ohne Begruendung:'::text AS hw,
  ARRAY['Projekte', 1 , 'Arten', apflora.ap."ApArtId", 'Populationen', apflora.pop."PopId"]::text[] AS url,
  ARRAY[concat('Population (Nr.): ', apflora.pop."PopNr")]::text[] AS text
FROM
  apflora.ap
  INNER JOIN
    apflora.pop
    ON apflora.ap."ApArtId" = apflora.pop."ApArtId"
WHERE
  apflora.pop."PopHerkunftUnklar" = 1
  AND apflora.pop."PopHerkunftUnklarBegruendung" IS NULL
ORDER BY
  apflora.ap."ApArtId",
  apflora.pop."PopNr";

DROP VIEW IF EXISTS apflora.v_qk2_pop_ohnetpop CASCADE;
CREATE OR REPLACE VIEW apflora.v_qk2_pop_ohnetpop AS
SELECT
  apflora.ap."ProjId",
  apflora.ap."ApArtId",
  'Population ohne Teilpopulation:'::text AS hw,
  ARRAY['Projekte', 1 , 'Arten', apflora.ap."ApArtId", 'Populationen', apflora.pop."PopId"]::text[] AS url,
  ARRAY[concat('Population (Nr.): ', apflora.pop."PopNr")]::text[] AS text
FROM
  apflora.ap
  INNER JOIN
    (apflora.pop
    LEFT JOIN
      apflora.tpop
      ON apflora.pop."PopId" = apflora.tpop."PopId")
    ON apflora.ap."ApArtId" = apflora.pop."ApArtId"
WHERE
  apflora.tpop."TPopId" IS NULL
ORDER BY
  apflora.ap."ApArtId",
  apflora.pop."PopNr";

DROP VIEW IF EXISTS apflora.v_qk2_tpop_ohnenr CASCADE;
CREATE OR REPLACE VIEW apflora.v_qk2_tpop_ohnenr AS
SELECT
  apflora.ap."ProjId",
  apflora.ap."ApArtId",
  'Teilpopulation ohne Nr.:'::text AS hw,
  ARRAY['Projekte', 1 , 'Arten', apflora.ap."ApArtId", 'Populationen', apflora.pop."PopId", 'Teil-Populationen', apflora.tpop."TPopId"]::text[] AS url,
  ARRAY[concat('Population (Nr.): ', apflora.pop."PopNr"), concat('Teil-Population (Nr.): ', apflora.tpop."TPopNr")]::text[] AS text
FROM
  apflora.ap
  INNER JOIN
    apflora.pop
    INNER JOIN
      apflora.tpop
      ON apflora.pop."PopId" = apflora.tpop."PopId"
    ON apflora.ap."ApArtId" = apflora.pop."ApArtId"
WHERE
  apflora.tpop."TPopNr" IS NULL
ORDER BY
  apflora.ap."ApArtId",
  apflora.pop."PopNr",
  apflora.tpop."TPopNr";

DROP VIEW IF EXISTS apflora.v_qk2_tpop_ohneflurname CASCADE;
CREATE OR REPLACE VIEW apflora.v_qk2_tpop_ohneflurname AS
SELECT
  apflora.ap."ProjId",
  apflora.ap."ApArtId",
  'Teilpopulation ohne Flurname:'::text AS hw,
  ARRAY['Projekte', 1 , 'Arten', apflora.ap."ApArtId", 'Populationen', apflora.pop."PopId", 'Teil-Populationen', apflora.tpop."TPopId"]::text[] AS url,
  ARRAY[concat('Population (Nr.): ', apflora.pop."PopNr"), concat('Teil-Population (Nr.): ', apflora.tpop."TPopNr")]::text[] AS text
FROM
  apflora.ap
  INNER JOIN
    (apflora.pop
    INNER JOIN
      apflora.tpop
      ON apflora.pop."PopId" = apflora.tpop."PopId")
    ON apflora.ap."ApArtId" = apflora.pop."ApArtId"
WHERE
  apflora.tpop."TPopFlurname" IS NULL
ORDER BY
  apflora.ap."ApArtId",
  apflora.pop."PopNr",
  apflora.tpop."TPopNr";

DROP VIEW IF EXISTS apflora.v_qk2_tpop_ohnestatus CASCADE;
CREATE OR REPLACE VIEW apflora.v_qk2_tpop_ohnestatus AS
SELECT
  apflora.ap."ProjId",
  apflora.ap."ApArtId",
  'Teilpopulation ohne Status:'::text AS hw,
  ARRAY['Projekte', 1 , 'Arten', apflora.ap."ApArtId", 'Populationen', apflora.pop."PopId", 'Teil-Populationen', apflora.tpop."TPopId"]::text[] AS url,
  ARRAY[concat('Population (Nr.): ', apflora.pop."PopNr"), concat('Teil-Population (Nr.): ', apflora.tpop."TPopNr")]::text[] AS text
FROM
  apflora.ap
  INNER JOIN
    (apflora.pop
    INNER JOIN
      apflora.tpop
      ON apflora.pop."PopId" = apflora.tpop."PopId")
    ON apflora.ap."ApArtId" = apflora.pop."ApArtId"
WHERE
  apflora.tpop."TPopHerkunft" IS NULL
ORDER BY
  apflora.ap."ApArtId",
  apflora.pop."PopNr",
  apflora.tpop."TPopNr";

DROP VIEW IF EXISTS apflora.v_qk2_tpop_ohnebekanntseit CASCADE;
CREATE OR REPLACE VIEW apflora.v_qk2_tpop_ohnebekanntseit AS
SELECT
  apflora.ap."ApArtId",
  'Teilpopulation ohne "bekannt seit":'::text AS hw,
  ARRAY['Projekte', 1 , 'Arten', apflora.ap."ApArtId", 'Populationen', apflora.pop."PopId", 'Teil-Populationen', apflora.tpop."TPopId"]::text[] AS url,
  ARRAY[concat('Population (Nr.): ', apflora.pop."PopNr"), concat('Teil-Population (Nr.): ', apflora.tpop."TPopNr")]::text[] AS text
FROM
  apflora.ap
  INNER JOIN
    (apflora.pop
    INNER JOIN
      apflora.tpop
      ON apflora.pop."PopId" = apflora.tpop."PopId")
    ON apflora.ap."ApArtId" = apflora.pop."ApArtId"
WHERE
  apflora.tpop."TPopBekanntSeit" IS NULL
ORDER BY
  apflora.ap."ApArtId",
  apflora.pop."PopNr",
  apflora.tpop."TPopNr";

DROP VIEW IF EXISTS apflora.v_qk2_tpop_ohneapberrelevant CASCADE;
CREATE OR REPLACE VIEW apflora.v_qk2_tpop_ohneapberrelevant AS
SELECT
  apflora.ap."ProjId",
  apflora.ap."ApArtId",
  'Teilpopulation ohne "Fuer AP-Bericht relevant":'::text AS hw,
  ARRAY['Projekte', 1 , 'Arten', apflora.ap."ApArtId", 'Populationen', apflora.pop."PopId", 'Teil-Populationen', apflora.tpop."TPopId"]::text[] AS url,
  ARRAY[concat('Population (Nr.): ', apflora.pop."PopNr"), concat('Teil-Population (Nr.): ', apflora.tpop."TPopNr")]::text[] AS text
FROM
  apflora.ap
  INNER JOIN
    (apflora.pop
    INNER JOIN
      apflora.tpop
      ON apflora.pop."PopId" = apflora.tpop."PopId")
    ON apflora.ap."ApArtId" = apflora.pop."ApArtId"
WHERE
  apflora.tpop."TPopApBerichtRelevant" IS NULL
ORDER BY
  apflora.ap."ApArtId",
  apflora.pop."PopNr",
  apflora.tpop."TPopNr";

DROP VIEW IF EXISTS apflora.v_qk2_tpop_statuspotentiellfuerapberrelevant CASCADE;
CREATE OR REPLACE VIEW apflora.v_qk2_tpop_statuspotentiellfuerapberrelevant AS
SELECT
  apflora.ap."ProjId",
  apflora.ap."ApArtId",
  'Teilpopulation mit Status "potenzieller Wuchs-/Ansiedlungsort" und "Fuer AP-Bericht relevant?" = ja:'::text AS hw,
  ARRAY['Projekte', 1 , 'Arten', apflora.ap."ApArtId", 'Populationen', apflora.pop."PopId", 'Teil-Populationen', apflora.tpop."TPopId"]::text[] AS url,
  ARRAY[concat('Population (Nr.): ', apflora.pop."PopNr"), concat('Teil-Population (Nr.): ', apflora.tpop."TPopNr")]::text[] AS text
FROM
  apflora.ap
  INNER JOIN
    (apflora.pop
    INNER JOIN
      apflora.tpop
      ON apflora.pop."PopId" = apflora.tpop."PopId")
    ON apflora.ap."ApArtId" = apflora.pop."ApArtId"
WHERE
  apflora.tpop."TPopHerkunft" = 300
  AND apflora.tpop."TPopApBerichtRelevant" = 1
ORDER BY
  apflora.ap."ApArtId",
  apflora.pop."PopNr",
  apflora.tpop."TPopNr";

DROP VIEW IF EXISTS apflora.v_qk2_tpop_mitstatusunklarohnebegruendung CASCADE;
CREATE OR REPLACE VIEW apflora.v_qk2_tpop_mitstatusunklarohnebegruendung AS
SELECT
  apflora.ap."ProjId",
  apflora.ap."ApArtId",
  'Teilpopulation mit "Status unklar", ohne Begruendung:'::text AS hw,
  ARRAY['Projekte', 1 , 'Arten', apflora.ap."ApArtId", 'Populationen', apflora.pop."PopId", 'Teil-Populationen', apflora.tpop."TPopId"]::text[] AS url,
  ARRAY[concat('Population (Nr.): ', apflora.pop."PopNr"), concat('Teil-Population (Nr.): ', apflora.tpop."TPopNr")]::text[] AS text
FROM
  apflora.ap
  INNER JOIN
    (apflora.pop
    INNER JOIN
      apflora.tpop
      ON apflora.pop."PopId" = apflora.tpop."PopId")
    ON apflora.ap."ApArtId" = apflora.pop."ApArtId"
WHERE
  apflora.tpop."TPopHerkunftUnklar" = 1
  AND apflora.tpop."TPopHerkunftUnklarBegruendung" IS NULL
ORDER BY
  apflora.ap."ApArtId",
  apflora.pop."PopNr",
  apflora.tpop."TPopNr";

DROP VIEW IF EXISTS apflora.v_qk2_tpop_ohnekoordinaten CASCADE;
CREATE OR REPLACE VIEW apflora.v_qk2_tpop_ohnekoordinaten AS
SELECT
  apflora.ap."ProjId",
  apflora.ap."ApArtId",
  'Teilpopulation: Mindestens eine Koordinate fehlt:'::text AS hw,
  ARRAY['Projekte', 1 , 'Arten', apflora.ap."ApArtId", 'Populationen', apflora.pop."PopId", 'Teil-Populationen', apflora.tpop."TPopId"]::text[] AS url,
  ARRAY[concat('Population (Nr.): ', apflora.pop."PopNr"), concat('Teil-Population (Nr.): ', apflora.tpop."TPopNr")]::text[] AS text
FROM
  apflora.ap
  INNER JOIN
    (apflora.pop
    INNER JOIN
      apflora.tpop
      ON apflora.pop."PopId" = apflora.tpop."PopId")
    ON apflora.ap."ApArtId" = apflora.pop."ApArtId"
WHERE
  apflora.tpop."TPopXKoord" IS NULL
  OR apflora.tpop."TPopYKoord" IS NULL
ORDER BY
  apflora.ap."ApArtId",
  apflora.pop."PopNr",
  apflora.tpop."TPopNr";

DROP VIEW IF EXISTS apflora.v_qk2_massn_ohnejahr CASCADE;
CREATE OR REPLACE VIEW apflora.v_qk2_massn_ohnejahr AS
SELECT
  apflora.ap."ProjId",
  apflora.ap."ApArtId",
  'Massnahme ohne Jahr:'::text AS hw,
  ARRAY['Projekte', 1 , 'Arten', apflora.ap."ApArtId", 'Populationen', apflora.pop."PopId", 'Teil-Populationen', apflora.tpop."TPopId", 'Massnahmen', apflora.tpopmassn.id]::text[] AS url,
  ARRAY[concat('Population (Nr.): ', apflora.pop."PopNr"), concat('Teil-Population (Nr.): ', apflora.tpop."TPopNr"), concat('Massnahme: ', apflora.tpopmassn.jahr)]::text[] AS text
FROM
  apflora.ap
  INNER JOIN
    (apflora.pop
    INNER JOIN
      (apflora.tpop
      INNER JOIN
        apflora.tpopmassn
        ON apflora.tpop."TPopId" = apflora.tpopmassn.tpop_id)
      ON apflora.pop."PopId" = apflora.tpop."PopId")
    ON apflora.ap."ApArtId" = apflora.pop."ApArtId"
WHERE
  apflora.tpopmassn.jahr IS NULL
ORDER BY
  apflora.ap."ApArtId",
  apflora.pop."PopNr",
  apflora.tpop."TPopNr",
  apflora.tpopmassn.id;

DROP VIEW IF EXISTS apflora.v_qk2_massn_ohnebearb CASCADE;
CREATE OR REPLACE VIEW apflora.v_qk2_massn_ohnebearb AS
SELECT
  apflora.ap."ProjId",
  apflora.ap."ApArtId",
  'Massnahme ohne BearbeiterIn:'::text AS hw,
  ARRAY['Projekte', 1 , 'Arten', apflora.ap."ApArtId", 'Populationen', apflora.pop."PopId", 'Teil-Populationen', apflora.tpop."TPopId", 'Massnahmen', apflora.tpopmassn.id]::text[] AS url,
  ARRAY[concat('Population (Nr.): ', apflora.pop."PopNr"), concat('Teil-Population (Nr.): ', apflora.tpop."TPopNr"), concat('Massnahme (id): ', apflora.tpopmassn.id)]::text[] AS text
FROM
  apflora.ap
  INNER JOIN
    (apflora.pop
    INNER JOIN
      (apflora.tpop
      INNER JOIN
        apflora.tpopmassn
        ON apflora.tpop."TPopId" = apflora.tpopmassn.tpop_id)
      ON apflora.pop."PopId" = apflora.tpop."PopId")
    ON apflora.ap."ApArtId" = apflora.pop."ApArtId"
WHERE
  apflora.tpopmassn.bearbeiter IS NULL
ORDER BY
  apflora.ap."ApArtId",
  apflora.pop."PopNr",
  apflora.tpop."TPopNr",
  apflora.tpopmassn.id;

DROP VIEW IF EXISTS apflora.v_qk2_massn_ohnetyp CASCADE;
CREATE OR REPLACE VIEW apflora.v_qk2_massn_ohnetyp AS
SELECT
  apflora.ap."ProjId",
  apflora.ap."ApArtId",
  'Massnahmen ohne Typ:'::text AS hw,
  ARRAY['Projekte', 1 , 'Arten', apflora.ap."ApArtId", 'Populationen', apflora.pop."PopId", 'Teil-Populationen', apflora.tpop."TPopId", 'Massnahmen', apflora.tpopmassn.id]::text[] AS url,
  ARRAY[concat('Population (Nr.): ', apflora.pop."PopNr"), concat('Teil-Population (Nr.): ', apflora.tpop."TPopNr"), concat('Massnahme (Jahr): ', apflora.tpopmassn.jahr)]::text[] AS text,
  apflora.tpopmassn.jahr AS "Berichtjahr"
FROM
  apflora.ap
  INNER JOIN
    (apflora.pop
    INNER JOIN
      (apflora.tpop
      INNER JOIN
        apflora.tpopmassn
        ON apflora.tpop."TPopId" = apflora.tpopmassn.tpop_id)
      ON apflora.pop."PopId" = apflora.tpop."PopId")
    ON apflora.ap."ApArtId" = apflora.pop."ApArtId"
WHERE
  apflora.tpopmassn.typ IS NULL
  AND apflora.tpopmassn.jahr IS NOT NULL
ORDER BY
  apflora.pop."PopNr",
  apflora.tpop."TPopNr",
  apflora.tpopmassn.jahr;

DROP VIEW IF EXISTS apflora.v_qk2_massnber_ohnejahr CASCADE;
CREATE OR REPLACE VIEW apflora.v_qk2_massnber_ohnejahr AS
SELECT
  apflora.ap."ProjId",
  apflora.ap."ApArtId",
  'Massnahmen-Bericht ohne Jahr:'::text AS hw,
  ARRAY['Projekte', 1 , 'Arten', apflora.ap."ApArtId", 'Populationen', apflora.pop."PopId", 'Teil-Populationen', apflora.tpop."TPopId", 'Massnahmen-Berichte', apflora.tpopmassnber.id]::text[] AS url,
  ARRAY[concat('Population (Nr.): ', apflora.pop."PopNr"), concat('Teil-Population (Nr.): ', apflora.tpop."TPopNr"), concat('Massnahmen-Bericht (Jahr): ', apflora.tpopmassnber.jahr)]::text[] AS text
FROM
  apflora.ap
  INNER JOIN
    (apflora.pop
    INNER JOIN
      (apflora.tpop
      INNER JOIN
        apflora.tpopmassnber
        ON apflora.tpop."TPopId" = apflora.tpopmassnber.tpop_id)
      ON apflora.pop."PopId" = apflora.tpop."PopId")
    ON apflora.ap."ApArtId" = apflora.pop."ApArtId"
WHERE
  apflora.tpopmassnber.jahr IS NULL
ORDER BY
  apflora.pop."PopNr",
  apflora.tpop."TPopNr",
  apflora.tpopmassnber.jahr,
  apflora.tpopmassnber.id;

DROP VIEW IF EXISTS apflora.v_qk2_massnber_ohneerfbeurt CASCADE;
CREATE OR REPLACE VIEW apflora.v_qk2_massnber_ohneerfbeurt AS
SELECT
  apflora.ap."ProjId",
  apflora.ap."ApArtId",
  'Massnahmen-Bericht ohne Entwicklung:'::text AS hw,
  ARRAY['Projekte', 1 , 'Arten', apflora.ap."ApArtId", 'Populationen', apflora.pop."PopId", 'Teil-Populationen', apflora.tpop."TPopId", 'Massnahmen-Berichte', apflora.tpopmassnber.id]::text[] AS url,
  ARRAY[concat('Population (Nr.): ', apflora.pop."PopNr"), concat('Teil-Population (Nr.): ', apflora.tpop."TPopNr"), concat('Massnahmen-Bericht (Jahr): ', apflora.tpopmassnber.jahr)]::text[] AS text,
  apflora.tpopmassnber.jahr AS "Berichtjahr"
FROM
  apflora.ap
  INNER JOIN
    (apflora.pop
    INNER JOIN
      (apflora.tpop
      INNER JOIN
        apflora.tpopmassnber
        ON apflora.tpop."TPopId" = apflora.tpopmassnber.tpop_id)
      ON apflora.pop."PopId" = apflora.tpop."PopId")
    ON apflora.ap."ApArtId" = apflora.pop."ApArtId"
WHERE
  apflora.tpopmassnber.beurteilung IS NULL
  AND apflora.tpopmassnber.jahr IS NOT NULL
ORDER BY
  apflora.pop."PopNr",
  apflora.tpop."TPopNr",
  apflora.tpopmassnber.jahr;

DROP VIEW IF EXISTS apflora.v_qk2_feldkontr_ohnejahr CASCADE;
CREATE OR REPLACE VIEW apflora.v_qk2_feldkontr_ohnejahr AS
SELECT
  apflora.ap."ProjId",
  apflora.ap."ApArtId",
  'Feldkontrolle ohne Jahr:'::text AS hw,
  ARRAY['Projekte', 1 , 'Arten', apflora.ap."ApArtId", 'Populationen', apflora.pop."PopId", 'Teil-Populationen', apflora.tpop."TPopId", 'Feld-Kontrollen', apflora.tpopkontr."TPopKontrId"]::text[] AS url,
  ARRAY[concat('Population (Nr.): ', apflora.pop."PopNr"), concat('Teil-Population (Nr.): ', apflora.tpop."TPopNr"), concat('Feld-Kontrolle (Jahr): ', apflora.tpopkontr."TPopKontrJahr")]::text[] AS text
FROM
  apflora.ap
  INNER JOIN
    (apflora.pop
    INNER JOIN
      (apflora.tpop
      INNER JOIN
        apflora.tpopkontr
        ON apflora.tpop."TPopId" = apflora.tpopkontr."TPopId")
      ON apflora.pop."PopId" = apflora.tpop."PopId")
    ON apflora.ap."ApArtId" = apflora.pop."ApArtId"
WHERE
  apflora.tpopkontr."TPopKontrJahr" IS NULL
  AND apflora.tpopkontr."TPopKontrTyp" <> 'Freiwilligen-Erfolgskontrolle'
ORDER BY
  apflora.pop."PopNr",
  apflora.tpop."TPopNr",
  apflora.tpopkontr."TPopKontrJahr";

DROP VIEW IF EXISTS apflora.v_qk2_feldkontr_ohnebearb CASCADE;
CREATE OR REPLACE VIEW apflora.v_qk2_feldkontr_ohnebearb AS
SELECT
  apflora.ap."ProjId",
  apflora.ap."ApArtId",
  'Feldkontrolle ohne BearbeiterIn:'::text AS hw,
  ARRAY['Projekte', 1 , 'Arten', apflora.ap."ApArtId", 'Populationen', apflora.pop."PopId", 'Teil-Populationen', apflora.tpop."TPopId", 'Feld-Kontrollen', apflora.tpopkontr."TPopKontrId"]::text[] AS url,
  ARRAY[concat('Population (Nr.): ', apflora.pop."PopNr"), concat('Teil-Population (Nr.): ', apflora.tpop."TPopNr"), concat('Kontrolle (id): ', apflora.tpopkontr."TPopKontrId")]::text[] AS text
FROM
  apflora.ap
  INNER JOIN
    (apflora.pop
    INNER JOIN
      (apflora.tpop
      INNER JOIN
        apflora.tpopkontr
        ON apflora.tpop."TPopId" = apflora.tpopkontr."TPopId")
      ON apflora.pop."PopId" = apflora.tpop."PopId")
    ON apflora.ap."ApArtId" = apflora.pop."ApArtId"
WHERE
  apflora.tpopkontr."TPopKontrBearb" IS NULL
  AND apflora.tpopkontr."TPopKontrTyp" <> 'Freiwilligen-Erfolgskontrolle'
ORDER BY
  apflora.pop."PopNr",
  apflora.tpop."TPopNr",
  apflora.tpopkontr."TPopKontrId";

DROP VIEW IF EXISTS apflora.v_qk2_freiwkontr_ohnejahr CASCADE;
CREATE OR REPLACE VIEW apflora.v_qk2_freiwkontr_ohnejahr AS
SELECT
  apflora.ap."ProjId",
  apflora.ap."ApArtId",
  'Freiwilligen-Kontrolle ohne Jahr:'::text AS hw,
  ARRAY['Projekte', 1 , 'Arten', apflora.ap."ApArtId", 'Populationen', apflora.pop."PopId", 'Teil-Populationen', apflora.tpop."TPopId", 'Freiwilligen-Kontrollen', apflora.tpopkontr."TPopKontrId"]::text[] AS url,
  ARRAY[concat('Population (Nr.): ', apflora.pop."PopNr"), concat('Teil-Population (Nr.): ', apflora.tpop."TPopNr"), concat('Feld-Kontrolle (id): ', apflora.tpopkontr."TPopKontrId")]::text[] AS text
FROM
  apflora.ap
  INNER JOIN
    (apflora.pop
    INNER JOIN
      (apflora.tpop
      INNER JOIN
        apflora.tpopkontr
        ON apflora.tpop."TPopId" = apflora.tpopkontr."TPopId")
      ON apflora.pop."PopId" = apflora.tpop."PopId")
    ON apflora.ap."ApArtId" = apflora.pop."ApArtId"
WHERE
  apflora.tpopkontr."TPopKontrJahr" IS NULL
  AND apflora.tpopkontr."TPopKontrTyp" = 'Freiwilligen-Erfolgskontrolle'
ORDER BY
  apflora.ap."ApArtId",
  apflora.pop."PopNr",
  apflora.tpop."TPopNr",
  apflora.tpopkontr."TPopKontrJahr";

DROP VIEW IF EXISTS apflora.v_qk2_freiwkontr_ohnebearb CASCADE;
CREATE OR REPLACE VIEW apflora.v_qk2_freiwkontr_ohnebearb AS
SELECT
  apflora.ap."ProjId",
  apflora.ap."ApArtId",
  'Freiwilligen-Kontrolle ohne BearbeiterIn:'::text AS hw,
  ARRAY['Projekte', 1 , 'Arten', apflora.ap."ApArtId", 'Populationen', apflora.pop."PopId", 'Teil-Populationen', apflora.tpop."TPopId", 'Freiwilligen-Kontrollen', apflora.tpopkontr."TPopKontrId"]::text[] AS url,
  ARRAY[concat('Population (Nr.): ', apflora.pop."PopNr"), concat('Teil-Population (Nr.): ', apflora.tpop."TPopNr"), concat('Feld-Kontrolle (id): ', apflora.tpopkontr."TPopKontrId")]::text[] AS text
FROM
  apflora.ap
  INNER JOIN
    (apflora.pop
    INNER JOIN
      (apflora.tpop
      INNER JOIN
        apflora.tpopkontr
        ON apflora.tpop."TPopId" = apflora.tpopkontr."TPopId")
      ON apflora.pop."PopId" = apflora.tpop."PopId")
    ON apflora.ap."ApArtId" = apflora.pop."ApArtId"
WHERE
  apflora.tpopkontr."TPopKontrBearb" IS NULL
  AND apflora.tpopkontr."TPopKontrTyp" = 'Freiwilligen-Erfolgskontrolle'
ORDER BY
  apflora.ap."ApArtId",
  apflora.pop."PopNr",
  apflora.tpop."TPopNr",
  apflora.tpopkontr."TPopKontrBearb";

DROP VIEW IF EXISTS apflora.v_qk2_feldkontr_ohnetyp CASCADE;
CREATE OR REPLACE VIEW apflora.v_qk2_feldkontr_ohnetyp AS
SELECT
  apflora.ap."ProjId",
  apflora.ap."ApArtId",
  'Feldkontrolle ohne Typ:'::text AS hw,
  ARRAY['Projekte', 1 , 'Arten', apflora.ap."ApArtId", 'Populationen', apflora.pop."PopId", 'Teil-Populationen', apflora.tpop."TPopId", 'Feld-Kontrollen', apflora.tpopkontr."TPopKontrId"]::text[] AS url,
  ARRAY[concat('Population (Nr.): ', apflora.pop."PopNr"), concat('Teil-Population (Nr.): ', apflora.tpop."TPopNr"), concat('Feld-Kontrolle (Jahr): ', apflora.tpopkontr."TPopKontrJahr")]::text[] AS text,
  apflora.tpopkontr."TPopKontrJahr" AS "Berichtjahr"
FROM
  apflora.ap
  INNER JOIN
    (apflora.pop
    INNER JOIN
      (apflora.tpop
      INNER JOIN
        apflora.tpopkontr
        ON apflora.tpop."TPopId" = apflora.tpopkontr."TPopId")
      ON apflora.pop."PopId" = apflora.tpop."PopId")
    ON apflora.ap."ApArtId" = apflora.pop."ApArtId"
WHERE
  (
    apflora.tpopkontr."TPopKontrTyp" IS NULL
    OR apflora.tpopkontr."TPopKontrTyp" = 'Erfolgskontrolle'
  )
  AND apflora.tpopkontr."TPopKontrJahr" IS NOT NULL
ORDER BY
  apflora.pop."PopNr",
  apflora.tpop."TPopNr",
  apflora.tpopkontr."TPopKontrJahr";

DROP VIEW IF EXISTS apflora.v_qk2_feldkontr_ohnezaehlung CASCADE;
CREATE OR REPLACE VIEW apflora.v_qk2_feldkontr_ohnezaehlung AS
SELECT
  apflora.ap."ProjId",
  apflora.ap."ApArtId",
  'Feldkontrolle ohne Zaehlung:'::text AS hw,
  ARRAY['Projekte', 1 , 'Arten', apflora.ap."ApArtId", 'Populationen', apflora.pop."PopId", 'Teil-Populationen', apflora.tpop."TPopId", 'Feld-Kontrollen', apflora.tpopkontr."TPopKontrId"]::text[] AS url,
  ARRAY[concat('Population (Nr.): ', apflora.pop."PopNr"), concat('Teil-Population (Nr.): ', apflora.tpop."TPopNr"), concat('Feld-Kontrolle (Jahr): ', apflora.tpopkontr."TPopKontrJahr")]::text[] AS text,
  apflora.tpopkontr."TPopKontrJahr" AS "Berichtjahr"
FROM
  apflora.ap
  INNER JOIN
    (apflora.pop
    INNER JOIN
      (apflora.tpop
      INNER JOIN
        (apflora.tpopkontr
        LEFT JOIN
          apflora.tpopkontrzaehl
          ON apflora.tpopkontr."TPopKontrId" = apflora.tpopkontrzaehl.tpopkontr_id)
        ON apflora.tpop."TPopId" = apflora.tpopkontr."TPopId")
      ON apflora.pop."PopId" = apflora.tpop."PopId")
    ON apflora.ap."ApArtId" = apflora.pop."ApArtId"
GROUP BY
  apflora.ap."ApArtId",
  apflora.pop."PopId",
  apflora.tpop."TPopId",
  apflora.tpopkontr."TPopKontrId",
  apflora.tpopkontrzaehl.id
HAVING
  apflora.tpopkontrzaehl.id IS NULL
  AND apflora.tpopkontr."TPopKontrJahr" IS NOT NULL
  AND apflora.tpopkontr."TPopKontrTyp" <> 'Freiwilligen-Erfolgskontrolle'
ORDER BY
  apflora.ap."ApArtId",
  apflora.pop."PopNr",
  apflora.tpop."TPopNr",
  apflora.tpopkontr."TPopKontrJahr";

DROP VIEW IF EXISTS apflora.v_qk2_freiwkontr_ohnezaehlung CASCADE;
CREATE OR REPLACE VIEW apflora.v_qk2_freiwkontr_ohnezaehlung AS
SELECT
  apflora.ap."ProjId",
  apflora.ap."ApArtId",
  'Freiwilligen-Kontrolle ohne Zaehlung:'::text AS hw,
  ARRAY['Projekte', 1 , 'Arten', apflora.ap."ApArtId", 'Populationen', apflora.pop."PopId", 'Teil-Populationen', apflora.tpop."TPopId", 'Freiwilligen-Kontrollen', apflora.tpopkontr."TPopKontrId"]::text[] AS url,
  ARRAY[concat('Population (Nr.): ', apflora.pop."PopNr"), concat('Teil-Population (Nr.): ', apflora.tpop."TPopNr"), concat('Feld-Kontrolle (Jahr): ', apflora.tpopkontr."TPopKontrJahr")]::text[] AS text,
  apflora.tpopkontr."TPopKontrJahr" AS "Berichtjahr"
FROM
  apflora.ap
  INNER JOIN
    (apflora.pop
    INNER JOIN
      (apflora.tpop
      INNER JOIN
        (apflora.tpopkontr
        LEFT JOIN
          apflora.tpopkontrzaehl
          ON apflora.tpopkontr."TPopKontrId" = apflora.tpopkontrzaehl.tpopkontr_id)
        ON apflora.tpop."TPopId" = apflora.tpopkontr."TPopId")
      ON apflora.pop."PopId" = apflora.tpop."PopId")
    ON apflora.ap."ApArtId" = apflora.pop."ApArtId"
GROUP BY
  apflora.ap."ApArtId",
  apflora.pop."PopId",
  apflora.tpop."TPopId",
  apflora.tpopkontr."TPopKontrId",
  apflora.tpopkontrzaehl.id
HAVING
  apflora.tpopkontrzaehl.id IS NULL
  AND apflora.tpopkontr."TPopKontrJahr" IS NOT NULL
  AND apflora.tpopkontr."TPopKontrTyp" = 'Freiwilligen-Erfolgskontrolle'
ORDER BY
  apflora.ap."ApArtId",
  apflora.pop."PopNr",
  apflora.tpop."TPopNr",
  apflora.tpopkontr."TPopKontrJahr";

DROP VIEW IF EXISTS apflora.v_qk2_feldkontrzaehlung_ohneeinheit CASCADE;
CREATE OR REPLACE VIEW apflora.v_qk2_feldkontrzaehlung_ohneeinheit AS
SELECT
  apflora.ap."ProjId",
  apflora.ap."ApArtId",
  'Zaehlung ohne Zaehleinheit (Feldkontrolle):'::text AS hw,
  ARRAY['Projekte', 1 , 'Arten', apflora.ap."ApArtId", 'Populationen', apflora.pop."PopId", 'Teil-Populationen', apflora.tpop."TPopId", 'Feld-Kontrollen', apflora.tpopkontr."TPopKontrId", 'Zählungen', apflora.tpopkontrzaehl.id]::text[] AS url,
  ARRAY[concat('Population (Nr.): ', apflora.pop."PopNr"), concat('Teil-Population (Nr.): ', apflora.tpop."TPopNr"), concat('Feld-Kontrolle (Jahr): ', apflora.tpopkontr."TPopKontrJahr"), concat('Zählung (id): ', apflora.tpopkontrzaehl.id)]::text[] AS text,
  apflora.tpopkontr."TPopKontrJahr" AS "Berichtjahr"
FROM
  apflora.ap
  INNER JOIN
    (apflora.pop
    INNER JOIN
      (apflora.tpop
      INNER JOIN
        (apflora.tpopkontr
        INNER JOIN
          apflora.tpopkontrzaehl
          ON apflora.tpopkontr."TPopKontrId" = apflora.tpopkontrzaehl.tpopkontr_id)
        ON apflora.tpop."TPopId" = apflora.tpopkontr."TPopId")
      ON apflora.pop."PopId" = apflora.tpop."PopId")
    ON apflora.ap."ApArtId" = apflora.pop."ApArtId"
WHERE
  apflora.tpopkontrzaehl.einheit IS NULL
  AND apflora.tpopkontr."TPopKontrJahr" IS NOT NULL
  AND apflora.tpopkontr."TPopKontrTyp" <> 'Freiwilligen-Erfolgskontrolle'
ORDER BY
  apflora.pop."PopNr",
  apflora.tpop."TPopNr",
  apflora.tpopkontr."TPopKontrJahr";

DROP VIEW IF EXISTS apflora.v_qk2_freiwkontrzaehlung_ohneeinheit CASCADE;
CREATE OR REPLACE VIEW apflora.v_qk2_freiwkontrzaehlung_ohneeinheit AS
SELECT
  apflora.ap."ProjId",
  apflora.ap."ApArtId",
  'Zaehlung ohne Zaehleinheit (Freiwilligen-Kontrolle):'::text AS hw,
  ARRAY['Projekte', 1 , 'Arten', apflora.ap."ApArtId", 'Populationen', apflora.pop."PopId", 'Teil-Populationen', apflora.tpop."TPopId", 'Freiwilligen-Kontrollen', apflora.tpopkontr."TPopKontrId", 'Zählungen', apflora.tpopkontrzaehl.id]::text[] AS url,
  ARRAY[concat('Population (Nr.): ', apflora.pop."PopNr"), concat('Teil-Population (Nr.): ', apflora.tpop."TPopNr"), concat('Feld-Kontrolle (Jahr): ', apflora.tpopkontr."TPopKontrJahr"), concat('Zählung (id): ', apflora.tpopkontrzaehl.id)]::text[] AS text,
  apflora.tpopkontr."TPopKontrJahr" AS "Berichtjahr"
FROM
  apflora.ap
  INNER JOIN
    (apflora.pop
    INNER JOIN
      (apflora.tpop
      INNER JOIN
        (apflora.tpopkontr
        INNER JOIN
          apflora.tpopkontrzaehl
          ON apflora.tpopkontr."TPopKontrId" = apflora.tpopkontrzaehl.tpopkontr_id)
        ON apflora.tpop."TPopId" = apflora.tpopkontr."TPopId")
      ON apflora.pop."PopId" = apflora.tpop."PopId")
    ON apflora.ap."ApArtId" = apflora.pop."ApArtId"
WHERE
  apflora.tpopkontrzaehl.einheit IS NULL
  AND apflora.tpopkontr."TPopKontrJahr" IS NOT NULL
  AND apflora.tpopkontr."TPopKontrTyp" = 'Freiwilligen-Erfolgskontrolle'
ORDER BY
  apflora.pop."PopNr",
  apflora.tpop."TPopNr",
  apflora.tpopkontr."TPopKontrJahr";

DROP VIEW IF EXISTS apflora.v_qk2_feldkontrzaehlung_ohnemethode CASCADE;
CREATE OR REPLACE VIEW apflora.v_qk2_feldkontrzaehlung_ohnemethode AS
SELECT
  apflora.ap."ProjId",
  apflora.ap."ApArtId",
  'Zaehlung ohne Methode (Feldkontrolle):'::text AS hw,
  ARRAY['Projekte', 1 , 'Arten', apflora.ap."ApArtId", 'Populationen', apflora.pop."PopId", 'Teil-Populationen', apflora.tpop."TPopId", 'Feld-Kontrollen', apflora.tpopkontr."TPopKontrId", 'Zählungen', apflora.tpopkontrzaehl.id]::text[] AS url,
  ARRAY[concat('Population (Nr.): ', apflora.pop."PopNr"), concat('Teil-Population (Nr.): ', apflora.tpop."TPopNr"), concat('Feld-Kontrolle (Jahr): ', apflora.tpopkontr."TPopKontrJahr"), concat('Zählung (id): ', apflora.tpopkontrzaehl.id)]::text[] AS text,
  apflora.tpopkontr."TPopKontrJahr" AS "Berichtjahr"
FROM
  apflora.ap
  INNER JOIN
    (apflora.pop
    INNER JOIN
      (apflora.tpop
      INNER JOIN
        (apflora.tpopkontr
        INNER JOIN
          apflora.tpopkontrzaehl
          ON apflora.tpopkontr."TPopKontrId" = apflora.tpopkontrzaehl.tpopkontr_id)
        ON apflora.tpop."TPopId" = apflora.tpopkontr."TPopId")
      ON apflora.pop."PopId" = apflora.tpop."PopId")
    ON apflora.ap."ApArtId" = apflora.pop."ApArtId"
WHERE
  apflora.tpopkontrzaehl.methode IS NULL
  AND apflora.tpopkontr."TPopKontrJahr" IS NOT NULL
  AND apflora.tpopkontr."TPopKontrTyp" <> 'Freiwilligen-Erfolgskontrolle'
ORDER BY
  apflora.pop."PopNr",
  apflora.tpop."TPopNr",
  apflora.tpopkontr."TPopKontrJahr";

DROP VIEW IF EXISTS apflora.v_qk2_freiwkontrzaehlung_ohnemethode CASCADE;
CREATE OR REPLACE VIEW apflora.v_qk2_freiwkontrzaehlung_ohnemethode AS
SELECT
  apflora.ap."ProjId",
  apflora.ap."ApArtId",
  'Zaehlung ohne Methode (Freiwilligen-Kontrolle):'::text AS hw,
  ARRAY['Projekte', 1 , 'Arten', apflora.ap."ApArtId", 'Populationen', apflora.pop."PopId", 'Teil-Populationen', apflora.tpop."TPopId", 'Freiwilligen-Kontrollen', apflora.tpopkontr."TPopKontrId", 'Zählungen', apflora.tpopkontrzaehl.id]::text[] AS url,
  ARRAY[concat('Population (Nr.): ', apflora.pop."PopNr"), concat('Teil-Population (Nr.): ', apflora.tpop."TPopNr"), concat('Feld-Kontrolle (Jahr): ', apflora.tpopkontr."TPopKontrJahr"), concat('Zählung (id): ', apflora.tpopkontrzaehl.id)]::text[] AS text,
  apflora.tpopkontr."TPopKontrJahr" AS "Berichtjahr"
FROM
  apflora.ap
  INNER JOIN
    (apflora.pop
    INNER JOIN
      (apflora.tpop
      INNER JOIN
        (apflora.tpopkontr
        INNER JOIN
          apflora.tpopkontrzaehl
          ON apflora.tpopkontr."TPopKontrId" = apflora.tpopkontrzaehl.tpopkontr_id)
        ON apflora.tpop."TPopId" = apflora.tpopkontr."TPopId")
      ON apflora.pop."PopId" = apflora.tpop."PopId")
    ON apflora.ap."ApArtId" = apflora.pop."ApArtId"
WHERE
  apflora.tpopkontrzaehl.methode IS NULL
  AND apflora.tpopkontr."TPopKontrJahr" IS NOT NULL
  AND apflora.tpopkontr."TPopKontrTyp" = 'Freiwilligen-Erfolgskontrolle'
ORDER BY
  apflora.pop."PopNr",
  apflora.tpop."TPopNr",
  apflora.tpopkontr."TPopKontrJahr";

DROP VIEW IF EXISTS apflora.v_qk2_feldkontrzaehlung_ohneanzahl CASCADE;
CREATE OR REPLACE VIEW apflora.v_qk2_feldkontrzaehlung_ohneanzahl AS
SELECT
  apflora.ap."ProjId",
  apflora.ap."ApArtId",
  'Zaehlung ohne Anzahl (Feldkontrolle):'::text AS hw,
  ARRAY['Projekte', 1 , 'Arten', apflora.ap."ApArtId", 'Populationen', apflora.pop."PopId", 'Teil-Populationen', apflora.tpop."TPopId", 'Feld-Kontrollen', apflora.tpopkontr."TPopKontrId", 'Zählungen', apflora.tpopkontrzaehl.id]::text[] AS url,
  ARRAY[concat('Population (Nr.): ', apflora.pop."PopNr"), concat('Teil-Population (Nr.): ', apflora.tpop."TPopNr"), concat('Feld-Kontrolle (Jahr): ', apflora.tpopkontr."TPopKontrJahr"), concat('Zählung (id): ', apflora.tpopkontrzaehl.id)]::text[] AS text,
  apflora.tpopkontr."TPopKontrJahr" AS "Berichtjahr"
FROM
  apflora.ap
  INNER JOIN
    (apflora.pop
    INNER JOIN
      (apflora.tpop
      INNER JOIN
        (apflora.tpopkontr
        INNER JOIN
          apflora.tpopkontrzaehl
          ON apflora.tpopkontr."TPopKontrId" = apflora.tpopkontrzaehl.tpopkontr_id)
        ON apflora.tpop."TPopId" = apflora.tpopkontr."TPopId")
      ON apflora.pop."PopId" = apflora.tpop."PopId")
    ON apflora.ap."ApArtId" = apflora.pop."ApArtId"
WHERE
  apflora.tpopkontrzaehl.anzahl IS NULL
  AND apflora.tpopkontr."TPopKontrJahr" IS NOT NULL
  AND apflora.tpopkontr."TPopKontrTyp" <> 'Freiwilligen-Erfolgskontrolle'
ORDER BY
  apflora.pop."PopNr",
  apflora.tpop."TPopNr",
  apflora.tpopkontr."TPopKontrJahr";

DROP VIEW IF EXISTS apflora.v_qk2_freiwkontrzaehlung_ohneanzahl CASCADE;
CREATE OR REPLACE VIEW apflora.v_qk2_freiwkontrzaehlung_ohneanzahl AS
SELECT
  apflora.ap."ProjId",
  apflora.ap."ApArtId",
  'Zaehlung ohne Anzahl (Freiwilligen-Kontrolle):'::text AS hw,
  ARRAY['Projekte', 1 , 'Arten', apflora.ap."ApArtId", 'Populationen', apflora.pop."PopId", 'Teil-Populationen', apflora.tpop."TPopId", 'Freiwilligen-Kontrollen', apflora.tpopkontr."TPopKontrId", 'Zählungen', apflora.tpopkontrzaehl.id]::text[] AS url,
  ARRAY[concat('Population (Nr.): ', apflora.pop."PopNr"), concat('Teil-Population (Nr.): ', apflora.tpop."TPopNr"), concat('Feld-Kontrolle (Jahr): ', apflora.tpopkontr."TPopKontrJahr"), concat('Zählung (id): ', apflora.tpopkontrzaehl.id)]::text[] AS text,
  apflora.tpopkontr."TPopKontrJahr" AS "Berichtjahr"
FROM
  apflora.ap
  INNER JOIN
    (apflora.pop
    INNER JOIN
      (apflora.tpop
      INNER JOIN
        (apflora.tpopkontr
        INNER JOIN
          apflora.tpopkontrzaehl
          ON apflora.tpopkontr."TPopKontrId" = apflora.tpopkontrzaehl.tpopkontr_id)
        ON apflora.tpop."TPopId" = apflora.tpopkontr."TPopId")
      ON apflora.pop."PopId" = apflora.tpop."PopId")
    ON apflora.ap."ApArtId" = apflora.pop."ApArtId"
WHERE
  apflora.tpopkontrzaehl.anzahl IS NULL
  AND apflora.tpopkontr."TPopKontrJahr" IS NOT NULL
  AND apflora.tpopkontr."TPopKontrTyp" = 'Freiwilligen-Erfolgskontrolle'
ORDER BY
  apflora.pop."PopNr",
  apflora.tpop."TPopNr",
  apflora.tpopkontr."TPopKontrJahr";

DROP VIEW IF EXISTS apflora.v_qk2_tpopber_ohnejahr CASCADE;
CREATE OR REPLACE VIEW apflora.v_qk2_tpopber_ohnejahr AS
SELECT
  apflora.ap."ProjId",
  apflora.ap."ApArtId",
  'Teilpopulations-Bericht ohne Jahr:'::text AS hw,
  ARRAY['Projekte', 1 , 'Arten', apflora.ap."ApArtId", 'Populationen', apflora.pop."PopId", 'Teil-Populationen', apflora.tpop."TPopId", 'Kontroll-Berichte', apflora.tpopber.id]::text[] AS url,
  ARRAY[concat('Population (Nr.): ', apflora.pop."PopNr"), concat('Teil-Population (Nr.): ', apflora.tpop."TPopNr"), concat('Teilpopulations-Bericht (id): ', apflora.tpopber.id)]::text[] AS text
FROM
  apflora.ap
  INNER JOIN
    (apflora.pop
    INNER JOIN
      (apflora.tpop
      INNER JOIN
        apflora.tpopber
        ON apflora.tpop."TPopId" = apflora.tpopber.tpop_id)
      ON apflora.pop."PopId" = apflora.tpop."PopId")
    ON apflora.ap."ApArtId" = apflora.pop."ApArtId"
WHERE
  apflora.tpopber.jahr IS NULL
ORDER BY
  apflora.pop."PopNr",
  apflora.tpop."TPopNr",
  apflora.tpopber.jahr;

DROP VIEW IF EXISTS apflora.v_qk2_tpopber_ohneentwicklung CASCADE;
CREATE OR REPLACE VIEW apflora.v_qk2_tpopber_ohneentwicklung AS
SELECT
  apflora.ap."ProjId",
  apflora.ap."ApArtId",
  'Teilpopulations-Bericht ohne Entwicklung:'::text AS hw,
  ARRAY['Projekte', 1 , 'Arten', apflora.ap."ApArtId", 'Populationen', apflora.pop."PopId", 'Teil-Populationen', apflora.tpop."TPopId", 'Kontroll-Berichte', apflora.tpopber.id]::text[] AS url,
  ARRAY[concat('Population (Nr.): ', apflora.pop."PopNr"), concat('Teil-Population (Nr.): ', apflora.tpop."TPopNr"), concat('Teilpopulations-Bericht (Jahr): ', apflora.tpopber.jahr)]::text[] AS text,
  apflora.tpopber.jahr AS "Berichtjahr"
FROM
  apflora.ap
  INNER JOIN
    apflora.pop
    INNER JOIN
      apflora.tpop
      INNER JOIN
        apflora.tpopber
        ON apflora.tpop."TPopId" = apflora.tpopber.tpop_id
      ON apflora.pop."PopId" = apflora.tpop."PopId"
    ON apflora.ap."ApArtId" = apflora.pop."ApArtId"
WHERE
  apflora.tpopber.entwicklung IS NULL
  AND apflora.tpopber.jahr IS NOT NULL
ORDER BY
  apflora.pop."PopNr",
  apflora.tpop."TPopNr",
  apflora.tpopber.jahr;

DROP VIEW IF EXISTS apflora.v_qk2_popber_ohneentwicklung CASCADE;
CREATE OR REPLACE VIEW apflora.v_qk2_popber_ohneentwicklung AS
SELECT
  apflora.ap."ProjId",
  apflora.ap."ApArtId",
  'Populations-Bericht ohne Entwicklung:'::text AS hw,
  ARRAY['Projekte', 1 , 'Arten', apflora.ap."ApArtId", 'Populationen', apflora.pop."PopId", 'Kontroll-Berichte', apflora.popber."PopBerId"]::text[] AS url,
  ARRAY[concat('Population (Nr.): ', apflora.pop."PopNr"), concat('Populations-Bericht (Jahr): ', apflora.popber."PopBerJahr")]::text[] AS text,
  apflora.popber."PopBerJahr" AS "Berichtjahr"
FROM
  apflora.ap
  INNER JOIN
    apflora.pop
    INNER JOIN
      apflora.popber
      ON apflora.pop."PopId" = apflora.popber."PopId"
    ON apflora.ap."ApArtId" = apflora.pop."ApArtId"
WHERE
  apflora.popber."PopBerEntwicklung" IS NULL
  AND apflora.popber."PopBerJahr" IS NOT NULL
ORDER BY
  apflora.pop."PopNr",
  apflora.popber."PopBerJahr";

DROP VIEW IF EXISTS apflora.v_qk2_popber_ohnejahr CASCADE;
CREATE OR REPLACE VIEW apflora.v_qk2_popber_ohnejahr AS
SELECT
  apflora.ap."ProjId",
  apflora.ap."ApArtId",
  'Populations-Bericht ohne Jahr:'::text AS hw,
  ARRAY['Projekte', 1 , 'Arten', apflora.ap."ApArtId", 'Populationen', apflora.pop."PopId", 'Kontroll-Berichte', apflora.popber."PopBerId"]::text[] AS url,
  ARRAY[concat('Population (Nr.): ', apflora.pop."PopNr"), concat('Populations-Bericht (Jahr): ', apflora.popber."PopBerJahr")]::text[] AS text
FROM
  apflora.ap
  INNER JOIN
    apflora.pop
    INNER JOIN
      apflora.popber
      ON apflora.pop."PopId" = apflora.popber."PopId"
    ON apflora.ap."ApArtId" = apflora.pop."ApArtId"
WHERE
  apflora.popber."PopBerJahr" IS NULL
ORDER BY
  apflora.pop."PopNr",
  apflora.popber."PopBerJahr";

DROP VIEW IF EXISTS apflora.v_qk2_popmassnber_ohnejahr CASCADE;
CREATE OR REPLACE VIEW apflora.v_qk2_popmassnber_ohnejahr AS
SELECT
  apflora.ap."ProjId",
  apflora.ap."ApArtId",
  'Populations-Massnahmen-Bericht ohne Jahr:'::text AS hw,
  ARRAY['Projekte', 1 , 'Arten', apflora.ap."ApArtId", 'Populationen', apflora.pop."PopId", 'Massnahmen-Berichte', apflora.popmassnber."PopMassnBerId"]::text[] AS url,
  ARRAY[concat('Population (Nr.): ', apflora.pop."PopNr"), concat('Populations-Massnahmen-Bericht (Jahr): ', apflora.popmassnber."PopMassnBerJahr")]::text[] AS text
FROM
  apflora.ap
  INNER JOIN
    apflora.pop
    INNER JOIN
      apflora.popmassnber
      ON apflora.pop."PopId" = apflora.popmassnber."PopId"
    ON apflora.ap."ApArtId" = apflora.pop."ApArtId"
WHERE
  apflora.popmassnber."PopMassnBerJahr" IS NULL
ORDER BY
  apflora.pop."PopNr",
  apflora.popmassnber."PopMassnBerJahr";

DROP VIEW IF EXISTS apflora.v_qk2_popmassnber_ohneentwicklung CASCADE;
CREATE OR REPLACE VIEW apflora.v_qk2_popmassnber_ohneentwicklung AS
SELECT
  apflora.ap."ProjId",
  apflora.ap."ApArtId",
  'Populations-Massnahmen-Bericht ohne Entwicklung:'::text AS hw,
  ARRAY['Projekte', 1 , 'Arten', apflora.ap."ApArtId", 'Populationen', apflora.pop."PopId", 'Massnahmen-Berichte', apflora.popmassnber."PopMassnBerId"]::text[] AS url,
  ARRAY[concat('Population (Nr.): ', apflora.pop."PopNr"), concat('Populations-Massnahmen-Bericht (Jahr): ', apflora.popmassnber."PopMassnBerJahr")]::text[] AS text,
  apflora.popmassnber."PopMassnBerJahr" AS "Berichtjahr"
FROM
  apflora.ap
  INNER JOIN
    apflora.pop
    INNER JOIN
      apflora.popmassnber
      ON apflora.pop."PopId" = apflora.popmassnber."PopId"
    ON apflora.ap."ApArtId" = apflora.pop."ApArtId"
WHERE
  apflora.popmassnber."PopMassnBerErfolgsbeurteilung" IS NULL
  AND apflora.popmassnber."PopMassnBerJahr" IS NOT NULL
ORDER BY
  apflora.pop."PopNr",
  apflora.popmassnber."PopMassnBerJahr";

DROP VIEW IF EXISTS apflora.v_qk2_zielber_ohneentwicklung CASCADE;
CREATE OR REPLACE VIEW apflora.v_qk2_zielber_ohneentwicklung AS
SELECT
  apflora.ap."ProjId",
  apflora.ap."ApArtId",
  'Ziel-Bericht ohne Entwicklung:'::text AS hw,
  ARRAY['Projekte', 1 , 'Arten', apflora.ap."ApArtId", 'Ziele', apflora.ziel."ZielId", 'Berichte', apflora.zielber.id]::text[] AS url,
  ARRAY[concat('Ziel (Jahr): ', apflora.ziel."ZielJahr"), concat('Ziel-Bericht (Jahr): ', apflora.zielber.jahr)]::text[] AS text,
  apflora.zielber.jahr AS "Berichtjahr"
FROM
  apflora.ap
  INNER JOIN
    apflora.ziel
    INNER JOIN
      apflora.zielber
      ON apflora.ziel."ZielId" = apflora.zielber.ziel_id
    ON apflora.ap."ApArtId" = apflora.ziel."ApArtId"
WHERE
  apflora.zielber.erreichung IS NULL
  AND apflora.zielber.jahr IS NOT NULL
ORDER BY
  apflora.ziel."ZielJahr",
  apflora.ziel."ZielId",
  apflora.zielber.jahr;

DROP VIEW IF EXISTS apflora.v_qk2_zielber_ohnejahr CASCADE;
CREATE OR REPLACE VIEW apflora.v_qk2_zielber_ohnejahr AS
SELECT
  apflora.ap."ProjId",
  apflora.ap."ApArtId",
  'Ziel-Bericht ohne Jahr:'::text AS hw,
  ARRAY['Projekte', 1 , 'Arten', apflora.ap."ApArtId", 'Ziele', apflora.ziel."ZielId", 'Berichte', apflora.zielber.id]::text[] AS url,
  ARRAY[concat('Ziel (Jahr): ', apflora.ziel."ZielJahr"), concat('Ziel-Bericht (Jahr): ', apflora.zielber.jahr)]::text[] AS text
FROM
  apflora.ap
  INNER JOIN
    (apflora.ziel
    INNER JOIN
      apflora.zielber
      ON apflora.ziel."ZielId" = apflora.zielber.ziel_id)
    ON apflora.ap."ApArtId" = apflora.ziel."ApArtId"
WHERE
  apflora.zielber.jahr IS NULL
ORDER BY
  apflora.ziel."ZielJahr",
  apflora.ziel."ZielId",
  apflora.zielber.jahr;

DROP VIEW IF EXISTS apflora.v_qk2_ziel_ohnejahr CASCADE;
CREATE OR REPLACE VIEW apflora.v_qk2_ziel_ohnejahr AS
SELECT
  apflora.ap."ProjId",
  apflora.ap."ApArtId",
  'Ziel ohne Jahr:'::text AS hw,
  ARRAY['Projekte', 1 , 'Arten', apflora.ap."ApArtId", 'Ziele', apflora.ziel."ZielId"]::text[] AS url,
  ARRAY[concat('Ziel (id): ', apflora.ziel."ZielId")]::text[] AS text
FROM
  apflora.ap
  INNER JOIN
    apflora.ziel
    ON apflora.ap."ApArtId" = apflora.ziel."ApArtId"
WHERE
  apflora.ziel."ZielJahr" IS NULL
  OR apflora.ziel."ZielJahr" = 1
ORDER BY
  apflora.ziel."ZielId";

DROP VIEW IF EXISTS apflora.v_qk2_ziel_ohnetyp CASCADE;
CREATE OR REPLACE VIEW apflora.v_qk2_ziel_ohnetyp AS
SELECT
  apflora.ap."ProjId",
  apflora.ap."ApArtId",
  'Ziel ohne Typ:'::text AS hw,
  ARRAY['Projekte', 1 , 'Arten', apflora.ap."ApArtId", 'Ziele', apflora.ziel."ZielId"]::text[] AS url,
  ARRAY[concat('Ziel (Jahr): ', apflora.ziel."ZielJahr")]::text[] AS text
FROM
  apflora.ap
  INNER JOIN
    apflora.ziel
    ON apflora.ap."ApArtId" = apflora.ziel."ApArtId"
WHERE
  apflora.ziel."ZielTyp" IS NULL
ORDER BY
  apflora.ziel."ZielJahr";

DROP VIEW IF EXISTS apflora.v_qk2_ziel_ohneziel CASCADE;
CREATE OR REPLACE VIEW apflora.v_qk2_ziel_ohneziel AS
SELECT
  apflora.ap."ProjId",
  apflora.ap."ApArtId",
  'Ziel ohne Ziel:'::text AS hw,
  ARRAY['Projekte', 1 , 'Arten', apflora.ap."ApArtId", 'Ziele', apflora.ziel."ZielId"]::text[] AS url,
  ARRAY[concat('Ziel (Jahr): ', apflora.ziel."ZielJahr")]::text[] AS text
FROM
  apflora.ap
  INNER JOIN
    apflora.ziel
    ON apflora.ap."ApArtId" = apflora.ziel."ApArtId"
WHERE
  apflora.ziel."ZielBezeichnung" IS NULL
ORDER BY
  apflora.ziel."ZielJahr";

DROP VIEW IF EXISTS apflora.v_qk2_erfkrit_ohnebeurteilung CASCADE;
CREATE OR REPLACE VIEW apflora.v_qk2_erfkrit_ohnebeurteilung AS
SELECT
  apflora.ap."ProjId",
  apflora.ap."ApArtId",
  'Erfolgskriterium ohne Beurteilung:'::text AS hw,
  ARRAY['Projekte', 1 , 'Arten', apflora.ap."ApArtId", 'Erfolgskriterien', apflora.erfkrit.id]::text[] AS url,
  ARRAY[concat('Erfolgskriterium (id): ', apflora.erfkrit.id)]::text[] AS text
FROM
  apflora.ap
  INNER JOIN
    apflora.erfkrit
    ON apflora.ap."ApArtId" = apflora.erfkrit.ap_id
WHERE
  apflora.erfkrit.erfolg IS NULL
ORDER BY
  apflora.erfkrit.id;

DROP VIEW IF EXISTS apflora.v_qk2_erfkrit_ohnekriterien CASCADE;
CREATE OR REPLACE VIEW apflora.v_qk2_erfkrit_ohnekriterien AS
SELECT
  apflora.ap."ProjId",
  apflora.ap."ApArtId",
  'Erfolgskriterium ohne Kriterien:'::text AS hw,
  ARRAY['Projekte', 1 , 'Arten', apflora.ap."ApArtId", 'Erfolgskriterien', apflora.erfkrit.id]::text[] AS url,
  ARRAY[concat('Erfolgskriterium (id): ', apflora.erfkrit.id)]::text[] AS text
FROM
  apflora.ap
  INNER JOIN
    apflora.erfkrit
    ON apflora.ap."ApArtId" = apflora.erfkrit.ap_id
WHERE
  apflora.erfkrit.kriterien IS NULL
ORDER BY
  apflora.erfkrit.id;

DROP VIEW IF EXISTS apflora.v_qk2_apber_ohnejahr CASCADE;
CREATE OR REPLACE VIEW apflora.v_qk2_apber_ohnejahr AS
SELECT
  apflora.ap."ProjId",
  apflora.ap."ApArtId",
  'AP-Bericht ohne Jahr:'::text AS hw,
  ARRAY['Projekte', 1 , 'Arten', apflora.ap."ApArtId", 'AP-Berichte', apflora.apber."JBerId"]::text[] AS url,
  ARRAY[concat('AP-Bericht (id): ', apflora.apber."JBerId")]::text[] AS text
FROM
  apflora.ap
  INNER JOIN
    apflora.apber
    ON apflora.ap."ApArtId" = apflora.apber."ApArtId"
GROUP BY
  apflora.ap."ApArtId",
  apflora.apber."JBerId"
HAVING
  apflora.apber."JBerJahr" IS NULL
ORDER BY
  apflora.apber."JBerId";

DROP VIEW IF EXISTS apflora.v_qk2_apber_ohnevergleichvorjahrgesamtziel CASCADE;
CREATE OR REPLACE VIEW apflora.v_qk2_apber_ohnevergleichvorjahrgesamtziel AS
SELECT
  apflora.ap."ProjId",
  apflora.ap."ApArtId",
  'AP-Bericht ohne Vergleich Vorjahr - Gesamtziel:'::text AS hw,
  ARRAY['Projekte', 1 , 'Arten', apflora.ap."ApArtId", 'AP-Berichte', apflora.apber."JBerId"]::text[] AS url,
  ARRAY[concat('AP-Bericht (Jahr): ', apflora.apber."JBerJahr")]::text[] AS text,
  apflora.apber."JBerJahr" AS "Berichtjahr"
FROM
  apflora.ap
  INNER JOIN
    apflora.apber
    ON apflora.ap."ApArtId" = apflora.apber."ApArtId"
WHERE
  apflora.apber."JBerVergleichVorjahrGesamtziel" IS NULL
  AND apflora.apber."JBerJahr" IS NOT NULL
ORDER BY
  apflora.apber."JBerJahr";

DROP VIEW IF EXISTS apflora.v_qk2_apber_ohnebeurteilung CASCADE;
CREATE OR REPLACE VIEW apflora.v_qk2_apber_ohnebeurteilung AS
SELECT
  apflora.ap."ProjId",
  apflora.ap."ApArtId",
  'AP-Bericht ohne Beurteilung:'::text AS hw,
  ARRAY['Projekte', 1 , 'Arten', apflora.ap."ApArtId", 'AP-Berichte', apflora.apber."JBerId"]::text[] AS url,
  ARRAY[concat('AP-Bericht (Jahr): ', apflora.apber."JBerJahr")]::text[] AS text,
  apflora.apber."JBerJahr" AS "Berichtjahr"
FROM
  apflora.ap
  INNER JOIN
    apflora.apber
    ON apflora.ap."ApArtId" = apflora.apber."ApArtId"
WHERE
  apflora.apber."JBerBeurteilung" IS NULL
  AND apflora.apber."JBerJahr" IS NOT NULL
ORDER BY
  apflora.apber."JBerJahr";

DROP VIEW IF EXISTS apflora.v_qk2_assozart_ohneart CASCADE;
CREATE OR REPLACE VIEW apflora.v_qk2_assozart_ohneart AS
SELECT
  apflora.ap."ProjId",
  apflora.ap."ApArtId",
  'Assoziierte Art ohne Art:'::text AS hw,
  ARRAY['Projekte', 1 , 'Arten', apflora.ap."ApArtId", 'assoziierte-Arten', apflora.assozart.id]::text[] AS url,
  ARRAY[concat('Assoziierte Art (id): ', apflora.assozart.id)]::text[] AS text
FROM
  apflora.ap
  INNER JOIN
    apflora.assozart
    ON apflora.ap."ApArtId" = apflora.assozart.ap_id
WHERE
  apflora.assozart.ae_id IS NULL
ORDER BY
  apflora.assozart.id;

DROP VIEW IF EXISTS apflora.v_qk2_pop_koordentsprechenkeinertpop CASCADE;
CREATE OR REPLACE VIEW apflora.v_qk2_pop_koordentsprechenkeinertpop AS
SELECT DISTINCT
  apflora.ap."ProjId",
  apflora.pop."ApArtId",
  'Population: Koordinaten entsprechen keiner Teilpopulation:'::text AS hw,
  ARRAY['Projekte', 1 , 'Arten', apflora.ap."ApArtId", 'Populationen', apflora.pop."PopId"]::text[] AS url,
  ARRAY[concat('Population (Nr): ', apflora.pop."PopNr")]::text[] AS text,
  apflora.pop."PopXKoord" AS "XKoord",
  apflora.pop."PopYKoord" AS "YKoord"
FROM
  apflora.ap
  INNER JOIN
    apflora.pop
    ON apflora.pop."ApArtId" = apflora.ap."ApArtId"
WHERE
  apflora.pop."PopXKoord" Is NOT Null
  AND apflora.pop."PopYKoord" IS NOT NULL
  AND apflora.pop."PopId" NOT IN (
    SELECT
      apflora.tpop."PopId"
    FROM
      apflora.tpop
    WHERE
      apflora.tpop."TPopXKoord" = "PopXKoord"
      AND apflora.tpop."TPopYKoord" = "PopYKoord"
  )
  ORDER BY
    apflora.ap."ProjId",
    apflora.pop."ApArtId";

DROP VIEW IF EXISTS apflora.v_qk2_pop_statusansaatversuchmitaktuellentpop CASCADE;
CREATE OR REPLACE VIEW apflora.v_qk2_pop_statusansaatversuchmitaktuellentpop AS
SELECT DISTINCT
  apflora.ap."ProjId",
  apflora.pop."ApArtId",
  'Population: Status ist "angesiedelt, Ansaatversuch", es gibt aber eine aktuelle Teilpopulation oder eine ursprüngliche erloschene:'::text AS hw,
  ARRAY['Projekte', 1 , 'Arten', apflora.ap."ApArtId", 'Populationen', apflora.pop."PopId"]::text[] AS url,
  ARRAY[concat('Population (Nr): ', apflora.pop."PopNr")]::text[] AS text
FROM
  apflora.ap
  INNER JOIN
    apflora.pop
    ON apflora.pop."ApArtId" = apflora.ap."ApArtId"
WHERE
  apflora.pop."PopHerkunft" = 201
  AND apflora.pop."PopId" IN (
    SELECT DISTINCT
      apflora.tpop."PopId"
    FROM
      apflora.tpop
    WHERE
      apflora.tpop."TPopHerkunft" IN (100, 101, 200, 210)
  );

DROP VIEW IF EXISTS apflora.v_qk2_pop_statusansaatversuchalletpoperloschen CASCADE;
CREATE OR REPLACE VIEW apflora.v_qk2_pop_statusansaatversuchalletpoperloschen AS
SELECT DISTINCT
  apflora.ap."ProjId",
  apflora.pop."ApArtId",
  'Population: Status ist "angesiedelt, Ansaatversuch", alle Teilpopulationen sind gemäss Status erloschen:'::text AS hw,
  ARRAY['Projekte', 1 , 'Arten', apflora.ap."ApArtId", 'Populationen', apflora.pop."PopId"]::text[] AS url,
  ARRAY[concat('Population (Nr): ', apflora.pop."PopNr")]::text[] AS text
FROM
  apflora.ap
    INNER JOIN apflora.pop
      INNER JOIN apflora.tpop
      ON apflora.tpop."PopId" = apflora.pop."PopId"
    ON apflora.pop."ApArtId" = apflora.ap."ApArtId"
WHERE
  apflora.pop."PopHerkunft" = 201
  AND EXISTS (
    SELECT
      1
    FROM
      apflora.tpop
    WHERE
      apflora.tpop."TPopHerkunft" IN (101, 202, 211)
      AND apflora.tpop."PopId" = apflora.pop."PopId"
  )
  AND NOT EXISTS (
    SELECT
      1
    FROM
      apflora.tpop
    WHERE
      apflora.tpop."TPopHerkunft" NOT IN (101, 202, 211)
      AND apflora.tpop."PopId" = apflora.pop."PopId"
  );

  DROP VIEW IF EXISTS apflora.v_qk2_pop_statusansaatversuchmittpopursprerloschen CASCADE;
  CREATE OR REPLACE VIEW apflora.v_qk2_pop_statusansaatversuchmittpopursprerloschen AS
  SELECT DISTINCT
    apflora.ap."ProjId",
    apflora.pop."ApArtId",
    'Population: Status ist "angesiedelt, Ansaatversuch", es gibt aber eine Teilpopulation mit Status "urspruenglich, erloschen":'::text AS hw,
    ARRAY['Projekte', 1 , 'Arten', apflora.ap."ApArtId", 'Populationen', apflora.pop."PopId"]::text[] AS url,
  ARRAY[concat('Population (Nr): ', apflora.pop."PopNr")]::text[] AS text
  FROM
    apflora.ap
    INNER JOIN
      apflora.pop
      ON apflora.pop."ApArtId" = apflora.ap."ApArtId"
  WHERE
    apflora.pop."PopHerkunft" = 201
    AND apflora.pop."PopId" IN (
      SELECT DISTINCT
        apflora.tpop."PopId"
      FROM
        apflora.tpop
      WHERE
        apflora.tpop."TPopHerkunft" = 101
    );

DROP VIEW IF EXISTS apflora.v_qk2_pop_statuserloschenmittpopaktuell CASCADE;
CREATE OR REPLACE VIEW apflora.v_qk2_pop_statuserloschenmittpopaktuell AS
SELECT DISTINCT
  apflora.ap."ProjId",
  apflora.pop."ApArtId",
  'Population: Status ist "erloschen" (urspruenglich oder angesiedelt), es gibt aber eine Teilpopulation mit Status "aktuell" (urspruenglich oder angesiedelt):'::text AS hw,
    ARRAY['Projekte', 1 , 'Arten', apflora.ap."ApArtId", 'Populationen', apflora.pop."PopId"]::text[] AS url,
  ARRAY[concat('Population (Nr): ', apflora.pop."PopNr")]::text[] AS text
FROM
  apflora.ap
  INNER JOIN
    apflora.pop
    ON apflora.pop."ApArtId" = apflora.ap."ApArtId"
WHERE
  apflora.pop."PopHerkunft" IN (101, 202, 211)
  AND apflora.pop."PopId" IN (
    SELECT DISTINCT
      apflora.tpop."PopId"
    FROM
      apflora.tpop
    WHERE
      apflora.tpop."TPopHerkunft" IN (100, 200, 210)
  );

DROP VIEW IF EXISTS apflora.v_qk2_pop_statuserloschenmittpopansaatversuch CASCADE;
CREATE OR REPLACE VIEW apflora.v_qk2_pop_statuserloschenmittpopansaatversuch AS
SELECT DISTINCT
  apflora.ap."ProjId",
  apflora.pop."ApArtId",
  'Population: Status ist "erloschen" (urspruenglich oder angesiedelt), es gibt aber eine Teilpopulation mit Status "angesiedelt, Ansaatversuch":'::text AS hw,
    ARRAY['Projekte', 1 , 'Arten', apflora.ap."ApArtId", 'Populationen', apflora.pop."PopId"]::text[] AS url,
  ARRAY[concat('Population (Nr): ', apflora.pop."PopNr")]::text[] AS text
FROM
  apflora.ap
  INNER JOIN
    apflora.pop
    ON apflora.pop."ApArtId" = apflora.ap."ApArtId"
WHERE
  apflora.pop."PopHerkunft" IN (101, 202, 211)
  AND apflora.pop."PopId" IN (
    SELECT DISTINCT
      apflora.tpop."PopId"
    FROM
      apflora.tpop
    WHERE
      apflora.tpop."TPopHerkunft" = 201
  );

DROP VIEW IF EXISTS apflora.v_qk2_pop_statusangesiedeltmittpopurspruenglich CASCADE;
CREATE OR REPLACE VIEW apflora.v_qk2_pop_statusangesiedeltmittpopurspruenglich AS
SELECT DISTINCT
  apflora.ap."ProjId",
  apflora.pop."ApArtId",
  'Population: Status ist "angesiedelt", es gibt aber eine Teilpopulation mit Status "urspruenglich":'::text AS hw,
  ARRAY['Projekte', 1 , 'Arten', apflora.ap."ApArtId", 'Populationen', apflora.pop."PopId"]::text[] AS url,
  ARRAY[concat('Population (Nr): ', apflora.pop."PopNr")]::text[] AS text
FROM
  apflora.ap
  INNER JOIN
    apflora.pop
    ON apflora.pop."ApArtId" = apflora.ap."ApArtId"
WHERE
  apflora.pop."PopHerkunft" IN (200, 201, 202, 210, 211)
  AND apflora.pop."PopId" IN (
    SELECT DISTINCT
      apflora.tpop."PopId"
    FROM
      apflora.tpop
    WHERE
      apflora.tpop."TPopHerkunft" = 100
  );

DROP VIEW IF EXISTS apflora.v_qk2_pop_statuspotwuchsortmittpopanders CASCADE;
CREATE OR REPLACE VIEW apflora.v_qk2_pop_statuspotwuchsortmittpopanders AS
SELECT DISTINCT
  apflora.ap."ProjId",
  apflora.pop."ApArtId",
  'Population: Status ist "potenzieller Wuchs-/Ansiedlungsort", es gibt aber eine Teilpopulation mit Status "angesiedelt" oder "urspruenglich":'::text AS hw,
  ARRAY['Projekte', 1 , 'Arten', apflora.ap."ApArtId", 'Populationen', apflora.pop."PopId"]::text[] AS url,
  ARRAY[concat('Population (Nr): ', apflora.pop."PopNr")]::text[] AS text
FROM
  apflora.ap
  INNER JOIN
    apflora.pop
    ON apflora.pop."ApArtId" = apflora.ap."ApArtId"
WHERE
  apflora.pop."PopHerkunft" = 300
  AND apflora.pop."PopId" IN (
    SELECT DISTINCT
      apflora.tpop."PopId"
    FROM
      apflora.tpop
    WHERE
      apflora.tpop."TPopHerkunft" < 300
  );

DROP VIEW IF EXISTS apflora.v_qk2_tpop_mitstatusansaatversuchundzaehlungmitanzahl CASCADE;
CREATE OR REPLACE VIEW apflora.v_qk2_tpop_mitstatusansaatversuchundzaehlungmitanzahl AS
SELECT DISTINCT
  apflora.ap."ProjId",
  apflora.pop."ApArtId",
  apflora.pop."PopId",
  apflora.tpop."TPopId",
  'Teilpopulation mit Status "Ansaatversuch", bei denen in der letzten Kontrolle eine Anzahl festgestellt wurde:'::text AS hw,
  ARRAY['Projekte', 1 , 'Arten', apflora.ap."ApArtId", 'Populationen', apflora.pop."PopId", 'Teil-Populationen', apflora.tpop."TPopId"]::text[] AS url,
  ARRAY[concat('Population (Nr.): ', apflora.pop."PopNr"), concat('Teil-Population (Nr.): ', apflora.tpop."TPopNr")]::text[] AS text
FROM
  apflora.ap
  INNER JOIN
    apflora.pop
    INNER JOIN
      apflora.tpop
      ON apflora.tpop."PopId" = apflora.pop."PopId"
    ON apflora.pop."ApArtId" = apflora.ap."ApArtId"
WHERE
  apflora.tpop."TPopHerkunft" = 201
  AND apflora.tpop."TPopId" IN (
    SELECT DISTINCT
      apflora.tpopkontr."TPopId"
    FROM
      (apflora.tpopkontr
      INNER JOIN
        apflora.tpopkontrzaehl
        ON apflora.tpopkontr."TPopKontrId" = apflora.tpopkontrzaehl.tpopkontr_id)
      INNER JOIN
        apflora.v_tpopkontr_letzteid
        ON
          (
            apflora.v_tpopkontr_letzteid."TPopId" = apflora.tpopkontr."TPopId"
            AND apflora.v_tpopkontr_letzteid."MaxTPopKontrId" = apflora.tpopkontr."TPopKontrId"
          )
    WHERE
      apflora.tpopkontr."TPopKontrTyp" NOT IN ('Zwischenziel', 'Ziel')
      AND apflora.tpopkontrzaehl.anzahl > 0
  );

DROP VIEW IF EXISTS apflora.v_qk2_tpop_mitstatuspotentiellundzaehlungmitanzahl CASCADE;
CREATE OR REPLACE VIEW apflora.v_qk2_tpop_mitstatuspotentiellundzaehlungmitanzahl AS
SELECT DISTINCT
  apflora.projekt."ProjId",
  apflora.pop."ApArtId",
  apflora.pop."PopId",
  apflora.tpop."TPopId",
  'Teilpopulation mit Status "potentieller Wuchs-/Ansiedlungsort", bei denen in einer Kontrolle eine Anzahl festgestellt wurde:'::text AS hw,
  ARRAY['Projekte', 1 , 'Arten', apflora.ap."ApArtId", 'Populationen', apflora.pop."PopId", 'Teil-Populationen', apflora.tpop."TPopId"]::text[] AS url,
  ARRAY[concat('Population (Nr.): ', apflora.pop."PopNr"), concat('Teil-Population (Nr.): ', apflora.tpop."TPopNr")]::text[] AS text
FROM
  apflora.projekt
  INNER JOIN
    apflora.ap
    INNER JOIN
      apflora.pop
      INNER JOIN
        apflora.tpop
        ON apflora.tpop."PopId" = apflora.pop."PopId"
      ON apflora.pop."ApArtId" = apflora.ap."ApArtId"
    ON apflora.projekt."ProjId" = apflora.ap."ProjId"
WHERE
  apflora.tpop."TPopHerkunft" = 300
  AND apflora.tpop."TPopId" IN (
    SELECT DISTINCT
      apflora.tpopkontr."TPopId"
    FROM
      apflora.tpopkontr
      INNER JOIN
        apflora.tpopkontrzaehl
        ON apflora.tpopkontr."TPopKontrId" = apflora.tpopkontrzaehl.tpopkontr_id
    WHERE
      apflora.tpopkontr."TPopKontrTyp" NOT IN ('Zwischenziel', 'Ziel')
      AND apflora.tpopkontrzaehl.anzahl > 0
  )
ORDER BY
  apflora.pop."PopId",
  apflora.tpop."TPopId";

DROP VIEW IF EXISTS apflora.v_qk2_tpop_mitstatuspotentiellundmassnansiedlung CASCADE;
CREATE OR REPLACE VIEW apflora.v_qk2_tpop_mitstatuspotentiellundmassnansiedlung AS
SELECT DISTINCT
  apflora.ap."ProjId",
  apflora.pop."ApArtId",
  apflora.pop."PopId",
  apflora.tpop."TPopId",
  'Teilpopulation mit Status "potentieller Wuchs-/Ansiedlungsort", bei der eine Massnahme des Typs "Ansiedlung" existiert:'::text AS hw,
  ARRAY['Projekte', 1 , 'Arten', apflora.ap."ApArtId", 'Populationen', apflora.pop."PopId", 'Teil-Populationen', apflora.tpop."TPopId"]::text[] AS url,
  ARRAY[concat('Population (Nr.): ', apflora.pop."PopNr"), concat('Teil-Population (Nr.): ', apflora.tpop."TPopNr")]::text[] AS text
FROM
  apflora.ap
  INNER JOIN
    apflora.pop
    INNER JOIN
      apflora.tpop
      ON apflora.tpop."PopId" = apflora.pop."PopId"
    ON apflora.pop."ApArtId" = apflora.ap."ApArtId"
WHERE
  apflora.tpop."TPopHerkunft" = 300
  AND apflora.tpop."TPopId" IN (
    SELECT DISTINCT
      apflora.tpopmassn.tpop_id
    FROM
      apflora.tpopmassn
    WHERE
      apflora.tpopmassn.typ < 4
  );

-- wozu wird das benutzt?
DROP VIEW IF EXISTS apflora.v_qk_tpop_mitstatusaktuellundtpopbererloschen_maxtpopberjahr CASCADE;
CREATE OR REPLACE VIEW apflora.v_qk_tpop_mitstatusaktuellundtpopbererloschen_maxtpopberjahr AS
SELECT
  apflora.tpopber.tpop_id,
  max(apflora.tpopber.jahr) AS "MaxTPopBerJahr"
FROM
  apflora.tpopber
GROUP BY
  apflora.tpopber.tpop_id;

DROP VIEW IF EXISTS apflora.v_qk_tpop_erloschenundrelevantaberletztebeobvor1950_maxbeobjahr CASCADE;
CREATE OR REPLACE VIEW apflora.v_qk_tpop_erloschenundrelevantaberletztebeobvor1950_maxbeobjahr AS
SELECT
 apflora.tpopbeob.tpop_id as id,
  max(
    date_part('year', apflora.beob."Datum")
  ) AS "MaxJahr"
FROM
  apflora.tpopbeob
INNER JOIN
  apflora.beob
  ON apflora.tpopbeob.beob_id = apflora.beob.id
WHERE
  apflora.beob."Datum" IS NOT NULL AND
  apflora.tpopbeob.tpop_id IS NOT NULL
GROUP BY
  apflora.tpopbeob.tpop_id;

DROP VIEW IF EXISTS apflora.v_apber_pop_uebersicht CASCADE;
CREATE OR REPLACE VIEW apflora.v_apber_pop_uebersicht AS
SELECT
  apflora.adb_eigenschaften."TaxonomieId" AS "ApArtId",
  apflora.adb_eigenschaften."Artname" AS "Art",
  (
    SELECT
      COUNT(*)
    FROM
      apflora.pop
    WHERE
      apflora.pop."ApArtId" = apflora.adb_eigenschaften."TaxonomieId"
      AND apflora.pop."PopHerkunft" IN (100)
      AND apflora.pop."PopId" IN(
        SELECT
          apflora.tpop."PopId"
        FROM
          apflora.tpop
        WHERE
          apflora.tpop."TPopApBerichtRelevant" = 1
      )
  ) AS "aktuellUrspruenglich",
  (
    SELECT
      COUNT(*)
    FROM
      apflora.pop
    WHERE
      apflora.pop."ApArtId" = apflora.adb_eigenschaften."TaxonomieId"
      AND apflora.pop."PopHerkunft" IN (200, 210)
      AND apflora.pop."PopId" IN(
        SELECT
          apflora.tpop."PopId"
        FROM
          apflora.tpop
        WHERE
          apflora.tpop."TPopApBerichtRelevant" = 1
      )
  ) AS "aktuellAngesiedelt",
  (
    SELECT
      COUNT(*)
    FROM
      apflora.pop
    WHERE
      apflora.pop."ApArtId" = apflora.adb_eigenschaften."TaxonomieId"
      AND apflora.pop."PopHerkunft" IN (100, 200, 210)
      AND apflora.pop."PopId" IN(
        SELECT
          apflora.tpop."PopId"
        FROM
          apflora.tpop
        WHERE
          apflora.tpop."TPopApBerichtRelevant" = 1
      )
  ) AS "aktuell"
FROM
  apflora.adb_eigenschaften
  INNER JOIN
    (apflora.ap
    INNER JOIN
      apflora.pop
      ON apflora.ap."ApArtId" = apflora.pop."ApArtId")
    ON apflora.adb_eigenschaften."TaxonomieId" = apflora.ap."ApArtId"
WHERE
  apflora.ap."ApStatus" BETWEEN 1 AND 3
GROUP BY
  apflora.adb_eigenschaften."TaxonomieId",
  apflora.adb_eigenschaften."Artname"
ORDER BY
  apflora.adb_eigenschaften."Artname";

-- new views beginning 2017.10.04
DROP VIEW IF EXISTS apflora.v_qk2_pop_mit_ber_zunehmend_ohne_tpopber_zunehmend CASCADE;
CREATE OR REPLACE VIEW apflora.v_qk2_pop_mit_ber_zunehmend_ohne_tpopber_zunehmend AS
SELECT DISTINCT
  apflora.ap."ProjId",
  apflora.ap."ApArtId",
  apflora.pop."PopId",
  apflora.popber."PopBerJahr" AS "Berichtjahr",
  'Populationen mit Bericht "zunehmend" ohne Teil-Population mit Bericht "zunehmend":'::text AS hw,
  ARRAY['Projekte', apflora.ap."ProjId" , 'Arten', apflora.ap."ApArtId", 'Populationen', apflora.pop."PopId"]::text[] AS url,
  ARRAY[concat('Population (Nr.): ', apflora.pop."PopNr")]::text[] AS text
FROM
  apflora.ap
  INNER JOIN
  apflora.pop
    INNER JOIN apflora.popber
    ON apflora.pop."PopId" = apflora.popber."PopId"
  ON apflora.ap."ApArtId" = apflora.pop."ApArtId"
WHERE
  apflora.popber."PopBerEntwicklung" = 3
  AND apflora.popber."PopId" NOT IN (
    SELECT DISTINCT apflora.tpop."PopId"
    FROM
      apflora.tpop
      INNER JOIN apflora.tpopber
      ON apflora.tpop."TPopId" = apflora.tpopber.tpop_id
    WHERE
      apflora.tpopber.entwicklung = 3
      AND apflora.tpopber.jahr = apflora.popber."PopBerJahr"
  )
ORDER BY
  apflora.ap."ProjId",
  apflora.ap."ApArtId",
  apflora.pop."PopId",
  apflora.popber."PopBerJahr";

DROP VIEW IF EXISTS apflora.v_qk2_pop_mit_ber_abnehmend_ohne_tpopber_abnehmend CASCADE;
CREATE OR REPLACE VIEW apflora.v_qk2_pop_mit_ber_abnehmend_ohne_tpopber_abnehmend AS
SELECT DISTINCT
  apflora.ap."ProjId",
  apflora.ap."ApArtId",
  apflora.pop."PopId",
  apflora.popber."PopBerJahr" AS "Berichtjahr",
  'Populationen mit Bericht "abnehmend" ohne Teil-Population mit Bericht "abnehmend":'::text AS hw,
  ARRAY['Projekte', apflora.ap."ProjId" , 'Arten', apflora.ap."ApArtId", 'Populationen', apflora.pop."PopId"]::text[] AS url,
  ARRAY[concat('Population (Nr.): ', apflora.pop."PopNr")]::text[] AS text
FROM
  apflora.ap
  INNER JOIN
  apflora.pop
    INNER JOIN apflora.popber
    ON apflora.pop."PopId" = apflora.popber."PopId"
  ON apflora.ap."ApArtId" = apflora.pop."ApArtId"
WHERE
  apflora.popber."PopBerEntwicklung" = 1
  AND apflora.popber."PopId" NOT IN (
    SELECT DISTINCT apflora.tpop."PopId"
    FROM
      apflora.tpop
      INNER JOIN apflora.tpopber
      ON apflora.tpop."TPopId" = apflora.tpopber.tpop_id
    WHERE
      apflora.tpopber.entwicklung = 1
      AND apflora.tpopber.jahr = apflora.popber."PopBerJahr"
  )
ORDER BY
  apflora.ap."ProjId",
  apflora.ap."ApArtId",
  apflora.pop."PopId",
  apflora.popber."PopBerJahr";

DROP VIEW IF EXISTS apflora.v_qk2_pop_mit_ber_erloschen_ohne_tpopber_erloschen CASCADE;
CREATE OR REPLACE VIEW apflora.v_qk2_pop_mit_ber_erloschen_ohne_tpopber_erloschen AS
SELECT DISTINCT
  apflora.ap."ProjId",
  apflora.ap."ApArtId",
  apflora.pop."PopId",
  apflora.popber."PopBerJahr" AS "Berichtjahr",
  'Populationen mit Bericht "erloschen" ohne Teil-Population mit Bericht "erloschen":'::text AS hw,
  ARRAY['Projekte', apflora.ap."ProjId" , 'Arten', apflora.ap."ApArtId", 'Populationen', apflora.pop."PopId"]::text[] AS url,
  ARRAY[concat('Population (Nr.): ', apflora.pop."PopNr")]::text[] AS text
FROM
  apflora.ap
  INNER JOIN
  apflora.pop
    INNER JOIN apflora.popber
    ON apflora.pop."PopId" = apflora.popber."PopId"
  ON apflora.ap."ApArtId" = apflora.pop."ApArtId"
WHERE
  apflora.popber."PopBerEntwicklung" = 8
  AND apflora.popber."PopId" NOT IN (
    SELECT DISTINCT apflora.tpop."PopId"
    FROM
      apflora.tpop
      INNER JOIN apflora.tpopber
      ON apflora.tpop."TPopId" = apflora.tpopber.tpop_id
    WHERE
      apflora.tpopber.entwicklung = 8
      AND apflora.tpopber.jahr = apflora.popber."PopBerJahr"
  )
ORDER BY
  apflora.ap."ProjId",
  apflora.ap."ApArtId",
  apflora.pop."PopId",
  apflora.popber."PopBerJahr";

DROP VIEW IF EXISTS apflora.v_qk2_pop_mit_ber_erloschen_und_tpopber_nicht_erloschen CASCADE;
CREATE OR REPLACE VIEW apflora.v_qk2_pop_mit_ber_erloschen_und_tpopber_nicht_erloschen AS
SELECT DISTINCT
  apflora.ap."ProjId",
  apflora.ap."ApArtId",
  apflora.pop."PopId",
  apflora.popber."PopBerJahr" AS "Berichtjahr",
  'Populationen mit Bericht "erloschen" und mindestens einer gemäss Bericht nicht erloschenen Teil-Population:'::text AS hw,
  ARRAY['Projekte', apflora.ap."ProjId" , 'Arten', apflora.ap."ApArtId", 'Populationen', apflora.pop."PopId"]::text[] AS url,
  ARRAY[concat('Population (Nr.): ', apflora.pop."PopNr")]::text[] AS text
FROM
  apflora.ap
  INNER JOIN
  apflora.pop
    INNER JOIN apflora.popber
    ON apflora.pop."PopId" = apflora.popber."PopId"
  ON apflora.ap."ApArtId" = apflora.pop."ApArtId"
WHERE
  apflora.popber."PopBerEntwicklung" = 8
  AND apflora.popber."PopId" IN (
    SELECT DISTINCT apflora.tpop."PopId"
    FROM
      apflora.tpop
      INNER JOIN apflora.tpopber
      ON apflora.tpop."TPopId" = apflora.tpopber.tpop_id
    WHERE
      apflora.tpopber.entwicklung < 8
      AND apflora.tpopber.jahr = apflora.popber."PopBerJahr"
  )
ORDER BY
  apflora.ap."ProjId",
  apflora.ap."ApArtId",
  apflora.pop."PopId",
  apflora.popber."PopBerJahr";

DROP VIEW IF EXISTS apflora.v_qk2_tpop_statusaktuellletztertpopbererloschen;
CREATE OR REPLACE VIEW apflora.v_qk2_tpop_statusaktuellletztertpopbererloschen AS
WITH lasttpopber AS (
  SELECT DISTINCT ON (tpop_id)
    tpop_id,
    jahr,
    entwicklung
  FROM
    apflora.tpopber
  WHERE
    jahr IS NOT NULL
  ORDER BY
    tpop_id,
    jahr DESC
)
SELECT
  apflora.projekt."ProjId",
  apflora.ap."ApArtId",
  'Teilpopulation: Status ist "aktuell" (ursprünglich oder angesiedelt) oder potentieller Wuchsort; der letzte Teilpopulations-Bericht meldet aber "erloschen" und es gab seither keine Ansiedlung:'::text AS "hw",
  ARRAY['Projekte', 1 , 'Arten', apflora.ap."ApArtId", 'Populationen', apflora.pop."PopId", 'Teil-Populationen', apflora.tpop."TPopId"]::text[] AS "url",
  ARRAY[concat('Population (Nr.): ', apflora.pop."PopNr"), concat('Teil-Population (Nr.): ', apflora.tpop."TPopNr")]::text[] AS text
FROM
  apflora.projekt
  INNER JOIN
    apflora.ap
    INNER JOIN
      apflora.pop
      INNER JOIN
        apflora.tpop
        INNER JOIN lasttpopber
        ON apflora.tpop."TPopId" = lasttpopber.tpop_id
      ON apflora.pop."PopId" = apflora.tpop."PopId"
    ON apflora.ap."ApArtId" = apflora.pop."ApArtId"
  ON apflora.projekt."ProjId" = apflora.ap."ProjId"
WHERE
  apflora.tpop."TPopHerkunft" IN (100, 200, 210, 300)
  AND lasttpopber.entwicklung = 8
  AND apflora.tpop."TPopId" NOT IN (
    -- Ansiedlungen since apflora.tpopber.jahr
    SELECT
      apflora.tpopmassn.tpop_id
    FROM
      apflora.tpopmassn
    WHERE
      apflora.tpopmassn.tpop_id = apflora.tpop."TPopId"
      AND apflora.tpopmassn.typ BETWEEN 1 AND 3
      AND apflora.tpopmassn.jahr IS NOT NULL
      AND apflora.tpopmassn.jahr > lasttpopber.jahr
  );

DROP VIEW IF EXISTS apflora.v_qk2_pop_statusaktuellletzterpopbererloschen CASCADE;
CREATE OR REPLACE VIEW apflora.v_qk2_pop_statusaktuellletzterpopbererloschen AS
WITH lastpopber AS (
  SELECT DISTINCT ON ("PopId")
    "PopId",
    "PopBerJahr",
    "PopBerEntwicklung"
  FROM
    apflora.popber
  WHERE
    "PopBerJahr" IS NOT NULL
  ORDER BY
    "PopId",
    "PopBerJahr" DESC
)
SELECT
  apflora.projekt."ProjId",
  apflora.ap."ApArtId",
  'Population: Status ist "aktuell" (ursprünglich oder angesiedelt) oder potentieller Wuchsort; der letzte Populations-Bericht meldet aber "erloschen" und es gab seither keine Ansiedlung:'::text AS "hw",
  ARRAY['Projekte', 1 , 'Arten', apflora.ap."ApArtId", 'Populationen', apflora.pop."PopId"]::text[] AS "url",
  ARRAY[concat('Population (Nr.): ', apflora.pop."PopNr")]::text[] AS text
FROM
  apflora.projekt
  INNER JOIN
    apflora.ap
    INNER JOIN
      apflora.pop
      INNER JOIN lastpopber
      ON apflora.pop."PopId" = lastpopber."PopId"
    ON apflora.ap."ApArtId" = apflora.pop."ApArtId"
  ON apflora.projekt."ProjId" = apflora.ap."ProjId"
WHERE
  apflora.pop."PopHerkunft" IN (100, 200, 210, 300)
  AND lastpopber."PopBerEntwicklung" = 8
  AND apflora.pop."PopId" NOT IN (
    -- Ansiedlungen since lastpopber."PopBerJahr"
    SELECT DISTINCT
      apflora.tpop."PopId"
    FROM
      apflora.tpop
      INNER JOIN
        apflora.tpopmassn
        ON apflora.tpop."TPopId" = apflora.tpopmassn.tpop_id
    WHERE
      apflora.tpopmassn.typ BETWEEN 1 AND 3
      AND apflora.tpopmassn.jahr > lastpopber."PopBerJahr"
  );

DROP VIEW IF EXISTS apflora.v_qk2_tpop_statuserloschenletztertpopberzunehmend CASCADE;
CREATE OR REPLACE VIEW apflora.v_qk2_tpop_statuserloschenletztertpopberzunehmend AS
WITH lasttpopber AS (
  SELECT DISTINCT ON (tpop_id)
    tpop_id,
    jahr,
    entwicklung
  FROM
    apflora.tpopber
  WHERE
    jahr IS NOT NULL
  ORDER BY
    tpop_id,
    jahr DESC
)
SELECT
  apflora.projekt."ProjId",
  apflora.ap."ApArtId",
  'Teilpopulation: Status ist "erloschen" (ursprünglich oder angesiedelt), Ansaatversuch oder potentieller Wuchsort; der letzte Teilpopulations-Bericht meldet aber "zunehmend" und es gab seither keine Ansiedlung:'::text AS "hw",
  ARRAY['Projekte', 1 , 'Arten', apflora.ap."ApArtId", 'Populationen', apflora.pop."PopId", 'Teil-Populationen', apflora.tpop."TPopId"]::text[] AS "url",
  ARRAY[concat('Population (Nr.): ', apflora.pop."PopNr"), concat('Teil-Population (Nr.): ', apflora.tpop."TPopNr")]::text[] AS text
FROM
  apflora.projekt
  INNER JOIN
    apflora.ap
    INNER JOIN
      apflora.pop
      INNER JOIN
        apflora.tpop
        INNER JOIN lasttpopber
        ON apflora.tpop."TPopId" = lasttpopber.tpop_id
      ON apflora.pop."PopId" = apflora.tpop."PopId"
    ON apflora.ap."ApArtId" = apflora.pop."ApArtId"
  ON apflora.projekt."ProjId" = apflora.ap."ProjId"
WHERE
  apflora.tpop."TPopHerkunft" IN (101, 201, 202, 211, 300)
  AND lasttpopber.entwicklung = 3
  AND apflora.tpop."TPopId" NOT IN (
    -- Ansiedlungen since apflora.tpopber.jahr
    SELECT
      apflora.tpopmassn.tpop_id
    FROM
      apflora.tpopmassn
    WHERE
      apflora.tpopmassn.tpop_id = apflora.tpop."TPopId"
      AND apflora.tpopmassn.typ BETWEEN 1 AND 3
      AND apflora.tpopmassn.jahr IS NOT NULL
      AND apflora.tpopmassn.jahr > lasttpopber.jahr
  );

DROP VIEW IF EXISTS apflora.v_qk2_pop_statuserloschenletzterpopberzunehmend CASCADE;
CREATE OR REPLACE VIEW apflora.v_qk2_pop_statuserloschenletzterpopberzunehmend AS
WITH lastpopber AS (
  SELECT DISTINCT ON ("PopId")
    "PopId",
    "PopBerJahr",
    "PopBerEntwicklung"
  FROM
    apflora.popber
  WHERE
    "PopBerJahr" IS NOT NULL
  ORDER BY
    "PopId",
    "PopBerJahr" DESC
)
SELECT
  apflora.projekt."ProjId",
  apflora.ap."ApArtId",
  'Population: Status ist "erloschen" (ursprünglich oder angesiedelt), Ansaatversuch oder potentieller Wuchsort; der letzte Populations-Bericht meldet aber "zunehmend" und es gab seither keine Ansiedlung:'::text AS "hw",
  ARRAY['Projekte', 1 , 'Arten', apflora.ap."ApArtId", 'Populationen', apflora.pop."PopId"]::text[] AS "url",
  ARRAY[concat('Population (Nr.): ', apflora.pop."PopNr")]::text[] AS text
FROM
  apflora.projekt
  INNER JOIN
    apflora.ap
    INNER JOIN
      apflora.pop
      INNER JOIN lastpopber
      ON apflora.pop."PopId" = lastpopber."PopId"
    ON apflora.ap."ApArtId" = apflora.pop."ApArtId"
  ON apflora.projekt."ProjId" = apflora.ap."ProjId"
WHERE
  apflora.pop."PopHerkunft" IN (101, 201, 202, 211, 300)
  AND lastpopber."PopBerEntwicklung" = 3
  AND apflora.pop."PopId" NOT IN (
    -- Ansiedlungen since lastpopber."PopBerJahr"
    SELECT DISTINCT
      apflora.tpop."PopId"
    FROM
      apflora.tpop
      INNER JOIN
        apflora.tpopmassn
        ON apflora.tpop."TPopId" = apflora.tpopmassn.tpop_id
    WHERE
      apflora.tpopmassn.typ BETWEEN 1 AND 3
      AND apflora.tpopmassn.jahr > lastpopber."PopBerJahr"
  );

DROP VIEW IF EXISTS apflora.v_qk2_tpop_statuserloschenletztertpopberstabil CASCADE;
CREATE OR REPLACE VIEW apflora.v_qk2_tpop_statuserloschenletztertpopberstabil AS
WITH lasttpopber AS (
  SELECT DISTINCT ON (tpop_id)
    tpop_id,
    jahr,
    entwicklung
  FROM
    apflora.tpopber
  WHERE
    jahr IS NOT NULL
  ORDER BY
    tpop_id,
    jahr DESC
)
SELECT
  apflora.projekt."ProjId",
  apflora.ap."ApArtId",
  'Teilpopulation: Status ist "erloschen" (ursprünglich oder angesiedelt), Ansaatversuch oder potentieller Wuchsort; der letzte Teilpopulations-Bericht meldet aber "stabil" und es gab seither keine Ansiedlung:'::text AS "hw",
  ARRAY['Projekte', 1 , 'Arten', apflora.ap."ApArtId", 'Populationen', apflora.pop."PopId", 'Teil-Populationen', apflora.tpop."TPopId"]::text[] AS "url",
  ARRAY[concat('Population (Nr.): ', apflora.pop."PopNr"), concat('Teil-Population (Nr.): ', apflora.tpop."TPopNr")]::text[] AS text
FROM
  apflora.projekt
  INNER JOIN
    apflora.ap
    INNER JOIN
      apflora.pop
      INNER JOIN
        apflora.tpop
        INNER JOIN lasttpopber
        ON apflora.tpop."TPopId" = lasttpopber.tpop_id
      ON apflora.pop."PopId" = apflora.tpop."PopId"
    ON apflora.ap."ApArtId" = apflora.pop."ApArtId"
  ON apflora.projekt."ProjId" = apflora.ap."ProjId"
WHERE
  apflora.tpop."TPopHerkunft" IN (101, 201, 202, 211, 300)
  AND lasttpopber.entwicklung = 2
  AND apflora.tpop."TPopId" NOT IN (
    -- Ansiedlungen since apflora.tpopber.jahr
    SELECT
      apflora.tpopmassn.tpop_id
    FROM
      apflora.tpopmassn
    WHERE
      apflora.tpopmassn.tpop_id = apflora.tpop."TPopId"
      AND apflora.tpopmassn.typ BETWEEN 1 AND 3
      AND apflora.tpopmassn.jahr IS NOT NULL
      AND apflora.tpopmassn.jahr > lasttpopber.jahr
  );

DROP VIEW IF EXISTS apflora.v_qk2_pop_statuserloschenletzterpopberstabil CASCADE;
CREATE OR REPLACE VIEW apflora.v_qk2_pop_statuserloschenletzterpopberstabil AS
WITH lastpopber AS (
  SELECT DISTINCT ON ("PopId")
    "PopId",
    "PopBerJahr",
    "PopBerEntwicklung"
  FROM
    apflora.popber
  WHERE
    "PopBerJahr" IS NOT NULL
  ORDER BY
    "PopId",
    "PopBerJahr" DESC
)
SELECT
  apflora.projekt."ProjId",
  apflora.ap."ApArtId",
  'Population: Status ist "erloschen" (ursprünglich oder angesiedelt), Ansaatversuch oder potentieller Wuchsort; der letzte Populations-Bericht meldet aber "stabil" und es gab seither keine Ansiedlung:'::text AS "hw",
  ARRAY['Projekte', 1 , 'Arten', apflora.ap."ApArtId", 'Populationen', apflora.pop."PopId"]::text[] AS "url",
  ARRAY[concat('Population (Nr.): ', apflora.pop."PopNr")]::text[] AS text
FROM
  apflora.projekt
  INNER JOIN
    apflora.ap
    INNER JOIN
      apflora.pop
      INNER JOIN lastpopber
      ON apflora.pop."PopId" = lastpopber."PopId"
    ON apflora.ap."ApArtId" = apflora.pop."ApArtId"
  ON apflora.projekt."ProjId" = apflora.ap."ProjId"
WHERE
  apflora.pop."PopHerkunft" IN (101, 201, 202, 211, 300)
  AND lastpopber."PopBerEntwicklung" = 2
  AND apflora.pop."PopId" NOT IN (
    -- Ansiedlungen since lastpopber."PopBerJahr"
    SELECT DISTINCT
      apflora.tpop."PopId"
    FROM
      apflora.tpop
      INNER JOIN
        apflora.tpopmassn
        ON apflora.tpop."TPopId" = apflora.tpopmassn.tpop_id
    WHERE
      apflora.tpopmassn.typ BETWEEN 1 AND 3
      AND apflora.tpopmassn.jahr > lastpopber."PopBerJahr"
  );

DROP VIEW IF EXISTS apflora.v_qk2_tpop_statuserloschenletztertpopberabnehmend CASCADE;
CREATE OR REPLACE VIEW apflora.v_qk2_tpop_statuserloschenletztertpopberabnehmend AS
WITH lasttpopber AS (
  SELECT DISTINCT ON (tpop_id)
    tpop_id,
    jahr,
    entwicklung
  FROM
    apflora.tpopber
  WHERE
    jahr IS NOT NULL
  ORDER BY
    tpop_id,
    jahr DESC
)
SELECT
  apflora.projekt."ProjId",
  apflora.ap."ApArtId",
  'Teilpopulation: Status ist "erloschen" (ursprünglich oder angesiedelt), Ansaatversuch oder potentieller Wuchsort; der letzte Teilpopulations-Bericht meldet aber "abnehmend" und es gab seither keine Ansiedlung:'::text AS "hw",
  ARRAY['Projekte', 1 , 'Arten', apflora.ap."ApArtId", 'Populationen', apflora.pop."PopId", 'Teil-Populationen', apflora.tpop."TPopId"]::text[] AS "url",
  ARRAY[concat('Population (Nr.): ', apflora.pop."PopNr"), concat('Teil-Population (Nr.): ', apflora.tpop."TPopNr")]::text[] AS text
FROM
  apflora.projekt
  INNER JOIN
    apflora.ap
    INNER JOIN
      apflora.pop
      INNER JOIN
        apflora.tpop
        INNER JOIN lasttpopber
        ON apflora.tpop."TPopId" = lasttpopber.tpop_id
      ON apflora.pop."PopId" = apflora.tpop."PopId"
    ON apflora.ap."ApArtId" = apflora.pop."ApArtId"
  ON apflora.projekt."ProjId" = apflora.ap."ProjId"
WHERE
  apflora.tpop."TPopHerkunft" IN (101, 201, 202, 211, 300)
  AND lasttpopber.entwicklung = 1
  AND apflora.tpop."TPopId" NOT IN (
    -- Ansiedlungen since apflora.tpopber.jahr
    SELECT
      apflora.tpopmassn.tpop_id
    FROM
      apflora.tpopmassn
    WHERE
      apflora.tpopmassn.tpop_id = apflora.tpop."TPopId"
      AND apflora.tpopmassn.typ BETWEEN 1 AND 3
      AND apflora.tpopmassn.jahr IS NOT NULL
      AND apflora.tpopmassn.jahr > lasttpopber.jahr
  );

DROP VIEW IF EXISTS apflora.v_qk2_pop_statuserloschenletzterpopberabnehmend CASCADE;
CREATE OR REPLACE VIEW apflora.v_qk2_pop_statuserloschenletzterpopberabnehmend AS
WITH lastpopber AS (
  SELECT DISTINCT ON ("PopId")
    "PopId",
    "PopBerJahr",
    "PopBerEntwicklung"
  FROM
    apflora.popber
  WHERE
    "PopBerJahr" IS NOT NULL
  ORDER BY
    "PopId",
    "PopBerJahr" DESC
)
SELECT
  apflora.projekt."ProjId",
  apflora.ap."ApArtId",
  'Population: Status ist "erloschen" (ursprünglich oder angesiedelt), Ansaatversuch oder potentieller Wuchsort; der letzte Populations-Bericht meldet aber "abnehmend" und es gab seither keine Ansiedlung:'::text AS "hw",
  ARRAY['Projekte', 1 , 'Arten', apflora.ap."ApArtId", 'Populationen', apflora.pop."PopId"]::text[] AS "url",
  ARRAY[concat('Population (Nr.): ', apflora.pop."PopNr")]::text[] AS text
FROM
  apflora.projekt
  INNER JOIN
    apflora.ap
    INNER JOIN
      apflora.pop
      INNER JOIN lastpopber
      ON apflora.pop."PopId" = lastpopber."PopId"
    ON apflora.ap."ApArtId" = apflora.pop."ApArtId"
  ON apflora.projekt."ProjId" = apflora.ap."ProjId"
WHERE
  apflora.pop."PopHerkunft" IN (101, 201, 202, 211, 300)
  AND lastpopber."PopBerEntwicklung" = 1
  AND apflora.pop."PopId" NOT IN (
    -- Ansiedlungen since lastpopber."PopBerJahr"
    SELECT DISTINCT
      apflora.tpop."PopId"
    FROM
      apflora.tpop
      INNER JOIN
        apflora.tpopmassn
        ON apflora.tpop."TPopId" = apflora.tpopmassn.tpop_id
    WHERE
      apflora.tpopmassn.typ BETWEEN 1 AND 3
      AND apflora.tpopmassn.jahr > lastpopber."PopBerJahr"
  );

DROP VIEW IF EXISTS apflora.v_qk2_tpop_statuserloschenletztertpopberunsicher CASCADE;
CREATE OR REPLACE VIEW apflora.v_qk2_tpop_statuserloschenletztertpopberunsicher AS
WITH lasttpopber AS (
  SELECT DISTINCT ON (tpop_id)
    tpop_id,
    jahr,
    entwicklung
  FROM
    apflora.tpopber
  WHERE
    jahr IS NOT NULL
  ORDER BY
    tpop_id,
    jahr DESC
)
SELECT
  apflora.projekt."ProjId",
  apflora.ap."ApArtId",
  'Teilpopulation: Status ist "erloschen" (ursprünglich oder angesiedelt) oder potentieller Wuchsort; der letzte Teilpopulations-Bericht meldet aber "unsicher" und es gab seither keine Ansiedlung:'::text AS "hw",
  ARRAY['Projekte', 1 , 'Arten', apflora.ap."ApArtId", 'Populationen', apflora.pop."PopId", 'Teil-Populationen', apflora.tpop."TPopId"]::text[] AS "url",
  ARRAY[concat('Population (Nr.): ', apflora.pop."PopNr"), concat('Teil-Population (Nr.): ', apflora.tpop."TPopNr")]::text[] AS text
FROM
  apflora.projekt
  INNER JOIN
    apflora.ap
    INNER JOIN
      apflora.pop
      INNER JOIN
        apflora.tpop
        INNER JOIN lasttpopber
        ON apflora.tpop."TPopId" = lasttpopber.tpop_id
      ON apflora.pop."PopId" = apflora.tpop."PopId"
    ON apflora.ap."ApArtId" = apflora.pop."ApArtId"
  ON apflora.projekt."ProjId" = apflora.ap."ProjId"
WHERE
  apflora.tpop."TPopHerkunft" IN (101, 202, 211, 300)
  AND lasttpopber.entwicklung = 4
  AND apflora.tpop."TPopId" NOT IN (
    -- Ansiedlungen since jahr
    SELECT
      apflora.tpopmassn.tpop_id
    FROM
      apflora.tpopmassn
    WHERE
      apflora.tpopmassn.tpop_id = apflora.tpop."TPopId"
      AND apflora.tpopmassn.typ BETWEEN 1 AND 3
      AND apflora.tpopmassn.jahr IS NOT NULL
      AND apflora.tpopmassn.jahr > lasttpopber.jahr
  );

DROP VIEW IF EXISTS apflora.v_qk2_pop_statuserloschenletzterpopberunsicher CASCADE;
CREATE OR REPLACE VIEW apflora.v_qk2_pop_statuserloschenletzterpopberunsicher AS
WITH lastpopber AS (
  SELECT DISTINCT ON ("PopId")
    "PopId",
    "PopBerJahr",
    "PopBerEntwicklung"
  FROM
    apflora.popber
  WHERE
    "PopBerJahr" IS NOT NULL
  ORDER BY
    "PopId",
    "PopBerJahr" DESC
)
SELECT
  apflora.projekt."ProjId",
  apflora.ap."ApArtId",
  'Population: Status ist "erloschen" (ursprünglich oder angesiedelt) oder potentieller Wuchsort; der letzte Populations-Bericht meldet aber "unsicher" und es gab seither keine Ansiedlung:'::text AS "hw",
  ARRAY['Projekte', 1 , 'Arten', apflora.ap."ApArtId", 'Populationen', apflora.pop."PopId"]::text[] AS "url",
  ARRAY[concat('Population (Nr.): ', apflora.pop."PopNr")]::text[] AS text
FROM
  apflora.projekt
  INNER JOIN
    apflora.ap
    INNER JOIN
      apflora.pop
      INNER JOIN lastpopber
      ON apflora.pop."PopId" = lastpopber."PopId"
    ON apflora.ap."ApArtId" = apflora.pop."ApArtId"
  ON apflora.projekt."ProjId" = apflora.ap."ProjId"
WHERE
  apflora.pop."PopHerkunft" IN (101, 202, 211, 300)
  AND lastpopber."PopBerEntwicklung" = 4
  AND apflora.pop."PopId" NOT IN (
    -- Ansiedlungen since lastpopber."PopBerJahr"
    SELECT DISTINCT
      apflora.tpop."PopId"
    FROM
      apflora.tpop
      INNER JOIN
        apflora.tpopmassn
        ON apflora.tpop."TPopId" = apflora.tpopmassn.tpop_id
    WHERE
      apflora.tpopmassn.typ BETWEEN 1 AND 3
      AND apflora.tpopmassn.jahr > lastpopber."PopBerJahr"
  );

DROP VIEW IF EXISTS apflora.v_qk2_pop_ohnetpopmitgleichemstatus CASCADE;
CREATE OR REPLACE VIEW apflora.v_qk2_pop_ohnetpopmitgleichemstatus AS
SELECT
  apflora.projekt."ProjId",
  apflora.ap."ApArtId",
  'Population: Keine Teil-Population hat den Status der Population:'::text AS "hw",
  ARRAY['Projekte', 1 , 'Arten', apflora.ap."ApArtId", 'Populationen', apflora.pop."PopId"]::text[] AS "url",
  ARRAY[concat('Population (Nr.): ', apflora.pop."PopNr")]::text[] AS text
FROM
  apflora.projekt
  INNER JOIN
    apflora.ap
    INNER JOIN
      apflora.pop
    ON apflora.ap."ApArtId" = apflora.pop."ApArtId"
  ON apflora.projekt."ProjId" = apflora.ap."ProjId"
WHERE
  --why was this here? deactivated 2017-11-03
  --apflora.pop."PopHerkunft" = 210
  apflora.pop."PopId" NOT IN (
    SELECT DISTINCT
      apflora.tpop."PopId"
    FROM
      apflora.tpop
    WHERE
      apflora.tpop."PopId" = apflora.pop."PopId"
      AND (
          apflora.tpop."TPopHerkunft" = apflora.pop."PopHerkunft"
          -- problem: the values for erloschen and aktuell can vary
          -- depending on bekannt seit
          -- even though they are same value in status field of form
          OR (apflora.tpop."TPopHerkunft" = 200 AND apflora.pop."PopHerkunft" = 210)
          OR (apflora.tpop."TPopHerkunft" = 210 AND apflora.pop."PopHerkunft" = 200)
          OR (apflora.tpop."TPopHerkunft" = 202 AND apflora.pop."PopHerkunft" = 211)
          OR (apflora.tpop."TPopHerkunft" = 211 AND apflora.pop."PopHerkunft" = 202)
      )
  );

DROP VIEW IF EXISTS apflora.v_qk2_pop_status300tpopstatusanders CASCADE;
CREATE OR REPLACE VIEW apflora.v_qk2_pop_status300tpopstatusanders AS
SELECT
  apflora.projekt."ProjId",
  apflora.ap."ApArtId",
  'Population: Status ist "potentieller Wuchs-/Ansiedlungsort". Es gibt aber Teil-Populationen mit abweichendem Status:'::text AS "hw",
  ARRAY['Projekte', 1 , 'Arten', apflora.ap."ApArtId", 'Populationen', apflora.pop."PopId"]::text[] AS "url",
  ARRAY[concat('Population (Nr.): ', apflora.pop."PopNr")]::text[] AS text
FROM
  apflora.projekt
  INNER JOIN
    apflora.ap
    INNER JOIN
      apflora.pop
    ON apflora.ap."ApArtId" = apflora.pop."ApArtId"
  ON apflora.projekt."ProjId" = apflora.ap."ProjId"
WHERE
  apflora.pop."PopHerkunft" = 300
  AND apflora.pop."PopId" IN (
    -- Ansiedlungen since lastpopber."PopBerJahr"
    SELECT DISTINCT
      apflora.tpop."PopId"
    FROM
      apflora.tpop
    WHERE
      apflora.tpop."PopId" = apflora.pop."PopId"
      AND apflora.tpop."TPopHerkunft" <> 300
  );

DROP VIEW IF EXISTS apflora.v_qk2_pop_status201tpopstatusunzulaessig CASCADE;
CREATE OR REPLACE VIEW apflora.v_qk2_pop_status201tpopstatusunzulaessig AS
SELECT
  apflora.projekt."ProjId",
  apflora.ap."ApArtId",
  'Population: Status ist "Ansaatversuch". Es gibt Teil-Populationen mit nicht zulässigen Stati ("ursprünglich" oder "angesiedelt, aktuell"):'::text AS "hw",
  ARRAY['Projekte', 1 , 'Arten', apflora.ap."ApArtId", 'Populationen', apflora.pop."PopId"]::text[] AS "url",
  ARRAY[concat('Population (Nr.): ', apflora.pop."PopNr")]::text[] AS text
FROM
  apflora.projekt
  INNER JOIN
    apflora.ap
    INNER JOIN
      apflora.pop
    ON apflora.ap."ApArtId" = apflora.pop."ApArtId"
  ON apflora.projekt."ProjId" = apflora.ap."ProjId"
WHERE
  apflora.pop."PopHerkunft" = 201
  AND apflora.pop."PopId" IN (
    -- Ansiedlungen since lastpopber."PopBerJahr"
    SELECT DISTINCT
      apflora.tpop."PopId"
    FROM
      apflora.tpop
    WHERE
      apflora.tpop."PopId" = apflora.pop."PopId"
      AND apflora.tpop."TPopHerkunft" IN (100, 101, 200, 210)
  );

DROP VIEW IF EXISTS apflora.v_qk2_pop_status202tpopstatusanders CASCADE;
CREATE OR REPLACE VIEW apflora.v_qk2_pop_status202tpopstatusanders AS
SELECT
  apflora.projekt."ProjId",
  apflora.ap."ApArtId",
  'Population: Status ist "angesiedelt nach Beginn AP, erloschen/nicht etabliert". Es gibt Teil-Populationen mit abweichendem Status:'::text AS "hw",
  ARRAY['Projekte', 1 , 'Arten', apflora.ap."ApArtId", 'Populationen', apflora.pop."PopId"]::text[] AS "url",
  ARRAY[concat('Population (Nr.): ', apflora.pop."PopNr")]::text[] AS text
FROM
  apflora.projekt
  INNER JOIN
    apflora.ap
    INNER JOIN
      apflora.pop
    ON apflora.ap."ApArtId" = apflora.pop."ApArtId"
  ON apflora.projekt."ProjId" = apflora.ap."ProjId"
WHERE
  apflora.pop."PopHerkunft" = 202
  AND apflora.pop."PopId" IN (
    -- Ansiedlungen since lastpopber."PopBerJahr"
    SELECT DISTINCT
      apflora.tpop."PopId"
    FROM
      apflora.tpop
    WHERE
      apflora.tpop."PopId" = apflora.pop."PopId"
      AND apflora.tpop."TPopHerkunft" <> 202
  );

DROP VIEW IF EXISTS apflora.v_qk2_pop_status211tpopstatusunzulaessig CASCADE;
CREATE OR REPLACE VIEW apflora.v_qk2_pop_status211tpopstatusunzulaessig AS
SELECT
  apflora.projekt."ProjId",
  apflora.ap."ApArtId",
  'Population: Status ist "angesiedelt vor Beginn AP, erloschen/nicht etabliert". Es gibt Teil-Populationen mit nicht zulässigen Stati ("ursprünglich", "angesiedelt, aktuell", "Ansaatversuch", "potentieller Wuchsort"):'::text AS "hw",
  ARRAY['Projekte', 1 , 'Arten', apflora.ap."ApArtId", 'Populationen', apflora.pop."PopId"]::text[] AS "url",
  ARRAY[concat('Population (Nr.): ', apflora.pop."PopNr")]::text[] AS text
FROM
  apflora.projekt
  INNER JOIN
    apflora.ap
    INNER JOIN
      apflora.pop
    ON apflora.ap."ApArtId" = apflora.pop."ApArtId"
  ON apflora.projekt."ProjId" = apflora.ap."ProjId"
WHERE
  apflora.pop."PopHerkunft" = 211
  AND apflora.pop."PopId" IN (
    -- Ansiedlungen since lastpopber."PopBerJahr"
    SELECT DISTINCT
      apflora.tpop."PopId"
    FROM
      apflora.tpop
    WHERE
      apflora.tpop."PopId" = apflora.pop."PopId"
      AND apflora.tpop."TPopHerkunft" IN (100, 101, 210, 200, 201, 300)
  );

DROP VIEW IF EXISTS apflora.v_qk2_pop_status200tpopstatusunzulaessig CASCADE;
CREATE OR REPLACE VIEW apflora.v_qk2_pop_status200tpopstatusunzulaessig AS
SELECT
  apflora.projekt."ProjId",
  apflora.ap."ApArtId",
  'Population: Status ist "angesiedelt nach Beginn AP, aktuell". Es gibt Teil-Populationen mit nicht zulässigen Stati ("ursprünglich", "angesiedelt vor Beginn AP, aktuell"):'::text AS "hw",
  ARRAY['Projekte', 1 , 'Arten', apflora.ap."ApArtId", 'Populationen', apflora.pop."PopId"]::text[] AS "url",
  ARRAY[concat('Population (Nr.): ', apflora.pop."PopNr")]::text[] AS text
FROM
  apflora.projekt
  INNER JOIN
    apflora.ap
    INNER JOIN
      apflora.pop
    ON apflora.ap."ApArtId" = apflora.pop."ApArtId"
  ON apflora.projekt."ProjId" = apflora.ap."ProjId"
WHERE
  apflora.pop."PopHerkunft" = 200
  AND apflora.pop."PopId" IN (
    -- Ansiedlungen since lastpopber."PopBerJahr"
    SELECT DISTINCT
      apflora.tpop."PopId"
    FROM
      apflora.tpop
    WHERE
      apflora.tpop."PopId" = apflora.pop."PopId"
      AND apflora.tpop."TPopHerkunft" IN (100, 101, 210)
  );

DROP VIEW IF EXISTS apflora.v_qk2_pop_status210tpopstatusunzulaessig CASCADE;
CREATE OR REPLACE VIEW apflora.v_qk2_pop_status210tpopstatusunzulaessig AS
SELECT
  apflora.projekt."ProjId",
  apflora.ap."ApArtId",
  'Population: Status ist "angesiedelt vor Beginn AP, aktuell". Es gibt Teil-Populationen mit nicht zulässigen Stati ("ursprünglich"):'::text AS "hw",
  ARRAY['Projekte', 1 , 'Arten', apflora.ap."ApArtId", 'Populationen', apflora.pop."PopId"]::text[] AS "url",
  ARRAY[concat('Population (Nr.): ', apflora.pop."PopNr")]::text[] AS text
FROM
  apflora.projekt
  INNER JOIN
    apflora.ap
    INNER JOIN
      apflora.pop
    ON apflora.ap."ApArtId" = apflora.pop."ApArtId"
  ON apflora.projekt."ProjId" = apflora.ap."ProjId"
WHERE
  apflora.pop."PopHerkunft" = 210
  AND apflora.pop."PopId" IN (
    -- Ansiedlungen since lastpopber."PopBerJahr"
    SELECT DISTINCT
      apflora.tpop."PopId"
    FROM
      apflora.tpop
    WHERE
      apflora.tpop."PopId" = apflora.pop."PopId"
      AND apflora.tpop."TPopHerkunft" IN (100, 101)
  );

DROP VIEW IF EXISTS apflora.v_qk2_pop_status101tpopstatusanders CASCADE;
CREATE OR REPLACE VIEW apflora.v_qk2_pop_status101tpopstatusanders AS
SELECT
  apflora.projekt."ProjId",
  apflora.ap."ApArtId",
  'Population: Status ist "ursprünglich, erloschen". Es gibt Teil-Populationen (ausser potentiellen Wuchs-/Ansiedlungsorten) mit abweichendem Status:'::text AS "hw",
  ARRAY['Projekte', 1 , 'Arten', apflora.ap."ApArtId", 'Populationen', apflora.pop."PopId"]::text[] AS "url",
  ARRAY[concat('Population (Nr.): ', apflora.pop."PopNr")]::text[] AS text
FROM
  apflora.projekt
  INNER JOIN
    apflora.ap
    INNER JOIN
      apflora.pop
    ON apflora.ap."ApArtId" = apflora.pop."ApArtId"
  ON apflora.projekt."ProjId" = apflora.ap."ProjId"
WHERE
  apflora.pop."PopHerkunft" = 101
  AND apflora.pop."PopId" IN (
    -- Ansiedlungen since lastpopber."PopBerJahr"
    SELECT DISTINCT
      apflora.tpop."PopId"
    FROM
      apflora.tpop
    WHERE
      apflora.tpop."PopId" = apflora.pop."PopId"
      AND apflora.tpop."TPopHerkunft" NOT IN (101, 300)
  );

DROP VIEW IF EXISTS apflora.v_qk2_pop_statuserloschenletzterpopbererloschenmitansiedlung CASCADE;
CREATE OR REPLACE VIEW apflora.v_qk2_pop_statuserloschenletzterpopbererloschenmitansiedlung AS
WITH lastpopber AS (
  SELECT DISTINCT ON ("PopId")
    "PopId",
    "PopBerJahr",
    "PopBerEntwicklung"
  FROM
    apflora.popber
  WHERE
    "PopBerJahr" IS NOT NULL
  ORDER BY
    "PopId",
    "PopBerJahr" DESC
)
SELECT
  apflora.projekt."ProjId",
  apflora.ap."ApArtId",
  'Population: Status ist "erloschen" (ursprünglich oder angesiedelt); der letzte Populations-Bericht meldet "erloschen". Seither gab es aber eine Ansiedlung:'::text AS "hw",
  ARRAY['Projekte', 1 , 'Arten', apflora.ap."ApArtId", 'Populationen', apflora.pop."PopId"]::text[] AS "url",
  ARRAY[concat('Population (Nr.): ', apflora.pop."PopNr")]::text[] AS text
FROM
  apflora.projekt
  INNER JOIN
    apflora.ap
    INNER JOIN
      apflora.pop
      INNER JOIN lastpopber
      ON apflora.pop."PopId" = lastpopber."PopId"
    ON apflora.ap."ApArtId" = apflora.pop."ApArtId"
  ON apflora.projekt."ProjId" = apflora.ap."ProjId"
WHERE
  apflora.pop."PopHerkunft" IN (101, 202, 211)
  AND lastpopber."PopBerEntwicklung" = 8
  AND apflora.pop."PopId" IN (
    -- Ansiedlungen since lastpopber."PopBerJahr"
    SELECT DISTINCT
      apflora.tpop."PopId"
    FROM
      apflora.tpop
      INNER JOIN
        apflora.tpopmassn
        ON apflora.tpop."TPopId" = apflora.tpopmassn.tpop_id
    WHERE
      apflora.tpopmassn.typ BETWEEN 1 AND 3
      AND apflora.tpopmassn.jahr > lastpopber."PopBerJahr"
  );

DROP VIEW IF EXISTS apflora.v_qk2_tpop_statuserloschenletztertpopbererloschenmitansiedlung CASCADE;
CREATE OR REPLACE VIEW apflora.v_qk2_tpop_statuserloschenletztertpopbererloschenmitansiedlung AS
WITH lasttpopber AS (
  SELECT DISTINCT ON (tpop_id)
    tpop_id,
    jahr,
    entwicklung
  FROM
    apflora.tpopber
  WHERE
    jahr IS NOT NULL
  ORDER BY
    tpop_id,
    jahr DESC
)
SELECT
  apflora.projekt."ProjId",
  apflora.ap."ApArtId",
  'Teilpopulation: Status ist "erloschen" (ursprünglich oder angesiedelt); der letzte Teilpopulations-Bericht meldet "erloschen". Seither gab es aber eine Ansiedlung:'::text AS "hw",
  ARRAY['Projekte', 1 , 'Arten', apflora.ap."ApArtId", 'Populationen', apflora.pop."PopId", 'Teil-Populationen', apflora.tpop."TPopId"]::text[] AS "url",
  ARRAY[concat('Population (Nr.): ', apflora.pop."PopNr"), concat('Teil-Population (Nr.): ', apflora.tpop."TPopNr")]::text[] AS text
FROM
  apflora.projekt
  INNER JOIN
    apflora.ap
    INNER JOIN
      apflora.pop
      INNER JOIN
        apflora.tpop
        INNER JOIN lasttpopber
        ON apflora.tpop."TPopId" = lasttpopber.tpop_id
      ON apflora.pop."PopId" = apflora.tpop."PopId"
    ON apflora.ap."ApArtId" = apflora.pop."ApArtId"
  ON apflora.projekt."ProjId" = apflora.ap."ProjId"
WHERE
  apflora.tpop."TPopHerkunft" IN (101, 202, 211)
  AND lasttpopber.entwicklung = 8
  AND apflora.tpop."TPopId" IN (
    -- Ansiedlungen since apflora.tpopber.jahr
    SELECT
      apflora.tpopmassn.tpop_id
    FROM
      apflora.tpopmassn
    WHERE
      apflora.tpopmassn.tpop_id = apflora.tpop."TPopId"
      AND apflora.tpopmassn.typ BETWEEN 1 AND 3
      AND apflora.tpopmassn.jahr IS NOT NULL
      AND apflora.tpopmassn.jahr > lasttpopber.jahr
  );