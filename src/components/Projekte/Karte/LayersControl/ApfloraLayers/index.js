import React from 'react'
import { observer } from 'mobx-react'
import styled from 'styled-components'
import Button from '@material-ui/core/Button'
import DragHandleIcon from '@material-ui/icons/DragHandle'
import PauseCircleOutlineIcon from '@material-ui/icons/PauseCircleOutline'
import PlayCircleOutlineIcon from '@material-ui/icons/PlayCircleOutline'
import LocalFloristIcon from '@material-ui/icons/LocalFlorist'
import FilterCenterFocusIcon from '@material-ui/icons/FilterCenterFocus'
import RemoveIcon from '@material-ui/icons/Remove'
import PhotoFilterIcon from '@material-ui/icons/PhotoFilter'
import {
  SortableContainer,
  SortableElement,
  SortableHandle,
  arrayMove,
} from 'react-sortable-hoc'
import 'leaflet'
import 'leaflet-draw'
import { ApolloProvider, Query } from 'react-apollo'
import app from 'ampersand-app'
import get from 'lodash/get'
import flatten from 'lodash/flatten'

import Checkbox from '../shared/Checkbox'
import dataGql from './data.graphql'
import setAssigningBeob from './setAssigningBeob.graphql'
import getBounds from '../../../../../modules/getBounds'
import idsInsideFeatureCollection from '../../../../../modules/idsInsideFeatureCollection'

const StyledIconButton = styled(Button)`
  max-width: 18px;
  min-height: 20px !important;
  min-width: 20px !important;
  padding: 0 !important;
  margin-top: -3px !important;
`
const StyledPauseCircleOutlineIcon = styled(PauseCircleOutlineIcon)`
  cursor: ${props =>
    props['data-assigningispossible'] ? 'pointer' : 'not-allowed'};
`
const StyledPlayCircleOutlineIcon = styled(PlayCircleOutlineIcon)`
  color: ${props =>
    props['data-assigningispossible'] ? 'black' : 'rgba(0,0,0,0.2) !important'};
  cursor: ${props =>
    props['data-assigningispossible'] ? 'pointer' : 'not-allowed'};
`
const CardContent = styled.div`
  color: rgb(48, 48, 48);
  padding-left: 5px;
  padding-right: 4px;
`
const StyledDragHandleIcon = styled(DragHandleIcon)`
  height: 20px !important;
  color: #7b7b7b !important;
  cursor: grab;
`
const ZoomToIcon = styled(FilterCenterFocusIcon)`
  height: 20px !important;
`
const FilterIcon = styled(PhotoFilterIcon)`
  height: 20px !important;
`
const LayerDiv = styled.div`
  display: flex;
  min-height: 24px;
  justify-content: space-between;
  padding-top: 4px;
  &:not(:last-of-type) {
    border-bottom: 1px solid #ececec;
  }
  /*
   * z-index is needed because leaflet
   * sets high one for controls
   */
  z-index: 2000;
  /*
   * font-size is lost while moving a layer
   * because it is inherited from higher up
   */
  font-size: 12px;
`
const IconsDiv = styled.div`
  display: flex;
`
const ZuordnenDiv = styled.div``
const ZoomToDiv = styled.div`
  padding-left: 3px;
  min-width: 18px;
`
const FilterDiv = styled.div`
  padding-left: 3px;
`
const MapIcon = styled(LocalFloristIcon)`
  margin-right: -0.1em;
  height: 20px !important;
  paint-order: stroke;
  stroke-width: 1px;
  stroke: black;
`
const PopMapIcon = MapIcon.extend`
  color: #947500 !important;
`
const TpopMapIcon = MapIcon.extend`
  color: #016f19 !important;
`
const BeobNichtBeurteiltMapIcon = MapIcon.extend`
  color: #9a009a !important;
`
const BeobNichtZuzuordnenMapIcon = MapIcon.extend`
  color: #ffe4ff !important;
`
const BeobZugeordnetMapIcon = MapIcon.extend`
  color: #ff00ff !important;
`
const BeobZugeordnetAssignPolylinesIcon = styled(RemoveIcon)`
  margin-right: -0.1em;
  height: 20px !important;
  color: #ff00ff !important;
`
const MapIconDiv = styled.div``

