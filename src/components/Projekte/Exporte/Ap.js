// @flow
import React from 'react'
import Card from '@material-ui/core/Card'
import CardActions from '@material-ui/core/CardActions'
import CardContent from '@material-ui/core/CardContent'
import Collapse from '@material-ui/core/Collapse'
import IconButton from '@material-ui/core/IconButton'
import Icon from '@material-ui/core/Icon'
import Button from '@material-ui/core/Button'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import compose from 'recompose/compose'
import withState from 'recompose/withState'
import styled from 'styled-components'
import { ApolloConsumer } from 'react-apollo'
import gql from "graphql-tag"
import get from 'lodash/get'

import exportModule from '../../../modules/export'
import Message from './Message'
import listError from '../../../modules/listError'

const StyledCard = styled(Card)`
  margin: 10px 0;
  background-color: #fff8e1 !important;
`
const StyledCardActions = styled(CardActions)`
  justify-content: space-between;
  cursor: pointer;
  height: auto !important;
`
const CardActionIconButton = styled(IconButton)`
  transform: ${props => (props['data-expanded'] ? 'rotate(180deg)' : 'none')};
`
const CardActionTitle = styled.div`
  padding-left: 8px;
  font-weight: bold;
  word-break: break-word;
  user-select: none;
`
const StyledCardContent = styled(CardContent)`
  margin: -15px 0 0 0;
  display: flex;
  flex-wrap: wrap;
  align-items: stretch;
  justify-content: stretch;
  align-content: stretch;
`
const DownloadCardButton = styled(Button)`
  flex-basis: 450px;
  > span:first-of-type {
    text-transform: none !important;
    font-weight: 500;
    display: block;
    text-align: left;
    justify-content: flex-start !important;
    user-select: none;
  }
`

const enhance = compose(
  withState('expanded', 'setExpanded', false),
  withState('message', 'setMessage', null),
)

