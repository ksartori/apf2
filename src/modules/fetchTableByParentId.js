// @flow
import axios from 'axios'
import app from 'ampersand-app'

import apiBaseUrl from './apiBaseUrl'
import tables from './tables'
import recordValuesForWhichTableDataWasFetched from './recordValuesForWhichTableDataWasFetched'
import writeToStore from './writeToStore'

export default (store:Object, schemaNamePassed:string, tableName:string, parentId:number) => {
  if (!tableName) {
    return new Error(`action fetchTableByParentId: tableName must be passed`)
  }
  if (!parentId) {
    return new Error(`action fetchTableByParentId: parentId must be passed`)
  }
  const schemaName = schemaNamePassed || `apflora`
  const idField = tables.find(t => t.table === tableName).idField
  const parentIdField = tables.find(t => t.table === tableName).parentIdField

  // only fetch if not yet fetched
  const { valuesForWhichTableDataWasFetched } = store
  if (
    valuesForWhichTableDataWasFetched[tableName] &&
    valuesForWhichTableDataWasFetched[tableName][idField] &&
    valuesForWhichTableDataWasFetched[tableName][idField].includes(parentId)
  ) {
    return
  }

  const url = `${apiBaseUrl}/schema/${schemaName}/table/${tableName}/field/${parentIdField}/value/${parentId}`
  store.loading.push(tableName)

  app.db[tableName]
    .toArray()
    .then((data) => {
      writeToStore({ store, data, table: tableName, field: idField })
      recordValuesForWhichTableDataWasFetched({ store, table: tableName, field: idField, value: parentId })
    })
    .then(() => axios.get(url))
    .then(({ data }) => {
      store.loading = store.loading.filter(el => el !== tableName)
      // leave ui react before this happens
      setTimeout(() => writeToStore({ store, data, table: tableName, field: idField }))
      setTimeout(() =>
        app.db[tableName].bulkPut(data)
      )
    })
    .catch(error => {
      store.loading = store.loading.filter(el => el !== tableName)
      store.listError(error)
    })
}
