import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import { connect } from 'react-redux'

import {getIcon, rowsToGraph} from '../../util/parse'
import { SearchInput } from '../UI/search-input'
import {selectFilter, setSearchTerm, updateGraph} from '../Redux/actions'

const Container = styled.div`
  font-family: 'Lato', sans-serif;
  user-select: none;
`

const Title = styled.div`
  text-transform: uppercase;
  font-weight: bold;
  font-size: 14px;
  color: #858383;
`

const Dot = styled.div`
  color: #eb5757;
  font-size: 28px;
  transform: translateY(3px);
  display: inline-block;
  font-weight: bold;
`

const PatientContainer = styled.div`
  display: grid;
  grid-template-columns: 20% 80%;
  height: 10vh;
  padding: 15px;
  padding-left: 0;
  user-select: text;
`

const Image = styled.img`
  height: 90%;
`

const Name = styled.div`
  display: flex;
  align-items: center;
  font-size: 40px;
`

function Header({ patient, setSearchTerm, selectFilter, updateGraph }) {
  const [removeLeafNode, toggleRemoveLeafNode] = useState(false)
  const onSearch = (term) => {
  let _serchTerm = term.toUpperCase().replace(/P/g, "").trim();
    setSearchTerm(parseInt(_serchTerm))

  }

  useEffect(() => {
    fetch('https://api.rootnet.in/covid19-in/unofficial/covid19india.org', {
        cors: 'no-cors',
        method: 'GET',
        redirect: 'follow',
    })
      .then(resp => resp.json())
      .then(res => {
          updateGraph(rowsToGraph(res.data.rawPatientData, removeLeafNode))
          selectFilter('P2P')
      })
      .catch(err => console.log('error', err))
  }, [removeLeafNode])

  const onChecked = (isEdgeNodeFilterChecked) => {
      toggleRemoveLeafNode(isEdgeNodeFilterChecked)
  }

  const { patientId } = patient

  return (
    <Container>
      <Title>
        covid19india.org Tracker Live <Dot>&nbsp;&middot;&nbsp;</Dot> 2H ago
      </Title>
      <SearchInput searchTerm={onSearch} edgeNodeFilter={onChecked} />
      <PatientContainer>
        <Image src={getIcon(patient)} />
        <Name>P {patientId.toString().substring(2)}</Name>
      </PatientContainer>
    </Container>
  )
}

export default connect(null, {
  setSearchTerm, updateGraph, selectFilter
})(Header)
