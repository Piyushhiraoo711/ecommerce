import React, { useEffect } from "react";
import Card from "../card/Card";
import { useDispatch, useSelector } from "react-redux";
import { fetchAdminDashboard } from "../../slice/adminSlice";

const AdminDashboard = () => {
  const dispatch = useDispatch();
  const {dashboard, error} = useSelector(state => state.admin);


  useEffect(()=>{
    dispatch(fetchAdminDashboard());
  },[dispatch])
  
  return (
    <>
    {
      console.log("dashboard", dashboard)
    }
    
    </>
  );
};

export default AdminDashboard;
