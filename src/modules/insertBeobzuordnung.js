// @flow
import axios from 'axios'
import queryString from 'query-string'

import apiBaseUrl from './apiBaseUrl'
import appBaseUrl from './appBaseUrl'
import insertDatasetInIdb from './insertDatasetInIdb'

const updateBeobzuordnungData = (store, beobBereitgestellt, newKey, newValue) => {
  store.updateProperty(newKey, newValue)
  store.updatePropertyInDb(newKey, newValue)
  store.updateProperty(`NO_ISFS`, beobBereitgestellt.NO_ISFS)
  store.updatePropertyInDb(`NO_ISFS`, beobBereitgestellt.NO_ISFS)
  store.updateProperty(`QuelleId`, beobBereitgestellt.QuelleId)
  store.updatePropertyInDb(`QuelleId`, beobBereitgestellt.QuelleId)
}

const continueWithBeobBereitgestellt = (store, beobBereitgestellt, newKey, newValue) => {
  const { projekt, ap } = store.activeUrlElements
  // set new url
  const query = `${Object.keys(store.urlQuery).length > 0 ? `?${queryString.stringify(store.urlQuery)}` : ``}`
  if (newKey === `BeobNichtZuordnen`) {
    const newUrl = `/Projekte/${projekt}/Arten/${ap}/nicht-zuzuordnende-Beobachtungen/${beobBereitgestellt.BeobId}${query}`
    store.history.push(newUrl)
    updateBeobzuordnungData(store, beobBereitgestellt, newKey, newValue)
  } else if (newKey === `TPopId`) {
    // ouch. Need to get url for this tpop
    // Nice: tpop was already loaded for building tpop list
    const tpop = store.table.tpop.get(newValue)
    const newUrl = `/Projekte/${projekt}/Arten/${ap}/Populationen/${tpop.PopId}/Teil-Populationen/${newValue}/Beobachtungen/${beobBereitgestellt.BeobId}${query}`
    store.history.push(newUrl)
    updateBeobzuordnungData(store, beobBereitgestellt, newKey, newValue)
  }
}

export default (store:Object, newKey:string, newValue:number) => {
  /**
   * newKey is either BeobNichtZuordnen or TPopId
   */
  // get data from beob_bereitgestellt in activeDataset
  const beobBereitgestellt = store.activeDataset.row
  // check if a corresponding beobzuordnung already exists
  const beobzuordnungExists = !!store.table.beobzuordnung.get(beobBereitgestellt.BeobId)
  if (beobzuordnungExists) {
    return continueWithBeobBereitgestellt(store, beobBereitgestellt, newKey, newValue)
  }
  // insert new dataset in db and fetch id
  const url = `${apiBaseUrl}/apflora/beobzuordnung/NO_NOTE/${beobBereitgestellt.BeobId}`
  axios.post(url)
    .then(({ data }) => {
      const row = data
      // insert this dataset in store.table
      store.table.beobzuordnung.set(row.NO_NOTE, row)
      // insert this dataset in idb
      insertDatasetInIdb(store, `beobzuordnung`, row)
      continueWithBeobBereitgestellt(store, beobBereitgestellt, newKey, newValue)
    })
    .catch(error => store.listError(error))
}
