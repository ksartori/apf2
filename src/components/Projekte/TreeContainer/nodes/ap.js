// @flow
import findIndex from 'lodash/findIndex'
import get from 'lodash/get'

import compareLabel from './compareLabel'
import projektNodes from './projekt'

export default ({
  data,
  tree,
  projId,
}: {
  data: Object,
  tree: Object,
  projId: number,
}): Array<Object> => {
  const { nodeLabelFilter, apFilter } = tree
  const nodeLabelFilterString = nodeLabelFilter.get('ap')
  const aps = get(data, 'allAps.nodes', [])

  // fetch sorting indexes of parents
  const projIndex = findIndex(projektNodes({ data, tree }), {
    id: projId,
  })

  // map through all elements and create array of nodes
  const nodes = aps
    // filter by projekt
    .filter(el => el.projId === projId)
    // filter by nodeLabelFilter
    .filter(el => {
      if (nodeLabelFilterString) {
        return get(el, 'aeEigenschaftenByArtId.artname', '')
          .toLowerCase()
          .includes(nodeLabelFilterString.toLowerCase())
      }
      return true
    })
    // filter by apFilter
    .filter(el => {
      if (apFilter) {
        return [1, 2, 3].includes(el.bearbeitung)
      }
      return true
    })
    .map(el => ({
      nodeType: 'table',
      menuType: 'ap',
      id: el.id,
      parentId: el.projId,
      urlLabel: el.id,
      label: get(el, 'aeEigenschaftenByArtId.artname', '(keine Art gewählt)'),
      url: ['Projekte', el.projId, 'Aktionspläne', el.id],
      hasChildren: true,
    }))
    // sort by label
    .sort(compareLabel)
    .map((el, index) => {
      el.sort = [projIndex, 1, index]
      return el
    })
  return nodes
}
