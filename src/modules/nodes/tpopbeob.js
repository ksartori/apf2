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
  const tpopId = activeUrlElements.tpop
  if (!tpopId) return []
  const tpopIndex = findIndex(table.filteredAndSorted.tpop, { TPopId: tpopId })

  return table.filteredAndSorted.tpopbeob.map((el, index) => {
    const sort = [projIndex, 1, apIndex, 1, popIndex, 1, tpopIndex, 6, index]

    return {
      nodeType: `table`,
      menuType: `tpopbeob`,
      id: el.beobId,
      parentId: tpopId,
      label: el.label,
      expanded: el.beobId === activeUrlElements.tpopbeob,
      url: [`Projekte`, activeUrlElements.projekt, `Arten`, activeUrlElements.ap, `Populationen`, activeUrlElements.pop, `Teil-Populationen`, el.TPopId, `Beobachtungen`, el.beobId],
      level: 8,
      sort,
      childrenLength: 0,
    }
  })
}
