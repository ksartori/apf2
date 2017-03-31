import findIndex from 'lodash/findIndex'

export default (store) => {
  const { activeUrlElements, tree, table } = store

  // fetch sorting indexes of parents
  const projId = activeUrlElements.projekt
  if (!projId) return []
  const projIndex = findIndex(tree.filteredAndSorted.projekt, { ProjId: projId })
  const apArtId = activeUrlElements.ap
  if (!apArtId) return []
  const apIndex = findIndex(tree.filteredAndSorted.ap, { ApArtId: apArtId })
  const popId = activeUrlElements.pop
  if (!popId) return []
  const popIndex = findIndex(tree.filteredAndSorted.pop, { PopId: popId })
  const tpopId = activeUrlElements.tpop
  if (!tpopId) return []
  const tpopIndex = findIndex(tree.filteredAndSorted.tpop, { TPopId: tpopId })

  const childrenLength = tree.filteredAndSorted.tpopmassn.length

  let message = childrenLength
  if (table.tpopmassnLoading) {
    message = `...`
  }
  if (tree.nodeLabelFilter.get(`tpopmassn`)) {
    message = `${childrenLength} gefiltert`
  }

  return {
    nodeType: `folder`,
    menuType: `tpopmassnFolder`,
    id: tpopId,
    label: `Massnahmen (${message})`,
    expanded: activeUrlElements.tpopmassnFolder,
    url: [`Projekte`, projId, `Arten`, apArtId, `Populationen`, popId, `Teil-Populationen`, tpopId, `Massnahmen`],
    sort: [projIndex, 1, apIndex, 1, popIndex, 1, tpopIndex, 1],
    hasChildren: childrenLength > 0,
  }
}
