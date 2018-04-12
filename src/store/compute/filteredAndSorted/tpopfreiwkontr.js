import sortBy from 'lodash/sortBy'

export default (store: Object, tree: Object): Array<Object> => {
  const { table } = store
  const { nodeLabelFilter } = tree
  // grab tpopkontr as array and sort them by year
  let tpopkontr = Array.from(table.tpopkontr.values()).filter(
    t => t.typ === 'Freiwilligen-Erfolgskontrolle'
  )
  // add label
  tpopkontr.forEach(el => {
    el.label = `${el.jahr || '(kein Jahr)'}`
  })
  // filter by nodeLabelFilter
  const filterString = nodeLabelFilter.get('tpopfreiwkontr')
  if (filterString) {
    tpopkontr = tpopkontr.filter(p =>
      p.label.toLowerCase().includes(filterString.toLowerCase())
    )
  }
  // return sorted by date or year
  return sortBy(tpopkontr, k => (k.datum ? k.datum : `${k.jahr}-01-01`))
}
