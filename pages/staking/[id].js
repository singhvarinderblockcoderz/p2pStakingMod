import React from "react";
import Staking from "../../Component/Staking";

const login = (props) => {
  return (
    <div>
      <Staking props={props}/>
    </div>
  );
};
export default login;

export function getServerSideProps(context) {
  const {query} = context;
  console.log(query,"to params")
  return{
    props:{
      userId:query.userId,
      id:query.id,
    }
  }
}