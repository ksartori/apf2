// @flow
import { extendObservable, computed } from 'mobx'

import getBeobForMap from '../action/getBeobForMap'
import getTpopBeobBounds from '../action/getTpopBeobBounds'
import getTpopBeobMarkersClustered from '../action/getTpopBeobMarkersClustered'
import getTpopBeobMarkers from '../action/getTpopBeobMarkers'
import getTpopBeobAssignPolylines from '../action/getTpopBeobAssignPolylines'

export default (store: Object): void => {
  extendObservable(store.map.tpopBeob, {
    highlightedIds: computed(
      () => {
        const { activeNodes } = store.tree
        const mapFilterTpopBeob = store.map.mapFilter.tpopBeob
        if (mapFilterTpopBeob.length > 0) {
          return mapFilterTpopBeob
        }
        if (activeNodes.tpopbeob) {
          return [activeNodes.tpopbeob]
        } else if (activeNodes.tpop) {
          return store.map.tpopBeob.beobs
            .filter(b => !b.nicht_zuordnen && b.tpop_id === activeNodes.tpop)
            .map(b => b.beob_id)
        } else if (activeNodes.pop) {
          return store.map.tpopBeob.beobs
            .filter(b => {
              if (!b.nicht_zuordnen && b.tpop_id) {
                const tpop = store.table.tpop.get(b.tpop_id)
                if (tpop) {
                  const popId = tpop.pop_id
                  return popId && popId === activeNodes.pop
                }
                return false
              }
              return false
            })
            .map(b => b.beob_id)
        }
        return []
      },
      { name: 'mapTpopBeobHighlightedIds' }
    ),
    markersClustered: computed(() => getTpopBeobMarkersClustered(store), {
      name: 'mapTpopBeobMarkersClustered',
    }),
    markers: computed(() => getTpopBeobMarkers(store), {
      name: 'mapTpopBeobMarkers',
    }),
    assignPolylines: computed(() => getTpopBeobAssignPolylines(store), {
      name: 'mapTpopBeobAssignPolylines',
    }),
    beobs: computed(
      () =>
        getBeobForMap(store).filter(b => {
          const beob = store.table.beob.get(b.id)
          return beob && !beob.nicht_zuordnen && beob.tpop_id
        }),
      { name: 'mapTpopBeobBeobs' }
    ),
    bounds: computed(() => getTpopBeobBounds(store.map.tpopBeob.beobs), {
      name: 'mapTpopBeobBounds',
    }),
    boundsOfHighlightedIds: computed(
      () =>
        getTpopBeobBounds(
          store.map.tpopBeob.beobs.filter(b =>
            store.map.tpopBeob.highlightedIds.includes(
              isNaN(b.beob_id) ? b.beob_id : Number(b.beob_id)
            )
          )
        ),
      { name: 'mapTpopBeobBoundsOfHighlightedIds' }
    ),
  })
}
