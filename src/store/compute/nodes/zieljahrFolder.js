import findIndex from 'lodash/findIndex'

export default (store, tree) => {
  const { activeNodes } = tree

  // fetch sorting indexes of parents
  const projId = activeNodes.projekt
  if (!projId) return []
  const projIndex = findIndex(tree.filteredAndSorted.projekt, { ProjId: projId })
  const apArtId = activeNodes.ap
  if (!apArtId) return []
  const apIndex = findIndex(tree.filteredAndSorted.ap, { ApArtId: apArtId })
  // prevent folder from showing when nodeFilter is set
  if (apIndex === -1) return []

  const zieljahreNodesLength = tree.filteredAndSorted.zieljahr.length

  let message = `${zieljahreNodesLength} Jahre`
  if (store.table.zielLoading) {
    message = `...`
  }
  if (tree.nodeLabelFilter.get(`ziel`)) {
    const jahreTxt = zieljahreNodesLength === 1 ? `Jahr` : `Jahre`
    message = `${zieljahreNodesLength} ${jahreTxt} gefiltert`
  }

  return {
    nodeType: `folder`,
    menuType: `zielFolder`,
    id: apArtId,
    urlLabel: `AP-Ziele`,
    label: `AP-Ziele (${message})`,
    expanded: activeNodes.zielFolder,
    url: [`Projekte`, projId, `Arten`, apArtId, `AP-Ziele`],
    sort: [projIndex, 1, apIndex, 2],
    hasChildren: zieljahreNodesLength > 0,
  }
}
