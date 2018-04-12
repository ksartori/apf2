// @flow
import axios from 'axios'

import recordValuesForWhichTableDataWasFetched from '../../modules/recordValuesForWhichTableDataWasFetched'

export default (store: Object, apArtId: number): any => {
  const { valuesForWhichTableDataWasFetched } = store

  // only fetch if not yet fetched
  if (
    valuesForWhichTableDataWasFetched.tpopForAp &&
    valuesForWhichTableDataWasFetched.tpopForAp.ApArtId &&
    valuesForWhichTableDataWasFetched.tpopForAp.ApArtId.includes(apArtId)
  ) {
    return
  }

  const url = `/v_tpop_for_ap?ApArtId=eq.${apArtId}`
  store.loading.push('tpopForAp')
  axios
    .get(url)
    .then(({ data }) => {
      store.loading = store.loading.filter(el => el !== 'tpopForAp')
      store.writeToStore({ data, table: 'tpop', field: 'id' })
      recordValuesForWhichTableDataWasFetched({
        store,
        table: 'tpopForAp',
        field: 'ApArtId',
        value: apArtId,
      })
    })
    .catch(error => {
      store.loading = store.loading.filter(el => el !== 'tpopForAp')
      store.listError(error)
    })
}
