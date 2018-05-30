// @flow
import get from 'lodash/get'
import isEqual from 'lodash/isEqual'
import upperFirst from 'lodash/upperFirst'
import camelCase from 'lodash/camelCase'
import gql from 'graphql-tag'

import tables from '../../../../modules/tables'
import listError from '../../../../modules/listError'
import setTreeKey from './setTreeKey.graphql'
import setDatasetToDelete from './setDatasetToDelete.graphql'

export default async ({
  client,
  data,
  refetchTree,
}:{
  client: Object,
  data: Object,
  refetchTree: () => void
}): Promise<void> => {
  // deleteDatasetDemand checks variables
  const datasetToDelete = get(data, 'datasetToDelete')
  const { table: tablePassed, id, url } = datasetToDelete

  // some tables need to be translated, i.e. tpopfreiwkontr
  const tableMetadata = tables.find(t => t.table === tablePassed)
  if (!tableMetadata) {
    return listError(
      new Error(
        `Error in action deleteDatasetDemand: no table meta data found for table "${tablePassed}"`
      )
    )
  }
  const table = tableMetadata.dbTable ? tableMetadata.dbTable : tablePassed
  console.log('delete:', {tablePassed,table,id,url})

  /**
   * TODO:
   * fetch data for dataset
   * then add it to deletedDatasets
   */

  try {
    await client.mutate({
      mutation: gql`
        mutation delete${upperFirst(camelCase(table))}($id: UUID!) {
          delete${upperFirst(camelCase(table))}ById(input: { id: $id }) {
            ${camelCase(table)} {
              id
            }
          }
        }
      `,
      variables: { id },
    }) 
  } catch (error) {
    return listError(error)
  }

  // if tpop was deleted: set beob free
  // not necessary: is done by reference by db
  // BUT: need to refetch tree

  // set new url if necessary
  const activeNodeArray1 = get(data, 'tree.activeNodeArray')
  console.log('delete:', {activeNodeArray1})
  if (isEqual(activeNodeArray1, url)) {
    const newActiveNodeArray1 = [...url]
    newActiveNodeArray1.pop()
    // if zieljahr is active, need to pop again,
    // (in case there is no other ziel left in same year)
    if (table === 'ziel') {
      newActiveNodeArray1.pop()
    }
    await client.mutate({
      mutation: setTreeKey,
      variables: {
        value: newActiveNodeArray1,
        tree: 'tree',
        key: 'activeNodeArray'
      }
    })
  }
  const activeNodeArray2 = get(data, 'tree2.activeNodeArray')
  console.log('delete:', {activeNodeArray2})
  if (isEqual(activeNodeArray2, url)) {
    const newActiveNodeArray2 = [...url]
    newActiveNodeArray2.pop()
    // if zieljahr is active, need to pop again,
    // (in case there is no other ziel left in same year)
    if (table === 'ziel') {
      newActiveNodeArray2.pop()
    }
    await client.mutate({
      mutation: setTreeKey,
      variables: {
        value: newActiveNodeArray2,
        tree: 'tree2',
        key: 'activeNodeArray'
      }
    })
  }

  // remove from openNodes
  const openNodes1 = get(data, 'tree.openNodes')
  const newOpenNodes1 = openNodes1.filter(n => !isEqual(n, url))
  console.log('delete:', {newOpenNodes1})
  await client.mutate({
    mutation: setTreeKey,
    variables: {
      value: newOpenNodes1,
      tree: 'tree',
      key: 'openNodes'
    }
  })
  const openNodes2 = get(data, 'tree2.openNodes')
  const newOpenNodes2 = openNodes2.filter(n => !isEqual(n, url))
  console.log('delete:', {newOpenNodes2})
  await client.mutate({
    mutation: setTreeKey,
    variables: {
      value: newOpenNodes2,
      tree: 'tree2',
      key: 'openNodes'
    }
  })

  // reset datasetToDelete
  await client.mutate({
    mutation: setDatasetToDelete,
    variables: {
      table: null,
      id: datasetToDelete.id,
      label: null,
      url: null,
    }
  })

  refetchTree()
}
