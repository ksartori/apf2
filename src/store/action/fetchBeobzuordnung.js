// @flow
import { runInAction, computed } from 'mobx'
import axios from 'axios'
import cloneDeep from 'lodash/cloneDeep'

import recordValuesForWhichTableDataWasFetched from '../../modules/recordValuesForWhichTableDataWasFetched'

const writeToStore = (store: Object, data: Array<Object>): void => {
  runInAction(() => {
    data.forEach(zuordnung => {
      // set computed value "beob"
      zuordnung.beob = computed(() => store.table.beob.get(zuordnung.BeobId))
      // set computed value "type"
      zuordnung.type = computed(() => {
        if (zuordnung.BeobNichtZuordnen && zuordnung.BeobNichtZuordnen === 1) {
          return 'nichtZuzuordnen'
        }
        if (zuordnung.TPopId) {
          return 'zugeordnet'
        }
        return 'nichtBeurteilt'
      })
      store.table.tpopbeob.set(zuordnung.BeobId, zuordnung)
    })
  })
}

export default (store: Object, apArtId: number): any => {
  // console.log('module fetchBeobzuordnung: apArtId:', apArtId)
  const { valuesForWhichTableDataWasFetched } = store
  if (!apArtId) {
    return store.listError(
      new Error('action fetchBeobzuordnung: apArtId must be passed')
    )
  }

  // only fetch if not yet fetched
  if (
    valuesForWhichTableDataWasFetched.tpopbeob &&
    valuesForWhichTableDataWasFetched.tpopbeob.ArtId &&
    valuesForWhichTableDataWasFetched.tpopbeob.ArtId.includes(apArtId)
  ) {
    return
  }

  store.loading.push('tpopbeob')
  axios
    .get(`/v_tpopbeob?ApArtId=eq.${apArtId}`)
    .then(({ data }) => {
      store.loading = store.loading.filter(el => el !== 'tpopbeob')
      // copy array without the individual objects being references
      // otherwise the computed values are passed to idb
      // and this creates errors, ad they can't be cloned
      writeToStore(store, cloneDeep(data))
      recordValuesForWhichTableDataWasFetched({
        store,
        table: 'tpopbeob',
        field: 'ArtId',
        value: apArtId,
      })
    })
    .catch(error => {
      store.loading = store.loading.filter(el => el !== 'tpopbeob')
      store.listError(error)
    })
}
