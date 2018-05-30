// @flow
/**
 * need to keep class because of ref
 */
import React from 'react'
import { observer, inject } from 'mobx-react'
import styled from 'styled-components'
import compose from 'recompose/compose'
import withHandlers from 'recompose/withHandlers'
import clone from 'lodash/clone'
import get from 'lodash/get'
import app from 'ampersand-app'
import withLifecycle from '@hocs/with-lifecycle'

import LabelFilter from './LabelFilter'
import ApFilter from './ApFilter'
import Tree from './Tree'
import CmApFolder from './contextmenu/ApFolder'
import CmAp from './contextmenu/Ap'
import CmApberuebersichtFolder from './contextmenu/ApberuebersichtFolder'
import CmApberuebersicht from './contextmenu/Apberuebersicht'
import CmAssozartFolder from './contextmenu/AssozartFolder'
import CmAssozart from './contextmenu/Assozart'
import CmApartFolder from './contextmenu/ApartFolder'
import CmApart from './contextmenu/Apart'
import CmBeobZugeordnetFolder from './contextmenu/BeobZugeordnetFolder'
import CmBerFolder from './contextmenu/BerFolder'
import CmBer from './contextmenu/Ber'
import CmApberFolder from './contextmenu/ApberFolder'
import CmApber from './contextmenu/Apber'
import CmErfkritFolder from './contextmenu/ErfkritFolder'
import CmErfkrit from './contextmenu/Erfkrit'
import CmZielFolder from './contextmenu/ZielFolder'
import CmZielJahrFolder from './contextmenu/ZielJahrFolder'
import CmZiel from './contextmenu/Ziel'
import CmZielBerFolder from './contextmenu/ZielBerFolder'
import CmZielBer from './contextmenu/Zielber'
import CmPopFolder from './contextmenu/PopFolder'
import CmPop from './contextmenu/Pop'
import CmPopmassnberFolder from './contextmenu/PopmassnberFolder'
import CmPopmassnber from './contextmenu/Popmassnber'
import CmPopberFolder from './contextmenu/PopberFolder'
import CmPopber from './contextmenu/Popber'
import CmProjekt from './contextmenu/Projekt'
import CmTpopFolder from './contextmenu/TpopFolder'
import CmTpop from './contextmenu/Tpop'
import CmTpopberFolder from './contextmenu/TpopberFolder'
import CmTpopber from './contextmenu/Tpopber'
import CmBeobZugeordnet from './contextmenu/BeobZugeordnet'
import CmBeobnichtbeurteilt from './contextmenu/Beobnichtbeurteilt'
import CmBeobNichtZuzuordnen from './contextmenu/BeobNichtZuzuordnen'
import CmTpopfreiwkontrFolder from './contextmenu/TpopfreiwkontrFolder'
import CmTpopfreiwkontr from './contextmenu/Tpopfreiwkontr'
import CmTpopfreiwkontrzaehlFolder from './contextmenu/TpopfreiwkontrzaehlFolder'
import CmTpopfreiwkontrzaehl from './contextmenu/Tpopfreiwkontrzaehl'
import CmTpopfeldkontrFolder from './contextmenu/TpopfeldkontrFolder'
import CmTpopfeldkontr from './contextmenu/Tpopfeldkontr'
import CmTpopfeldkontrzaehlFolder from './contextmenu/TpopfeldkontrzaehlFolder'
import CmTpopfeldkontrzaehl from './contextmenu/Tpopfeldkontrzaehl'
import CmTpopmassnberFolder from './contextmenu/TpopmassnberFolder'
import CmTpopmassnber from './contextmenu/Tpopmassnber'
import CmTpopmassnFolder from './contextmenu/TpopmassnFolder'
import CmTpopmassn from './contextmenu/Tpopmassn'
import DeleteDatasetModal from './DeleteDatasetModal'
import ErrorBoundary from '../../shared/ErrorBoundarySingleChild'
import copyBiotopTo from '../../../modules/copyBiotopTo'
import setUrlQueryValue from '../../../modules/setUrlQueryValue'
import moveTo from '../../../modules/moveTo'
import copyTo from '../../../modules/copyTo'
import listError from '../../../modules/listError'
import createNewPopFromBeob from '../../../modules/createNewPopFromBeob'
import setTreeKeyGql from './setTreeKey.graphql'
import copyBeobZugeordnetKoordToPop from '../../../modules/copyBeobZugeordnetKoordToPop'
import copyTpopKoordToPop from '../../../modules/copyTpopKoordToPop'
import setCopyingBiotop from './setCopyingBiotop.graphql'
import setCopying from './setCopying.graphql'
import setMoving from './setMoving.graphql'
import tpopById from './tpopById.graphql'
import beobById from './beobById.graphql'
import setDatasetToDelete from './setDatasetToDelete.graphql'
import openLowerNodes from './openLowerNodes'
import closeLowerNodes from './closeLowerNodes'
import insertDataset from './insertDataset'

