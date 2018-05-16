// @flow
import React from 'react'
import { toJS } from 'mobx'
import { observer, inject } from 'mobx-react'
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import Typography from '@material-ui/core/Typography'
import IconButton from '@material-ui/core/IconButton'
import Menu from '@material-ui/core/Menu'
import MenuItem from '@material-ui/core/MenuItem'
import Button from '@material-ui/core/Button'
import MoreVertIcon from '@material-ui/icons/MoreVert'
import clone from 'lodash/clone'
import remove from 'lodash/remove'
import styled from 'styled-components'
import compose from 'recompose/compose'
import withState from 'recompose/withState'
import withHandlers from 'recompose/withHandlers'
import shouldUpdate from 'recompose/shouldUpdate'

import isMobilePhone from '../modules/isMobilePhone'
import ErrorBoundary from './shared/ErrorBoundary'

const StyledAppBar = styled(AppBar)`
  @media print {
    display: none !important;
  }
`
const StyledToolbar = styled(Toolbar)`
  justify-content: space-between;
`
const StyledButton = styled(Button)`
  color: ${props =>
    props['data-visible']
      ? 'rgb(255, 255, 255) !important'
      : 'rgba(255, 255, 255, 0.298039) !important'};
`
const MenuDiv = styled.div`
  display: flex;
  flex-wrap: wrap;
`
const StyledMoreVertIcon = styled(MoreVertIcon)`
  color: white !important;
`

/**
 * checking props change according to
 * https://marmelab.com/blog/2017/02/06/react-is-slow-react-is-fast.html
 */
const checkPropsChange = (props, nextProps) =>
  toJS(nextProps.store.urlQuery.projekteTabs).join() !==
    toJS(props.store.urlQuery.projekteTabs).join() ||
  nextProps.store.user.name !== props.store.user.name

const enhance = compose(
  inject('store'),
  shouldUpdate(checkPropsChange),
  withState('anchorEl', 'setAnchorEl', null),
  withHandlers({
    onClickButton: props => name => {
      const { store } = props
      const projekteTabs = clone(toJS(store.urlQuery.projekteTabs))
      if (isMobilePhone()) {
        // show one tab only
        store.setUrlQueryValue('projekteTabs', [name])
      } else {
        const exporteIsVisible = projekteTabs.includes('exporte')
        const isVisible = projekteTabs.includes(name)
        if (isVisible) {
          if (name === 'daten' && exporteIsVisible) {
            remove(projekteTabs, el => el === 'exporte')
          } else {
            remove(projekteTabs, el => el === name)
          }
        } else {
          projekteTabs.push(name)
          if (name === 'tree2') {
            store.tree.cloneActiveNodeArrayToTree2()
          }
          if (name === 'daten' && exporteIsVisible) {
            // need to remove exporte
            // because exporte replaces daten
            remove(projekteTabs, el => el === 'exporte')
          }
        }
        store.setUrlQueryValue('projekteTabs', projekteTabs)
      }
    },
    watchVideos: ({ setAnchorEl }) => () => {
      setAnchorEl(null)
      window.open(
        'https://www.youtube.com/playlist?list=PLTz8Xt5SOQPS-dbvpJ_DrB4-o3k3yj09J'
      )
    },
    showDeletedDatasets: ({ setAnchorEl, store }) => () => {
      setAnchorEl(null)
      store.toggleShowDeletedDatasets()
    },
  }),
  withHandlers({
    onClickButtonStrukturbaum: ({ onClickButton }) => () =>
      onClickButton('tree'),
    onClickButtonStrukturbaum2: ({ onClickButton }) => () =>
      onClickButton('tree2'),
    onClickButtonDaten: ({ onClickButton }) => () => onClickButton('daten'),
    onClickButtonDaten2: ({ onClickButton }) => () => onClickButton('daten2'),
    onClickButtonKarte: ({ onClickButton }) => () => onClickButton('karte'),
    onClickButtonExporte: ({ onClickButton, setAnchorEl }) => () => {
      setAnchorEl(null)
      onClickButton('exporte')
    },
  }),
  observer
)

