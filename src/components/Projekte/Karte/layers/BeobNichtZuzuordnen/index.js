import React from 'react'
import { inject } from 'mobx-react'
import compose from 'recompose/compose'
import { Query } from 'react-apollo'
import get from 'lodash/get'
import flatten from 'lodash/flatten'
import format from 'date-fns/format'

import dataGql from './data.graphql'
import buildMarkers from './buildMarkers'
import buildMarkersClustered from './buildMarkersClustered'
import Marker from './Marker'
import MarkerCluster from './MarkerCluster'

const enhance = compose(inject('store'))

const BeobNichtZuzuordnenMarker = ({
  store,
  tree,
  activeNodes,
  clustered
} : {
  store: Object,
  tree: Object,
  activeNodes: Array<Object>,
  clustered: Boolean
}) =>
  <Query query={dataGql}
    variables={{
      apId: activeNodes.ap,
      projId: activeNodes.projekt,
    }}
  >
    {({ loading, error, data }) => {
      if (error) return `Fehler: ${error.message}`

      const beobNichtZuzuordnenFilterString = get(tree, 'nodeLabelFilter.beobNichtZuzuordnen')
      const aparts = get(data, 'projektById.apsByProjId.nodes[0].apartsByApId.nodes', [])
      const beobs = flatten(
        aparts.map(a => get(a, 'aeEigenschaftenByArtId.beobsByArtId.nodes', []))
      )
        // filter them by nodeLabelFilter
        .filter(el => {
          if (!beobNichtZuzuordnenFilterString) return true
          const datum = el.datum ? format(el.datum, 'YYYY.MM.DD') : '(kein Datum)'
          const autor = el.autor || '(kein Autor)'
          const quelle = get(el, 'beobQuelleWerteByQuelleId.name', '')
          return `${datum}: ${autor} (${quelle})`
            .toLowerCase()
            .includes(beobNichtZuzuordnenFilterString.toLowerCase())
        })

      if (clustered) return <MarkerCluster markers={buildMarkersClustered({ beobs, activeNodes, store })} />
      return <Marker markers={buildMarkers({ beobs, tree, activeNodes, store })} />
    
  }}
</Query>


export default enhance(BeobNichtZuzuordnenMarker)
