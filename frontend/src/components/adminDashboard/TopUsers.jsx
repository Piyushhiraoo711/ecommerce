import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { topUsers } from '../../slice/adminSlice';

const TopUsers = () => {

const dispatch = useDispatch();
const {topUser } = useSelector(state => state.admin)
    useEffect(()=>{dispatch(topUsers())},[dispatch])
  return (
<>
{
    console.log("top user", topUser)
}
</>
  )
}

export default TopUsers