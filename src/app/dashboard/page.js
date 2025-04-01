"use client";
import React, { useEffect, useState, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";



import DomainForm from "./domain";
import DomainTable from "./domain/table";

import * as domainActions from "@/redux/domain/actions";

const Dashboard = () => {
  const initRef = useRef(null);
  const dispatch = useDispatch();

  const [deletingId, setDeletingId] = useState(null);

  const { getting, getDomain, adding } = useSelector((state) => state.domain);

  useEffect(() => {
    if (!initRef.current) {
      initRef.current = true;
      dispatch(domainActions.getAllDomains());
    }
  }, [dispatch]);

  const handleDomainSubmit = (value) => {
    let data = {
      domainName: value,
    };
    dispatch(domainActions.addDomain(data));
  };

  const handleDelete = (id) => {
    setDeletingId(id);
    dispatch(domainActions.deleteDomain(id));
  };

  // if (getting) {
  //   return <Loader />;
  // }

  return (
    <div className="dashboard_container">
      <DomainForm adding={adding} handleDomainSubmit={handleDomainSubmit} />
      <br />
      <>
        {getDomain?.length > 0 && (
          <DomainTable
            getDomain={getDomain}
            handleDelete={handleDelete}
            deletingId={deletingId}
          />
        )}
      </>
    </div>
  );
};

export default Dashboard;
