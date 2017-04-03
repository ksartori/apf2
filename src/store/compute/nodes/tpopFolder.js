import findIndex from 'lodash/findIndex'

export default (store) => {
  const { activeNodes, tree, table } = store

  // fetch sorting indexes of parents
  const projId = activeNodes.projekt
  if (!projId) return []
  const projIndex = findIndex(tree.filteredAndSorted.projekt, { ProjId: projId })
  const apArtId = activeNodes.ap
  if (!apArtId) return []
  const apIndex = findIndex(tree.filteredAndSorted.ap, { ApArtId: apArtId })
  const popId = activeNodes.pop
  if (!popId) return []
  const popIndex = findIndex(tree.filteredAndSorted.pop, { PopId: popId })

  const childrenLength = tree.filteredAndSorted.tpop.length

  let message = childrenLength
  if (table.tpopLoading) {
    message = `...`
  }
  if (tree.nodeLabelFilter.get(`tpop`)) {
    message = `${childrenLength} gefiltert`
  }

  return {
    nodeType: `folder`,
    menuType: `tpopFolder`,
    id: popId,
    label: `Teil-Populationen (${message})`,
    expanded: activeNodes.tpopFolder,
    url: [`Projekte`, projId, `Arten`, apArtId, `Populationen`, popId, `Teil-Populationen`],
    sort: [projIndex, 1, apIndex, 1, popIndex, 1],
    hasChildren: childrenLength > 0,
  }
}
