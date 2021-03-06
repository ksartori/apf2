// @flow
import format from 'date-fns/format'
import app from 'ampersand-app'
import get from 'lodash/get'

import queryBeob from './queryBeob.graphql'
import createPop from './createPop.graphql'
import createTpop from './createTpop.graphql'
import updateBeobById from './updateBeobById.graphql'
import setTreeKeyGql from './setTreeKey.graphql'
import { isEqual } from 'date-fns';

export default async ({
  tree,
  activeNodes,
  id,
  refetch,
  errorState,
}: {
  tree: Object,
  activeNodes: Object,
  id: String,
  refetch: () => void,
  errorState: Object,
}): Promise<void> => {
  const { client } = app
  const { ap, projekt } = activeNodes
  let beobResult
  try {
    beobResult = await client.query({
      query: queryBeob,
      variables: { id }
    })
  } catch(error) {
    return errorState.add(error)
  }
  const beob = get(beobResult, 'data.beobById')
  const { x, y, datum, data } = beob

  // create new pop for ap
  let popResult
  try {
    popResult = await client.mutate({
      mutation: createPop,
      variables: {
        apId: ap,
        x,
        y,
        bekanntSeit: format(new Date(datum), 'YYYY')
      }
    })
  } catch (error) {
    return errorState.add(error)
  }
  const pop = get(popResult, 'data.createPop.pop')

  // create new tpop for pop
  let tpopResult
  try {
    tpopResult = await client.mutate({
      mutation: createTpop,
      variables: {
        popId: pop.id,
        x,
        y,
        bekannt_seit: format(new Date(datum), 'YYYY'),
        gemeinde: data.NOM_COMMUNE ? data.NOM_COMMUNE : null,
        flurname: data.DESC_LOCALITE_ ? data.DESC_LOCALITE_ : null,
      }
    })
  } catch (error) {
    return errorState.add(error)
  }
  const tpop = get(tpopResult, 'data.createTpop.tpop')

  try {
    await client.mutate({
      mutation: updateBeobById,
      variables: {
        id,
        tpopId: tpop.id,
      }
    })
  } catch (error) {
    return errorState.add(error)
  }

  // set new activeNodeArray
  const newActiveNodeArray = [
    `Projekte`,
    projekt,
    `Aktionspläne`,
    ap,
    `Populationen`,
    tpop.popId,
    `Teil-Populationen`,
    tpop.id,
    `Beobachtungen`,
    id,
  ]

  let newOpenNodes = [
    ...tree.openNodes,
    // add Beob and it's not yet existing parents to open nodes
    [ `Projekte`, projekt, `Aktionspläne`, ap, `Populationen` ],
    [ `Projekte`, projekt, `Aktionspläne`, ap, `Populationen`, tpop.popId ],
    [ `Projekte`, projekt, `Aktionspläne`, ap, `Populationen`, tpop.popId, `Teil-Populationen` ],
    [ `Projekte`, projekt, `Aktionspläne`, ap, `Populationen`, tpop.popId, `Teil-Populationen`, tpop.id ],
    [ `Projekte`, projekt, `Aktionspläne`, ap, `Populationen`, tpop.popId, `Teil-Populationen`, tpop.id, `Beobachtungen` ],
    [ `Projekte`, projekt, `Aktionspläne`, ap, `Populationen`, tpop.popId, `Teil-Populationen`, tpop.id, `Beobachtungen`, id ]
  ]
    // and remove old node
    .filter(n => !isEqual(n, tree.activeNodeArray))
  
  await client.mutate({
    mutation: setTreeKeyGql,
    variables: {
      value: newOpenNodes,
      tree: tree.name,
      key: 'openNodes'
    }
  })
  // set new activeNodeArray
  await client.mutate({
    mutation: setTreeKeyGql,
    variables: {
      value: newActiveNodeArray,
      tree: tree.name,
      key: 'activeNodeArray'
    }
  })

  refetch()
}
