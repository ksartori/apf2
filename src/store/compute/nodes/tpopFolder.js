import findIndex from 'lodash/findIndex'

export default (store) => {
  const { activeUrlElements, node, table } = store

  // fetch sorting indexes of parents
  const projId = activeUrlElements.projekt
  if (!projId) return []
  const projIndex = findIndex(node.filteredAndSorted.projekt, { ProjId: projId })
  const apArtId = activeUrlElements.ap
  if (!apArtId) return []
  const apIndex = findIndex(node.filteredAndSorted.ap, { ApArtId: apArtId })
  const popId = activeUrlElements.pop
  if (!popId) return []
  const popIndex = findIndex(node.filteredAndSorted.pop, { PopId: popId })

  const childrenLength = node.filteredAndSorted.tpop.length

  let message = childrenLength
  if (table.tpopLoading) {
    message = `...`
  }
  if (node.nodeLabelFilter.get(`tpop`)) {
    message = `${childrenLength} gefiltert`
  }

  return {
    nodeType: `folder`,
    menuType: `tpopFolder`,
    id: popId,
    label: `Teil-Populationen (${message})`,
    expanded: activeUrlElements.tpopFolder,
    url: [`Projekte`, projId, `Arten`, apArtId, `Populationen`, popId, `Teil-Populationen`],
    sort: [projIndex, 1, apIndex, 1, popIndex, 1],
    hasChildren: childrenLength > 0,
  }
}
