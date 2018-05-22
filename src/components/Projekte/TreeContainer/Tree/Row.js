// @flow
import React from 'react'
import { observer, inject } from 'mobx-react'
import styled from 'styled-components'
import compose from 'recompose/compose'
import { ContextMenuTrigger } from 'react-contextmenu'
import SwapVerticalCircleIcon from '@material-ui/icons/SwapVerticalCircle'
import ContentCopyIcon from '@material-ui/icons/ContentCopy'
import PhotoLibraryIcon from '@material-ui/icons/PhotoLibrary'
import LocalFloristIcon from '@material-ui/icons/LocalFlorist'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import ChevronRightIcon from '@material-ui/icons/ChevronRight'
import MoreHorizIcon from '@material-ui/icons/MoreHoriz'
import get from 'lodash/get'

import isNodeInActiveNodePath from './isNodeInActiveNodePath'
import isNodeOpen from './isNodeOpen'
import toggleNode from './toggleNode'
import toggleNodeSymbol from './toggleNodeSymbol'

const singleRowHeight = 23
const StyledNode = styled.div`
  padding-left: ${props => `${Number(props['data-level']) * 17 - 10}px`};
  height: ${singleRowHeight}px;
  max-height: ${singleRowHeight}px;
  box-sizing: border-box;
  margin: 0;
  display: flex;
  flex-direction: row;
  white-space: nowrap;
  user-select: none;
  color: ${props =>
    props['data-nodeisinactivenodepath'] ? '#D84315' : 'inherit'};
`
const StyledExpandMoreIcon = styled(ExpandMoreIcon)`
  margin-top: ${props =>
    props['data-nodeisopen'] ? '-6px !important' : '1px !important'};
  margin-left: ${props => (props['data-nodeisopen'] ? '-1px !important' : 0)};
  margin-right: ${props => (props['data-nodeisopen'] ? '-5px !important' : 0)};
  padding-left: ${props => (props['data-nodeisopen'] ? '2px' : '2px')};
  height: ${props =>
    props['data-nodeisopen'] ? '30px !important' : '22px !important'};
  width: ${props =>
    props['data-nodeisopen'] ? '30px !important' : '26px !important'};
  color: ${props =>
    props['data-nodeisinactivenodepath'] ? '#D84315 !important' : 'inherit'};
  cursor: pointer;
  &:hover {
    color: #f57c00 !important;
  }
`
const StyledChevronRightIcon = styled(ChevronRightIcon)`
  margin-top: -2px !important;
  padding-left: 2px;
  height: 22px !important;
  width: 26px;
  cursor: pointer;
  &:hover {
    color: #f57c00 !important;
  }
`
const StyledMoreHorizIcon = styled(MoreHorizIcon)`
  margin-top: ${props =>
    props['data-nodeisinactivenodepath']
      ? '-5px !important'
      : '-2px !important'};
  padding-left: ${props =>
    props['data-nodeisinactivenodepath'] ? '1px' : '2px'};
  height: ${props =>
    props['data-nodeisinactivenodepath']
      ? '26px !important'
      : '22px !important'};
  color: ${props =>
    props['data-nodeisinactivenodepath'] ? '#D84315 !important' : 'inherit'};
  width: 26px;
  cursor: pointer;
  &:hover {
    color: #f57c00 !important;
  }
`
const SymbolDiv = styled.div`
  cursor: pointer;
`
const SymbolSpan = styled.span`
  padding-right: 8px !important;
  padding-left: ${props =>
    props['data-nodeisinactivenodepath'] ? '7px' : '9px'};
  font-weight: ${props =>
    props['data-nodeisinactivenodepath'] ? '900 !important' : 'inherit'};
  margin-top: -9px !important;
  font-size: 28px !important;
  width: 26px;
`
const TextSpan = styled.span`
  margin-left: 0;
  font-size: 16px !important;
  font-weight: ${props =>
    props['data-nodeisinactivenodepath'] ? '900 !important' : 'inherit'};
  cursor: pointer;
  &:hover {
    color: #f57c00;
  }
`
const StyledMapIcon = styled(LocalFloristIcon)`
  padding-right: 2px;
  margin-left: -2px;
  height: 20px !important;
`
const PopMapIcon = styled(StyledMapIcon)`
  color: #947500 !important;
`
const TpopMapIcon = styled(StyledMapIcon)`
  color: #016f19 !important;
`
const BeobNichtBeurteiltMapIcon = styled(StyledMapIcon)`
  color: #9a009a !important;
`
const BeobNichtZuzuordnenMapIcon = styled(StyledMapIcon)`
  color: #ffe4ff !important;
`
const BeobZugeordnetMapIcon = styled(StyledMapIcon)`
  color: #ff00ff !important;
`
const PopFilteredMapIcon = styled(PopMapIcon)`
  -webkit-text-stroke: 1px #f5ef00;
  -moz-text-stroke: 1px #f5ef00;
`
const TpopFilteredMapIcon = styled(TpopMapIcon)`
  -webkit-text-stroke: 1px #f5ef00;
  -moz-text-stroke: 1px #f5ef00;
`
const BeobNichtBeurteiltFilteredMapIcon = styled(BeobNichtBeurteiltMapIcon)`
  -webkit-text-stroke: 1px #f5ef00;
  -moz-text-stroke: 1px #f5ef00;
`
const BeobNichtZuzuordnenFilteredMapIcon = styled(BeobNichtZuzuordnenMapIcon)`
  -webkit-text-stroke: 1px #f5ef00;
  -moz-text-stroke: 1px #f5ef00;
`
const BeobZugeordnetFilteredMapIcon = styled(BeobZugeordnetMapIcon)`
  -webkit-text-stroke: 1px #f5ef00;
  -moz-text-stroke: 1px #f5ef00;
`
const MovingIcon = styled(SwapVerticalCircleIcon)`
  padding-left: 0.2em;
  height: 20px !important;
  color: rgb(255, 90, 0) !important;
`
const CopyingIcon = styled(ContentCopyIcon)`
  padding-left: 0.2em;
  height: 20px !important;
  color: rgb(255, 90, 0) !important;
`
const BiotopCopyingIcon = styled(PhotoLibraryIcon)`
  padding-left: 0.2em;
  height: 20px !important;
  color: rgb(255, 90, 0) !important;
`
const showPopMapIcon = (store, tree, node, activeNodes) =>
  node.menuType === 'ap' &&
  node.id === (activeNodes.ap || store.map.pop.apId) &&
  store.map.activeApfloraLayers.includes('Pop')
