import React from "react";

const Card = ({ title, value }) => {
  return (
    <>
      <div className="bg-white text-black  rounded-xl shadow p-6 w-full">
        <h2 className="font-bold text-sm">{title}</h2>
        <h1 className="text-3xl font-bold mt-2">{value}</h1>
      </div>
    </>
  );
};

export default Card;