const MyAppBar = ({
  store,
  onClickButtonStrukturbaum,
  onClickButtonStrukturbaum2,
  onClickButtonDaten,
  onClickButtonDaten2,
  onClickButtonKarte,
  onClickButtonExporte,
  showDeletedDatasets,
  watchVideos,
  anchorEl,
  setAnchorEl,
}: {
  store: Object,
  onClickButton: () => void,
  onClickButtonStrukturbaum: () => void,
  onClickButtonStrukturbaum2: () => void,
  onClickButtonDaten: () => void,
  onClickButtonDaten2: () => void,
  onClickButtonKarte: () => void,
  onClickButtonExporte: () => void,
  showDeletedDatasets: () => void,
  watchVideos: () => void,
  anchorEl: Object,
  setAnchorEl: () => void,
}) => {
  const projekteTabs = store.urlQuery.projekteTabs
  const treeIsVisible = projekteTabs.includes('tree')
  const tree2IsVisible = projekteTabs.includes('tree2')
  const datenIsVisible =
    projekteTabs.includes('daten') && !projekteTabs.includes('exporte')
  const daten2IsVisible =
    projekteTabs.includes('daten2') && !projekteTabs.includes('exporte')
  const karteIsVisible = projekteTabs.includes('karte')
  const exporteIsVisible = projekteTabs.includes('exporte')
  const exporteIsActive = !!store.tree.activeNodes.projekt
  const isMobile = isMobilePhone()

  return (
    <ErrorBoundary>
      <StyledAppBar position="static">
        <StyledToolbar>
          <Typography variant="title" color="inherit">
            {isMobile ? '' : 'AP Flora'}
          </Typography>
          <MenuDiv>
            <StyledButton
              data-visible={treeIsVisible}
              onClick={onClickButtonStrukturbaum}
            >
              Strukturbaum
            </StyledButton>
            <StyledButton
              data-visible={datenIsVisible}
              onClick={onClickButtonDaten}
            >
              Daten
            </StyledButton>
            {!isMobile && (
              <StyledButton
                data-visible={tree2IsVisible}
                onClick={onClickButtonStrukturbaum2}
              >
                Strukturbaum 2
              </StyledButton>
            )}
            {!isMobile && (
              <StyledButton
                data-visible={daten2IsVisible}
                onClick={onClickButtonDaten2}
              >
                Daten 2
              </StyledButton>
            )}
            <StyledButton
              data-visible={karteIsVisible}
              onClick={onClickButtonKarte}
            >
              Karte
            </StyledButton>
            {!isMobile &&
              exporteIsActive && (
                <StyledButton
                  data-visible={exporteIsVisible}
                  onClick={onClickButtonExporte}
                >
                  Exporte
                </StyledButton>
              )}

            <div>
              <IconButton
                aria-label="Mehr"
                aria-owns={anchorEl ? 'long-menu' : null}
                aria-haspopup="true"
                onClick={event => setAnchorEl(event.currentTarget)}
              >
                <StyledMoreVertIcon />
              </IconButton>
              <Menu
                id="long-menu"
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={() => setAnchorEl(null)}
              >
                {isMobile &&
                  exporteIsActive && (
                    <MenuItem
                      onClick={onClickButtonExporte}
                      disabled={exporteIsVisible}
                    >
                      Exporte
                    </MenuItem>
                  )}
                <MenuItem
                  onClick={showDeletedDatasets}
                  disabled={store.deletedDatasets.length === 0}
                >
                  gelöschte Datensätze wiederherstellen
                </MenuItem>
                <MenuItem onClick={watchVideos}>Video-Anleitungen</MenuItem>
                <MenuItem
                  onClick={() => {
                    setAnchorEl(null)
                    store.logout()
                  }}
                >{`${store.user.name} abmelden`}</MenuItem>
              </Menu>
            </div>
          </MenuDiv>
        </StyledToolbar>
      </StyledAppBar>
    </ErrorBoundary>
  )
}

export default enhance(MyAppBar)
