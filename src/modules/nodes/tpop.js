import findIndex from 'lodash/findIndex'

export default (store) => {
  const { activeUrlElements, table } = store
  // fetch sorting indexes of parents
  const projId = activeUrlElements.projekt
  if (!projId) return []
  const projIndex = findIndex(table.filteredAndSorted.projekt, { ProjId: projId })
  const apArtId = activeUrlElements.ap
  if (!apArtId) return []
  const apIndex = findIndex(table.filteredAndSorted.ap, { ApArtId: apArtId })
  const popId = activeUrlElements.pop
  if (!popId) return []
  const popIndex = findIndex(table.filteredAndSorted.pop, { PopId: popId })

  return table.filteredAndSorted.tpop.map((el, index) => ({
    nodeType: `table`,
    menuType: `tpop`,
    id: el.TPopId,
    parentId: el.PopId,
    label: el.label,
    expanded: el.TPopId === activeUrlElements.tpop,
    url: [`Projekte`, projId, `Arten`, apArtId, `Populationen`, el.PopId, `Teil-Populationen`, el.TPopId],
    level: 7,
    sort: [projIndex, 1, apIndex, 1, popIndex, 1, index],
    childrenLength: 6,
  }))
}