const showPopFilteredMapIcon = (store, node) =>
  node.menuType === 'pop' &&
  store.map.activeApfloraLayers.includes('Pop') &&
  store.map.pop.highlightedIds.includes(node.id)
const showTpopMapIcon = (store, tree, node, activeNodes) =>
  node.menuType === 'ap' &&
  node.id === (activeNodes.ap || store.map.pop.apId) &&
  store.map.activeApfloraLayers.includes('Tpop')
const showTpopFilteredMapIcon = (store, node) =>
  node.menuType === 'tpop' &&
  store.map.activeApfloraLayers.includes('Tpop') &&
  store.map.tpop.highlightedIds.includes(node.id)
const showBeobNichtBeurteiltMapIcon = (store, tree, node, activeNodes) =>
  node.menuType === 'beobzuordnungFolder' &&
  node.id === activeNodes.ap &&
  store.map.activeApfloraLayers.includes('BeobNichtBeurteilt')
const showBeobNichtZuzuordnenMapIcon = (store, tree, node, activeNodes) =>
  node.menuType === 'beobNichtZuzuordnenFolder' &&
  node.id === activeNodes.ap &&
  store.map.activeApfloraLayers.includes('BeobNichtZuzuordnen')
const showBeobZugeordnetMapIcon = (store, tree, node, activeNodes) =>
  node.menuType === 'beobZugeordnetFolder' &&
  node.id === activeNodes.tpop &&
  store.map.activeApfloraLayers.includes('BeobZugeordnet')
const showBeobNichtBeurteiltFilteredMapIcon = (store, node) =>
  node.menuType === 'beobzuordnung' &&
  store.map.activeApfloraLayers.includes('BeobNichtBeurteilt') &&
  store.map.beobNichtBeurteilt.highlightedIds.includes(node.id)
const showBeobNichtZuzuordnenFilteredMapIcon = (store, node) =>
  node.menuType === 'beobNichtZuzuordnen' &&
  store.map.activeApfloraLayers.includes('BeobNichtZuzuordnen') &&
  store.map.beobNichtZuzuordnen.highlightedIds.includes(node.id)
const showBeobZugeordnetFilteredMapIcon = (store, tree, node, activeNodes) =>
  (node.menuType === 'beobZugeordnet' &&
    store.map.activeApfloraLayers.includes('BeobZugeordnet') &&
    store.map.beobZugeordnet.highlightedIds.includes(node.id)) ||
  (node.menuType === 'tpop' &&
    !activeNodes.beobZugeordnet &&
    store.map.activeApfloraLayers.includes('BeobZugeordnet') &&
    node.id === activeNodes.tpop) ||
  (node.menuType === 'pop' &&
    !activeNodes.tpop &&
    store.map.activeApfloraLayers.includes('BeobZugeordnet') &&
    node.id === activeNodes.pop)

const enhance = compose(inject('store'), observer)

