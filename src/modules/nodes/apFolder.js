import findIndex from 'lodash/findIndex'

export default (store) => {
  const { activeUrlElements } = store
  // fetch sorting indexes of parents
  const projId = activeUrlElements.projekt
  if (!projId) return []
  const projIndex = findIndex(store.table.filteredAndSorted.projekt, { ProjId: projId })
  // build label
  //const apNodesLength = store.node.node.ap.length
  const apNodesLength = 0
  let message = apNodesLength
  if (store.table.apLoading) {
    message = `...`
  }
  if (store.node.nodeLabelFilter.get(`ap`)) {
    message = `${apNodesLength} gefiltert`
  }

  return {
    nodeType: `folder`,
    menuType: `apFolder`,
    id: projId,
    label: `Arten (${message})`,
    expanded: activeUrlElements.apFolder,
    url: [`Projekte`, projId, `Arten`],
    level: 2,
    sort: [projIndex, 1],
    childrenLength: apNodesLength,
  }
}
