// @flow
import findIndex from 'lodash/findIndex'
import get from 'lodash/get'
import union from 'lodash/union'

export default ({
  data,
  tree,
  projektNodes,
  projId,
  apNodes,
  apId,
}: {
  data: Object,
  tree: Object,
  projektNodes: Array < Object > ,
  projId: String,
  apNodes: Array < Object > ,
  apId: String,
}): Array < Object > => {
  const ziels = get(data, 'ziels.nodes', [])

  // fetch sorting indexes of parents
  const projIndex = findIndex(projektNodes, {
    id: projId,
  })
  const apIndex = findIndex(apNodes, {
    id: apId
  })
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
    // reduce to distinct years
    .reduce((a, el, index) => union(a, [el.jahr]), [])
  const zieljahreLength = zieljahre.length
  let message = `${zieljahreLength} ${zieljahreLength === 1 ? 'Jahr' : 'Jahre'}`
  if (tree.nodeLabelFilter.get('ziel')) {
    message = `${zieljahreLength} ${
      zieljahreLength === 1 ? 'Jahr' : 'Jahre'
    } gefiltert`
  }

  return [{
    nodeType: 'folder',
    menuType: 'zieljahrFolder',
    id: apId,
    urlLabel: 'AP-Ziele',
    label: `AP-Ziele (${message})`,
    url: ['Projekte', projId, 'Aktionspläne', apId, 'AP-Ziele'],
    sort: [projIndex, 1, apIndex, 2],
    hasChildren: zieljahreLength > 0,
  }, ]
}