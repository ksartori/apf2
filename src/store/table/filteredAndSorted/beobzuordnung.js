import sortBy from 'lodash/sortBy'

export default (store) => {
  const { activeUrlElements, table, node } = store
  // grab beob_bereitgestellt as array and sort them by year
  let beobzuordnung = Array.from(table.beob_bereitgestellt.values())
  // show only nodes of active ap
  beobzuordnung = beobzuordnung.filter(a =>
    a.NO_ISFS === activeUrlElements.ap
  )
  beobzuordnung.forEach((el) => {
    const quelle = table.beob_quelle.get(el.QuelleId)
    const quelleName = quelle && quelle.name ? quelle.name : ``
    el.label = `${el.Datum || `(kein Datum)`}: ${el.Autor || `(kein Autor)`} (${quelleName})`
  })
  // filter by node.nodeLabelFilter
  const filterString = node.nodeLabelFilter.get(`beobzuordnung`)
  if (filterString) {
    beobzuordnung = beobzuordnung.filter(p =>
      p.label.toLowerCase().includes(filterString.toLowerCase())
    )
  }
  // sort by label and return
  return sortBy(beobzuordnung, `label`).reverse()
}
