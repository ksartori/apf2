// @flow
import omit from 'lodash/omit'

import beobIdsFromServerInsideFeatureCollection from './beobIdsFromServerInsideFeatureCollection'
import tpopIdsInsideFeatureCollection from './tpopIdsInsideFeatureCollection'
import popIdsInsideFeatureCollection from './popIdsInsideFeatureCollection'
import exportXlsx from './exportXlsx'
import exportCsv from './exportCsv'
import exportKml from './exportKml'

export default async ({
  data:dataPassed,
  store,
  fileName,
  kml,
}: {
  data: Array<Object>,
  store: Object,
  fileName: string,
  kml: Boolean,
}) => {
  const { listError, map } = store
  const onError = error => {
    listError(error)
  }
  const { mapFilter } = map
  const { applyMapFilterToExport } = store.export
  let data = dataPassed.map(d=> omit(d, ['__typename', 'Symbol(id)']))
  // now we could manipulate the data, for instance apply mapFilter
  const filterFeatures = mapFilter.filter.features
  if (filterFeatures.length > 0 && applyMapFilterToExport) {
    const keys = Object.keys(data[0])
    // filter data
    // beob can also have PopId and tpop-id, so dont filter by TPopId if you filter by beob id
    if (keys.includes('id')) {
      const beobIds = beobIdsFromServerInsideFeatureCollection(store, data)
      data = data.filter(d => beobIds.includes(d.id))
    } else if (keys.includes('TPopId')) {
      // data sets with TPopId usually also deliver PopId,
      // so only filter by TPopid then
      const tpopIds = tpopIdsInsideFeatureCollection(store, data)
      data = data.filter(d => tpopIds.includes(d.id))
    } else if (keys.includes('PopId')) {
      const popIds = popIdsInsideFeatureCollection(store, data)
      data = data.filter(d => popIds.includes(d.PopId))
    }
  }
  if (data.length === 0) {
    return onError(
      'Es gibt offenbar keine Daten, welche exportiert werden können'
    )
  }
  if (kml) {
    exportKml({
      fileName,
      data,
    })
  } else if (store.export.fileType === 'csv') {
    exportCsv({
      fileName,
      data,
    })
  } else {
    // pass some data in case something goes wrong
    exportXlsx({
      store,
      fileName,
      data,
    })
  }
  store.export.removeDownload(fileName)
}
