import React from 'react'
import { Query } from 'react-apollo'
import get from 'lodash/get'
import flatten from 'lodash/flatten'
import format from 'date-fns/format'

import dataGql from './data.graphql'
import buildMarkers from './buildMarkers'
import buildMarkersClustered from './buildMarkersClustered'
import Marker from './Marker'
import MarkerCluster from './MarkerCluster'

const BeobZugeordnetMarker = ({
  tree,
  activeNodes,
  apfloraLayers,
  clustered,
  refetchTree,
  beobZugeordnetHighlightedIds,
} : {
  tree: Object,
  activeNodes: Array<Object>,
  apfloraLayers: Array<Object>,
  clustered: Boolean,
  refetchTree: () => void,
  beobZugeordnetHighlightedIds: Array<String>,
}) =>
  <Query query={dataGql}
    variables={{
      apId: activeNodes.ap,
      projId: activeNodes.projekt
    }}
  >
    {({ loading, error, data, client }) => {
      if (error) return `Fehler: ${error.message}`

      const beobZugeordnetFilterString = get(tree, 'nodeLabelFilter.beobZugeordnet')
      const aparts = get(data, 'projektById.apsByProjId.nodes[0].apartsByApId.nodes', [])
      const beobs = flatten(
        aparts.map(a => get(a, 'aeEigenschaftenByArtId.beobsByArtId.nodes', []))
      )
        // filter them by nodeLabelFilter
        .filter(el => {
          if (!beobZugeordnetFilterString) return true
          const datum = el.datum ? format(el.datum, 'YYYY.MM.DD') : '(kein Datum)'
          const autor = el.autor || '(kein Autor)'
          const quelle = get(el, 'beobQuelleWerteByQuelleId.name', '')
          return `${datum}: ${autor} (${quelle})`
            .toLowerCase()
            .includes(beobZugeordnetFilterString.toLowerCase())
        })

      if (clustered) {
        const markers = buildMarkersClustered({
          beobs,
          activeNodes,
          apfloraLayers,
          data,
          beobZugeordnetHighlightedIds,
        })
        return <MarkerCluster markers={markers} />
      }
      const markers = buildMarkers({
        beobs,
        tree,
        activeNodes,
        apfloraLayers,
        client,
        data,
        refetchTree,
        beobZugeordnetHighlightedIds,
      })
      return <Marker markers={markers} />
    
  }}
</Query>

export default BeobZugeordnetMarker
