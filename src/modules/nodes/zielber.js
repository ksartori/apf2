// @flow
import findIndex from 'lodash/findIndex'

export default (
  store: Object,
  tree: Object,
  projId: number,
  apArtId: number,
  zieljahr: number,
  zielId: number
): Array<Object> => {
  // fetch sorting indexes of parents
  const projIndex = findIndex(tree.filteredAndSorted.projekt, {
    ProjId: projId,
  })
  const apIndex = findIndex(
    tree.filteredAndSorted.ap.filter(a => a.ProjId === projId),
    { ApArtId: apArtId }
  )
  const zieljahrIndex = findIndex(tree.filteredAndSorted.zieljahr, {
    jahr: zieljahr,
  })
  const zielIndex = findIndex(
    tree.filteredAndSorted.ziel.filter(z => z.jahr === zieljahr),
    { id: zielId }
  )

  // map through all and create array of nodes
  return tree.filteredAndSorted.zielber
    .filter(z => z.ziel_id === zielId)
    .map((el, index) => ({
      nodeType: 'table',
      menuType: 'zielber',
      id: el.id,
      parentId: el.ziel_id,
      urlLabel: el.id,
      label: el.label,
      url: [
        'Projekte',
        projId,
        'Arten',
        apArtId,
        'AP-Ziele',
        zieljahr,
        el.ziel_id,
        'Berichte',
        el.id,
      ],
      sort: [projIndex, 1, apIndex, 2, zieljahrIndex, zielIndex, 1, index],
      hasChildren: false,
    }))
}
