import findIndex from 'lodash/findIndex'

export default (store, tree) => {
  // fetch sorting indexes of parents
  const projId = tree.activeNodes.projekt
  if (!projId) return []
  const projIndex = findIndex(tree.filteredAndSorted.projekt, { ProjId: projId })
  const apArtId = tree.activeNodes.ap
  if (!apArtId) return []
  const apIndex = findIndex(tree.filteredAndSorted.ap, { ApArtId: apArtId })

  const beobNichtZuzuordnenNodesLength = tree.filteredAndSorted.beobNichtZuzuordnen.length

  let message = beobNichtZuzuordnenNodesLength
  if (store.loading.includes(`beobzuordnung`)) {
    message = `...`
  }
  if (tree.nodeLabelFilter.get(`beobNichtZuzuordnen`)) {
    message = `${beobNichtZuzuordnenNodesLength} gefiltert`
  }

  return {
    nodeType: `folder`,
    menuType: `beobNichtZuzuordnenFolder`,
    id: apArtId,
    label: `Beobachtungen nicht zuzuordnen (${message})`,
    expanded: tree.activeNodes.beobNichtZuzuordnenFolder,
    url: [`Projekte`, projId, `Arten`, apArtId, `nicht-zuzuordnende-Beobachtungen`],
    sort: [projIndex, 1, apIndex, 9],
    hasChildren: beobNichtZuzuordnenNodesLength > 0,
  }
}
