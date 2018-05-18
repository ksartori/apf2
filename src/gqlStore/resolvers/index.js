// @flow
import merge from 'lodash/merge'

import treeKey from './treeKey'
import urlQuery from './urlQuery'
import login from './login'
import updateAvailable from './updateAvailable'
import mapMouseCoordinates from './mapMouseCoordinates'
import copyingBiotop from './copyingBiotop'
import user from './user'

export default merge(
  treeKey,
  urlQuery,
  login,
  updateAvailable,
  mapMouseCoordinates,
  copyingBiotop,
  user,
)
