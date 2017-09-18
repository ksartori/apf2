// @flow
import React from 'react'
import { observer, inject } from 'mobx-react'
import Dialog from 'material-ui/Dialog'
import FlatButton from 'material-ui/FlatButton'
import compose from 'recompose/compose'
import withHandlers from 'recompose/withHandlers'
import styled from 'styled-components'

const MessageContainer = styled.div`
  display: flex;
  justify-content: space-between;
  padding-bottom: ${props => (props.paddBottom ? '20px' : 0)};
`

const enhance = compose(
  inject('store'),
  withHandlers({
    onClickRead: props => message => props.store.messages.setRead(message),
  }),
  observer
)

const UserMessages = ({
  store,
  open,
  onClickRead,
}: {
  store: Object,
  open: boolean,
  onClickRead: () => {},
}) => {
  return (
    <Dialog
      title="Nachrichten von apflora:"
      open={store.messages.messages.length > 0}
      contentStyle={{
        maxWidth: window.innerWidth * 0.8,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
      }}
    >
      {store.messages.messages.sort(m => m.time).map((m, index) => {
        const paddBottom = index < store.messages.messages.length - 1
        return (
          <MessageContainer key={m.id} paddBottom={paddBottom}>
            <div>
              {m.message}
            </div>
            <FlatButton label="o.k." onTouchTap={() => onClickRead(m)} />
          </MessageContainer>
        )
      })}
    </Dialog>
  )
}

export default enhance(UserMessages)
