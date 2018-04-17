// @flow
import axios from 'axios'

export default async (
  store: Object,
  tree: Object,
  beobId: number | string
): Promise<void> => {
  const { table } = store
  const { activeNodes } = tree
  const beob = table.beob.get(beobId)
  beob.tpop_id = null
  beob.nicht_zuordnen = false
  beob.bemerkungen = null
  try {
    await axios.patch(`/beob?id=eq.${beobId}`, beob)
  } catch (error) {
    store.listError(error)
  }
  // remove this dataset in store.table
  table.beob.set(beobId, beob)
  // set activeNodeArray to corresponding beob
  const newActiveNodeArray = [
    'Projekte',
    activeNodes.projekt,
    'Arten',
    activeNodes.ap,
    'nicht-beurteilte-Beobachtungen',
    beobId,
  ]
  tree.setActiveNodeArray(newActiveNodeArray)
}
