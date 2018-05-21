// @flow
import findIndex from 'lodash/findIndex'
import get from 'lodash/get'

import compareLabel from './compareLabel'

export default ({
  data,
  tree,
  projektNodes,
  apNodes,
  popNodes,
  projId,
  apId,
  popId,
}: {
  data: Object,
  tree: Object,
  projektNodes: Array<Object>,
  apNodes: Array<Object>,
  popNodes: Array<Object>,
  projId: String,
  apId: String,
  popId: String,
}): Array<Object> => {
  // fetch sorting indexes of parents
  const projIndex = findIndex(projektNodes, {
    id: projId,
  })
  const apIndex = findIndex(apNodes, { id: apId })
  const popIndex = findIndex(popNodes, { id: popId })
  const nodeLabelFilterString = get(tree.nodeLabelFilter
    .find(f => f.table === 'popber'), 'value')

  // map through all elements and create array of nodes
  const nodes = get(data, 'popbers.nodes', [])
    .filter(el => el.popId === popId)
    // filter by nodeLabelFilter
    .filter(el => {
      if (nodeLabelFilterString) {
        return `${el.jahr || '(kein Jahr)'}: ${get(
          el,
          'tpopmassnErfbeurtWerteByBeurteilung.text',
          '(nicht beurteilt)'
        )}`
          .toLowerCase()
          .includes(nodeLabelFilterString.toLowerCase())
      }
      return true
    })
    .map(el => ({
      nodeType: 'table',
      menuType: 'popber',
      id: el.id,
      parentId: popId,
      urlLabel: el.id,
      label: `${el.jahr || '(kein Jahr)'}: ${get(
        el,
        'tpopEntwicklungWerteByEntwicklung.text',
        '(nicht beurteilt)'
      )}`,
      url: [
        'Projekte',
        projId,
        'Aktionspläne',
        apId,
        'Populationen',
        popId,
        'Kontroll-Berichte',
        el.id,
      ],
      hasChildren: false,
    }))
    // sort by label
    .sort(compareLabel)
    .map((el, index) => {
      el.sort = [projIndex, 1, apIndex, 1, popIndex, 2, index]
      return el
    })
  return nodes
}
