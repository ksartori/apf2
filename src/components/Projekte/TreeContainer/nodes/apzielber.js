// @flow
import findIndex from 'lodash/findIndex'
import get from 'lodash/get'

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
  zielJahr,
  zielId,
  apzieljahrFolderNodes,
  apzielNodes,
}: {
  data: Object,
  treeName: String,
  projektNodes: Array<Object>,
  apNodes: Array<Object>,
  openNodes: Array<String>,
  projId: String,
  apId: String,
  zielJahr: Number,
  zielId: String,
  apzieljahrFolderNodes: Array<Object>,
  apzielNodes: Array<Object>,
}): Array<Object> => {
  const zielbers = get(data, 'zielbers.nodes', [])
  // fetch sorting indexes of parents
  const projIndex = findIndex(projektNodes, {
    id: projId,
  })
  const apIndex = findIndex(apNodes, {
    id: apId
  })
  const zieljahrIndex = findIndex(apzieljahrFolderNodes, el => el.jahr === zielJahr)
  const zielIndex = findIndex(apzielNodes, el => el.id === zielId)
  const nodeLabelFilterString = get(data, `${treeName}.nodeLabelFilter.zielber`)

  // map through all elements and create array of nodes
  const nodes = zielbers
    .filter(el => el.zielId === zielId)
    // filter by nodeLabelFilter
    .filter(el => {
      if (nodeLabelFilterString) {
        return `${el.jahr || '(kein Jahr)'}: ${el.erreichung ||
          '(nicht beurteilt)'}`.toLowerCase().includes(nodeLabelFilterString.toLowerCase())
      }
      return true
    })
    .map(el => ({
      nodeType: 'table',
      menuType: 'zielber',
      id: el.id,
      parentId: el.zielId,
      urlLabel: el.id,
      label: `${el.jahr || '(kein Jahr)'}: ${el.erreichung ||
        '(nicht beurteilt)'}`,
      url: [
        'Projekte',
        projId,
        'Aktionspläne',
        apId,
        'AP-Ziele',
        zielJahr,
        el.zielId,
        'Berichte',
        el.id,
      ],
      hasChildren: false,
    }))
    .filter(el => allParentNodesAreOpen(openNodes, el.url))
    // sort by label
    .sort(compareLabel)
    .map((el, index) => {
      el.sort = [projIndex, 1, apIndex, 2, zieljahrIndex, zielIndex, 1, index]
      return el
    })

  return nodes
}