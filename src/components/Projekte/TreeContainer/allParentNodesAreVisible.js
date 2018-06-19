// @flow
import isEqual from 'lodash/isEqual'

export default (nodes: Array<Object>, nodeUrl: Array<String>): Boolean => {
  const nodesToUse = nodes.filter(n => !['user', 'userFolder'].includes(n.menuType))
  const parentNodesUrlArray = []
  /*
  let parentNodeUrl = [...nodeUrl]
  parentNodeUrl.pop()
  for (let i = 1; i <= parentNodeUrl.length; i++) {
    parentNodesUrlArray.push(parentNodeUrl.slice(0, i))
  }*/
  for (let i = 2; i <= nodeUrl.length; i++) {
    parentNodesUrlArray.push(nodeUrl.slice(0, i))
  }
  /*
  for (let i = 3; i <= nodeUrl.length; i++) {
    parentNodesUrlArray.push(nodeUrl.slice(0, i))
  }*/
  console.log('allParentNodesAreVisible:', {nodes,nodesToUse,nodeUrl,parentNodesUrlArray})
  // find all parent nodes
  // return false if one is not found
  let allParentNodesAreVisible = true
  parentNodesUrlArray.forEach(url => {
    const parentNode = nodesToUse.find(node => isEqual(node.url, url))
    if (!parentNode) {
      allParentNodesAreVisible = false
    }
  })
  return allParentNodesAreVisible
}
