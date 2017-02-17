// @flow
/*
 *
 * Strukturbaum
 * https://rawgit.com/bvaughn/react-virtualized/master/playground/tree.html
 * https://github.com/bvaughn/react-virtualized/blob/master/playground/tree.js
 *
 * need class because of ref
 *
 */

import React, { Component, PropTypes } from 'react'
import { observer, inject } from 'mobx-react'
import { AutoSizer, List } from 'react-virtualized'
import { ContextMenuTrigger } from 'react-contextmenu'
import styled from 'styled-components'
import compose from 'recompose/compose'
import { Scrollbars } from 'react-custom-scrollbars'
import FontIcon from 'material-ui/FontIcon'

import isNodeInActiveNodePath from '../../../modules/isNodeInActiveNodePath'

const singleRowHeight = 23
const Container = styled.div`
  height: 100%;
  font-family: 'Roboto Mono', monospace;
  ul {
    margin: 0;
    list-style: none;
    padding: 0 0 0 1.1em;
  }
`
const ListContainer = styled(List)`
  font-family: 'Roboto Mono', monospace;
  font-size: 14px;
  font-weight: normal;
  * {
    box-sizing: border-box;
    font-size: 14px;
    font-weight: normal;
  }
  &:focus {
    outline-color: rgb(48, 48, 48) !important;
  }
`
const TopUl = styled.ul``
const TopUlForPathLength1 = styled(TopUl)`
  padding: 0 0 0 0.5em !important;
`
const StyledNode = styled.div`
  height: ${singleRowHeight}px;
  max-height: ${singleRowHeight}px;
  box-sizing: border-box;
  margin: 0;
  display: flex;
  flex-direction: row;
  white-space: nowrap;
  user-select: none;
  font-size: 1.1em;
  cursor: pointer;
  color: rgb(247, 247, 247);
  &:hover {
    color: orange;
  }
`
const StyledNodeInActiveNodePath = styled(StyledNode)`
  font-weight: 900;
  color: rgb(255, 94, 94);
  font-size: 14px;
`
const StyledSymbolSpan = styled.span`
  margin-right: 0;
  font-weight: 900;
`
const StyledSymbolOpenSpan = styled(StyledSymbolSpan)`
  /*margin-top: -0.2em; only necessary on mac!!!*/
  font-size: 1.4em;
`
const StyledTextSpan = styled.span`
  padding-left: .5em;
`
const StyledMapIcon = styled(FontIcon)`
  padding-left: .2em;
  margin-right: -0.1em;
  font-size: 20px !important;
`
const PopMapIcon = styled(StyledMapIcon)`
  color: #947500 !important;
`
const TpopMapIcon = styled(StyledMapIcon)`
  color: #016f19 !important;
`
const PopFilteredMapIcon = styled(PopMapIcon)`
  -webkit-text-stroke: 2px #f5ef00;
`
const TpopFilteredMapIcon = styled(TpopMapIcon)`
  -webkit-text-stroke: 2px #f5ef00;
`
const StyledTextInActiveNodePathSpan = styled(StyledTextSpan)`
  font-weight: 900;
`
const LoadingDiv = styled.div`
  padding-left: 15px;
  font-size: 14px;
`
const StyledScrollbars = styled(Scrollbars)`
  div:first-child {
    /* without this a hideous white line appears on the right */
    margin-right: -25px !important;
  }
  .ReactVirtualized__Grid {
    overflow: visible !important;
  }
`
const enhance = compose(
  inject(`store`),
  observer
)

class Strukturbaum extends Component {

  static propTypes = {
    store: PropTypes.object.isRequired,
    nrOfRows: PropTypes.number.isRequired,
    rowNrOfActiveNode: PropTypes.number.isRequired,
  }

  constructor() {
    super()
    // $FlowIssue
    this.rowRenderer = this.rowRenderer.bind(this)
    // $FlowIssue
    this.renderNode = this.renderNode.bind(this)
    // $FlowIssue
    this.noRowsRenderer = this.noRowsRenderer.bind(this)
  }

  rowRenderer({ key, index }) {
    const { store } = this.props
    return (
      <div key={key}>
        {this.renderNode(store.projektNodes[index], index)}
      </div>
    )
  }

  noRowsRenderer() {
    const { store } = this.props
    const message = (
      store.table.projektLoading ?
      `lade Daten...` :
      `keine Daten`
    )
    return (
      <Container>
        <LoadingDiv>
          {message}
        </LoadingDiv>
      </Container>
    )
  }

