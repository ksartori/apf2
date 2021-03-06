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
import get from 'lodash/get'
import { Query } from 'react-apollo'
import { Subscribe } from 'unstated'

import AutoComplete from '../Autocomplete'
import exportModule from '../../../../modules/export'
import Message from '../Message'
import dataGql from './data.graphql'
import ErrorState from '../../../../state/Error'
import epsg2056to4326 from '../../../../modules/epsg2056to4326'

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
const AutocompleteContainer = styled.div`
  flex-basis: 450px;
  padding-left: 16px;
`
const isRemoteHost = window.location.hostname !== 'localhost'

const enhance = compose(
  withState('expanded', 'setExpanded', false),
  withState('message', 'setMessage', null),
)

const Teilpopulationen = ({
  fileType,
  mapFilter,
  applyMapFilterToExport,
  expanded,
  setExpanded,
  message,
  setMessage,
}: {
  fileType: String,
  mapFilter: Object,
  applyMapFilterToExport: Boolean,
  expanded: Boolean,
  setExpanded: () => void,
  message: String,
  setMessage: () => void,
}) => (
  <Subscribe to={[ErrorState]}>
    {errorState =>
      <Query query={dataGql}>
        {({ loading, error, data, client }) => {
          if (error) return `Fehler: ${error.message}`
          const artList = get(data, 'allAeEigenschaftens.nodes', [])
            .filter(n => !!get(n, 'apByArtId.id'))
            .map(n => ({
              id: get(n, 'apByArtId.id'),
              value: n.artname
            }))

          return (
            <StyledCard>
              <StyledCardActions
                disableActionSpacing
                onClick={() => setExpanded(!expanded)}
              >
                <CardActionTitle>Teilpopulationen</CardActionTitle>
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
                      setMessage('Export "Teilpopulationen" wird vorbereitet...')
                      try {
                        const { data } = await client.query({
                          query: await import('./allVTpops.graphql')
                        })
                        const enrichedData = get(data, 'allVTpops.nodes', [])
                          .map(oWithout => {
                            let o = {...oWithout}
                            let nachBeginnAp = null
                            if (
                              o.ap_start_jahr &&
                              o.bekannt_seit &&
                              [200, 201, 202].includes(o.status)
                            ) {
                              if (o.ap_start_jahr <= o.bekannt_seit) {
                                nachBeginnAp = true
                              } else {
                                nachBeginnAp = false
                              }
                            }
                            o.angesiedelt_nach_beginn_ap = nachBeginnAp
                            return o
                          })
                        exportModule({
                          data: enrichedData,
                          fileName: 'Teilpopulationen',
                          fileType,
                          mapFilter,
                          applyMapFilterToExport,
                          idKey: 'id',
                          xKey: 'x',
                          yKey: 'y',
                          errorState,
                        })
                      } catch(error) {
                        errorState.add(error)
                      }
                      setMessage(null)
                    }}
                  >
                    Teilpopulationen
                  </DownloadCardButton>
                  <DownloadCardButton
                    onClick={async () => {
                      setMessage('Export "TeilpopulationenWebGisBun" wird vorbereitet...')
                      try {
                        const { data } = await client.query({
                          query: await import('./allVTpopWebgisbuns.graphql')
                        })
                        exportModule({
                          data: get(data, 'allVTpopWebgisbuns.nodes', []),
                          fileName: 'TeilpopulationenWebGisBun',
                          fileType,
                          applyMapFilterToExport,
                          mapFilter,
                          idKey: 'TPOPID',
                          xKey: 'TPOP_X',
                          yKey: 'TPOP_Y',
                          errorState,
                        })
                      } catch(error) {
                        errorState.add(error)
                      }
                      setMessage(null)
                    }}
                  >
                    Teilpopulationen für WebGIS BUN
                  </DownloadCardButton>
                  <DownloadCardButton
                    onClick={async () => {
                      setMessage('Export "Teilpopulationen" wird vorbereitet...')
                      try {
                        const { data } = await client.query({
                          query: await import('./allVTpopKmls.graphql')
                        })
                        const enrichedData = get(data, 'allVTpopKmls.nodes', [])
                          .map(oWithout => {
                            let o = {...oWithout}
                            const [bg, lg] = epsg2056to4326(o.x, o.y)
                            o.laengengrad = lg
                            o.breitengrad = bg
                            return o
                          })
                        exportModule({
                          data: enrichedData,
                          fileName: 'Teilpopulationen',
                          fileType,
                          applyMapFilterToExport,
                          mapFilter,
                          idKey: 'id',
                          xKey: 'x',
                          yKey: 'y',
                          errorState,
                          kml: true,
                        })
                      } catch(error) {
                        errorState.add(error)
                      }
                      setMessage(null)
                    }}
                  >
                    <div>Teilpopulationen für Google Earth</div>
                    <div>(beschriftet mit PopNr/TPopNr)</div>
                  </DownloadCardButton>
                  <DownloadCardButton
                    onClick={async () => {
                      setMessage('Export "TeilpopulationenNachNamen" wird vorbereitet...')
                      try {
                        const { data } = await client.query({
                          query: await import('./allVTpopKmlnamen.graphql')
                        })
                        const enrichedData = get(data, 'allVTpopKmlnamen.nodes', [])
                          .map(oWithout => {
                            let o = {...oWithout}
                            const [bg, lg] = epsg2056to4326(o.x, o.y)
                            o.laengengrad = lg
                            o.breitengrad = bg
                            return o
                          })
                        exportModule({
                          data: enrichedData,
                          fileName: 'TeilpopulationenNachNamen',
                          fileType,
                          applyMapFilterToExport,
                          mapFilter,
                          idKey: 'id',
                          xKey: 'x',
                          yKey: 'y',
                          errorState,
                          kml: true,
                        })
                      } catch(error) {
                        errorState.add(error)
                      }
                      setMessage(null)
                    }}
                  >
                    <div>Teilpopulationen für Google Earth</div>
                    <div>(beschriftet mit Artname, PopNr/TPopNr)</div>
                  </DownloadCardButton>
                  <DownloadCardButton
                    onClick={async () => {
                      setMessage('Export "TeilpopulationenVonApArtenOhneBekanntSeit" wird vorbereitet...')
                      try {
                        const { data } = await client.query({
                          query: await import('./allVTpopOhnebekanntseits.graphql')
                        })
                        exportModule({
                          data: get(data, 'allVTpopOhnebekanntseits.nodes', []),
                          fileName: 'TeilpopulationenVonApArtenOhneBekanntSeit',
                          fileType,
                          applyMapFilterToExport,
                          mapFilter,
                          idKey: 'id',
                          xKey: 'x',
                          yKey: 'y',
                          errorState,
                        })
                      } catch(error) {
                        errorState.add(error)
                      }
                      setMessage(null)
                    }}
                  >
                    <div>Teilpopulationen von AP-Arten</div>
                    <div>{'ohne "Bekannt seit"'}</div>
                  </DownloadCardButton>
                  <DownloadCardButton
                    onClick={async () => {
                      setMessage('Export "TeilpopulationenOhneApBerichtRelevant" wird vorbereitet...')
                      try {
                        const { data } = await client.query({
                          query: await import('./allVTpopOhneapberichtrelevants.graphql')
                        })
                        exportModule({
                          data: get(data, 'allVTpopOhneapberichtrelevants.nodes', []),
                          fileName: 'TeilpopulationenOhneApBerichtRelevant',
                          fileType,
                          applyMapFilterToExport,
                          mapFilter,
                          idKey: 'id',
                          xKey: 'x',
                          yKey: 'y',
                          errorState,
                        })
                      } catch(error) {
                        errorState.add(error)
                      }
                      setMessage(null)
                    }}
                  >
                    <div>Teilpopulationen ohne Eintrag</div>
                    <div>{'im Feld "Für AP-Bericht relevant"'}</div>
                  </DownloadCardButton>
                  <DownloadCardButton
                    onClick={async () => {
                      setMessage('Export "TeilpopulationenAnzahlMassnahmen" wird vorbereitet...')
                      try {
                        const { data } = await client.query({
                          query: await import('./allVTpopAnzmassns.graphql')
                        })
                        exportModule({
                          data: get(data, 'allVTpopAnzmassns.nodes', []),
                          fileName: 'TeilpopulationenAnzahlMassnahmen',
                          fileType,
                          applyMapFilterToExport,
                          mapFilter,
                          idKey: 'id',
                          xKey: 'x',
                          yKey: 'y',
                          errorState,
                        })
                      } catch(error) {
                        errorState.add(error)
                      }
                      setMessage(null)
                    }}
                  >
                    Anzahl Massnahmen pro Teilpopulation
                  </DownloadCardButton>
                  <DownloadCardButton
                    onClick={async () => {
                      setMessage('Export "TeilpopulationenAnzKontrInklusiveLetzteKontrUndLetztenTPopBericht" wird vorbereitet...')
                      try {
                        const { data } = await client.query({
                          query: await import('./allVTpopAnzkontrinklletzterundletztertpopbers.graphql')
                        })
                        exportModule({
                          data: get(data, 'allVTpopAnzkontrinklletzterundletztertpopbers.nodes', []),
                          fileName: 'TeilpopulationenAnzKontrInklusiveLetzteKontrUndLetztenTPopBericht',
                          fileType,
                          applyMapFilterToExport,
                          mapFilter,
                          idKey: 'id',
                          xKey: 'x',
                          yKey: 'y',
                          errorState,
                        })
                      } catch(error) {
                        errorState.add(error)
                      }
                      setMessage(null)
                    }}
                    disabled={isRemoteHost}
                    title={
                      isRemoteHost ? 'nur aktiv, wenn apflora lokal installiert wird' : ''
                    }
                  >
                    <div>Teilpopulationen mit:</div>
                    <ul
                      style={{
                        paddingLeft: '18px',
                        marginTop: '5px',
                        marginBottom: '10px',
                      }}
                    >
                      <li>Anzahl Kontrollen</li>
                      <li>letzte Kontrolle</li>
                      <li>letzter Teilpopulationsbericht</li>
                      <li>letzte Zählung</li>
                    </ul>
                    <div>{'= "Eier legende Wollmilchsau"'}</div>
                  </DownloadCardButton>
                  <AutocompleteContainer>
                    <AutoComplete
                      label={`"Eier legende Wollmilchsau" für eine Art`}
                      objects={artList}
                      openabove
                      mapFilter={mapFilter}
                    />
                  </AutocompleteContainer>
                  <DownloadCardButton
                    onClick={async () => {
                      setMessage('Export "TeilpopulationenTPopUndMassnBerichte" wird vorbereitet...')
                      try {
                        const { data } = await client.query({
                          query: await import('./allVTpopPopberundmassnbers.graphql')
                        })
                        exportModule({
                          data: get(data, 'allVTpopPopberundmassnbers.nodes', []),
                          fileName: 'TeilpopulationenTPopUndMassnBerichte',
                          fileType,
                          applyMapFilterToExport,
                          mapFilter,
                          idKey: 'tpop_id',
                          xKey: 'tpop_x',
                          yKey: 'tpop_y',
                          errorState,
                        })
                      } catch(error) {
                        errorState.add(error)
                      }
                      setMessage(null)
                    }}
                  >
                    Teilpopulationen inklusive Teilpopulations- und Massnahmen-Berichten
                  </DownloadCardButton>
                </StyledCardContent>
              </Collapse>
              {
                !!message &&
                <Message message={message} />
              }
            </StyledCard>
          )
        }}
      </Query>
    }
  </Subscribe>
)

export default enhance(Teilpopulationen)
