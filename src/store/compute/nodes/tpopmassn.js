import findIndex from 'lodash/findIndex'

export default (store) => {
  const { activeUrlElements, tree } = store
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

  return tree.filteredAndSorted.tpopmassn.map((el, index) => ({
    nodeType: `table`,
    menuType: `tpopmassn`,
    id: el.TPopMassnId,
    parentId: tpopId,
    label: el.label,
    expanded: el.TPopMassnId === activeUrlElements.tpopmassn,
    url: [`Projekte`, projId, `Arten`, apArtId, `Populationen`, popId, `Teil-Populationen`, tpopId, `Massnahmen`, el.TPopMassnId],
    sort: [projIndex, 1, apIndex, 1, popIndex, 1, tpopIndex, 1, index],
    hasChildren: false,
  }))
}
