import React from "react";
import Layout from "../layout/Layout";
import styled from "@emotion/styled";

const Load = styled.div`
  border: 5px solid rgba(0, 0, 0, 0.3);
  width: 7rem;
  height: 7rem;
  border-radius: 50%;
  border-left-color: #7d47ff;
  margin: 0 auto;
  margin-top: 10rem;
  animation: spin 1s ease infinite;

  @keyframes spin {
  0% {
    transform: rotate(0deg);
  }

  100% {
    transform: rotate(360deg);
  }
}
`;

const Spinner = () => {
  return (
    <Layout>
      <Load></Load>
    </Layout>
  )
}

export default Spinner