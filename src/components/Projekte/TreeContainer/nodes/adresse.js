// @flow
import get from 'lodash/get'

import compareLabel from './compareLabel'

export default ({
  data,
  treeName,
  projektNodes,
}: {
  data: Object,
  treeName: String,
  projektNodes: Array<Object>,
}): Array<Object> => {
  const adresses = get(data, 'adresses.nodes', [])
  const wlIndex = projektNodes.length + 2
  const nodeLabelFilterString = get(data, `${treeName}.nodeLabelFilter.adresse`)

  // map through all elements and create array of nodes
  const nodes = adresses
    // filter by nodeLabelFilter
    .filter(el => {
      if (nodeLabelFilterString) {
        const name = el.name || '(kein Name)'
        return name
          .toLowerCase()
          .includes(nodeLabelFilterString.toLowerCase())
      }
      return true
    })
    .map(el => ({
      nodeType: 'table',
      menuType: 'adresse',
      id: el.id,
      parentId: 'adresseFolder',
      urlLabel: el.id,
      label: el.name || '(kein Name)',
      url: ['Werte-Listen', 'Adressen', el.id],
      hasChildren: false,
    }))
    // sort by label
    .sort(compareLabel)
    .map((el, index) => {
      el.sort = [wlIndex, 1, index]
      return el
    })
  return nodes
}
