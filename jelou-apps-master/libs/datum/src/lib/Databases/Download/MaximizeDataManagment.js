import { useContext, useState } from "react";
import { DataManagmentContext } from "../../context/DataManagmentContext";
import HeaderWidget from "./HeaderWidget";
import OptionsTypes from "./OptionsTypes";
import StatusBodyContainer from "./StatusBodyContainer";
import FooterWidget from "./FooterWidget";

const options = {
  IMPORTS: "IMPORTS",
  DOWNLOADS: "DOWNLOADS"
}

const MaximizeDataManagment = () => {
  const [currentOption, setCurrentOption] = useState(options.IMPORTS);

  const handleOptions = (type) => {
    setCurrentOption(type)
  }

  const formatFileName = (name) =>{
    const split = name.split("-");
    return `${split[0]}.xlsx`
  }

  return (
    <div className="flex flex-col h-[55vh] w-[24vw] bg-white rounded-10 border-transparent shadow-menu rounded-b-none overflow-hidden">
      <HeaderWidget />
      <OptionsTypes
        handleOptions={handleOptions}
        currentOption={currentOption}
        options={options}
      />
      <StatusBodyContainer formatFileName={formatFileName} />
      <FooterWidget />
    </div>
  )
}

export default MaximizeDataManagment;
