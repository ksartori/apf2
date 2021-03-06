//@flow
/**
   * 1. load all data
   * 2. add activeNodeArrays for all data to openNodes
   * 3. update openNodes
   * 4. refresh tree
   */
import app from 'ampersand-app'
import get from 'lodash/get'

import dataGql from './data.graphql'
import setTreeKeyGql from './setTreeKey.graphql'

export default async ({
  tree,
  activeNodes,
  id,
  refetch,
}:{
  tree: Object,
  activeNodes: Object,
  id: String,
  refetch: () => void,
}) => {
  const { client } = app
  const { projekt, ap, pop } = activeNodes
  const { openNodes } = tree
  // 1. load all data
  const { data } = await client.query({
    query: dataGql,
    variables: { id }
  })
  const tpopkontrs = get(data, 'tpopById.tpopkontrsByTpopId.nodes')
  // 2. add activeNodeArrays for all data to openNodes
  let newOpenNodes = [
    ...openNodes,
    ['Projekte', projekt, 'Aktionspläne', ap, 'Populationen', pop, 'Teil-Populationen', id, 'Feld-Kontrollen']
  ]
  tpopkontrs.forEach(k => {
    newOpenNodes = [
      ...newOpenNodes,
      ['Projekte', projekt, 'Aktionspläne', ap, 'Populationen', pop, 'Teil-Populationen', id, 'Feld-Kontrollen', k.id],
      ['Projekte', projekt, 'Aktionspläne', ap, 'Populationen', pop, 'Teil-Populationen', id, 'Feld-Kontrollen', k.id, 'Zaehlungen']
    ]
    const zaehls = get(k, 'tpopkontrzaehlsByTpopkontrId.nodes')
    zaehls.forEach(z => {
      newOpenNodes = [
        ...newOpenNodes,
        ['Projekte', projekt, 'Aktionspläne', ap, 'Populationen', pop, 'Teil-Populationen', id, 'Feld-Kontrollen', k.id, 'Zaehlungen', z.id]
      ]
    })
  })

  // 3. update openNodes
  await client.mutate({
    mutation: setTreeKeyGql,
    variables: {
      tree: tree.name,
      value: newOpenNodes,
      key: 'openNodes',
    }
  })

  // 4. refresh tree
  refetch()
}