// @flow
import findIndex from 'lodash/findIndex'

export default (
  store: Object,
  tree: Object,
  projId: number,
  apId: number
): Array<Object> => {
  // fetch sorting indexes of parents
  const projIndex = findIndex(tree.filteredAndSorted.projekt, {
    id: projId,
  })
  const apIndex = findIndex(
    tree.filteredAndSorted.ap.filter(a => a.proj_id === projId),
    { id: apId }
  )

  return tree.filteredAndSorted.apart
    .filter(p => p.ap_id === apId)
    .map((el, index) => ({
      nodeType: 'table',
      menuType: 'apart',
      id: el.id,
      parentId: apId,
      urlLabel: el.id,
      label: el.label,
      url: ['Projekte', projId, 'Aktionspläne', apId, 'ap-arten', el.id],
      sort: [projIndex, 1, apIndex, 7, index],
      hasChildren: false,
    }))
}
