import { useContext, useState } from "react";
import MinimizeDataManagment from "./MinimizeDataManagment";
import MaximizeDataManagment from "./MaximizeDataManagment";
import { DataManagmentContext } from "../../context/DataManagmentContext";

const DownloadPanel = () => {
  const { openPanel } = useContext(DataManagmentContext)

  return (
    <div className="absolute bottom-0 right-0 mr-12">
      { openPanel ? <MaximizeDataManagment />: <MinimizeDataManagment />}
    </div>
  )
}

export default DownloadPanel