const DragHandle = SortableHandle(() => (
  <StyledIconButton title="ziehen, um Layer höher/tiefer zu stapeln">
    <StyledDragHandleIcon />
  </StyledIconButton>
))
const SortableItem = SortableElement(
  ({
    apfloraLayer,
    activeNodes,
    activeApfloraLayers,
    setActiveApfloraLayers,
    data,
    client,
    bounds,
    setBounds,
    mapFilter,
  }) => {
    const assigning = get(data, 'assigningBeob')
    const assigningispossible =
      activeApfloraLayers.includes('tpop') &&
      (
        (
          activeApfloraLayers.includes('beobNichtBeurteilt') &&
          apfloraLayer.value === 'beobNichtBeurteilt'
        ) ||
        (
          activeApfloraLayers.includes('beobZugeordnet') &&
          apfloraLayer.value === 'beobZugeordnet'
        )
      )
    const getZuordnenIconTitle = () => {
      if (assigning) return 'Zuordnung beenden'
      if (assigningispossible) return 'Teil-Populationen zuordnen'
      return 'Teil-Populationen zuordnen (aktivierbar, wenn auch Teil-Populationen eingeblendet werden)'
    }
    // for each layer there must exist a path in data.graphql!
    let layerData = get(data, `${apfloraLayer.value}.nodes`, [])
    if (apfloraLayer.value === 'tpop') {
      // but tpop is special...
      const pops = get(data, 'pop.nodes', [])
      layerData = flatten(
        pops.map(n => get(n, 'tpopsByPopId.nodes'))
      )
    }
    //const idsOfLayer = get(data, `${apfloraLayer.value}.nodes`, []).map(n => n.id)
    const highlightedIdsOfLayer = idsInsideFeatureCollection({
      mapFilter,
      data: layerData,
      idKey: 'id',
      xKey: 'x',
      yKey: 'y',
    })
    const layerDataHighlighted = layerData.filter(o => highlightedIdsOfLayer.includes(o.id))

    return (
      <LayerDiv>
        <Checkbox
          value={apfloraLayer.value}
          label={apfloraLayer.label}
          checked={activeApfloraLayers.includes(apfloraLayer.value)}
          onChange={() => {
            if (activeApfloraLayers.includes(apfloraLayer.value)) {
              return setActiveApfloraLayers(
                activeApfloraLayers.filter(l => l !== apfloraLayer.value)
              )
            }
            return setActiveApfloraLayers([...activeApfloraLayers, apfloraLayer.value])
          }}
        />
        <IconsDiv>
          {['beobNichtBeurteilt', 'beobZugeordnet'].includes(
            apfloraLayer.value
          ) && (
            <ZuordnenDiv>
              <StyledIconButton
                title={getZuordnenIconTitle()}
                onClick={() => {
                  if (activeApfloraLayers.includes('tpop')) {
                    client.mutate({
                      mutation: setAssigningBeob,
                      variables: { value: !assigning }
                    })
                  }
                }}
              >
                {assigning ? (
                  <StyledPauseCircleOutlineIcon
                    data-assigningispossible={assigningispossible}
                  />
                ) : (
                  <StyledPlayCircleOutlineIcon
                    data-assigningispossible={assigningispossible}
                  />
                )}
              </StyledIconButton>
            </ZuordnenDiv>
          )}
          {apfloraLayer.value === 'pop' &&
            activeApfloraLayers.includes('pop') && (
              <MapIconDiv>
                <PopMapIcon id="PopMapIcon" />
              </MapIconDiv>
            )}
          {apfloraLayer.value === 'tpop' &&
            activeApfloraLayers.includes('tpop') && (
              <MapIconDiv>
                <TpopMapIcon id="TpopMapIcon" />
              </MapIconDiv>
            )}
          {apfloraLayer.value === 'beobNichtBeurteilt' &&
            activeApfloraLayers.includes('beobNichtBeurteilt') && (
              <MapIconDiv>
                <BeobNichtBeurteiltMapIcon id="BeobNichtBeurteiltMapIcon" />
              </MapIconDiv>
            )}
          {apfloraLayer.value === 'beobNichtZuzuordnen' &&
            activeApfloraLayers.includes('beobNichtZuzuordnen') && (
              <MapIconDiv>
                <BeobNichtZuzuordnenMapIcon id="BeobNichtZuzuordnenMapIcon" />
              </MapIconDiv>
            )}
          {apfloraLayer.value === 'beobZugeordnet' &&
            activeApfloraLayers.includes('beobZugeordnet') && (
              <MapIconDiv>
                <BeobZugeordnetMapIcon id="BeobZugeordnetMapIcon" />
              </MapIconDiv>
            )}
          {apfloraLayer.value === 'beobZugeordnetAssignPolylines' &&
            activeApfloraLayers.includes('beobZugeordnetAssignPolylines') && (
              <MapIconDiv>
                <BeobZugeordnetAssignPolylinesIcon
                  id="BeobZugeordnetAssignPolylinesMapIcon"
                  className="material-icons"
                >
                  remove
                </BeobZugeordnetAssignPolylinesIcon>
              </MapIconDiv>
            )}
          {false && (
            <FilterDiv>
              {[
                'pop',
                'tpop',
                'beobNichtBeurteilt',
                'beobNichtZuzuordnen',
                'beobZugeordnet',
              ].includes(apfloraLayer.value) && (
                <StyledIconButton
                  title="mit Umriss(en) filtern"
                  onClick={() => {
                    if (activeApfloraLayers.includes('mapFilter')) {
                      return setActiveApfloraLayers(
                        activeApfloraLayers.filter(l => l !== 'mapFilter')
                      )
                    }
                    setActiveApfloraLayers([...activeApfloraLayers, 'mapFilter'])
                    // this does not work, see: https://github.com/Leaflet/Leaflet.draw/issues/708
                    //window.L.Draw.Rectangle.initialize()
                  }}
                >
                  <FilterIcon
                    style={{
                      color: activeApfloraLayers.includes(
                        apfloraLayer.value
                      )
                        ? 'black'
                        : '#e2e2e2',
                      cursor: activeApfloraLayers.includes(
                        apfloraLayer.value
                      )
                        ? 'pointer'
                        : 'not-allowed',
                    }}
                  />
                </StyledIconButton>
              )}
            </FilterDiv>
          )}
          <ZoomToDiv>
            {apfloraLayer.value !== 'mapFilter' && (
              <StyledIconButton
                title={`auf alle '${apfloraLayer.label}' zoomen`}
                onClick={() => {
                  if (activeApfloraLayers.includes(apfloraLayer.value)) {
                    setBounds(getBounds(layerData))
                  }
                }}
              >
                <ZoomToIcon
                  style={{
                    color: activeApfloraLayers.includes(apfloraLayer.value)
                      ? 'black'
                      : '#e2e2e2',
                    cursor: activeApfloraLayers.includes(apfloraLayer.value)
                      ? 'pointer'
                      : 'not-allowed',
                  }}
                />
              </StyledIconButton>
            )}
          </ZoomToDiv>
          <ZoomToDiv>
            {apfloraLayer.value !== 'mapFilter' && (
              <StyledIconButton
                title={`auf aktive '${apfloraLayer.label}' zoomen`}
                onClick={() => {
                  if (activeApfloraLayers.includes(apfloraLayer.value)) {
                    setBounds(getBounds(layerDataHighlighted))
                  }
                }}
              >
                <ZoomToIcon
                  style={{
                    color:
                      activeApfloraLayers.includes(apfloraLayer.value) &&
                      highlightedIdsOfLayer.length > 0
                        ? '#fbec04'
                        : '#e2e2e2',
                    fontWeight:
                      activeApfloraLayers.includes(apfloraLayer.value) &&
                      highlightedIdsOfLayer.length > 0
                        ? 'bold'
                        : 'normal',
                    cursor:
                      activeApfloraLayers.includes(apfloraLayer.value) &&
                      highlightedIdsOfLayer.length > 0
                        ? 'pointer'
                        : 'not-allowed',
                  }}
                />
              </StyledIconButton>
            )}
          </ZoomToDiv>
          <div>
            {!['beobZugeordnetAssignPolylines', 'mapFilter'].includes(
              apfloraLayer.value
            ) && <DragHandle />}
          </div>
        </IconsDiv>
      </LayerDiv>
    )
  }
)
const SortableList = SortableContainer(
  ({
    items,
    activeApfloraLayers,
    setActiveApfloraLayers,
    data,
    client,
    bounds,
    setBounds,
    mapFilter,
  }) => (
    <div>
      {
        items.map((apfloraLayer, index) => (
          <SortableItem
            key={index}
            index={index}
            apfloraLayer={apfloraLayer}
            activeApfloraLayers={activeApfloraLayers}
            setActiveApfloraLayers={setActiveApfloraLayers}
            data={data}
            client={client}
            bounds={bounds}
            setBounds={setBounds}
            mapFilter={mapFilter}
          />
        ))
      }
    </div>
  )
)

