import React from 'react'
import get from 'lodash/get'
import flatten from 'lodash/flatten'
import format from 'date-fns/format'

import buildLines from './buildLines'
import Polylines from './Polylines'

/**
 * not fetching data here because:
 * needs to be refetched after assigning beobs
 * so it is fetched in ProjektContainer
 */

const Lines = ({
  data,
  tree,
  activeNodes,
  mapIdsFiltered,
}:{
  data: Object,
  tree: Object,
  activeNodes: Array<Object>,
  mapIdsFiltered: Array<String>,
}) => {
  const beobZugeordnetFilterString = get(tree, 'nodeLabelFilter.beobZugeordnet')
  const aparts = get(data, 'beobAssignLines.apsByProjId.nodes[0].apartsByApId.nodes', [])
  const beobs = flatten(aparts.map(a => get(a, 'aeEigenschaftenByArtId.beobsByArtId.nodes', [])))
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
  const lines = buildLines({
    beobs,
    activeNodes,
    mapIdsFiltered,
  })
  return <Polylines lines={lines} />
}

export default Lines