const Row = ({
  key,
  index,
  style,
  store,
  tree,
  nodes,
  activeNodes,
  treeName,
  data,
  client
}: {
  key?: number,
  index: number,
  style: Object,
  store: Object,
  tree: Object,
  nodes: Array<Object>,
  activeNodes: Array<Object>,
  treeName: String,
  data: Object,
  client: Object
}) => {
  const node = nodes[index]
  const tree2 = get(data, treeName)
  //console.log('Row:', { data, nodes })
  const openNodes = get(data, `${treeName}.openNodes`)
  const activeNodeArray = get(data, `${treeName}.activeNodeArray`)
  const onClickNode = event => toggleNode({ tree: tree2, node, client })
  const onClickNodeSymbol = event => toggleNodeSymbol({ tree: tree2, node, client })
  const myProps = { key: index }
  const nodeIsInActiveNodePath = isNodeInActiveNodePath(node, activeNodeArray)
  const nodeIsOpen = isNodeOpen(openNodes, node.url)
  // build symbols
  let useSymbolIcon = true
  let useSymbolSpan = false
  let symbolIcon
  if (node.hasChildren && nodeIsOpen) {
    symbolIcon = 'expandMore'
  } else if (node.hasChildren) {
    symbolIcon = 'chevronRight'
  } else if (node.label === 'lade Daten...') {
    symbolIcon = 'moreHoriz'
  } else {
    useSymbolSpan = true
    useSymbolIcon = false
  }
  const dataUrl = JSON.stringify(node.url)
  const level = node.url.length - 1
  const moving =
    node.nodeType === 'table' &&
    node.menuType === store.moving.table &&
    node.id === store.moving.id
  const copying =
    node.nodeType === 'table' &&
    node.menuType === store.copying.table &&
    node.id === store.copying.id
  
  const copyingBiotop =
    node.nodeType === 'table' && node.id === get(data, 'copyingBiotop.id')

  return (
    <div key={key} style={style}>
      <ContextMenuTrigger
        id={`${treeName}${node.menuType}`}
        collect={props => myProps}
        nodeId={node.id}
        nodeLabel={node.label}
        key={`${node.menuType}${node.id}`}
      >
        <StyledNode
          data-level={level}
          data-nodeisinactivenodepath={nodeIsInActiveNodePath}
          data-id={node.id}
          data-parentid={node.parentId}
          data-url={dataUrl}
          data-nodetype={node.nodeType}
          data-label={node.label}
          data-menutype={node.menuType}
        >
          {useSymbolIcon && (
            <SymbolDiv onClick={onClickNodeSymbol}>
              {symbolIcon === 'expandMore' && (
                <StyledExpandMoreIcon
                  data-nodeisinactivenodepath={nodeIsInActiveNodePath}
                  data-nodeisopen={nodeIsOpen}
                />
              )}
              {symbolIcon === 'chevronRight' && <StyledChevronRightIcon />}
              {symbolIcon === 'moreHoriz' && (
                <StyledMoreHorizIcon
                  data-nodeisinactivenodepath={nodeIsInActiveNodePath}
                />
              )}
            </SymbolDiv>
          )}
          {useSymbolSpan && (
            <SymbolSpan data-nodeisinactivenodepath={nodeIsInActiveNodePath}>
              {'-'}
            </SymbolSpan>
          )}
          {showPopMapIcon(store, tree, node, activeNodes) && (
            <div title="in Karte sichtbar">
              <PopMapIcon />
            </div>
          )}
          {showTpopMapIcon(store, tree, node, activeNodes) && (
            <div title="in Karte sichtbar">
              <TpopMapIcon />
            </div>
          )}
          {showBeobNichtBeurteiltMapIcon(store, tree, node, activeNodes) && (
            <div title="in Karte sichtbar">
              <BeobNichtBeurteiltMapIcon />
            </div>
          )}
          {showBeobNichtZuzuordnenMapIcon(store, tree, node, activeNodes) && (
            <div title="in Karte sichtbar">
              <BeobNichtZuzuordnenMapIcon />
            </div>
          )}
          {showBeobZugeordnetMapIcon(store, tree, node, activeNodes) && (
            <div title="in Karte sichtbar">
              <BeobZugeordnetMapIcon />
            </div>
          )}
          {showPopFilteredMapIcon(store, node) && (
            <div title="in Karte hervorgehoben">
              <PopFilteredMapIcon />
            </div>
          )}
          {showTpopFilteredMapIcon(store, node) && (
            <div title="in Karte hervorgehoben">
              <TpopFilteredMapIcon />
            </div>
          )}
          {showBeobNichtBeurteiltFilteredMapIcon(store, node) && (
            <div title="in Karte hervorgehoben">
              <BeobNichtBeurteiltFilteredMapIcon />
            </div>
          )}
          {showBeobNichtZuzuordnenFilteredMapIcon(store, node) && (
            <div title="in Karte hervorgehoben">
              <BeobNichtZuzuordnenFilteredMapIcon />
            </div>
          )}
          {showBeobZugeordnetFilteredMapIcon(store, tree, node, activeNodes) && (
            <div title="in Karte hervorgehoben">
              <BeobZugeordnetFilteredMapIcon />
            </div>
          )}
          <TextSpan
            data-nodeisinactivenodepath={nodeIsInActiveNodePath}
            node={node}
            onClick={onClickNode}
          >
            {node.label}
          </TextSpan>
          {moving && (
            <div title="zum Verschieben gemerkt, bereit zum Einfügen">
              <MovingIcon />
            </div>
          )}
          {copying && (
            <div title="kopiert, bereit zum Einfügen">
              <CopyingIcon />
            </div>
          )}
          {copyingBiotop && (
            <div title="Biotop kopiert, bereit zum Einfügen">
              <BiotopCopyingIcon />
            </div>
          )}
        </StyledNode>
      </ContextMenuTrigger>
    </div>
  )
}

export default enhance(Row)
