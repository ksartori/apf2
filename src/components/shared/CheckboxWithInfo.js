// @flow
import React from 'react'
import { observer } from 'mobx-react'
import { FormGroup, FormControlLabel } from 'material-ui/Form'
import Checkbox from 'material-ui/Checkbox'
import compose from 'recompose/compose'
import withHandlers from 'recompose/withHandlers'
import styled from 'styled-components'

import InfoWithPopover from './InfoWithPopover'
import Label from './Label'

const Container = styled.div`
  display: flex;
  justify-content: space-between;
  div:nth-of-type(2) {
    display: flex;
    flex-direction: column;
    justify-content: space-around;
  }
`
const StyledFormControlLabel = styled(FormControlLabel)`
  margin-top: -10px;
`

const enhance = compose(
  withHandlers({
    onCheck: ({ saveToDb }) => (e, val) => saveToDb(val),
  }),
  observer
)

const CheckboxWithInfo = ({
  value,
  label,
  onCheck,
  popover,
  saveToDb,
}: {
  value?: number | string,
  label: string,
  onCheck: () => void,
  popover: Object,
  saveToDb: () => void,
}) => (
  <Container>
    <FormGroup>
      <Label label={label} />
      <StyledFormControlLabel
        control={
          <Checkbox
            checked={value}
            onChange={onCheck}
            value={label}
            color="primary"
          />
        }
      />
    </FormGroup>
    <div>
      <InfoWithPopover>{popover}</InfoWithPopover>
    </div>
  </Container>
)

CheckboxWithInfo.defaultProps = {
  value: null,
}

export default enhance(CheckboxWithInfo)
