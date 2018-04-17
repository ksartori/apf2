// @flow
import clone from 'lodash/clone'

import epsg2056to4326 from '../../modules/epsg2056to4326'

export default (store: Object): Array<Object> => {
  const { table, tree } = store
  const myApArtId = tree.activeNodes.ap
  const aps = Array.from(table.ap.values()).find(v => v.id === myApArtId)
  const apArt = aps ? aps.art : null
  // get beobs of this ap
  let beobs = Array.from(table.beob.values()).filter(
    beob => beob.art_id === apArt
  )

  return beobs
    .map(bb => {
      const beob = clone(bb)
      // add KoordWgs84
      beob.KoordWgs84 = epsg2056to4326(beob.x, beob.y)
      return beob
    })
    .filter(beob => !!beob.KoordWgs84)
}