const AP = ({
  fileType,
  applyMapFilterToExport,
  client,
  expanded,
  setExpanded,
  message,
  setMessage,
}: {
  fileType: String,
  applyMapFilterToExport: Boolean,
  client: Object,
  expanded: Boolean,
  setExpanded: () => void,
  message: String,
  setMessage: () => void,
}) => (
  <ApolloConsumer>
    {client =>
      <StyledCard>
        <StyledCardActions
          disableActionSpacing
          onClick={() => setExpanded(!expanded)}
        >
          <CardActionTitle>Aktionsplan</CardActionTitle>
          <CardActionIconButton
            data-expanded={expanded}
            aria-expanded={expanded}
            aria-label="öffnen"
          >
            <Icon title={expanded ? 'schliessen' : 'öffnen'}>
              <ExpandMoreIcon />
            </Icon>
          </CardActionIconButton>
        </StyledCardActions>
        <Collapse in={expanded} timeout="auto" unmountOnExit>
          <StyledCardContent>
            <DownloadCardButton
              onClick={async () => {
                setMessage('Export "AP" wird vorbereitet...')
                try {
                  const { data } = await client.query({
                    query: gql`
                      query view {
                        allVAps {
                          nodes {
                            id
                            artname
                            bearbeitung
                            start_jahr: startJahr
                            umsetzung
                            bearbeiter
                            changed
                            changed_by: changedBy
                          }
                        }
                      }`
                  })
                  exportModule({
                    data: get(data, 'allVAps.nodes', []), 
                    fileName: 'AP',
                    fileType,
                    applyMapFilterToExport,
                  })
                } catch(error) {
                  listError(error)
                }
                setMessage(null)
              }}
            >
              Aktionspläne
            </DownloadCardButton>
            <DownloadCardButton
              onClick={async () => {
                setMessage('Export "ApOhnePopulationen" wird vorbereitet...')
                try {
                  const { data } = await client.query({
                    query: gql`
                      query view {
                        allVApOhnepops {
                          nodes {
                            id
                            artname
                            bearbeitung
                            start_jahr: startJahr
                            umsetzung
                            bearbeiter
                            pop_id: popId
                          }
                        }
                      }`
                  })
                  exportModule({
                    data: get(data, 'allVApOhnepops.nodes', []),
                    fileName: 'ApOhnePopulationen',
                    fileType,
                    applyMapFilterToExport,
                  })
                } catch(error) {
                  listError(error)
                }
                setMessage(null)
              }}
            >
              Aktionspläne ohne Populationen
            </DownloadCardButton>
            <DownloadCardButton
              onClick={async () => {
                setMessage('Export "ApAnzahlMassnahmen" wird vorbereitet...')
                try {
                  const { data } = await client.query({
                    query: gql`
                      query view {
                        allVApAnzmassns {
                          nodes {
                            id
                            artname
                            bearbeitung
                            start_jahr: startJahr
                            umsetzung
                            anzahl_massnahmen: anzahlMassnahmen
                          }
                        }
                      }`
                  })
                  exportModule({
                    data: get(data, 'allVApAnzmassns.nodes', []),
                    fileName: 'ApAnzahlMassnahmen',
                    fileType,
                    applyMapFilterToExport,
                  })
                } catch(error) {
                  listError(error)
                }
                setMessage(null)
              }}
            >
              Anzahl Massnahmen pro Aktionsplan
            </DownloadCardButton>
            <DownloadCardButton
              onClick={async () => {
                setMessage('Export "ApAnzahlKontrollen" wird vorbereitet...')
                try {
                  const { data } = await client.query({
                    query: gql`
                      query view {
                        allVApAnzkontrs {
                          nodes {
                            id
                            artname
                            bearbeitung
                            start_jahr: startJahr
                            umsetzung
                            anzahl_kontrollen: anzahlKontrollen
                          }
                        }
                      }`
                  })
                  exportModule({
                    data: get(data, 'allVApAnzkontrs.nodes', []),
                    fileName: 'ApAnzahlKontrollen',
                    fileType,
                    applyMapFilterToExport,
                  })
                } catch(error) {
                  listError(error)
                }
                setMessage(null)
              }}
            >
              Anzahl Kontrollen pro Aktionsplan
            </DownloadCardButton>
            <DownloadCardButton
              onClick={async () => {
                setMessage('Export "Jahresberichte" wird vorbereitet...')
                try {
                  const { data } = await client.query({
                    query: gql`
                      query view {
                        allVApbers {
                          nodes {
                            id
                            ap_id: apId
                            artname
                            jahr
                            situation
                            vergleich_vorjahr_gesamtziel: vergleichVorjahrGesamtziel
                            beurteilung
                            beurteilung_decodiert: beurteilungDecodiert
                            veraenderung_zum_vorjahr: veraenderungZumVorjahr
                            apber_analyse: apberAnalyse
                            konsequenzen_umsetzung: konsequenzenUmsetzung
                            konsequenzen_erfolgskontrolle: konsequenzenErfolgskontrolle
                            biotope_neue: biotopeNeue
                            biotope_optimieren: biotopeOptimieren
                            massnahmen_optimieren: massnahmenOptimieren
                            wirkung_auf_art: wirkungAufArt
                            changed
                            changed_by: changedBy
                            massnahmen_ap_bearb: massnahmenApBearb
                            massnahmen_planung_vs_ausfuehrung: massnahmenPlanungVsAusfuehrung
                            datum
                            bearbeiter
                            bearbeiter_decodiert: bearbeiterDecodiert
                          }
                        }
                      }`
                  })
                  exportModule({
                    data: get(data, 'allVApbers.nodes', []),
                    fileName: 'Jahresberichte',
                    fileType,
                    applyMapFilterToExport,
                  })
                } catch(error) {
                  listError(error)
                }
                setMessage(null)
              }}
            >
              AP-Berichte (Jahresberichte)
            </DownloadCardButton>
            <DownloadCardButton
              onClick={async () => {
                setMessage('Export "ApJahresberichteUndMassnahmen" wird vorbereitet...')
                try {
                  const { data } = await client.query({
                    query: gql`
                      query view {
                        allVApApberundmassns {
                          nodes {
                            id
                            artname
                            bearbeitung
                            start_jahr: startJahr
                            umsetzung
                            bearbeiter
                            artwert
                            massn_jahr: massnJahr
                            massn_anzahl: massnAnzahl
                            massn_anzahl_bisher: massnAnzahlBisher
                            bericht_erstellt: berichtErstellt
                          }
                        }
                      }`
                  })
                  exportModule({
                    data: get(data, 'allVApApberundmassns.nodes', []),
                    fileName: 'ApJahresberichteUndMassnahmen',
                    fileType,
                    applyMapFilterToExport,
                  })
                } catch(error) {
                  listError(error)
                }
                setMessage(null)
              }}
            >
              AP-Berichte und Massnahmen
            </DownloadCardButton>
            <DownloadCardButton
              onClick={async () => {
                setMessage('Export "ApZiele" wird vorbereitet...')
                try {
                  const { data } = await client.query({
                    query: gql`
                      query view {
                        allVZiels {
                          nodes {
                            ap_id: apId
                            artname
                            ap_bearbeitung: apBearbeitung
                            ap_start_jahr: apStartJahr
                            ap_umsetzung: apUmsetzung
                            ap_bearbeiter: apBearbeiter
                            id
                            jahr
                            typ
                            bezeichnung
                          }
                        }
                      }`
                  })
                  exportModule({
                    data: get(data, 'allVZiels.nodes', []),
                    fileName: 'ApZiele',
                    fileType,
                    applyMapFilterToExport,
                  })
                } catch(error) {
                  listError(error)
                }
                setMessage(null)
              }}
            >
              Ziele
            </DownloadCardButton>
            <DownloadCardButton
              onClick={async () => {
                setMessage('Export "Zielberichte" wird vorbereitet...')
                try {
                  const { data } = await client.query({
                    query: gql`
                      query view {
                        allVZielbers {
                          nodes {
                            ap_id: apId
                            artname
                            ap_bearbeitung: apBearbeitung
                            ap_start_jahr: apStartJahr
                            ap_umsetzung: apUmsetzung
                            ap_bearbeiter: apBearbeiter
                            ziel_id: zielId
                            ziel_jahr: zielJahr
                            ziel_typ: zielTyp
                            ziel_bezeichnung: zielBezeichnung
                            id
                            jahr
                            erreichung
                            bemerkungen
                            changed
                            changed_by: changedBy
                          }
                        }
                      }`
                  })
                  exportModule({
                    data: get(data, 'allVZielbers.nodes', []),
                    fileName: 'Zielberichte',
                    fileType,
                    applyMapFilterToExport,
                  })
                } catch(error) {
                  listError(error)
                }
                setMessage(null)
              }}
            >
              Ziel-Berichte
            </DownloadCardButton>
            <DownloadCardButton
              onClick={async () => {
                setMessage('Export "Berichte" wird vorbereitet...')
                try {
                  const { data } = await client.query({
                    query: gql`
                      query view {
                        allVBers {
                          nodes {
                            ap_id: apId
                            artname
                            ap_bearbeitung: apBearbeitung
                            ap_start_jahr: apStartJahr
                            ap_umsetzung: apUmsetzung
                            ap_bearbeiter: apBearbeiter
                            id
                            autor
                            jahr
                            titel
                            url
                            changed
                            changed_by: changedBy
                          }
                        }
                      }`
                  })
                  exportModule({
                    data: get(data, 'allVBers.nodes', []),
                    fileName: 'Berichte',
                    fileType,
                    applyMapFilterToExport,
                  })
                } catch(error) {
                  listError(error)
                }
                setMessage(null)
              }}
            >
              Berichte
            </DownloadCardButton>
            <DownloadCardButton
              onClick={async () => {
                setMessage('Export "Erfolgskriterien" wird vorbereitet...')
                try {
                  const { data } = await client.query({
                    query: gql`
                      query view {
                        allVErfkrits {
                          nodes {
                            ap_id: apId
                            artname
                            ap_bearbeitung: apBearbeitung
                            ap_start_jahr: apStartJahr
                            ap_umsetzung: apUmsetzung
                            ap_bearbeiter: apBearbeiter
                            id
                            beurteilung
                            kriterien
                            changed
                            changed_by: changedBy
                          }
                        }
                      }`
                  })
                  exportModule({
                    data: get(data, 'allVErfkrits.nodes', []),
                    fileName: 'Erfolgskriterien',
                    fileType,
                    applyMapFilterToExport,
                  })
                } catch(error) {
                  listError(error)
                }
                setMessage(null)
              }}
            >
              Erfolgskriterien
            </DownloadCardButton>
            <DownloadCardButton
              onClick={async () => {
                setMessage('Export "Idealbiotope" wird vorbereitet...')
                try {
                  const { data } = await client.query({
                    query: gql`
                      query view {
                        allVIdealbiotops {
                          nodes {
                            ap_id: apId
                            artname
                            ap_bearbeitung: apBearbeitung
                            ap_start_jahr: apStartJahr
                            ap_umsetzung: apUmsetzung
                            ap_bearbeiter: apBearbeiter
                            erstelldatum
                            hoehenlage
                            region
                            exposition
                            besonnung
                            hangneigung
                            boden_typ: bodenTyp
                            boden_kalkgehalt: bodenKalkgehalt
                            boden_durchlaessigkeit: bodenDurchlaessigkeit
                            boden_humus: bodenHumus
                            boden_naehrstoffgehalt: bodenNaehrstoffgehalt
                            wasserhaushalt
                            konkurrenz
                            moosschicht
                            krautschicht
                            strauchschicht
                            baumschicht
                            bemerkungen
                            changed
                            changed_by: changedBy
                          }
                        }
                      }`
                  })
                  exportModule({
                    data: get(data, 'allVIdealbiotops.nodes', []),
                    fileName: 'Idealbiotope',
                    fileType,
                    applyMapFilterToExport,
                  })
                } catch(error) {
                  listError(error)
                }
                setMessage(null)
              }}
            >
              Idealbiotope
            </DownloadCardButton>
            <DownloadCardButton
              onClick={async () => {
                setMessage('Export "AssoziierteArten" wird vorbereitet...')
                try {
                  const { data } = await client.query({
                    query: gql`
                      query view {
                        allVAssozarts {
                          nodes {
                            ap_id: apId
                            artname
                            ap_bearbeitung: apBearbeitung
                            ap_start_jahr: apStartJahr
                            ap_umsetzung: apUmsetzung
                            ap_bearbeiter: apBearbeiter
                            id
                            artname_assoziiert: artnameAssoziiert
                            bemerkungen
                            changed
                            changed_by: changedBy
                          }
                        }
                      }`
                  })
                  exportModule({
                    data: get(data, 'allVAssozarts.nodes', []),
                    fileName: 'AssoziierteArten',
                    fileType,
                    applyMapFilterToExport,
                  })
                } catch(error) {
                  listError(error)
                }
                setMessage(null)
              }}
            >
              Assoziierte Arten
            </DownloadCardButton>
          </StyledCardContent>
        </Collapse>
        {
          !!message &&
          <Message message={message} />
        }
      </StyledCard>
    }
  </ApolloConsumer>
  
)

export default enhance(AP)
