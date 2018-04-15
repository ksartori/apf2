import sortBy from 'lodash/sortBy'
import format from 'date-fns/format'

export default (store: Object, tree: Object): Array<Object> => {
  const { table } = store
  const { nodeLabelFilter } = tree
  // grab tpopbeob as array and sort them by year
  let tpopbeob = Array.from(table.tpopbeob.values()).filter(
    b => !b.nicht_zuordnen && b.tpop_id
  )
  // map through all and create array of nodes
  tpopbeob.forEach(el => {
    let datum = ''
    let autor = ''
    let quelle = ''
    let quelleName = ''
    const beob = table.beob.get(el.beob_id)
    if (beob) {
      if (beob.datum) {
        datum = format(beob.datum, 'YYYY.MM.DD')
      }
      if (beob.autor) {
        autor = beob.autor
      }
      if (beob.quelle_id) {
        quelle = table.beob_quelle.get(beob.quelle_id)
        quelleName = quelle && quelle.name ? quelle.name : ''
      }
    }
    el.label = `${datum || '(kein Datum)'}: ${autor ||
      '(kein Autor)'} (${quelleName})`
  })
  // filter by nodeLabelFilter
  const filterString = nodeLabelFilter.get('tpopbeob')
  if (filterString) {
    tpopbeob = tpopbeob.filter(p =>
      p.label.toLowerCase().includes(filterString.toLowerCase())
    )
  }
  // sort by label and return
  return sortBy(tpopbeob, 'label').reverse()
}
