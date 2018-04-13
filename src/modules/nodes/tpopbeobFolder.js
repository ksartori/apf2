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

  const childrenLength = tree.filteredAndSorted.tpopbeob.filter(
    t => t.tpop_id === tpopId
  ).length
  let message = childrenLength
  if (store.loading.includes('tpopbeob')) {
    message = '...'
  }
  if (tree.nodeLabelFilter.get('tpopbeob')) {
    message = `${childrenLength} gefiltert`
  }

  return [
    {
      nodeType: 'folder',
      menuType: 'tpopbeobFolder',
      id: tpopId,
      urlLabel: 'Beobachtungen',
      label: `Beobachtungen zugeordnet (${message})`,
      url: [
        'Projekte',
        projId,
        'Arten',
        apId,
        'Populationen',
        popId,
        'Teil-Populationen',
        tpopId,
        'Beobachtungen',
      ],
      sort: [projIndex, 1, apIndex, 1, popIndex, 1, tpopIndex, 6],
      hasChildren: childrenLength > 0,
    },
  ]
}
