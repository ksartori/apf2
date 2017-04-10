// @flow
import React from 'react'
import styled from 'styled-components'

import TestdataMessage from './TestdataMessage'

const Container = styled.div`
  background-color: #424242;
  padding-bottom: 10px;
`
const Title = styled.div`
  padding: 10px 10px 0 10px;
  color: #b3b3b3;
  font-weight: bold;
`

const FormTitle = (
  {
    tree,
    title,
    noTestdataMessage = false,
  }:
  {
    tree: Object,
    title: string,
    noTestdataMessage?: boolean,
  }
) =>
  <Container>
    <Title>
      {title}
    </Title>
    {
      !noTestdataMessage &&
      <TestdataMessage tree={tree} />
    }
  </Container>

export default FormTitle
