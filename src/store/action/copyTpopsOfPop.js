// @flow
export default async ({
  store,
  popIdFrom,
  popIdTo,
}: {
  store: Object,
  popIdFrom: number,
  popIdTo: number,
}) => {
  // 1. fetch all tpops
  await store.fetchTableByParentId('apflora', 'tpop', popIdFrom)
  // 2. add tpops to new pop
  const tpops = Array.from(store.table.tpop.values()).filter(
    tpop => tpop.PopId === popIdFrom
  )
  tpops.forEach(tpop => store.copyTo(popIdTo, 'tpop', tpop.TPopId))
}