const ApfloraLayers = ({
  activeNodes,
  apfloraLayers,
  setApfloraLayers,
  activeApfloraLayers,
  setActiveApfloraLayers,
  bounds,
  setBounds,
  popBounds,
  setPopBounds,
  tpopBounds,
  setTpopBounds,
  mapFilter,
}: {
  activeNodes: Object,
  apfloraLayers: Array<Object>,
  setApfloraLayers: () => void,
  activeApfloraLayers: Array<Object>,
  setActiveApfloraLayers: () => void,
  bounds: Array<Array<Number>>,
  setBounds: () => void,
  popBounds: Array<Array<Number>>,
  setPopBounds: () => void,
  tpopBounds: Array<Array<Number>>,
  setTpopBounds: () => void,
  mapFilter: Object,
}) => (
  <ApolloProvider client={app.client}>
    <Query
      query={dataGql}
      variables={{
        isAp: !!activeNodes.ap,
        ap: activeNodes.ap ? [activeNodes.ap] : [],
      }}
    >
      {({ loading, error, data, client }) => {
        if (error) return `Fehler: ${error.message}`

        return (
          <CardContent>
            <SortableList
              items={apfloraLayers}
              onSortEnd={({ oldIndex, newIndex }) =>
                setApfloraLayers(arrayMove(apfloraLayers, oldIndex, newIndex))
              }
              useDragHandle
              lockAxis="y"
              activeApfloraLayers={activeApfloraLayers}
              setActiveApfloraLayers={setActiveApfloraLayers}
              data={data}
              client={client}
              bounds={bounds}
              setBounds={setBounds}
              mapFilter={mapFilter}
            />
          </CardContent>
        )
      }}
    </Query>
  </ApolloProvider>
)

export default observer(ApfloraLayers)
