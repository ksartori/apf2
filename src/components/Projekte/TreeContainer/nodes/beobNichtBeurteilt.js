// @flow
import findIndex from 'lodash/findIndex'
import get from 'lodash/get'
import format from 'date-fns/format'

import allParentNodesAreOpen from '../allParentNodesAreOpen'
import compareLabel from './compareLabel'

export default ({
  data,
  treeName,
  projektNodes,
  apNodes,
  openNodes,
  projId,
  apId,
}: {
  data: Object,
  treeName: String,
  projektNodes: Array<Object>,
  apNodes: Array<Object>,
  openNodes: Array<String>,
  projId: String,
  apId: String,
}): Array<Object> => {
  const beobNichtBeurteilts = get(data, 'beobNichtBeurteilts.nodes', [])
  // fetch sorting indexes of parents
  const projIndex = findIndex(projektNodes, {
    id: projId,
  })
  const apIndex = findIndex(apNodes, { id: apId })
  const nodeLabelFilterString = get(
    data,
    `${treeName}.nodeLabelFilter.beobNichtBeurteilt`
  )

  // map through all elements and create array of nodes
  const nodes = beobNichtBeurteilts
    .filter(el => el.apId === apId)
    // filter by nodeLabelFilter
    .filter(el => {
      if (nodeLabelFilterString) {
        return `${
          el.datum ? format(el.datum, 'YYYY.MM.DD') : '(kein Datum)'
        }: ${el.autor || '(kein Autor)'} (${el.quelle})`
          .toLowerCase()
          .includes(nodeLabelFilterString.toLowerCase())
      }
      return true
    })
    .map(el => ({
      nodeType: 'table',
      menuType: 'beobNichtBeurteilt',
      id: el.id,
      parentId: apId,
      urlLabel: el.id,
      label: `${
        el.datum ? format(el.datum, 'YYYY.MM.DD') : '(kein Datum)'
      }: ${el.autor || '(kein Autor)'} (${el.quelle})`,
      url: [
        'Projekte',
        projId,
        'Aktionspläne',
        apId,
        'nicht-beurteilte-Beobachtungen',
        el.id,
      ],
      hasChildren: false,
    }))
    .filter(el => allParentNodesAreOpen(openNodes, el.url))
    // sort by label
    .sort(compareLabel)
    .map((el, index) => {
      el.sort = [projIndex, 1, apIndex, 10, index]
      return el
    })

  return nodes
}
