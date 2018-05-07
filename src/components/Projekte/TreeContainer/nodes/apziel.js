// @flow
import findIndex from 'lodash/findIndex'
import get from 'lodash/get'
import union from 'lodash/union'

import compareLabel from './compareLabel'

export default ({
  data,
  tree,
  projektNodes,
  apNodes,
  projId,
  apId,
  jahr,
}: {
  data: Object,
  tree: Object,
  projektNodes: Array<Object>,
  apNodes: Array<Object>,
  projId: String,
  apId: String,
  jahr: Number,
}): Array<Object> => {
  const ziels = get(data, 'ziels.nodes', [])
  // fetch sorting indexes of parents
  const projIndex = findIndex(projektNodes, {
    id: projId,
  })
  const apIndex = findIndex(apNodes, { id: apId })
  const nodeLabelFilterString = tree.nodeLabelFilter.get('ziel')

  const zieljahre = ziels
    .filter(el => el.apId === apId)
    // filter by nodeLabelFilter
    .filter(el => {
      if (nodeLabelFilterString) {
        return `${el.bezeichnung || '(kein Ziel)'} (${get(
          el,
          'zielTypWerteByTyp.text',
          '(kein Typ)'
        )})`.includes(nodeLabelFilterString.toLowerCase())
      }
      return true
    })
    .reduce((a, el, index) => union(a, [el.jahr]), [])
    .sort()
  const zieljahrIndex = findIndex(zieljahre, el => el === jahr)

  // map through all elements and create array of nodes
  const nodes = ziels
    .filter(el => el.apId === apId)
    .filter(el => el.jahr === jahr)
    // filter by nodeLabelFilter
    .filter(el => {
      if (nodeLabelFilterString) {
        return `${el.bezeichnung || '(kein Ziel)'} (${get(
          el,
          'zielTypWerteByTyp.text',
          '(kein Typ)'
        )})`.includes(nodeLabelFilterString.toLowerCase())
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
    // sort by label
    .sort(compareLabel)
    .map((el, index) => {
      el.sort = [projIndex, 1, apIndex, 2, zieljahrIndex, index]
      return el
    })

  return nodes
}
