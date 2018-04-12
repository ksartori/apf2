// @flow
/**
 * moves a dataset to a different parent
 * used when moving for instance tpop to other pop in tree
 */

import axios from 'axios'

import tables from '../../modules/tables'

export default (store: Object, newParentId: number): any => {
  let { table } = store.moving
  const { id } = store.moving

  // ensure derived data exists
  const tabelle: {
    table: string,
    dbTable: ?string,
    idField: string,
    parentIdField: string,
  } = tables.find(t => t.table === table)
  // in tpopfeldkontr and tpopfreiwkontr need to find dbTable
  if (tabelle.dbTable) {
    table = tabelle.dbTable
  }
  const idField = tabelle ? tabelle.idField : undefined
  if (!idField) {
    return store.listError(
      new Error('change was not saved: Reason: idField was not found')
    )
  }
  const parentIdField = tabelle.parentIdField
  if (!parentIdField) {
    return store.listError(
      new Error('change was not saved: Reason: parentIdField was not found')
    )
  }

  const row = store.table[table].get(id)
  if (!row) {
    console.log('moveTo, data:', {
      newParentId,
      table,
      id,
      tabelle,
      idField,
      parentIdField,
    })
    return store.listError(
      new Error('change was not saved: Reason: dataset was not found in store')
    )
  }
  // save old value, in case change has to be reverted later
  const oldValue = row[parentIdField]
  // update store
  row[parentIdField] = newParentId
  // update db
  axios
    .patch(`/${table}?${idField}=eq.${id}`, { [parentIdField]: newParentId })
    .catch(error => {
      // revert change in store
      row[parentIdField] = oldValue
      store.listError(error)
    })
}
