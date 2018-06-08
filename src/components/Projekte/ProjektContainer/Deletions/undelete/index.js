//@flow
import upperFirst from 'lodash/upperFirst'
import camelCase from 'lodash/camelCase'
import app from 'ampersand-app'

import setTreeKey from './setTreeKey.graphql'

const addNodeToOpenNodes = (openNodes, url) => {
  if (url.length === 0) return
  if (url.length === 1) return openNodes.push(url)
  const newUrl = [...url].pop()
  openNodes.push(newUrl)
  addNodeToOpenNodes(openNodes, newUrl)
}

export default async ({
  datasetsDeleted,
  dataset,
  tree,
  refetchTree,
  setShowDeletions,
  deleteState,
  errorState,
}:{
  datasetsDeleted: Array<Object>,
  dataset: Object,
  tree: Object,
  refetchTree: () => void,
  setShowDeletions: () => void,
  deleteState: Object,
  errorState: Object,
}) => {
  const { client } = app
  const { table, url, data } = dataset
  console.log('undelete:', {dataset,table,url,data})
  // 1. create new dataset
  const queryName = `create${upperFirst(camelCase(table))}`
  console.log('undelete:', {queryName})
  let mutation
  try {
    mutation = await import('./' + queryName + '.graphql')
  } catch (error) {
    return errorState.add(new Error(
      `Die Abfrage, um einen Datensatz für die Tabelle ${table} zu erstellen, scheint zu fehlen. Sorry!`
    ))
  }
  console.log('undelete:', {mutation})
  try {
    await client.mutate({
      mutation,
      variables: data,
    }) 
  } catch (error) {
    return errorState.add(error)
  }
  console.log('undelete: create mutation run')

  // set it as new activeNodeArray and open node
  const { openNodes } = tree
  const newOpenNodes = [...openNodes]
  addNodeToOpenNodes(newOpenNodes, url)
  await client.mutate({
    mutation: setTreeKey,
    variables: {
      tree: tree.name,
      value1: url,
      key1: 'activeNodeArray',
      value2: newOpenNodes,
      key2: 'openNodes'
    }
  })
  console.log('undelete:', {newOpenNodes})

  // 2. remove dataset from datasetsDeleted
  if (datasetsDeleted.length === 1) setShowDeletions(false)
  deleteState.removeDataset(dataset.id)
  console.log('undelete: dataset deleted removed from deleteState')

  // refetch tree
  refetchTree()
}