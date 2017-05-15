// @flow
import React from 'react'
import { observer, inject } from 'mobx-react'
import styled from 'styled-components'
import compose from 'recompose/compose'
import lifecycle from 'recompose/lifecycle'

import TreeContainer from './TreeContainer'
import Daten from './Daten'
import Karte from './Karte'
import Exporte from './Exporte'

const Container = styled(({ loading, children, ...rest }) => (
  <div {...rest}>{children}</div>
))`
  display: flex;
  flex-direction: column;
  height: 100%;
  cursor: ${props => (props.loading ? 'wait' : 'inherit')}
`
const Content = styled.div`
  display: flex;
  flex-wrap: nowrap;
  height: 100%;
`
const KarteContainer = styled.div`
  border-color: #424242;
  border-width: 1px;
  border-style: solid;
  flex-basis: 600px;
  flex-grow: 6;
  flex-shrink: 1;
  height: 100%;
`

const enhance = compose(
  inject('store'),
  lifecycle({
    componentDidMount: function() {
      // console.log('Projekte did mount')
    },
  }),
  observer,
)

const Projekte = ({ store }: { store: Object }) => {
  const projekteTabs = store.urlQuery.projekteTabs
  const treeIsVisible = projekteTabs.includes('tree')
  const tree2IsVisible = projekteTabs.includes('tree2')
  const datenIsVisible =
    projekteTabs.includes('daten') && !projekteTabs.includes('exporte')
  const daten2IsVisible =
    projekteTabs.includes('daten2') && !projekteTabs.includes('exporte')
  const karteIsVisible = projekteTabs.includes('karte')
  const exporteIsVisible = projekteTabs.includes('exporte')

  return (
    <Container loading={store.loading.length > 0}>
      <Content>
        {treeIsVisible && <TreeContainer tree={store.tree} />}
        {datenIsVisible && <Daten tree={store.tree} />}
        {tree2IsVisible && <TreeContainer tree={store.tree2} />}
        {daten2IsVisible && <Daten tree={store.tree2} />}
        {exporteIsVisible && <Exporte />}
        {karteIsVisible &&
          <KarteContainer>
            <Karte
              /**
               * key of tabs is added to force mounting
               * when tabs change
               * without remounting grey space remains
               * when daten or tree tab is removed :-(
               */
              key={store.urlQuery.projekteTabs.toString()}
              popMarkers={store.map.pop.markers}
              popHighlighted={store.map.pop.highlightedIds.join()}
              tpopMarkers={store.map.tpop.markers}
              tpopHighlighted={store.map.tpop.highlightedIds.join()}
              tpopMarkersClustered={store.map.tpop.markersClustered}
              beobNichtBeurteiltMarkers={store.map.beobNichtBeurteilt.markers}
              beobNichtBeurteiltHighlighted={store.map.beobNichtBeurteilt.highlightedIds.join()}
              beobNichtBeurteiltMarkersClustered={
                store.map.beobNichtBeurteilt.markersClustered
              }
              beobNichtZuzuordnenMarkers={
                store.map.beobNichtZuzuordnen.markersClustered
              }
              beobNichtZuzuordnenHighlighted={store.map.beobNichtZuzuordnen.highlightedIds.join()}
              tpopBeobMarkers={store.map.tpopBeob.markers}
              tpopBeobHighlighted={store.map.tpopBeob.highlightedIds.join()}
              tpopBeobMarkersClustered={store.map.tpopBeob.markersClustered}
              tpopBeobAssigning={store.map.beob.assigning}
              tpopBeobAssignPolylines={store.map.tpopBeob.assignPolylines}
              tpopBeobAssignPolylinesLength={
                store.map.tpopBeob.assignPolylines.length
              }
              idOfTpopBeingLocalized={store.map.tpop.idOfTpopBeingLocalized}
              activeBaseLayer={store.map.activeBaseLayer}
              activeOverlays={store.map.activeOverlays}
              activeApfloraLayers={store.map.activeApfloraLayers}
              // SortedStrings enforce rerendering when sorting or visibility changes
              activeOverlaysSortedString={store.map.activeOverlaysSortedString}
              activeApfloraLayersSortedString={
                store.map.activeApfloraLayersSortedString
              }
            />
          </KarteContainer>}
      </Content>
    </Container>
  )
}

export default enhance(Projekte)
