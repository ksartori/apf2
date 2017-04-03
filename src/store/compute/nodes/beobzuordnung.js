import findIndex from 'lodash/findIndex'

export default (store, tree) => {
  // fetch sorting indexes of parents
  const projId = tree.activeNodes.projekt
  if (!projId) return []
  const projIndex = findIndex(tree.filteredAndSorted.projekt, { ProjId: projId })
  const apArtId = tree.activeNodes.ap
  if (!apArtId) return []
  const apIndex = findIndex(tree.filteredAndSorted.ap, { ApArtId: apArtId })

  // map through all and create array of nodes
  return tree.filteredAndSorted.beobzuordnung.map((el, index) => {
    const beobId = isNaN(el.BeobId) ? el.BeobId : parseInt(el.BeobId, 10)

    return {
      nodeType: `table`,
      menuType: `beobzuordnung`,
      id: beobId,
      parentId: apArtId,
      label: el.label,
      expanded: beobId === tree.activeNodes.beobzuordnung,
      url: [`Projekte`, projId, `Arten`, apArtId, `nicht-beurteilte-Beobachtungen`, beobId],
      sort: [projIndex, 1, apIndex, 8, index],
      hasChildren: false,
    }
  })
}
