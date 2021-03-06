// @flow
import get from 'lodash/get'

import allParentNodesAreOpen from '../allParentNodesAreOpen'
import buildProjektNodes from './projekt'
import buildUserFolderNode from './userFolder'
import buildWlFolderNode from './wlFolder'
import buildAdresseFolderNode from './adresseFolder'
import buildAdresseNodes from './adresse'
import buildUserNodes from './user'
import buildApFolderNodes from './apFolder'
import buildApberuebersichtFolderNodes from './apberuebersichtFolder'
import buildApberuebersichtNodes from './apberuebersicht'
import buildApNodes from './ap'
import buildPopFolderNode from './popFolder'
import qkFolderNodes from './qkFolder'
import buildBeobNichtZuzuordnenFolderNodes from './beobNichtZuzuordnenFolder'
import buildBeobNichtBeurteiltFolderNodes from './beobNichtBeurteiltFolder'
import buildAssozartFolderNodes from './assozartFolder'
import buildEkfzaehleinheitFolderNodes from './ekfzaehleinheitFolder'
import buildApartFolderNodes from './apartFolder'
import buildIdealbiotopFolderNodes from './idealbiotopFolder'
import buildBerFolderNodes from './berFolder'
import buildApberFolderNodes from './apberFolder'
import buildAperfkritFolderNodes from './aperfkritFolder'
import buildApzielFolderNodes from './apzielFolder'
import buildApzieljahrFolderNodes from './apzieljahrFolder'
import buildApzielNodes from './apziel'
import buildApzielberFolderNodes from './apzielberFolder'
import buildApzielberNodes from './apzielber'
import buildPopNodes from './pop'
import buildBeobNichtZuzuordnenNodes from './beobNichtZuzuordnen'
import buildBeobNichtBeurteiltNodes from './beobNichtBeurteilt'
import buildAssozartNodes from './assozart'
import buildEkfzaehleinheitNodes from './ekfzaehleinheit'
import buildApartNodes from './apart'
import buildBerNodes from './ber'
import buildApberNodes from './apber'
import buildAperfkritNodes from './aperfkrit'
import buildTpopFolderNodes from './tpopFolder'
import buildPopberFolderNodes from './popberFolder'
import buildPopmassnberFolderNodes from './popmassnberFolder'
import buildPopmassnberNodes from './popmassnber'
import buildPopberNodes from './popber'
import buildTpopNodes from './tpop'
import buildBeobZugeordnetFolderNodes from './beobZugeordnetFolder'
import buildTpopberFolderNodes from './tpopberFolder'
import buildTpopfreiwkontrFolderNodes from './tpopfreiwkontrFolder'
import buildTpopfeldkontrFolderNodes from './tpopfeldkontrFolder'
import buildTpopmassnberFolderNodes from './tpopmassnberFolder'
import tpopmassnFolderNodes from './tpopmassnFolder'
import buildBeobZugeordnetNodes from './beobZugeordnet'
import buildTpopberNodes from './tpopber'
import buildTpopfreiwkontrNodes from './tpopfreiwkontr'
import buildTpopfeldkontrNodes from './tpopfeldkontr'
import buildTpopmassnberNodes from './tpopmassnber'
import buildTpopmassnNodes from './tpopmassn'
import buildTpopfeldkontrzaehlFolderNodes from './tpopfeldkontrzaehlFolder'
import buildTpopfeldkontrzaehlNodes from './tpopfeldkontrzaehl'
import sort from '../sort'

const compare = (a, b) => {
  // sort a before, if it has no value at this index
  if (a !== 0 && !a) return -1
  // sort a after if b has no value at this index
  if (b !== 0 && !b) return 1
  // sort a before if its value is smaller
  return a - b
}

