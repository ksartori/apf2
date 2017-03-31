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

  // map through all and create array of nodes
  return node.filteredAndSorted.beobNichtZuzuordnen.map((el, index) => {
    const beobId = isNaN(el.NO_NOTE) ? el.NO_NOTE : parseInt(el.NO_NOTE, 10)

    return {
      nodeType: `table`,
      menuType: `beobNichtZuzuordnen`,
      id: beobId,
      parentId: apArtId,
      label: el.label,
      expanded: beobId === activeUrlElements.beobNichtZuzuordnen,
      url: [`Projekte`, projId, `Arten`, apArtId, `nicht-zuzuordnende-Beobachtungen`, beobId],
      level: 5,
      sort: [projIndex, 1, apIndex, 9, index],
      childrenLength: 0,
    }
  })
}
