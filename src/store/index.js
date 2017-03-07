// @flow
import {
  extendObservable,
  action,
  autorun,
  autorunAsync,
  computed,
  observable,
} from 'mobx'
import $ from 'jquery'
import sortBy from 'lodash/sortBy'
import flatten from 'tree-flatten'

import fetchTable from '../modules/fetchTable'
import fetchBeobzuordnungModule from '../modules/fetchBeobzuordnung'
import fetchTableByParentId from '../modules/fetchTableByParentId'
import fetchTpopForAp from '../modules/fetchTpopForAp'
import fetchPopForAp from '../modules/fetchPopForAp'
import fetchDatasetById from '../modules/fetchDatasetById'
import fetchBeobBereitgestellt from '../modules/fetchBeobBereitgestellt'
import updateActiveDatasetFromUrl from '../modules/updateActiveDatasetFromUrl'
import getActiveUrlElements from '../modules/getActiveUrlElements'
import fetchDataForActiveUrlElements from '../modules/fetchDataForActiveUrlElements'
import buildProjektNodes from '../modules/nodes/projekt'
import updateProperty from '../modules/updateProperty'
import updatePropertyInDb from '../modules/updatePropertyInDb'
import manipulateUrl from '../modules/manipulateUrl'
import getUrl from '../modules/getUrl'
import getUrlQuery from '../modules/getUrlQuery'
import fetchFields from '../modules/fetchFields'
import fetchFieldsFromIdb from '../modules/fetchFieldsFromIdb'
import insertDataset from '../modules/insertDataset'
import deleteDatasetDemand from '../modules/deleteDatasetDemand'
import deleteDatasetExecute from '../modules/deleteDatasetExecute'
import toggleNode from '../modules/toggleNode'
import listError from '../modules/listError'
import setUrlQuery from '../modules/setUrlQuery'
import setQk from '../modules/setQk'
import setQkFilter from '../modules/setQkFilter'
import fetchQk from '../modules/fetchQk'
import addMessagesToQk from '../modules/addMessagesToQk'
import getPopsForMap from '../modules/getPopsForMap'
import getTpopsForMap from '../modules/getTpopsForMap'
import getPopBounds from '../modules/getPopBounds'
import getTpopBounds from '../modules/getTpopBounds'
import epsg4326to21781 from '../modules/epsg4326to21781'
import getPopMarkers from '../modules/getPopMarkers'
import getTpopMarkers from '../modules/getTpopMarkers'
import fetchLogin from '../modules/fetchLogin'
import logout from '../modules/logout'
import setLoginFromIdb from '../modules/setLoginFromIdb'
import localizeTpop from '../modules/localizeTpop'
import fetchStammdatenTables from '../modules/fetchStammdatenTables'
import projektNodes from '../modules/nodes/projekt'
import apFolderNodes from '../modules/nodes/apFolder'
import apberuebersichtFolderNodes from '../modules/nodes/apberuebersichtFolder'
import apberuebersichtNodes from '../modules/nodes/apberuebersicht'
import exporteFolderNodes from '../modules/nodes/exporteFolder'
import apNodes from '../modules/nodes/ap'
import allNodes from '../modules/nodes/allNodes'
import qkFolderNode from '../modules/nodes/qkFolder'

import TableStore from './table'
import ObservableHistory from './ObservableHistory'

