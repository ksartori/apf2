// @flow
import React, { Fragment } from 'react'
import { ContextMenu, MenuItem } from 'react-contextmenu'
import { inject } from 'mobx-react'
import compose from 'recompose/compose'
import withState from 'recompose/withState'
import withHandlers from 'recompose/withHandlers'

import ErrorBoundary from '../../../shared/ErrorBoundary'
import userIsReadOnly from '../../../../modules/userIsReadOnly'

const enhance = compose(
  inject('store'),
  withState('label', 'changeLabel', ''),
  withHandlers({
    // according to https://github.com/vkbansal/react-contextmenu/issues/65
    // this is how to pass data from ContextMenuTrigger to ContextMenu
    onShow: props => event => props.changeLabel(event.detail.data.nodeLabel),
  })
)

const Tpopmassn = ({
  store,
  tree,
  onClick,
  changeLabel,
  label,
  onShow,
}: {
  store: Object,
  tree: Object,
  onClick: () => void,
  changeLabel: () => void,
  label: string | number,
  onShow: () => void,
}) => (
  <ErrorBoundary>
    <ContextMenu
      id={`${tree.name}tpopmassn`}
      collect={props => props}
      onShow={onShow}
    >
      <div className="react-contextmenu-title">Massnahme</div>
      {
        !userIsReadOnly(store.user.token) &&
        <Fragment>
          <MenuItem
            onClick={onClick}
            data={{
              action: 'insert',
              table: 'tpopmassn',
            }}
          >
            erstelle neue
          </MenuItem>
          <MenuItem
            onClick={onClick}
            data={{
              action: 'delete',
              table: 'tpopmassn',
            }}
          >
            lösche
          </MenuItem>
          <MenuItem
            onClick={onClick}
            data={{
              action: 'markForMoving',
              table: 'tpopmassn',
            }}
          >
            verschiebe
          </MenuItem>
          <MenuItem
            onClick={onClick}
            data={{
              action: 'markForCopying',
              table: 'tpopmassn',
            }}
          >
            kopiere
          </MenuItem>
          {store.copying.table && (
            <MenuItem
              onClick={onClick}
              data={{
                action: 'resetCopying',
              }}
            >
              Kopieren aufheben
            </MenuItem>
          )}
        </Fragment>
      }
    </ContextMenu>
  </ErrorBoundary>
)

export default enhance(Tpopmassn)
