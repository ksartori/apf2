import findIndex from 'lodash/findIndex'

export default (
  store: Object,
  tree: Object,
  projId: number,
  apId: number,
  popId: number,
  tpopId: number
): Array<Object> => {
  // fetch sorting indexes of parents
  const projIndex = findIndex(tree.filteredAndSorted.projekt, {
    ProjId: projId,
  })
  const apIndex = findIndex(
    tree.filteredAndSorted.ap.filter(a => a.ProjId === projId),
    { ApArtId: apId }
  )
  const popIndex = findIndex(
    tree.filteredAndSorted.pop.filter(p => p.ap_id === apId),
    { id: popId }
  )
  const tpopIndex = findIndex(
    tree.filteredAndSorted.tpop.filter(t => t.pop_id === popId),
    { id: tpopId }
  )

  return tree.filteredAndSorted.tpopber
    .filter(t => t.tpop_id === tpopId)
    .map((el, index) => ({
      nodeType: 'table',
      menuType: 'tpopber',
      parentId: tpopId,
      id: el.id,
      urlLabel: el.id,
      label: el.label,
      url: [
        'Projekte',
        projId,
        'Arten',
        apId,
        'Populationen',
        popId,
        'Teil-Populationen',
        tpopId,
        'Kontroll-Berichte',
        el.id,
      ],
      sort: [projIndex, 1, apIndex, 1, popIndex, 1, tpopIndex, 5, index],
      hasChildren: false,
    }))
}