function Store() {
  this.history = ObservableHistory
  this.loading = []
  extendObservable(this, {
    loading: [],
  })
  this.node = {
    node: {}
  }
  extendObservable(this.node, {
    apFilter: false,
    nodeLabelFilter: observable.map({}),
  })
  extendObservable(this.node.node, {
    projekt: computed(() => projektNodes(this)),
    apFolder: computed(() => apFolderNodes(this)),
    apberuebersichtFolder: computed(() => apberuebersichtFolderNodes(this)),
    exporteFolder: computed(() => exporteFolderNodes(this)),
    apberuebersicht: computed(() => apberuebersichtNodes(this)),
    ap: computed(() => apNodes(this)),
    nodes: computed(() => allNodes(this)),
    qkFolder: computed(() => qkFolderNode(this)),
  })
  this.ui = {}
  extendObservable(this.ui, {
    windowWidth: $(window).width(),
    windowHeight: $(window).height(),
    treeHeight: 0,
    lastClickY: 0,
    treeTopPosition: 0,
  })
  this.app = {}
  extendObservable(this.app, {
    errors: [],
    fields: [],
    map: null,
  })
  this.user = {}
  // name set to prevent Login Dialog from appearing before setLoginFromIdb has fetched from idb
  extendObservable(this.user, {
    name: `temporaryValue`,
    roles: [],
    readOnly: true,
  })
  this.map = {
    mouseCoord: [],
    mouseCoordEpsg21781: [],
    pop: {},
    tpop: {},
  }
  extendObservable(this.map, {
    mouseCoord: [],
    mouseCoordEpsg21781: computed(() => {
      if (this.map.mouseCoord[0]) {
        return epsg4326to21781(this.map.mouseCoord[0], this.map.mouseCoord[1])
      }
      return []
    }),
  })
  extendObservable(this.map.pop, {
    // apArtId is needed because
    // need to pass apArtId when activeUrlElements.ap
    // is not yet set...
    apArtId: null,
    visible: false,
    highlightedIds: [],
    pops: computed(() =>
      getPopsForMap(this)
    ),
    bounds: computed(() =>
      getPopBounds(this.map.pop.pops)
    ),
    // alternative is using names
    labelUsingNr: true,
    markers: computed(() =>
      getPopMarkers(this)
    ),
  })
  extendObservable(this.map.tpop, {
    visible: false,
    highlightedIds: [],
    highlightedPopIds: [],
    tpops: computed(() =>
      getTpopsForMap(this)
    ),
    bounds: computed(() =>
      getTpopBounds(this.map.tpop.tpops)
    ),
    // alternative is using names
    labelUsingNr: true,
    markers: computed(() =>
      getTpopMarkers(this)
    ),
    idOfTpopBeingLocalized: 0,
  })
  this.table = TableStore
  extendObservable(this.table.filteredAndSorted, {
    projekt: computed(() => {
      // grab projekte as array and sort them by name
      let projekte = Array.from(this.table.projekt.values())
      // filter by node.nodeLabelFilter
      const filterString = this.node.nodeLabelFilter.get(`projekt`)
      if (filterString) {
        projekte = projekte.filter(p =>
          p.ProjName
            .toLowerCase()
            .includes(filterString.toLowerCase())
        )
      }
      // sort
      projekte = sortBy(projekte, `ProjName`)
      return projekte
    }),
    apberuebersicht: computed(() => {
      const { activeUrlElements } = this
      // grab apberuebersicht as array and sort them by year
      let apberuebersicht = Array.from(this.table.apberuebersicht.values())
      // show only nodes of active projekt
      apberuebersicht = apberuebersicht.filter(a => a.ProjId === activeUrlElements.projekt)
      // filter by node.nodeLabelFilter
      const filterString = this.node.nodeLabelFilter.get(`apberuebersicht`)
      if (filterString) {
        apberuebersicht = apberuebersicht.filter(p =>
          p.JbuJahr
            .toString()
            .includes(filterString)
        )
      }
      // sort
      apberuebersicht = sortBy(apberuebersicht, `JbuJahr`)
      return apberuebersicht
    }),
    ap: computed(() => {
      const { activeUrlElements, table } = this
      const { adb_eigenschaften } = table
      // grab ap as array and sort them by name
      let ap = Array.from(this.table.ap.values())
      // show only ap of active projekt
      ap = ap.filter(a => a.ProjId === activeUrlElements.projekt)
      // filter by node.apFilter
      if (this.node.apFilter) {
        // ApStatus between 3 and 5
        ap = ap.filter(a => [1, 2, 3].includes(a.ApStatus))
      }
      // sort
      // need to add artnameVollständig to sort and filter by nodeLabelFilter
      if (adb_eigenschaften.size > 0) {
        ap.forEach(x => {
          const ae = adb_eigenschaften.get(x.ApArtId)
          return x.label = ae ? ae.Artname : `(keine Art gewählt)`
        })
        // filter by node.nodeLabelFilter
        const filterString = this.node.nodeLabelFilter.get(`ap`)
        if (filterString) {
          ap = ap.filter(p =>
            p.label.toLowerCase().includes(filterString.toLowerCase())
          )
        }
        ap = sortBy(ap, `label`)
      }
      return ap
    }),
  })
  this.valuesForWhichTableDataWasFetched = {}
  this.qk = observable.map()
  extendObservable(this, {
    datasetToDelete: {},
    tellUserReadOnly: action(() =>
      this.listError(new Error(`Sie haben keine Schreibrechte`))
    ),
    setIdOfTpopBeingLocalized: action((id) => {
      if (this.user.readOnly) return this.tellUserReadOnly()
      this.map.tpop.idOfTpopBeingLocalized = id
    }),
    localizeTpop: action((x, y) => {
      if (this.user.readOnly) return this.tellUserReadOnly()
      localizeTpop(this, x, y)
    }),
    fetchLogin: action((name, password) => {
      fetchLogin(this, name, password)
    }),
    logout: action(() =>
      logout(this)
    ),
    setLoginFromIdb: action(() =>
      setLoginFromIdb(this)
    ),
    setMapMouseCoord: action((e) => {
      this.map.mouseCoord = [e.latlng.lng, e.latlng.lat]
    }),
    toggleMapPopLabelContent: action((layer) =>
      this.map[layer].labelUsingNr = !this.map[layer].labelUsingNr
    ),
    toggleApFilter: action(() => {
      this.node.apFilter = !this.node.apFilter
    }),
    fetchQk: action(() =>
      fetchQk({ store: this })
    ),
    setQk: action(({ berichtjahr, messages, filter }) =>
      setQk({ store: this, berichtjahr, messages, filter })
    ),
    setQkFilter: action(({ filter }) =>
      setQkFilter({ store: this, filter })
    ),
    addMessagesToQk: action(({ messages }) => {
      addMessagesToQk({ store: this, messages })
    }),
    fetchFieldsFromIdb: action(() =>
      fetchFieldsFromIdb(this)
    ),
    updateLabelFilter: action((table, value) => {
      if (!table) {
        return this.listError(
          new Error(`nodeLabelFilter cant be updated: no table passed`)
        )
      }
      this.node.nodeLabelFilter.set(table, value)
    }),
    insertDataset: action((table, parentId, baseUrl) => {
      if (this.user.readOnly) return this.tellUserReadOnly()
      insertDataset(this, table, parentId, baseUrl)
    }),
    deleteDatasetDemand: action((table, id, url, label) => {
      if (this.user.readOnly) return this.tellUserReadOnly()
      deleteDatasetDemand(this, table, id, url, label)
    }),
    deleteDatasetAbort: action(() => {
      this.datasetToDelete = {}
    }),
    deleteDatasetExecute: action(() => {
      if (this.user.readOnly) return this.tellUserReadOnly()
      deleteDatasetExecute(this)
    }),
    listError: action(error =>
      listError(this, error)
    ),
    // updates data in store
    updateProperty: action((key, value) => {
      if (this.user.readOnly) return this.tellUserReadOnly()
      updateProperty(this, key, value)
    }),
    // updates data in database
    updatePropertyInDb: action((key, value) => {
      if (this.user.readOnly) return this.tellUserReadOnly()
      updatePropertyInDb(this, key, value)
    }),
    // fetch all data of a table
    // primarily used for werte (domain) tables
    // and projekt
    fetchTable: action((schemaName, tableName) =>
      fetchTable(this, schemaName, tableName)
    ),
    fetchStammdaten: action(() => {
      fetchFields(this)
      fetchStammdatenTables(this)
    }),
    fetchBeobzuordnung: action(apArtId =>
      fetchBeobzuordnungModule(this, apArtId)
    ),
    // fetch data of table for id of parent table
    // used for actual apflora data (but projekt)
    fetchTableByParentId: action((schemaName, tableName, parentId) =>
      fetchTableByParentId(this, schemaName, tableName, parentId)
    ),
    fetchTpopForAp: action(apArtId =>
      fetchTpopForAp(this, apArtId)
    ),
    fetchPopForAp: action(apArtId =>
      fetchPopForAp(this, apArtId)
    ),
    fetchDatasetById: action(({ schemaName, tableName, id }) =>
      fetchDatasetById({ store: this, schemaName, tableName, id })
    ),
    fetchBeobBereitgestellt: action(apArtId =>
      fetchBeobBereitgestellt(this, apArtId)
    ),
    // action when user clicks on a node in the tree
    toggleNode: action(node =>
      toggleNode(this, node)
    ),
    /**
     * urlQueries are used to control tabs
     * for instance: Entwicklung or Biotop in tpopfeldkontr
     * or: strukturbaum, daten and map in projekte
     */
    setUrlQuery: action((key, value) =>
      setUrlQuery(this, key, value)
    ),
    showMapLayer: action((layer, bool) =>
      this.map[layer].visible = bool
    ),
    highlightIdOnMap: action((layer, id) =>
      this.map[layer].highlightedIds = [...this.map[layer].highlightedIds, parseInt(id, 10)]
    ),
    unhighlightIdOnMap: action((layer, id) =>
      this.map[layer].highlightedIds = this.map[layer].highlightedIds.filter(i => i !== id)
    ),
    highlightTpopByPopIdOnMap: action((id) =>
      this.map.tpop.highlightedPopIds = [...this.map.tpop.highlightedPopIds, parseInt(id, 10)]
    ),
    unhighlightTpopByPopIdOnMap: action((id) =>
      this.map.tpop.highlightedPopIds = this.map.tpop.highlightedPopIds.filter(i => i !== id)
    ),
    /**
     * url paths are used to control tree and forms
     */
    url: computed(() =>
      //$FlowIssue
      getUrl(this.history.location.pathname)
    ),
    /**
     * urlQueries are used to control tabs
     * for instance: Entwicklung or Biotop in tpopfeldkontr
     */
    urlQuery: computed(() =>
      //$FlowIssue
      getUrlQuery(this.history.location.search)
    ),
    projektNodes: computed(() =>
      buildProjektNodes(this)
    ),
    nodesFlattened: computed(() => {
      let nodes = []
      this.projektNodes.forEach(n => {
        // console.log(`node:`, n)
        const nodeFlattended = flatten(n, `children`)
        // console.log(`nodeFlattended:`, nodeFlattended)
        nodes = nodes.concat(nodeFlattended)
      })
      return nodes
    }),
    activeDataset: computed(() =>
      updateActiveDatasetFromUrl(this)
    ),
    activeUrlElements: computed(() =>
      getActiveUrlElements(this.url)
    ),
  })
}

const MyStore = new Store()

// don't know why but combining this with last extend call
// creates an error in an autorun
// maybe needed actions are not part of Store yet?
extendObservable(
  MyStore,
  {
    manipulateUrl: autorun(
      `manipulateUrl`,
      () => manipulateUrl(MyStore)
    ),
    reactWhenUrlHasChanged: autorunAsync(
      `reactWhenUrlHasChanged`,
      () => {
        fetchDataForActiveUrlElements(MyStore)
      }
    ),
  }
)

export default MyStore
