// @flow
import gql from 'graphql-tag'

import isNodeOpen from './isNodeOpen'

export default ({
  tree,
  node,
  client
}: {
  tree: Object,
  node: Object,
  client: Object
}) => {
  // make sure this node's url is not yet contained
  // otherwise same nodes will be added multiple times!
  if (isNodeOpen(tree.openNodes, node.url)) return

  const newOpenNodes = [...tree.openNodes, node.url]
  if (['tpopfeldkontr', 'tpopfreiwkontr'].includes(node.menuType)) {
    // automatically open zaehlFolder of tpopfeldkontr or tpopfreiwkontr
    newOpenNodes.push([...node.url, 'Zaehlungen'])
  }
  if (node.menuType === 'ziel') {
    // automatically open zielberFolder of ziel
    newOpenNodes.push([...node.url, 'Berichte'])
  }

  client.mutate({
    mutation: gql`
      mutation setTreeKey($value: Array!, $tree: String!, $key: String!) {
        setTreeKey(tree: $tree, key: $key, value: $value) @client {
          tree @client {
            openNodes
            __typename: Tree
          }
        }
      }
    `,
    variables: {
      value: newOpenNodes,
      tree: tree.name,
      key: 'openNodes'
    }
  })
}
