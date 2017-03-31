import findIndex from 'lodash/findIndex'

export default (store) => {
  const { activeUrlElements, node } = store

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
  const tpopId = activeUrlElements.tpop
  if (!tpopId) return []
  const tpopIndex = findIndex(node.filteredAndSorted.tpop, { TPopId: tpopId })

  const childrenLength = node.filteredAndSorted.tpopbeob.length
  let message = childrenLength
  if (store.loading.includes(`beobzuordnung`)) {
    message = `...`
  }
  if (node.nodeLabelFilter.get(`tpopbeob`)) {
    message = `${childrenLength} gefiltert`
  }

  return {
    nodeType: `folder`,
    menuType: `tpopbeobFolder`,
    id: tpopId,
    label: `Beobachtungen zugeordnet (${message})`,
    expanded: activeUrlElements.tpopbeobFolder,
    url: [`Projekte`, projId, `Arten`, apArtId, `Populationen`, popId, `Teil-Populationen`, tpopId, `Beobachtungen`],
    sort: [projIndex, 1, apIndex, 1, popIndex, 1, tpopIndex, 6],
    hasChildren: childrenLength > 0,
  }
}
