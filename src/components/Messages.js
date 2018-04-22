// @flow
import React from 'react'
import { observer, inject } from 'mobx-react'
import Dialog from 'material-ui/Dialog'
import Button from 'material-ui-next/Button'
import compose from 'recompose/compose'
import withHandlers from 'recompose/withHandlers'
import styled from 'styled-components'

import ErrorBoundary from './shared/ErrorBoundary'

const StyledDialog = styled(Dialog)`
  > div > div > div > div {
    overflow: auto !important;
  }
`
const MessageContainer = styled.div`
  display: flex;
  justify-content: space-between;
  padding-bottom: ${props => (props.paddBottom ? '20px' : 0)};
`
const AllOkButton = styled(Button)`
  position: absolute !important;
  top: 25px;
  right: 25px;
`

const enhance = compose(
  inject('store'),
  withHandlers({
    onClickRead: props => message => props.store.messages.setRead(message),
    onClickReadAll: props => () => {
      const { messages, setRead } = props.store.messages
      messages.forEach(message => setRead(message))
    },
  }),
  observer
)

const UserMessages = ({
  store,
  open,
  onClickRead,
  onClickReadAll,
}: {
  store: Object,
  open: boolean,
  onClickRead: () => {},
  onClickReadAll: () => {},
}) => {
  return (
    <ErrorBoundary>
      <StyledDialog
        title="Letzte Anpassungen:"
        open={store.messages.messages.length > 0 && !!store.user.name}
        contentStyle={{
          maxWidth: window.innerWidth * 0.8,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
        }}
      >
        <div>
          <AllOkButton onClick={onClickReadAll}>alle o.k.</AllOkButton>
          {store.messages.messages.sort(m => m.time).map((m, index) => {
            const paddBottom = index < store.messages.messages.length - 1
            return (
              <MessageContainer key={m.id} paddBottom={paddBottom}>
                <div>{m.message}</div>
                <Button onClick={() => onClickRead(m)}>o.k.</Button>
              </MessageContainer>
            )
          })}
        </div>
      </StyledDialog>
    </ErrorBoundary>
  )
}

export default enhance(UserMessages)
