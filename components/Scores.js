"use client";

const Scores = (props) => {
  const Num = ({ number }) => {
    let className = "inline-flex items-center justify-center w-4 rounded-md px-3.5 mx-0.5 py-2 text-xs font-medium ring-1 ring-inset ring-gray-500/10 ";

    if (number === 1) {
      className += "text-black bg-[#FFD700]";
    } else if (number === 2) {
      className += "text-black bg-gray-100";
    } else if (number === 3) {
      className += "text-black bg-[#CD7F32]";
    } else if (number === 4) {
      className += "text-black bg-gray-300";
    } else if (number >= 5 && number <= 8) {
      className += "text-white bg-gray-600";
    }

    return (
      <><div className={className}>
        {number}
      </div>&nbsp;</>

    );
  }

  return (
    <div className='flex py-3 pl-2 flex-wrap gap-y-2'>
      {props.last20.map((number, index) => (
        <Num key={index} number={number}></Num>
      ))}
    </div>);
}

export default Scores