  renderNode(node, index) {
    const { store } = this.props
    const onClick = (event) => {
      event.stopPropagation()
      store.ui.lastClickY = event.pageY
      store.toggleNode(node)
    }

    const props = { key: index }
    const nodeHasChildren = node.children && node.children.length
    let childNodes = []
    const symbolTypes = {
      open: `${String.fromCharCode(709)}`,
      closed: `>`,
      hasNoChildren: `-`,
      loadingData: ``,
    }
    let symbol
    const nodeIsInActiveNodePath = isNodeInActiveNodePath(node, store.url)
    let SymbolSpan = StyledSymbolSpan
    const TextSpan = nodeIsInActiveNodePath ? StyledTextInActiveNodePathSpan : StyledTextSpan

    if (nodeHasChildren && node.expanded) {
      props.onClick = onClick
      symbol = symbolTypes.open
      if (nodeIsInActiveNodePath) {
        SymbolSpan = StyledSymbolOpenSpan
      }
      childNodes = node.children.map(child =>
        this.renderNode(child, child.url.join(`/`))
      )
    } else if (nodeHasChildren) {
      props.onClick = onClick
      symbol = symbolTypes.closed
    } else if (node.label === `lade Daten...`) {
      symbol = symbolTypes.loadingData
    } else {
      symbol = symbolTypes.hasNoChildren
      props.onClick = onClick
    }
    const Node = nodeIsInActiveNodePath ? StyledNodeInActiveNodePath : StyledNode
    const showPopMapIcon = (
      node.menuType === `ap` &&
      node.id === (store.activeUrlElements.ap || store.map.pop.apArtId) &&
      store.map.pop.visible
    )
    const showPopFilteredMapIcon = (
      node.menuType === `pop` &&
      store.map.pop.visible &&
      store.map.pop.highlightedIds.includes(node.id)
    )
    const showTpopMapIcon = (
      node.menuType === `ap` &&
      node.id === (store.activeUrlElements.ap || store.map.pop.apArtId) &&
      store.map.tpop.visible
    )
    const showTpopFilteredMapIcon = (
      (
        node.menuType === `tpop` &&
        store.map.tpop.visible &&
        store.map.tpop.highlightedIds.includes(node.id)
      ) ||
      (
        node.menuType === `tpopFolder` &&
        store.map.tpop.visible &&
        store.map.tpop.highlightedPopIds.includes(node.id)
      )
    )

    childNodes.unshift(
      <ContextMenuTrigger
        id={node.menuType}
        collect={props => props}
        nodeId={node.id}
        nodeLabel={node.label}
        key={`${index}-child`}
      >
        <Node
          data-id={node.id}
          data-parentId={node.parentId}
          data-url={JSON.stringify(node.url)}
          data-nodeType={node.nodeType}
          data-label={node.label}
          data-menuType={node.menuType}
        >
          <SymbolSpan>
            {symbol}
          </SymbolSpan>
          {
            showPopMapIcon &&
            <PopMapIcon
              id="map"
              className="material-icons"
              title="in Karte sichtbar"
            >
              local_florist
            </PopMapIcon>
          }
          {
            showTpopMapIcon &&
            <TpopMapIcon
              id="map"
              className="material-icons"
              title="in Karte sichtbar"
            >
              local_florist
            </TpopMapIcon>
          }
          {
            showPopFilteredMapIcon &&
            <PopFilteredMapIcon
              id="map"
              className="material-icons"
              title="in Karte hervorgehoben"
            >
              local_florist
            </PopFilteredMapIcon>
          }
          {
            showTpopFilteredMapIcon &&
            <TpopFilteredMapIcon
              id="map"
              className="material-icons"
              title="in Karte hervorgehoben"
            >
              local_florist
            </TpopFilteredMapIcon>
          }
          <TextSpan>
            {node.label}
          </TextSpan>
        </Node>
      </ContextMenuTrigger>
    )

    const TopChildUl = (
      node.urlPath && node.urlPath.length && node.urlPath.length === 1 ?
      TopUlForPathLength1 :
      TopUl
    )

    return (
      <TopChildUl
        key={index}
        onClick={props.onClick}
      >
        <li>
          {childNodes}
        </li>
      </TopChildUl>
    )
  }

  render() {  // eslint-disable-line class-methods-use-this
    const { store, nrOfNodeRows, rowNrOfActiveNode } = this.props

    // calculate scrolltop
    // without this if a folder low in the tree is opened,
    // it always gets scrolled down out of sight
    const nodes = store.projektNodes
    const rowHeight = nrOfNodeRows * singleRowHeight
    const treeHeightAboveActiveNode = rowNrOfActiveNode * singleRowHeight
    console.log(`Strukturbaum: nrOfNodeRows:`, nrOfNodeRows)
    console.log(`Strukturbaum: rowHeight:`, rowHeight)
    console.log(`Strukturbaum: rowNrOfActiveNode:`, rowNrOfActiveNode)
    console.log(`Strukturbaum: treeHeightAboveActiveNode:`, treeHeightAboveActiveNode)
    const roomAboveClick = store.ui.lastClickY - store.ui.treeTopPosition
    // correcting by 10px seems to keep the tree from jumping
    // const scrolltop = (treeHeightAboveActiveNode - roomAboveClick) + 10
    const popVisible = store.map.pop.visible
    const tpopVisible = store.map.tpop.visible
    // pass length of highlightedIds to List
    // to make it rerender when highlighting changes
    const popHighlighted = store.map.pop.highlightedIds.length
    const tpopHighlighted = store.map.tpop.highlightedIds.length

    // console.log(`Strukturbaum: rowNrOfActiveNode:`, rowNrOfActiveNode)

    return (
      <Container>
        <AutoSizer>
          {({ height, width }) => (
            <StyledScrollbars
              style={{ width, height }}
              autoHide
            >
              <ListContainer
                height={height}
                rowCount={nodes.length}
                rowHeight={rowHeight}
                rowRenderer={this.rowRenderer}
                noRowsRenderer={this.noRowsRenderer}
                width={width}
                scrollTop={treeHeightAboveActiveNode}
                popVisible={popVisible}
                popHighlighted={popHighlighted}
                tpopVisible={tpopVisible}
                tpopHighlighted={tpopHighlighted}
                ref={(c) => { this.tree = c }}
                {...store.projektNodes}
              />
            </StyledScrollbars>
          )}
        </AutoSizer>
      </Container>
    )
  }
}

export default enhance(Strukturbaum)