export default ({
  data,
  treeName,
  loading,
  role,
}: {
  data: Object,
  treeName: String,
  loading: Boolean,
  role: String,
}): Array<Object> => {
  const openNodes = [...get(data, `${treeName}.openNodes`)]
    // need to sort so folders are added in correct order
    // because every lower folder gets previous nodes passed
    .sort(sort)

  const projektNodes = [...buildProjektNodes({ data, treeName })]
  const userFolderNode = buildUserFolderNode({
    data,
    treeName,
    projektNodes,
    loading,
  })

  let nodes = [...projektNodes, userFolderNode]
  if (role === 'apflora_manager') {
    nodes = [...nodes, buildWlFolderNode({ projektNodes })]
  }
  let apNodes
  let popNodes
  let tpopNodes
  let tpopfeldkontrNodes
  let tpopfreiwkontrNodes
  let apzieljahrFolderNodes
  let apzielNodes

  /**
   * We ALWAYS add an array of nodes,
   * never a single one
   * not even for folders that are never more than one
   * because the function adding the nodes
   * should be able to pass none as well
   * for instance if a parent node is not open
   * or some filter is active
   */
  openNodes.forEach(nodeUrl => {
    if (
      nodeUrl[0] === 'Projekte' &&
      // do not process ['Projekte']
      nodeUrl.length > 1
    ) {
      const projId = nodeUrl[1]
      if (nodeUrl.length === 2 && nodeUrl[0] === 'Projekte') {
        nodes = [
          ...nodes,
          ...buildApFolderNodes({
            data,
            treeName,
            loading,
            projektNodes,
            projId,
          }),
          ...buildApberuebersichtFolderNodes({
            data,
            treeName,
            loading,
            projektNodes,
            projId,
          }),
        ]
      }
      if (
        nodeUrl.length === 3 &&
        nodeUrl[2] === 'AP-Berichte' &&
        allParentNodesAreOpen(openNodes, nodeUrl)
      ) {
        nodes = [
          ...nodes,
          ...buildApberuebersichtNodes({
            data,
            treeName,
            loading,
            projektNodes,
            projId,
          }),
        ]
      }
      if (
        nodeUrl.length === 3 &&
        nodeUrl[2] === 'Aktionspläne' &&
        allParentNodesAreOpen(openNodes, nodeUrl)
      ) {
        apNodes = buildApNodes({
          data,
          treeName,
          loading,
          projektNodes,
          projId,
        })
        nodes = [...nodes, ...apNodes]
      }
      if (
        nodeUrl.length === 4 &&
        nodeUrl[2] === 'Aktionspläne' &&
        allParentNodesAreOpen(openNodes, nodeUrl)
      ) {
        const apId = nodeUrl[3]
        nodes = [
          ...nodes,
          ...buildPopFolderNode({
            data,
            treeName,
            loading,
            projektNodes,
            projId,
            apNodes,
            openNodes,
            apId,
          }),
          ...buildApzielFolderNodes({
            data,
            treeName,
            loading,
            apNodes,
            openNodes,
            projektNodes,
            projId,
            apId,
          }),
          ...buildAperfkritFolderNodes({
            data,
            treeName,
            loading,
            apNodes,
            openNodes,
            projektNodes,
            projId,
            apId,
          }),
          ...buildApberFolderNodes({
            data,
            treeName,
            loading,
            apNodes,
            openNodes,
            projektNodes,
            projId,
            apId,
          }),
          ...buildBerFolderNodes({
            data,
            treeName,
            loading,
            apNodes,
            openNodes,
            projektNodes,
            projId,
            apId,
          }),
          ...buildIdealbiotopFolderNodes({
            data,
            treeName,
            loading,
            apNodes,
            openNodes,
            projektNodes,
            projId,
            apId,
          }),
          ...buildAssozartFolderNodes({
            data,
            treeName,
            loading,
            apNodes,
            openNodes,
            projektNodes,
            projId,
            apId,
          }),
          ...buildEkfzaehleinheitFolderNodes({
            data,
            treeName,
            loading,
            apNodes,
            openNodes,
            projektNodes,
            projId,
            apId,
          }),
          ...buildApartFolderNodes({
            data,
            treeName,
            loading,
            apNodes,
            openNodes,
            projektNodes,
            projId,
            apId,
          }),
          ...buildBeobNichtBeurteiltFolderNodes({
            data,
            treeName,
            loading,
            apNodes,
            openNodes,
            projektNodes,
            projId,
            apId,
          }),
          ...buildBeobNichtZuzuordnenFolderNodes({
            data,
            treeName,
            loading,
            apNodes,
            openNodes,
            projektNodes,
            projId,
            apId,
          }),
          ...qkFolderNodes({
            data,
            treeName,
            loading,
            apNodes,
            openNodes,
            projektNodes,
            projId,
            apId,
          }),
        ]
      }
      // if nodeUrl.length > 4, nodeUrl[2] is always 'Aktionspläne'
      if (
        nodeUrl.length === 5 &&
        nodeUrl[4] === 'AP-Ziele' &&
        allParentNodesAreOpen(openNodes, nodeUrl)
      ) {
        apzieljahrFolderNodes = buildApzieljahrFolderNodes({
          data,
          treeName,
          loading,
          apNodes,
          openNodes,
          projektNodes,
          projId,
          apId: nodeUrl[3],
        })
        nodes = [...nodes, ...apzieljahrFolderNodes]
      }
      if (
        nodeUrl.length === 6 &&
        nodeUrl[4] === 'AP-Ziele' &&
        allParentNodesAreOpen(openNodes, nodeUrl)
      ) {
        apzielNodes = buildApzielNodes({
          data,
          treeName,
          loading,
          apNodes,
          openNodes,
          projektNodes,
          projId,
          apId: nodeUrl[3],
          jahr: +nodeUrl[5],
          apzieljahrFolderNodes,
        })
        nodes = [...nodes, ...apzielNodes]
      }
      if (
        nodeUrl.length === 7 &&
        nodeUrl[4] === 'AP-Ziele' &&
        allParentNodesAreOpen(openNodes, nodeUrl)
      ) {
        nodes = [
          ...nodes,
          ...buildApzielberFolderNodes({
            data,
            treeName,
            loading,
            apNodes,
            openNodes,
            projektNodes,
            projId,
            apId: nodeUrl[3],
            zielJahr: +nodeUrl[5],
            apzieljahrFolderNodes,
            zielId: nodeUrl[6],
            apzielNodes,
          }),
        ]
      }
      if (
        nodeUrl.length === 8 &&
        nodeUrl[4] === 'AP-Ziele' &&
        nodeUrl[7] === 'Berichte' &&
        allParentNodesAreOpen(openNodes, nodeUrl)
      ) {
        nodes = [
          ...nodes,
          ...buildApzielberNodes({
            data,
            treeName,
            loading,
            apNodes,
            openNodes,
            projektNodes,
            projId,
            apId: nodeUrl[3],
            zielJahr: +nodeUrl[5],
            apzieljahrFolderNodes,
            zielId: nodeUrl[6],
            apzielNodes,
          }),
        ]
      }
      if (
        nodeUrl.length === 5 &&
        nodeUrl[4] === 'Populationen' &&
        allParentNodesAreOpen(openNodes, nodeUrl)
      ) {
        popNodes = buildPopNodes({
          data,
          treeName,
          loading,
          apNodes,
          openNodes,
          projektNodes,
          projId,
          apId: nodeUrl[3],
        })
        nodes = [...nodes, ...popNodes]
      }
      if (
        nodeUrl.length === 5 &&
        nodeUrl[4] === 'nicht-zuzuordnende-Beobachtungen' &&
        allParentNodesAreOpen(openNodes, nodeUrl)
      ) {
        nodes = [
          ...nodes,
          ...buildBeobNichtZuzuordnenNodes({
            data,
            treeName,
            loading,
            apNodes,
            openNodes,
            projektNodes,
            projId,
            apId: nodeUrl[3],
          }),
        ]
      }
      if (
        nodeUrl.length === 5 &&
        nodeUrl[4] === 'nicht-beurteilte-Beobachtungen' &&
        allParentNodesAreOpen(openNodes, nodeUrl)
      ) {
        nodes = [
          ...nodes,
          ...buildBeobNichtBeurteiltNodes({
            data,
            treeName,
            loading,
            apNodes,
            openNodes,
            projektNodes,
            projId,
            apId: nodeUrl[3],
          }),
        ]
      }
      if (
        nodeUrl.length === 5 &&
        nodeUrl[4] === 'assoziierte-Arten' &&
        allParentNodesAreOpen(openNodes, nodeUrl)
      ) {
        nodes = [
          ...nodes,
          ...buildAssozartNodes({
            data,
            treeName,
            loading,
            apNodes,
            openNodes,
            projektNodes,
            projId,
            apId: nodeUrl[3],
          }),
        ]
      }
      if (
        nodeUrl.length === 5 &&
        nodeUrl[4] === 'EKF-Zähleinheiten' &&
        allParentNodesAreOpen(openNodes, nodeUrl)
      ) {
        nodes = [
          ...nodes,
          ...buildEkfzaehleinheitNodes({
            data,
            treeName,
            loading,
            apNodes,
            openNodes,
            projektNodes,
            projId,
            apId: nodeUrl[3],
          }),
        ]
      }
      if (
        nodeUrl.length === 5 &&
        nodeUrl[4] === 'AP-Arten' &&
        allParentNodesAreOpen(openNodes, nodeUrl)
      ) {
        nodes = [
          ...nodes,
          ...buildApartNodes({
            data,
            treeName,
            loading,
            apNodes,
            openNodes,
            projektNodes,
            projId,
            apId: nodeUrl[3],
          }),
        ]
      }
      if (
        nodeUrl.length === 5 &&
        nodeUrl[4] === 'Berichte' &&
        allParentNodesAreOpen(openNodes, nodeUrl)
      ) {
        nodes = [
          ...nodes,
          ...buildBerNodes({
            data,
            treeName,
            loading,
            apNodes,
            openNodes,
            projektNodes,
            projId,
            apId: nodeUrl[3],
          }),
        ]
      }
      if (
        nodeUrl.length === 5 &&
        nodeUrl[4] === 'AP-Berichte' &&
        allParentNodesAreOpen(openNodes, nodeUrl)
      ) {
        nodes = [
          ...nodes,
          ...buildApberNodes({
            data,
            treeName,
            loading,
            apNodes,
            openNodes,
            projektNodes,
            projId,
            apId: nodeUrl[3],
          }),
        ]
      }
      if (
        nodeUrl.length === 5 &&
        nodeUrl[4] === 'AP-Erfolgskriterien' &&
        allParentNodesAreOpen(openNodes, nodeUrl)
      ) {
        nodes = [
          ...nodes,
          ...buildAperfkritNodes({
            data,
            treeName,
            loading,
            apNodes,
            openNodes,
            projektNodes,
            projId,
            apId: nodeUrl[3],
          }),
        ]
      }
      if (
        nodeUrl.length === 6 &&
        nodeUrl[4] === 'Populationen' &&
        allParentNodesAreOpen(openNodes, nodeUrl)
      ) {
        const apId = nodeUrl[3]
        const popId = nodeUrl[5]
        nodes = [
          ...nodes,
          ...buildTpopFolderNodes({
            data,
            treeName,
            loading,
            projektNodes,
            projId,
            apNodes,
            openNodes,
            apId,
            popNodes,
            popId,
          }),
          ...buildPopberFolderNodes({
            data,
            treeName,
            loading,
            projektNodes,
            projId,
            apNodes,
            openNodes,
            apId,
            popNodes,
            popId,
          }),
          ...buildPopmassnberFolderNodes({
            data,
            treeName,
            loading,
            projektNodes,
            projId,
            apNodes,
            openNodes,
            apId,
            popNodes,
            popId,
          }),
        ]
      }
      if (
        nodeUrl.length === 7 &&
        nodeUrl[4] === 'Populationen' &&
        nodeUrl[6] === 'Massnahmen-Berichte' &&
        allParentNodesAreOpen(openNodes, nodeUrl)
      ) {
        nodes = [
          ...nodes,
          ...buildPopmassnberNodes({
            data,
            treeName,
            loading,
            projId,
            projektNodes,
            apId: nodeUrl[3],
            apNodes,
            openNodes,
            popId: nodeUrl[5],
            popNodes,
          }),
        ]
      }
      if (
        nodeUrl.length === 7 &&
        nodeUrl[4] === 'Populationen' &&
        nodeUrl[6] === 'Kontroll-Berichte' &&
        allParentNodesAreOpen(openNodes, nodeUrl)
      ) {
        nodes = [
          ...nodes,
          ...buildPopberNodes({
            data,
            treeName,
            loading,
            projId,
            projektNodes,
            apId: nodeUrl[3],
            apNodes,
            openNodes,
            popId: nodeUrl[5],
            popNodes,
          }),
        ]
      }
      if (
        nodeUrl.length === 7 &&
        nodeUrl[4] === 'Populationen' &&
        nodeUrl[6] === 'Teil-Populationen' &&
        allParentNodesAreOpen(openNodes, nodeUrl)
      ) {
        tpopNodes = buildTpopNodes({
          data,
          treeName,
          loading,
          projId,
          projektNodes,
          apId: nodeUrl[3],
          apNodes,
          openNodes,
          popId: nodeUrl[5],
          popNodes,
        })
        nodes = [...nodes, ...tpopNodes]
      }
      if (
        nodeUrl.length === 8 &&
        nodeUrl[4] === 'Populationen' &&
        nodeUrl[6] === 'Teil-Populationen' &&
        allParentNodesAreOpen(openNodes, nodeUrl)
      ) {
        const apId = nodeUrl[3]
        const popId = nodeUrl[5]
        const tpopId = nodeUrl[7]
        nodes = [
          ...nodes,
          ...tpopmassnFolderNodes({
            data,
            treeName,
            loading,
            projId,
            projektNodes,
            apId,
            apNodes,
            openNodes,
            popId,
            popNodes,
            tpopId,
            tpopNodes,
          }),
          ...buildTpopmassnberFolderNodes({
            data,
            treeName,
            loading,
            projId,
            projektNodes,
            apId,
            apNodes,
            openNodes,
            popId,
            popNodes,
            tpopId,
            tpopNodes,
          }),
          ...buildTpopfeldkontrFolderNodes({
            data,
            treeName,
            loading,
            projId,
            projektNodes,
            apId,
            apNodes,
            openNodes,
            popId,
            popNodes,
            tpopId,
            tpopNodes,
          }),
          ...buildTpopfreiwkontrFolderNodes({
            data,
            treeName,
            loading,
            projId,
            projektNodes,
            apId,
            apNodes,
            openNodes,
            popId,
            popNodes,
            tpopId,
            tpopNodes,
          }),
          ...buildTpopberFolderNodes({
            data,
            treeName,
            loading,
            projId,
            projektNodes,
            apId,
            apNodes,
            openNodes,
            popId,
            popNodes,
            tpopId,
            tpopNodes,
          }),
          ...buildBeobZugeordnetFolderNodes({
            data,
            treeName,
            loading,
            projId,
            projektNodes,
            apId,
            apNodes,
            openNodes,
            popId,
            popNodes,
            tpopId,
            tpopNodes,
          }),
        ]
      }
      if (
        nodeUrl.length === 9 &&
        nodeUrl[4] === 'Populationen' &&
        nodeUrl[6] === 'Teil-Populationen' &&
        nodeUrl[8] === 'Beobachtungen' &&
        allParentNodesAreOpen(openNodes, nodeUrl)
      ) {
        nodes = [
          ...nodes,
          ...buildBeobZugeordnetNodes({
            data,
            treeName,
            loading,
            projId,
            projektNodes,
            apId: nodeUrl[3],
            apNodes,
            openNodes,
            popId: nodeUrl[5],
            popNodes,
            tpopId: nodeUrl[7],
            tpopNodes,
          }),
        ]
      }
      if (
        nodeUrl.length === 9 &&
        nodeUrl[4] === 'Populationen' &&
        nodeUrl[6] === 'Teil-Populationen' &&
        nodeUrl[8] === 'Kontroll-Berichte' &&
        allParentNodesAreOpen(openNodes, nodeUrl)
      ) {
        nodes = [
          ...nodes,
          ...buildTpopberNodes({
            data,
            treeName,
            loading,
            projId,
            projektNodes,
            apId: nodeUrl[3],
            apNodes,
            openNodes,
            popId: nodeUrl[5],
            popNodes,
            tpopId: nodeUrl[7],
            tpopNodes,
          }),
        ]
      }
      if (
        nodeUrl.length === 9 &&
        nodeUrl[4] === 'Populationen' &&
        nodeUrl[6] === 'Teil-Populationen' &&
        nodeUrl[8] === 'Freiwilligen-Kontrollen' &&
        allParentNodesAreOpen(openNodes, nodeUrl)
      ) {
        tpopfreiwkontrNodes = buildTpopfreiwkontrNodes({
          data,
          treeName,
          loading,
          projId,
          projektNodes,
          apId: nodeUrl[3],
          apNodes,
          openNodes,
          popId: nodeUrl[5],
          popNodes,
          tpopId: nodeUrl[7],
          tpopNodes,
        })
        nodes = [...nodes, ...tpopfreiwkontrNodes]
      }
      if (
        nodeUrl.length === 9 &&
        nodeUrl[4] === 'Populationen' &&
        nodeUrl[6] === 'Teil-Populationen' &&
        nodeUrl[8] === 'Feld-Kontrollen' &&
        allParentNodesAreOpen(openNodes, nodeUrl)
      ) {
        tpopfeldkontrNodes = buildTpopfeldkontrNodes({
          data,
          treeName,
          loading,
          projId,
          projektNodes,
          apId: nodeUrl[3],
          apNodes,
          openNodes,
          popId: nodeUrl[5],
          popNodes,
          tpopId: nodeUrl[7],
          tpopNodes,
        })
        nodes = [...nodes, ...tpopfeldkontrNodes]
      }
      if (
        nodeUrl.length === 9 &&
        nodeUrl[4] === 'Populationen' &&
        nodeUrl[6] === 'Teil-Populationen' &&
        nodeUrl[8] === 'Massnahmen-Berichte' &&
        allParentNodesAreOpen(openNodes, nodeUrl)
      ) {
        nodes = [
          ...nodes,
          ...buildTpopmassnberNodes({
            data,
            treeName,
            loading,
            projId,
            projektNodes,
            apId: nodeUrl[3],
            apNodes,
            openNodes,
            popId: nodeUrl[5],
            popNodes,
            tpopId: nodeUrl[7],
            tpopNodes,
          }),
        ]
      }
      if (
        nodeUrl.length === 9 &&
        nodeUrl[4] === 'Populationen' &&
        nodeUrl[6] === 'Teil-Populationen' &&
        nodeUrl[8] === 'Massnahmen' &&
        allParentNodesAreOpen(openNodes, nodeUrl)
      ) {
        nodes = [
          ...nodes,
          ...buildTpopmassnNodes({
            data,
            treeName,
            loading,
            projId,
            projektNodes,
            apId: nodeUrl[3],
            apNodes,
            openNodes,
            popId: nodeUrl[5],
            popNodes,
            tpopId: nodeUrl[7],
            tpopNodes,
          }),
        ]
      }
      if (
        nodeUrl.length === 10 &&
        nodeUrl[4] === 'Populationen' &&
        nodeUrl[6] === 'Teil-Populationen' &&
        nodeUrl[8] === 'Feld-Kontrollen' &&
        allParentNodesAreOpen(openNodes, nodeUrl)
      ) {
        nodes = [
          ...nodes,
          ...buildTpopfeldkontrzaehlFolderNodes({
            data,
            treeName,
            loading,
            projId,
            projektNodes,
            apId: nodeUrl[3],
            apNodes,
            openNodes,
            popId: nodeUrl[5],
            popNodes,
            tpopId: nodeUrl[7],
            tpopNodes,
            tpopkontrId: nodeUrl[9],
            tpopfeldkontrNodes,
          }),
        ]
      }
      if (
        nodeUrl.length === 11 &&
        nodeUrl[4] === 'Populationen' &&
        nodeUrl[6] === 'Teil-Populationen' &&
        nodeUrl[8] === 'Feld-Kontrollen' &&
        allParentNodesAreOpen(openNodes, nodeUrl)
      ) {
        nodes = [
          ...nodes,
          ...buildTpopfeldkontrzaehlNodes({
            data,
            treeName,
            loading,
            projId,
            projektNodes,
            apId: nodeUrl[3],
            apNodes,
            openNodes,
            popId: nodeUrl[5],
            popNodes,
            tpopId: nodeUrl[7],
            tpopNodes,
            tpopkontrId: nodeUrl[9],
            tpopfeldkontrNodes,
          }),
        ]
      }
    }
    if (nodeUrl.length === 1 && nodeUrl[0] === 'Benutzer') {
      nodes = [
        ...nodes,
        ...buildUserNodes({
          data,
          treeName,
          projektNodes,
        }),
      ]
    }
    if (
      role === 'apflora_manager' &&
      nodeUrl.length === 1 &&
      nodeUrl[0] === 'Werte-Listen'
    ) {
      nodes = [
        ...nodes,
        buildAdresseFolderNode({
          data,
          treeName,
          loading,
          projektNodes,
        }),
      ]
    }
    if (
      role === 'apflora_manager' &&
      nodeUrl.length === 2 &&
      nodeUrl[0] === 'Werte-Listen' &&
      nodeUrl[1] === 'Adressen' &&
      allParentNodesAreOpen(openNodes, nodeUrl)
    ) {
      nodes = [
        ...nodes,
        ...buildAdresseNodes({
          data,
          treeName,
          loading,
          projektNodes,
        }),
      ]
    }
  })

  /**
   * As all nodes are now in one flat list,
   * we need to sort them
   *
   * This is the sorting algorithm:
   *
   * compare the sort array value in the nodes
   * to determine sorting
   *
   * compare arrays element by element, starting with first
   * if a has no value at this index (> a is folder), sort a before b
   * if b has no value at this index (> b is folder), sort a after b
   * if a is smaller than b, sort a before b
   * if both array elements at this index are same,
   * compare values at next index
   *
   * see: stackoverflow.com/questions/13211709/javascript-sort-array-by-multiple-number-fields
   */
  return nodes.sort(
    (a, b) =>
      compare(a.sort[0], b.sort[0]) ||
      compare(a.sort[1], b.sort[1]) ||
      compare(a.sort[2], b.sort[2]) ||
      compare(a.sort[3], b.sort[3]) ||
      compare(a.sort[4], b.sort[4]) ||
      compare(a.sort[5], b.sort[5]) ||
      compare(a.sort[6], b.sort[6]) ||
      compare(a.sort[7], b.sort[7]) ||
      compare(a.sort[8], b.sort[8]) ||
      compare(a.sort[9], b.sort[9]) ||
      compare(a.sort[10], b.sort[10])
  )
}
