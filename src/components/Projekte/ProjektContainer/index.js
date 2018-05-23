// @flow
import React from 'react'
import { observer, inject } from 'mobx-react'
import { toJS } from 'mobx'
import styled from 'styled-components'
import compose from 'recompose/compose'
import { ReflexContainer, ReflexSplitter, ReflexElement } from 'react-reflex'
import { Query } from 'react-apollo'
import get from 'lodash/get'
import merge from 'lodash/merge'
import clone from 'lodash/clone'
import isEqual from 'lodash/isEqual'

// when Karte was loaded async, it did not load,
// but only in production!
import Karte from '../Karte'
import ErrorBoundary from '../../shared/ErrorBoundary'
import data1Gql from './data1.graphql'
import data2Gql from './data2.graphql'
import TreeContainer from '../TreeContainer'
import Daten from '../Daten'
import Exporte from '../Exporte'
import getActiveNodes from '../../../modules/getActiveNodes'
import variables from './variables'
import buildNodes from '../TreeContainer/nodes'

const Container = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  cursor: ${props => (props['data-loading'] ? 'wait' : 'inherit')};
`
const KarteContainer = styled.div`
  border-left-color: rgb(46, 125, 50);
  border-left-width: 1px;
  border-left-style: solid;
  border-right-color: rgb(46, 125, 50);
  border-right-width: 1px;
  border-right-style: solid;
  height: 100%;
  overflow: hidden;
`

const enhance = compose(inject('store'), observer)

const Projekte = ({
  store,
  treeName,
  tabs: tabsPassed
}: {
  store: Object,
  treeName: String,
  tabs: Array<String>
}) =>
  <Query query={data1Gql} >
    {({ error, data: data1 }) => {
      if (error) return `Fehler: ${error.message}`
      const activeNodeArray = get(data1, `${treeName}.activeNodeArray`)
      const activeNodes = getActiveNodes(activeNodeArray, store)

      return (
        <Query query={data2Gql} variables={variables(activeNodes)}>
          {({ loading, error, data: data2, client }) => {
            if (error) return `Fehler: ${error.message}`

            const data = merge(data1, data2)
            const nodes = buildNodes({ data, treeName })
            const tree = get(data, treeName)
            const activeNodeArray = get(data, `${treeName}.activeNodeArray`)
            const activeNode = nodes.find(n => isEqual(n.url, activeNodeArray))
            // remove 2 to treat all same
            const tabs = clone(tabsPassed).map(t => t.replace('2', ''))

            return (
              <Container data-loading={loading}>
                <ErrorBoundary>
                  <ReflexContainer orientation="vertical">
                    { 
                      tabs.includes('tree') &&
                      <ReflexElement>
                        <TreeContainer
                          treeName={treeName}
                          data={data}
                          nodes={nodes}
                          activeNodes={activeNodes}
                          activeNode={activeNode}
                          client={client}
                        />
                      </ReflexElement>
                    }
                    {
                      tabs.includes('tree') && tabs.includes('daten') &&
                      <ReflexSplitter />
                    }
                    {
                      tabs.includes('daten') &&
                      <ReflexElement
                        propagateDimensions={true}
                        renderOnResizeRate={100}
                        renderOnResize={true}
                      >
                        <Daten
                          tree={tree}
                          treeName={treeName}
                          activeNode={activeNode}
                        />
                      </ReflexElement>
                    }
                    {
                      tabs.includes('exporte') && (tabs.includes('tree') || tabs.includes('daten')) &&
                      <ReflexSplitter />
                    }
                    {
                      tabs.includes('exporte') &&
                      <ReflexElement>
                        <Exporte />
                      </ReflexElement>
                    }
                    {
                      tabs.includes('karte') && (tabs.includes('tree') || tabs.includes('daten') || tabs.includes('exporte')) &&
                      <ReflexSplitter />
                    }
                    {
                      tabs.includes('karte') &&
                      <ReflexElement
                        //className="karte"
                        //style={{ overflow: 'hidden' }}
                      >
                        <KarteContainer>
                          <Karte
                            /**
                             * key of tabs is added to force mounting
                             * when tabs change
                             * without remounting grey space remains
                             * when daten or tree tab is removed :-(
                             */
                            key={tabs.toString()}
                            popHighlighted={store.map.pop.highlightedIds.join()}
                            tpopHighlighted={store.map.tpop.highlightedIds.join()}
                            beobNichtBeurteiltHighlighted={store.map.beobNichtBeurteilt.highlightedIds.join()}
                            beobNichtZuzuordnenHighlighted={store.map.beobNichtZuzuordnen.highlightedIds.join()}
                            beobZugeordnetHighlighted={store.map.beobZugeordnet.highlightedIds.join()}
                            beobZugeordnetAssigning={store.map.beob.assigning}
                            idOfTpopBeingLocalized={store.map.tpop.idOfTpopBeingLocalized}
                            activeBaseLayer={store.map.activeBaseLayer}
                            activeOverlays={store.map.activeOverlays}
                            activeApfloraLayers={store.map.activeApfloraLayers}
                            // SortedStrings enforce rerendering when sorting or visibility changes
                            activeOverlaysSortedString={store.map.activeOverlaysSortedString}
                            activeApfloraLayersSortedString={
                              store.map.activeApfloraLayersSortedString
                            }
                            detailplaene={toJS(store.map.detailplaene)}
                            markierungen={toJS(store.map.markierungen)}
                          />
                        </KarteContainer>
                      </ReflexElement>
                    }
                  </ReflexContainer>
                </ErrorBoundary>
              </Container>
            )
          }}
        </Query>
      )
    }}
  </Query>

export default enhance(Projekte)