const Container = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  border-right-color: rgb(46, 125, 50);
  border-right-width: 1px;
  border-right-style: solid;
  border-left-color: rgb(46, 125, 50);
  border-left-width: 1px;
  border-left-style: solid;
  overflow: hidden;
  @media print {
    display: none !important;
  }
`
const LabelFilterContainer = styled.div`
  display: flex;
  justify-content: space-between;
  padding-left: 12px;
  padding-top: 5px;
  margin-bottom: 8px;
`
const InnerTreeContainer = styled.div`
  height: 100%;
  overflow: hidden;
`

const getAndValidateCoordinatesOfTpop = async id => {
  const { client } = app
  let tpopResult
  try {
    tpopResult = await client.query({
      query: tpopById,
      variables: { id }
    })
  } catch (error) {
    listError(error)
  }
  const tpop = get(tpopResult, 'data.tpopById')
  const { x, y } = tpop
  if (!x || !y) {
    listError(new Error(`Die Teilpopulation mit der ID ${id} kat keine (vollständigen) Koordinaten`))
    return { x: null, y: null }
  }
  return { x, y }
}

const getAndValidateCoordinatesOfBeob = async id => {
  const { client } = app
  let beobResult
  try {
    beobResult = await client.query({
      query: beobById,
      variables: { id }
    })
  } catch (error) {
    listError(error)
  }
  const beob = get(beobResult, 'data.beobById')
  const { x, y } = beob
  if (!x || !y) {
    listError(new Error(`Die Teilpopulation mit der ID ${id} kat keine (vollständigen) Koordinaten`))
    return { x: null, y: null }
  }
  return { x, y }
}

const showMapIfNotYetVisible = ({
  client,
  projekteTabs
}: {
  client: Object,
  projekteTabs: Array<String>
}) => {
  const isVisible = projekteTabs.includes('karte')
  if (!isVisible) {
    projekteTabs.push('karte')
    setUrlQueryValue({ client, key: 'projekteTabs', value: projekteTabs})
  }
}

const enhance = compose(
  inject('store'),
  withHandlers({
    handleClick: ({
      store,
      data: dbData,
      treeName,
      activeNode,
      activeNodes,
      refetchTree
    }) => ({
      data,
      element,
      nodes,
      client
    }) => {
      const tree = get(dbData, treeName)
      if (!data) return listError('no data passed with click')
      if (!element)
        return listError(new Error('no element passed with click'))
      const { table, action, actionTable } = data
      const { firstElementChild } = element
      if (!firstElementChild)
        return listError(new Error('no firstElementChild passed with click'))
      let id = firstElementChild.getAttribute('data-id')
      const parentId = firstElementChild.getAttribute('data-parentid')
      const url = firstElementChild.getAttribute('data-url')
      const label = firstElementChild.getAttribute('data-label')
      const baseUrl = JSON.parse(url)
      const nodeType = firstElementChild.getAttribute('data-nodetype')
      const menuType = firstElementChild.getAttribute('data-menutype')
      console.log('TreeContainer:', {table,menuType})
      const actions = {
        insert() {
          if (nodeType === 'table') {
            baseUrl.pop()
          }
          if (menuType === 'zielFolder') {
            // db sets year 1 as standard
            baseUrl.push(1)
          }
          const idToPass = parentId || id
          insertDataset({ tree, tablePassed: table, parentId: idToPass, baseUrl, menuType, id, refetch: refetchTree })
        },
        openLowerNodes() {
          openLowerNodes({ tree, activeNodes, id, parentId, menuType, refetch: refetchTree })
        },
        closeLowerNodes() {
          closeLowerNodes({ tree, url: baseUrl, refetch: refetchTree })
        },
        delete() {
          client.mutate({
            mutation: setDatasetToDelete,
            variables: {
              table,
              id,
              label,
              url,
            }
          })
        },
        showBeobOnMap() {
          const projekteTabs = get(data, 'urlQuery.projekteTabs', [])
          // 1. open map if not yet open
          showMapIfNotYetVisible({ client, projekteTabs })
          // 2 add layer for actionTable
          store.map.showMapLayer(
            actionTable,
            !store.map.activeOverlays.includes(actionTable)
          )
        },
        toggleTooltip() {
          store.map.toggleMapPopLabelContent(actionTable)
        },
        localizeOnMap() {
          const projekteTabs = get(data, 'urlQuery.projekteTabs', [])
          store.map.setIdOfTpopBeingLocalized(id)
          showMapIfNotYetVisible({ client, projekteTabs })
          store.map.showMapApfloraLayer('Tpop', true)
        },
        markForMoving() {
          client.mutate({
            mutation: setMoving,
            variables: { table, id, label }
          })
        },
        move() {
          moveTo(id)
        },
        markForCopying() {
          client.mutate({
            mutation: setCopying,
            variables: { table, id, label, withNextLevel: false }
          })
        },
        markForCopyingWithNextLevel() {
          client.mutate({
            mutation: setCopying,
            variables: { table, id, label, withNextLevel: true }
          })
        },
        resetCopying() {
          client.mutate({
            mutation: setCopying,
            variables: { table: null, id: null, label: null, withNextLevel: false }
          })
        },
        copy() {
          copyTo({ parentId: id, client, refetch: refetchTree })
        },
        markForCopyingBiotop() {
          client.mutate({
            mutation: setCopyingBiotop,
            variables: { id, label }
          })
        },
        resetCopyingBiotop() {
          client.mutate({
            mutation: setCopyingBiotop,
            variables: { id: 'copyingBiotop', label: null }
          })
        },
        copyBiotop() {
          copyBiotopTo({ id, client })
        },
        copyTpopKoordToPop() {
          copyTpopKoordToPop(id)
        },
        createNewPopFromBeob() {
          createNewPopFromBeob({ tree, activeNodes, id, refetch: refetchTree })
        },
        copyBeobZugeordnetKoordToPop() {
          copyBeobZugeordnetKoordToPop(id)
        },
        async showCoordOfTpopOnMapsZhCh() {
          const { x, y } = await getAndValidateCoordinatesOfTpop(id)
          if (x && y) {
            window.open(
              `https://maps.zh.ch/?x=${x}&y=${y}&scale=3000&markers=ring`,
              'target="_blank"'
            )
          }
        },
        async showCoordOfTpopOnMapGeoAdminCh() {
          const { x, y } = await getAndValidateCoordinatesOfTpop(id)
          if (x && y) {
            window.open(
              `https://map.geo.admin.ch/?bgLayer=ch.swisstopo.pixelkarte-farbe&Y=${x}&X=${y}&zoom=10&crosshair=circle`,
              'target="_blank"'
            )
          }
        },
        async showCoordOfBeobOnMapsZhCh() {
          const { x, y } = await getAndValidateCoordinatesOfBeob(id)
          if (x && y) {
            window.open(
              `https://maps.zh.ch/?x=${x}&y=${y}&scale=3000&markers=ring`,
              'target="_blank"'
            )
          }
        },
        async showCoordOfBeobOnMapGeoAdminCh() {
          const { x, y } = await getAndValidateCoordinatesOfBeob(id)
          if (x && y) {
            window.open(
              `https://map.geo.admin.ch/?bgLayer=ch.swisstopo.pixelkarte-farbe&Y=${x}&X=${y}&zoom=10&crosshair=circle`,
              'target="_blank"'
            )
          }
        },
      }
      if (Object.keys(actions).includes(action)) {
        actions[action]()
      } else {
        listError(new Error(`action "${action}" unknown, therefore not executed`))
      }
    },
  }),
  withLifecycle({
    onDidUpdate(prevProps, { nodes, activeNodes, treeName, data, client }) {
      /**
       * if activeNodeArray.length === 1
       * and there is only one projekt
       * open it
       * dont do this in render!
       */
      const openNodes = get(data, `${treeName}.openNodes`)
      const projekteNodes = nodes.filter(n => n.menuType === 'projekt')
      const existsOnlyOneProjekt = projekteNodes.length === 1
      const projektNode = projekteNodes[0]
      if (activeNodes.projektFolder &&
        !activeNodes.projekt &&
        existsOnlyOneProjekt &&
        projektNode
      ) {
        const projektUrl = clone(projektNode.url)
        client.mutate({
          mutation: setTreeKeyGql,
          variables: {
            value: projektUrl,
            tree: treeName,
            key: 'activeNodeArray'
          }
        })
        // add projekt to open nodes
        client.mutate({
          mutation: setTreeKeyGql,
          variables: {
            value: [...openNodes, projektUrl],
            tree: treeName,
            key: 'openNodes'
          }
        })
      }
    },
  }),
  observer
)

