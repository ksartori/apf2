// @flow
import within from '@turf/within'
import isFinite from 'lodash/isFinite'
import { toJS } from 'mobx'

import epsg2056to4326 from './epsg2056to4326notReverse'

export default (
  store: Object,
  tpopbeobs: Array<Object>
): Array<number | string> => {
  // make sure all tpopbeobs have coordinates
  const beobsToUse = tpopbeobs.filter(
    b => b.x && isFinite(b.x) && b.y && isFinite(b.y)
  )
  const points = {
    type: 'FeatureCollection',
    // build an array of geoJson points
    features: beobsToUse.map(b => ({
      type: 'Feature',
      properties: {
        BeobId: b.beob_id,
      },
      geometry: {
        type: 'Point',
        coordinates: epsg2056to4326(b.x, b.y),
      },
    })),
  }

  // let turf check what points are within filter
  const result = within(toJS(points), toJS(store.map.mapFilter.filter))
  return result.features.map(r => r.properties.BeobId)
}
