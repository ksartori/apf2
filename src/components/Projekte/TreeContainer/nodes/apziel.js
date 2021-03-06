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
  jahr,
  apzieljahrFolderNodes
}: {
  data: Object,
  treeName: String,
  projektNodes: Array<Object>,
  apNodes: Array<Object>,
  openNodes: Array<String>,
  projId: String,
  apId: String,
  jahr: Number,
  apzieljahrFolderNodes: Array<Object>
}): Array<Object> => {
  const ziels = get(data, 'ziels.nodes', [])
  // fetch sorting indexes of parents
  const projIndex = findIndex(projektNodes, {
    id: projId,
  })
  const apIndex = findIndex(apNodes, {
    id: apId
  })
  const nodeLabelFilterString = get(data, `${treeName}.nodeLabelFilter.ziel`)
  const zieljahrIndex = findIndex(apzieljahrFolderNodes, el => el.jahr === jahr)

  // map through all elements and create array of nodes
  const nodes = ziels
    .filter(el => el.apId === apId)
    .filter(el => el.jahr === jahr)
    // filter by nodeLabelFilter
    .filter(el => {
      if (nodeLabelFilterString) {
        const label = `${el.bezeichnung || '(kein Ziel)'} (${get(
          el, 'zielTypWerteByTyp.text') || '(kein Typ)'})`
        return label.toLowerCase().includes(nodeLabelFilterString.toLowerCase())
      }
      return true
    })
    .map(el => ({
      nodeType: 'table',
      menuType: 'ziel',
      id: el.id,
      parentId: el.apId,
      urlLabel: el.id,
      label: `${el.bezeichnung || '(kein Ziel)'} (${get(
        el,
        'zielTypWerteByTyp.text',
        'kein Typ'
      )})`,
      url: [
        'Projekte',
        projId,
        'Aktionspläne',
        el.apId,
        'AP-Ziele',
        el.jahr,
        el.id,
      ],
      hasChildren: true,
    }))
    .filter(el => allParentNodesAreOpen(openNodes, el.url))
    // sort by label
    .sort(compareLabel)
    .map((el, index) => {
      el.sort = [projIndex, 1, apIndex, 2, zieljahrIndex, index]
      return el
    })

  return nodes
}