const TreeContainer = ({
  store,
  treeName,
  flex,
  handleClick,
  data,
  nodes,
  activeNodes,
  activeNode,
  client,
  loading,
  moving,
  copying,
  refetchTree,
}: {
  store: Object,
  treeName: String,
  flex: Number,
  handleClick: () => void,
  data: Object,
  nodes: Array<Object>,
  activeNodes: Object,
  activeNode: Object,
  client: Object,
  loading: Boolean,
  moving: Object,
  copying: Object,
  refetchTree: () => void
}) => {
  const datasetToDelete = get(data, 'datasetToDelete')
  const deleteDatasetModalIsVisible = !!datasetToDelete.id
  const openNodes = get(data, `${treeName}.openNodes`)
  const tree = get(data, treeName)
  const activeNodeArray = get(data, `${treeName}.activeNodeArray`)
  const token = get(data, 'user.token', null)

  return (
    <ErrorBoundary>
      <Container>
        {deleteDatasetModalIsVisible && (
          <DeleteDatasetModal tree={tree} token={token} refetchTree={refetchTree} />
        )}
        <LabelFilterContainer>
          <LabelFilter
            treeName={treeName}
            nodes={nodes} 
            activeNode={activeNode}
          />
          {!!activeNodes.projekt && <ApFilter treeName={treeName} />}
        </LabelFilterContainer>
        <InnerTreeContainer
          // $FlowIssue
          innerRef={c => (this.tree = c)}
        >
          <Tree
            client={client}
            treeName={treeName}
            data={data}
            tree={tree}
            nodes={nodes}
            loading={loading}
            activeNodeArray={activeNodeArray}
            openNodes={openNodes}
            activeNodes={activeNodes}
            moving={moving}
            copying={copying}
            mapBeobZugeordnetVisible={store.map.activeApfloraLayers.includes(
              'BeobZugeordnet'
            )}
            mapBeobNichtBeurteiltVisible={store.map.activeApfloraLayers.includes(
              'BeobNichtBeurteilt'
            )}
            mapBeobNichtZuzuordnenVisible={store.map.activeApfloraLayers.includes(
              'BeobNichtZuzuordnen'
            )}
            mapPopVisible={store.map.activeApfloraLayers.includes('Pop')}
            mapTpopVisible={store.map.activeApfloraLayers.includes(
              'Tpop'
            )}
            popHighlightedIdsString={store.map.pop.highlightedIds.join()}
          />
        </InnerTreeContainer>
        <CmApFolder onClick={(e, data, element)=>handleClick({data,element,nodes,client})} tree={tree} token={token} />
        <CmAp onClick={(e, data, element)=>handleClick({data,element,nodes,client})} tree={tree} token={token} moving={moving} />
        <CmApberuebersichtFolder onClick={(e, data, element)=>handleClick({data,element,nodes,client})} tree={tree} token={token} />
        <CmApberuebersicht onClick={(e, data, element)=>handleClick({data,element,nodes,client})} tree={tree} token={token} />
        <CmAssozartFolder onClick={(e, data, element)=>handleClick({data,element,nodes,client})} tree={tree} token={token} />
        <CmAssozart onClick={(e, data, element)=>handleClick({data,element,nodes,client})} tree={tree} token={token} />
        <CmApartFolder onClick={(e, data, element)=>handleClick({data,element,nodes,client})} tree={tree} token={token} />
        <CmApart onClick={(e, data, element)=>handleClick({data,element,nodes,client})} tree={tree} token={token} />
        <CmBeobZugeordnetFolder onClick={(e, data, element)=>handleClick({data,element,nodes,client})} tree={tree} token={token} />
        <CmBerFolder onClick={(e, data, element)=>handleClick({data,element,nodes,client})} tree={tree} token={token} />
        <CmBer onClick={(e, data, element)=>handleClick({data,element,nodes,client})} tree={tree} token={token} />
        <CmApberFolder onClick={(e, data, element)=>handleClick({data,element,nodes,client})} tree={tree} token={token} />
        <CmApber onClick={(e, data, element)=>handleClick({data,element,nodes,client})} tree={tree} token={token} />
        <CmErfkritFolder onClick={(e, data, element)=>handleClick({data,element,nodes,client})} tree={tree} token={token} />
        <CmErfkrit onClick={(e, data, element)=>handleClick({data,element,nodes,client})} tree={tree} token={token} />
        <CmZielFolder onClick={(e, data, element)=>handleClick({data,element,nodes,client})} tree={tree} token={token} />
        <CmZielJahrFolder onClick={(e, data, element)=>handleClick({data,element,nodes,client})} tree={tree} token={token} />
        <CmZiel onClick={(e, data, element)=>handleClick({data,element,nodes,client})} tree={tree} token={token} />
        <CmZielBerFolder onClick={(e, data, element)=>handleClick({data,element,nodes,client})} tree={tree} token={token} />
        <CmZielBer onClick={(e, data, element)=>handleClick({data,element,nodes,client})} tree={tree} token={token} />
        <CmPopFolder onClick={(e, data, element)=>handleClick({data,element,nodes,client})} tree={tree} token={token} moving={moving} copying={copying} />
        <CmPop onClick={(e, data, element)=>handleClick({data,element,nodes,client})} tree={tree} token={token} moving={moving} copying={copying} />
        <CmPopmassnberFolder onClick={(e, data, element)=>handleClick({data,element,nodes,client})} tree={tree} token={token} />
        <CmPopmassnber onClick={(e, data, element)=>handleClick({data,element,nodes,client})} tree={tree} token={token} />
        <CmPopberFolder onClick={(e, data, element)=>handleClick({data,element,nodes,client})} tree={tree} token={token} />
        <CmPopber onClick={(e, data, element)=>handleClick({data,element,nodes,client})} tree={tree} token={token} />
        <CmProjekt onClick={(e, data, element)=>handleClick({data,element,nodes,client})} tree={tree} token={token} />
        <CmTpopFolder onClick={(e, data, element)=>handleClick({data,element,nodes,client})} tree={tree} token={token} moving={moving} copying={copying} />
        <CmTpop onClick={(e, data, element)=>handleClick({data,element,nodes,client})} tree={tree} token={token} moving={moving} copying={copying} />
        <CmTpopberFolder onClick={(e, data, element)=>handleClick({data,element,nodes,client})} tree={tree} token={token} />
        <CmTpopber onClick={(e, data, element)=>handleClick({data,element,nodes,client})} tree={tree} token={token} />
        <CmBeobZugeordnet onClick={(e, data, element)=>handleClick({data,element,nodes,client})} tree={tree} token={token} />
        <CmBeobnichtbeurteilt onClick={(e, data, element)=>handleClick({data,element,nodes,client})} tree={tree} token={token} />
        <CmBeobNichtZuzuordnen onClick={(e, data, element)=>handleClick({data,element,nodes,client})} tree={tree} token={token} />
        <CmTpopfreiwkontrFolder onClick={(e, data, element)=>handleClick({data,element,nodes,client})} tree={tree} token={token} moving={moving} copying={copying} />
        <CmTpopfreiwkontr onClick={(e, data, element)=>handleClick({data,element,nodes,client})} tree={tree} token={token} copying={copying} />
        <CmTpopfreiwkontrzaehlFolder onClick={(e, data, element)=>handleClick({data,element,nodes,client})} tree={tree} token={token} />
        <CmTpopfreiwkontrzaehl onClick={(e, data, element)=>handleClick({data,element,nodes,client})} tree={tree} token={token} />
        <CmTpopfeldkontrFolder onClick={(e, data, element)=>handleClick({data,element,nodes,client})} tree={tree} token={token} moving={moving} copying={copying} />
        <CmTpopfeldkontr onClick={(e, data, element)=>handleClick({data,element,nodes,client})} tree={tree} token={token} copying={copying} />
        <CmTpopfeldkontrzaehlFolder onClick={(e, data, element)=>handleClick({data,element,nodes,client})} tree={tree} token={token} />
        <CmTpopfeldkontrzaehl onClick={(e, data, element)=>handleClick({data,element,nodes,client})} tree={tree} token={token} />
        <CmTpopmassnberFolder onClick={(e, data, element)=>handleClick({data,element,nodes,client})} tree={tree} token={token} />
        <CmTpopmassnber onClick={(e, data, element)=>handleClick({data,element,nodes,client})} tree={tree} token={token} />
        <CmTpopmassnFolder onClick={(e, data, element)=>handleClick({data,element,nodes,client})} tree={tree} token={token} moving={moving} copying={copying} />
        <CmTpopmassn onClick={(e, data, element)=>handleClick({data,element,nodes,client})} tree={tree} token={token} copying={copying} />
      </Container>
    </ErrorBoundary>
  )
}

export default enhance(TreeContainer)
