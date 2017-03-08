import findIndex from 'lodash/findIndex'

export default (store) => {
  const { activeUrlElements, node, table } = store

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

  const childrenLength = table.filteredAndSorted.tpopmassn.length

  let message = childrenLength
  if (table.tpopmassnLoading) {
    message = `...`
  }
  if (node.nodeLabelFilter.get(`tpopmassn`)) {
    message = `${childrenLength} gefiltert`
  }
  const sort = [projIndex, 1, apIndex, 1, popIndex, 1, tpopIndex, 1]

  return {
    nodeType: `folder`,
    menuType: `tpopmassnFolder`,
    id: tpopId,
    label: `Massnahmen (${message})`,
    expanded: activeUrlElements.tpopmassnFolder,
    url: [`Projekte`, projId, `Arten`, apArtId, `Populationen`, popId, `Teil-Populationen`, tpopId, `Massnahmen`],
    level: 8,
    sort,
    childrenLength,
  }
}
