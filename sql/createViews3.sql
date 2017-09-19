/*
 * diese Views hängen von anderen ab, die in viewsGenerieren2.sql erstellt werden
 * daher muss dieser code NACH viewsGenerieren2.sql ausgeführt werden
 */

DROP VIEW IF EXISTS apflora.v_tpop_anzkontrinklletzterundletztertpopber CASCADE;
CREATE OR REPLACE VIEW apflora.v_tpop_anzkontrinklletzterundletztertpopber AS
SELECT
	apflora.v_tpop_anzkontrinklletzter."ApArtId" AS "ApArtId",
	apflora.v_tpop_anzkontrinklletzter."Familie",
	apflora.v_tpop_anzkontrinklletzter."AP Art",
	apflora.v_tpop_anzkontrinklletzter."AP Status",
	apflora.v_tpop_anzkontrinklletzter."AP Start im Jahr",
	apflora.v_tpop_anzkontrinklletzter."AP Stand Umsetzung",
	apflora.v_tpop_anzkontrinklletzter."AP verantwortlich",
	apflora.v_tpop_anzkontrinklletzter."PopId",
	apflora.v_tpop_anzkontrinklletzter."Pop Guid",
	apflora.v_tpop_anzkontrinklletzter."Pop Nr",
	apflora.v_tpop_anzkontrinklletzter."Pop Name",
	apflora.v_tpop_anzkontrinklletzter."Pop Status",
	apflora.v_tpop_anzkontrinklletzter."Pop bekannt seit",
	apflora.v_tpop_anzkontrinklletzter."TPop ID",
	apflora.v_tpop_anzkontrinklletzter."TPop Guid",
	apflora.v_tpop_anzkontrinklletzter."TPop Nr",
	apflora.v_tpop_anzkontrinklletzter."TPop Gemeinde",
	apflora.v_tpop_anzkontrinklletzter."TPop Flurname",
	apflora.v_tpop_anzkontrinklletzter."TPop Status",
	apflora.v_tpop_anzkontrinklletzter."TPop bekannt seit",
	apflora.v_tpop_anzkontrinklletzter."TPop Status unklar",
	apflora.v_tpop_anzkontrinklletzter."TPop Begruendung fuer unklaren Status",
	apflora.v_tpop_anzkontrinklletzter."TPop X-Koordinaten",
	apflora.v_tpop_anzkontrinklletzter."TPop Y-Koordinaten",
	apflora.v_tpop_anzkontrinklletzter."TPop Radius (m)",
	apflora.v_tpop_anzkontrinklletzter."TPop Hoehe",
	apflora.v_tpop_anzkontrinklletzter."TPop Exposition",
	apflora.v_tpop_anzkontrinklletzter."TPop Klima",
	apflora.v_tpop_anzkontrinklletzter."TPop Hangneigung",
	apflora.v_tpop_anzkontrinklletzter."TPop Beschreibung",
	apflora.v_tpop_anzkontrinklletzter."TPop Kataster-Nr",
	apflora.v_tpop_anzkontrinklletzter."TPop fuer AP-Bericht relevant",
	apflora.v_tpop_anzkontrinklletzter."TPop EigentuemerIn",
	apflora.v_tpop_anzkontrinklletzter."TPop Kontakt vor Ort",
	apflora.v_tpop_anzkontrinklletzter."TPop Nutzungszone",
	apflora.v_tpop_anzkontrinklletzter."TPop BewirtschafterIn",
	apflora.v_tpop_anzkontrinklletzter."TPop Bewirtschaftung",
	apflora.v_tpop_anzkontrinklletzter."TPop Anzahl Kontrollen",
	apflora.v_tpop_anzkontrinklletzter."TPopKontrId",
	apflora.v_tpop_anzkontrinklletzter."TPopId",
	apflora.v_tpop_anzkontrinklletzter."Kontr Guid",
	apflora.v_tpop_anzkontrinklletzter."Kontr Jahr",
	apflora.v_tpop_anzkontrinklletzter."Kontr Datum",
	apflora.v_tpop_anzkontrinklletzter."Kontr Typ",
	apflora.v_tpop_anzkontrinklletzter."Kontr BearbeiterIn",
	apflora.v_tpop_anzkontrinklletzter."Kontr Ueberlebensrate",
	apflora.v_tpop_anzkontrinklletzter."Kontr Vitalitaet",
	apflora.v_tpop_anzkontrinklletzter."Kontr Entwicklung",
	apflora.v_tpop_anzkontrinklletzter."Kontr Ursachen",
	apflora.v_tpop_anzkontrinklletzter."Kontr Erfolgsbeurteilung",
	apflora.v_tpop_anzkontrinklletzter."Kontr Aenderungs-Vorschlaege Umsetzung",
	apflora.v_tpop_anzkontrinklletzter."Kontr Aenderungs-Vorschlaege Kontrolle",
	apflora.v_tpop_anzkontrinklletzter."Kontr X-Koord",
	apflora.v_tpop_anzkontrinklletzter."Kontr Y-Koord",
	apflora.v_tpop_anzkontrinklletzter."Kontr Bemerkungen",
	apflora.v_tpop_anzkontrinklletzter."Kontr Lebensraum Delarze",
	apflora.v_tpop_anzkontrinklletzter."Kontr angrenzender Lebensraum Delarze",
	apflora.v_tpop_anzkontrinklletzter."Kontr Vegetationstyp",
	apflora.v_tpop_anzkontrinklletzter."Kontr Konkurrenz",
	apflora.v_tpop_anzkontrinklletzter."Kontr Moosschicht",
	apflora.v_tpop_anzkontrinklletzter."Kontr Krautschicht",
	apflora.v_tpop_anzkontrinklletzter."Kontr Strauchschicht",
	apflora.v_tpop_anzkontrinklletzter."Kontr Baumschicht",
	apflora.v_tpop_anzkontrinklletzter."Kontr Bodentyp",
	apflora.v_tpop_anzkontrinklletzter."Kontr Boden Kalkgehalt",
	apflora.v_tpop_anzkontrinklletzter."Kontr Boden Durchlaessigkeit",
	apflora.v_tpop_anzkontrinklletzter."Kontr Boden Humusgehalt",
	apflora.v_tpop_anzkontrinklletzter."Kontr Boden Naehrstoffgehalt",
	apflora.v_tpop_anzkontrinklletzter."Kontr Oberbodenabtrag",
	apflora.v_tpop_anzkontrinklletzter."Kontr Wasserhaushalt",
	apflora.v_tpop_anzkontrinklletzter."Kontr Uebereinstimmung mit Idealbiotop",
	apflora.v_tpop_anzkontrinklletzter."Kontr Handlungsbedarf",
	apflora.v_tpop_anzkontrinklletzter."Kontr Ueberpruefte Flaeche",
	apflora.v_tpop_anzkontrinklletzter."Kontr Flaeche der Teilpopulation m2",
	apflora.v_tpop_anzkontrinklletzter."Kontr auf Plan eingezeichnet",
	apflora.v_tpop_anzkontrinklletzter."Kontr Deckung durch Vegetation",
	apflora.v_tpop_anzkontrinklletzter."Kontr Deckung nackter Boden",
	apflora.v_tpop_anzkontrinklletzter."Kontr Deckung durch ueberpruefte Art",
	apflora.v_tpop_anzkontrinklletzter."Kontr auch junge Pflanzen",
	apflora.v_tpop_anzkontrinklletzter."Kontr maximale Veg-hoehe cm",
	apflora.v_tpop_anzkontrinklletzter."Kontr mittlere Veg-hoehe cm",
	apflora.v_tpop_anzkontrinklletzter."Kontr Gefaehrdung",
	apflora.v_tpop_anzkontrinklletzter."Kontrolle zuletzt geaendert",
	apflora.v_tpop_anzkontrinklletzter."Kontrolle zuletzt geaendert von",
	apflora.v_tpop_anzkontrinklletzter."Anzahlen",
	apflora.v_tpop_anzkontrinklletzter."Zaehleinheiten",
	apflora.v_tpop_anzkontrinklletzter."Methoden",
	apflora.v_tpopber_mitletzterid."AnzTPopBer",
	apflora.v_tpopber_mitletzterid."TPopBerId",
	apflora.v_tpopber_mitletzterid."TPopBer Jahr",
	apflora.v_tpopber_mitletzterid."TPopBer Entwicklung",
	apflora.v_tpopber_mitletzterid."TPopBer Bemerkungen",
	apflora.v_tpopber_mitletzterid."TPopBer MutWann",
	apflora.v_tpopber_mitletzterid."TPopBer MutWer"
FROM
	apflora.v_tpop_anzkontrinklletzter
  LEFT JOIN
    apflora.v_tpopber_mitletzterid
    ON apflora.v_tpop_anzkontrinklletzter."TPop ID" = apflora.v_tpopber_mitletzterid."TPopId";
