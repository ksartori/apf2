import React from 'react'
import Control from 'react-leaflet-control'
import { observer, inject } from 'mobx-react'
import styled from 'styled-components'
import compose from 'recompose/compose'
import withHandlers from 'recompose/withHandlers'
import withState from 'recompose/withState'
import { MuiThemeProvider } from '@material-ui/core/styles'
import theme from '../../../../theme'
import ExpandLessIcon from '@material-ui/icons/ExpandLess'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'

import Overlays from './Overlays'
import ApfloraLayers from './ApfloraLayers'
import BaseLayers from './BaseLayers'

const CardContainer = styled.div`
  background-color: white;
  background-clip: padding-box;
  border-radius: 5px;
  border: 2px solid rgba(0, 0, 0, 0.2);
`
const Card = styled.div`
  padding-top: 3px;
  color: rgb(48, 48, 48);
  &:not(:first-of-type) {
    border-top: 1px solid rgba(0, 0, 0, 0.2);
  }
`
const CardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  padding-left: 7px;
  padding-right: 2px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.2);
  cursor: pointer;
  font-weight: bold;
  user-select: none;
`
const CardTitle = styled.div`
  padding-right: 5px;
`
const CardTitleApfloraOpen = styled(CardTitle)`
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  width: 70px;
`
const StyledExpandLessIcon = styled(ExpandLessIcon)`
  height: 18px !important;
`
const StyledExpandMoreIcon = styled(ExpandMoreIcon)`
  height: 18px !important;
`

const enhance = compose(
  inject('store'),
  withState('baseLayersExpanded', 'toggleBaseLayersExpanded', false),
  withState('overlaysExpanded', 'toggleOverlaysExpanded', false),
  withState('apfloraLayersExpanded', 'toggleApfloraLayersExpanded', false),
  withHandlers({
    onToggleBaseLayersExpanded: ({
      overlaysExpanded,
      baseLayersExpanded,
      toggleOverlaysExpanded,
      toggleBaseLayersExpanded,
      toggleApfloraLayersExpanded,
      apfloraLayersExpanded,
    }) => () => {
      toggleBaseLayersExpanded(!baseLayersExpanded)
      if (overlaysExpanded) {
        toggleOverlaysExpanded(!overlaysExpanded)
      }
      if (apfloraLayersExpanded) {
        toggleApfloraLayersExpanded(!apfloraLayersExpanded)
      }
    },
    onToggleOverlaysExpanded: ({
      overlaysExpanded,
      baseLayersExpanded,
      toggleOverlaysExpanded,
      toggleBaseLayersExpanded,
      toggleApfloraLayersExpanded,
      apfloraLayersExpanded,
    }) => () => {
      toggleOverlaysExpanded(!overlaysExpanded)
      if (baseLayersExpanded) {
        toggleBaseLayersExpanded(!baseLayersExpanded)
      }
      if (apfloraLayersExpanded) {
        toggleApfloraLayersExpanded(!apfloraLayersExpanded)
      }
    },
    onToggleApfloraLayersExpanded: ({
      overlaysExpanded,
      baseLayersExpanded,
      toggleOverlaysExpanded,
      toggleBaseLayersExpanded,
      toggleApfloraLayersExpanded,
      apfloraLayersExpanded,
    }) => () => {
      toggleApfloraLayersExpanded(!apfloraLayersExpanded)
      if (overlaysExpanded) {
        toggleOverlaysExpanded(!overlaysExpanded)
      }
      if (baseLayersExpanded) {
        toggleBaseLayersExpanded(!baseLayersExpanded)
      }
    },
  }),
  observer
)

const LayersControl = ({
  store,
  apfloraLayers,
  setApfloraLayers,
  activeApfloraLayers,
  baseLayersExpanded,
  overlaysExpanded,
  apfloraLayersExpanded,
  onToggleBaseLayersExpanded,
  onToggleOverlaysExpanded,
  onToggleApfloraLayersExpanded,
}: {
  store: Object,
  apfloraLayers: Array<Object>,
  setApfloraLayers: () => void,
  activeApfloraLayers: Array<Object>,
  baseLayersExpanded: boolean,
  overlaysExpanded: boolean,
  toggleBaseLayersExpanded: () => void,
  toggleOverlaysExpanded: () => void,
  onToggleBaseLayersExpanded: () => void,
  onToggleOverlaysExpanded: () => void,
}) => {
  const { tree, table } = store
  const { activeNodes } = tree
  const getApfloraLayersTitle = () => {
    if (!activeNodes.ap) return 'apflora'
    const ap = table.ap.get(activeNodes.ap)
    if (!ap || !ap.label) return 'apflora'
    return ap.label
  }
  const ApfloraCard =
    baseLayersExpanded || apfloraLayersExpanded || overlaysExpanded
      ? CardTitle
      : CardTitleApfloraOpen

  return (
    <Control position="topright">
      <MuiThemeProvider theme={theme}>
        <CardContainer>
          <Card>
            <CardHeader onClick={onToggleApfloraLayersExpanded}>
              <ApfloraCard>{getApfloraLayersTitle()}</ApfloraCard>
              <div>
                {apfloraLayersExpanded ? (
                  <StyledExpandLessIcon />
                ) : (
                  <StyledExpandMoreIcon />
                )}
              </div>
            </CardHeader>
            {apfloraLayersExpanded && (
              <ApfloraLayers
                store={store}
                apfloraLayers={apfloraLayers}
                setApfloraLayers={setApfloraLayers}
                activeApfloraLayers={activeApfloraLayers}
                /**
                 * overlaysString enforces rererender
                 * even when only the sorting changes
                 */
                apfloraLayersString={apfloraLayers.map(o => o.value).join()}
                assigning={store.map.beob.assigning}
              />
            )}
          </Card>
          <Card>
            <CardHeader onClick={onToggleOverlaysExpanded}>
              <CardTitle>überlagernd</CardTitle>
              <div>
                {overlaysExpanded ? (
                  <StyledExpandLessIcon />
                ) : (
                  <StyledExpandMoreIcon />
                )}
              </div>
            </CardHeader>
            {overlaysExpanded && (
              <Overlays
                store={store}
                /**
                 * overlaysString enforces rererender
                 * even when only the sorting changes
                 */
                overlaysString={store.map.overlaysString}
                assigning={store.map.beob.assigning}
              />
            )}
          </Card>
          <Card>
            <CardHeader onClick={onToggleBaseLayersExpanded}>
              <CardTitle>Hintergrund</CardTitle>
              <div>
                {baseLayersExpanded ? (
                  <StyledExpandLessIcon />
                ) : (
                  <StyledExpandMoreIcon />
                )}
              </div>
            </CardHeader>
            {baseLayersExpanded && <BaseLayers store={store} />}
          </Card>
        </CardContainer>
      </MuiThemeProvider>
    </Control>
  )
}

export default enhance(LayersControl)
