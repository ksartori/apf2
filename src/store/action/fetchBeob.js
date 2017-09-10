// @flow
import { runInAction, computed } from 'mobx'
import axios from 'axios'
import cloneDeep from 'lodash/cloneDeep'

import recordValuesForWhichTableDataWasFetched from '../../modules/recordValuesForWhichTableDataWasFetched'

const writeToStore = (store, data) => {
  runInAction(() => {
    data.forEach(d => {
      d.beobzuordnung = computed(() => store.table.beobzuordnung.get(d.BeobId))
      store.table.beob.set(d.id, d)
    })
  })
}

export default (store: Object, apArtId: number): any => {
  // only fetch if not yet fetched
  const { valuesForWhichTableDataWasFetched } = store
  if (
    valuesForWhichTableDataWasFetched.beob &&
    valuesForWhichTableDataWasFetched.beob.ArtId &&
    valuesForWhichTableDataWasFetched.beob.ArtId.includes(apArtId)
  ) {
    return
  }

  const url = `/schema/beob/table/beob/field/ArtId/value/${apArtId}`
  recordValuesForWhichTableDataWasFetched({
    store,
    table: 'beob',
    field: 'ArtId',
    value: apArtId,
  })
  console.log('fetchBeob')
  axios
    .get(url)
    .then(({ data }) => {
      // copy array without the individual objects being references
      // otherwise the computed values are passed to idb
      // and this creates errors, as they can't be cloned
      writeToStore(store, cloneDeep(data))
    })
    .catch(error => {
      store.loading = store.loading.filter(el => el !== 'beob')
      // remove setting that prevents loading of this value
      valuesForWhichTableDataWasFetched.beob.ArtId = valuesForWhichTableDataWasFetched.beob.ArtId.filter(
        x => x !== apArtId
      )
      store.listError(error)
    })
}
