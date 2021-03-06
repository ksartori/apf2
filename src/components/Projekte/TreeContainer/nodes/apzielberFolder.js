// @flow
import findIndex from 'lodash/findIndex'
import get from 'lodash/get'

import allParentNodesAreOpen from '../allParentNodesAreOpen'

export default ({
  data,
  treeName,
  loading,
  projektNodes,
  projId,
  apNodes,
  openNodes,
  apId,
  zielJahr,
  zielId,
  apzieljahrFolderNodes,
  apzielNodes,
}: {
  data: Object,
  treeName: String,
  loading: Boolean,
  projektNodes: Array<Object>,
  projId: String,
  apNodes: Array<Object>,
  openNodes: Array<String>,
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
  const zielberNodesLength = zielbers
    .filter(el => el.zielId === zielId)
    // filter by nodeLabelFilter
    .filter(el => {
      if (nodeLabelFilterString) {
        return `${el.jahr || '(kein Jahr)'}: ${el.erreichung ||
          '(nicht beurteilt)'}`
          .toLowerCase()
          .includes(nodeLabelFilterString.toLowerCase())
      }
      return true
    }).length
  let message = (loading && !zielberNodesLength) ? '...' : zielberNodesLength
  if (nodeLabelFilterString) {
    message = `${zielberNodesLength} gefiltert`
  }

  const url = [
    'Projekte',
    projId,
    'Aktionspläne',
    apId,
    'AP-Ziele',
    zielJahr,
    zielId,
    'Berichte',
  ]
  const allParentsOpen = allParentNodesAreOpen(openNodes, url)
  if (!allParentsOpen) return []

  return [{
    nodeType: 'folder',
    menuType: 'zielberFolder',
    id: zielId,
    urlLabel: 'Berichte',
    label: `Berichte (${message})`,
    url,
    sort: [projIndex, 1, apIndex, 2, zieljahrIndex, zielIndex, 1],
    hasChildren: zielberNodesLength > 0,
  }, ]
}