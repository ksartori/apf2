import React from 'react'
import { inject } from 'mobx-react'
import compose from 'recompose/compose'
import { Query } from 'react-apollo'
import get from 'lodash/get'
import flatten from 'lodash/flatten'
import format from 'date-fns/format'

import dataGql from './data.graphql'
import buildMarkers from './buildMarkers'
import Marker from './Marker'

const enhance = compose(inject('store'))

const PmcComponent = ({ store }:{ store: Object }) => {
  const { tree } = store
  const { activeNodes, nodeLabelFilter } = tree
  const { ap, projekt } = activeNodes

  return (
    <Query query={dataGql}
      variables={{
        apId: ap,
        projId: projekt,
      }}
    >
      {({ loading, error, data }) => {
        if (error) return `Fehler: ${error.message}`

        const beobNichtBeurteiltFilterString = nodeLabelFilter.get('beobNichtBeurteilt')
        const aparts = get(data, 'projektById.apsByProjId.nodes[0].apartsByApId.nodes', [])
        const beobs = flatten(aparts.map(a => get(a, 'aeEigenschaftenByArtId.beobsByArtId.nodes', [])))
          // filter them by nodeLabelFilter
          .filter(el => {
            if (!beobNichtBeurteiltFilterString) return true
            return `${
              el.datum ? format(el.datum, 'YYYY.MM.DD') : '(kein Datum)'
            }: ${el.autor || '(kein Autor)'} (${get(el, 'beobQuelleWerteByQuelleId.name', '')})`.toLowerCase().includes(beobNichtBeurteiltFilterString.toLowerCase())
          })
        console.log('BeobNichtBeurteiltMarker:', {projekt, ap, data, aparts, beobs})
        const markers = buildMarkers({ beobs, store })

        return <Marker markers={markers} />
      
    }}
  </Query>
  )
}


export default enhance(PmcComponent)
