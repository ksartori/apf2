//@flow
import isFinite from 'lodash/isFinite'
import get from 'lodash/get'
import flatten from 'lodash/flatten'
import sortBy from 'lodash/sortBy'

import isPointInsidePolygon from './isPointInsidePolygon'

export default ({ data, ktZh }):Array<Object> => {
  const projId = get(data, 'projektById.id')
  const apId = get(data, 'projektById.apsByProjId.nodes[0].id')
  const pops = get(data, 'projektById.apsByProjId.nodes[0].popsByApId.nodes', [])
  const tpops =  flatten(pops.map(p => get(p, 'tpopsByPopId.nodes', [])))

  // kontrolliere die Relevanz ausserkantonaler Tpop
  let tpopsOutsideZh = tpops.filter(
    tpop =>
      tpop.apberRelevant === 1 &&
      !!tpop.x &&
      isFinite(tpop.x) &&
      !!tpop.y &&
      isFinite(tpop.y) &&
      !isPointInsidePolygon(ktZh, tpop.x, tpop.y)
  )
  tpopsOutsideZh = sortBy(
    tpopsOutsideZh,
    (n) => [
      get(n, 'popByPopId.nr'),
      n.nr,
    ]
  )
  return ({
    title: `Teilpopulation ist als 'Für AP-Bericht relevant' markiert, liegt aber ausserhalb des Kt. Zürich und sollte daher nicht relevant sein:`,
    messages: tpopsOutsideZh.map(tpop => ({
      url: [
        'Projekte',
        projId,
        'Aktionspläne',
        apId,
        'Populationen',
        get(tpop, 'popByPopId.id'),
        'Teil-Populationen',
        tpop.id,
      ],
      text: `Population: ${get(tpop, 'popByPopId.nr') || get(tpop, 'popByPopId.id')}, Teil-Population: ${tpop.nr || tpop.id}`,
    })),
  })
}