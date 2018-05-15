// @flow
import React from 'react'
import Card, { CardActions, CardContent } from 'material-ui/Card'
import Collapse from 'material-ui/transitions/Collapse'
import IconButton from 'material-ui/IconButton'
import Icon from 'material-ui/Icon'
import Button from 'material-ui/Button'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import compose from 'recompose/compose'
import withState from 'recompose/withState'
import styled from 'styled-components'
import { ApolloConsumer } from 'react-apollo'
import gql from "graphql-tag"
import get from 'lodash/get'
import { inject } from 'mobx-react'

import exportModule from '../../../modules/export'
import Message from './Message'

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
  inject('store')
)

const Massnahmen = ({
  store,
  expanded,
  setExpanded,
  message,
  setMessage,
}: {
  store:Object,
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
          <CardActionTitle>Massnahmen</CardActionTitle>
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
                    setMessage('Export "Massnahmen" wird vorbereitet...')
                    try {
                      const { data } = await client.query({
                        query: gql`
                          query view {
                            allVMassns {
                              nodes {
                                apId
                                familie
                                artname
                                apBearbeitung
                                apStartJahr
                                apUmsetzung
                                popId
                                popNr
                                popName
                                popStatus
                                popBekanntSeit
                                popStatusUnklar
                                popStatusUnklarBegruendung
                                popX
                                popY
                                tpopId
                                tpopNr
                                tpopGemeinde
                                tpopFlurname
                                tpopStatus
                                tpopBekanntSeit
                                tpopStatusUnklar
                                tpopStatusUnklarGrund
                                tpopX
                                tpopY
                                tpopRadius
                                tpopHoehe
                                tpopExposition
                                tpopKlima
                                tpopNeigung
                                tpopBeschreibung
                                tpopKatasterNr
                                tpopApberRelevant
                                tpopEigentuemer
                                tpopKontakt
                                tpopNutzungszone
                                tpopBewirtschafter
                                tpopBewirtschaftung
                                id
                                jahr
                                datum
                                typ
                                beschreibung
                                bearbeiter
                                bemerkungen
                                planVorhanden
                                planBezeichnung
                                flaeche
                                form
                                pflanzanordnung
                                markierung
                                anzTriebe
                                anzPflanzen
                                anzPflanzstellen
                                wirtspflanze
                                herkunftPop
                                sammeldatum
                                changed
                                changedBy
                              }
                            }
                          }`
                      })
                      exportModule({data: get(data, 'allVMassns.nodes', []), store, fileName: 'Massnahmen'})
                    } catch(error) {
                      setMessage(`Fehler: ${error.message}`)
                      setTimeout(() => setMessage(null), 5000)
                    }
                    setMessage(null)
                  }}
            >
              Massnahmen
            </DownloadCardButton>
            <DownloadCardButton
                  onClick={async () => {
                    setMessage('Export "MassnahmenWebGisBun" wird vorbereitet...')
                    try {
                      const { data } = await client.query({
                        query: gql`
                          query view {
                            allVMassnWebgisbuns {
                              nodes {
                                APARTID: apartid
                                APART: apart
                                POPGUID: popguid
                                POPNR: popnr
                                TPOPGUID: tpopguid
                                TPOPNR: tpopnr
                                TPOP_X: tpopX
                                TPOP_Y: tpopY
                                TPOPSTATUS: tpopstatus
                                MASSNGUID: massnguid
                                MASSNJAHR: massnjahr
                                MASSNDAT: massndat
                                MASSTYP: masstyp
                                MASSNMASSNAHME: massnmassnahme
                                MASSNBEARBEITER: massnbearbeiter
                                MASSNBEMERKUNG: massnbemerkung
                                MASSNPLAN: massnplan
                                MASSPLANBEZ: massplanbez
                                MASSNFLAECHE: massnflaeche
                                MASSNFORMANSIEDL: massnformansiedl
                                MASSNPFLANZANORDNUNG: massnpflanzanordnung
                                MASSNMARKIERUNG: massnmarkierung
                                MASSNANZTRIEBE: massnanztriebe
                                MASSNANZPFLANZEN: massnanzpflanzen
                                MASSNANZPFLANZSTELLEN: massnanzpflanzstellen
                                MASSNWIRTSPFLANZEN: massnwirtspflanzen
                                MASSNHERKUNFTSPOP: massnherkunftspop
                                MASSNSAMMELDAT: massnsammeldat
                                MASSNCHANGEDAT: massnchangedat
                                MASSNCHANGEBY: massnchangeby
                              }
                            }
                          }`
                      })
                      exportModule({data: get(data, 'allVMassnWebgisbuns.nodes', []), store, fileName: 'MassnahmenWebGisBun'})
                    } catch(error) {
                      setMessage(`Fehler: ${error.message}`)
                      setTimeout(() => setMessage(null), 5000)
                    }
                    setMessage(null)
                  }}
            >
              Massnahmen für WebGIS BUN
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

export default enhance(Massnahmen)
