import { useContext } from "react"
import Empty from "./Empty"
import StatusFile from "./StatusFile"
import { DataManagmentContext } from "../../context/DataManagmentContext"

const StatusBodyContainer = ({ formatFileName }) =>{
  const {
    dataImportFile
  } = useContext(DataManagmentContext)
  return (
    <div className="w-full flex flex-col items-center px-10 overflow-y-scroll">
    { dataImportFile.length > 0 ?
      dataImportFile.map(({file_name,processed_rows,total_rows, status}) =>
        <StatusFile
          file_name={file_name}
          processed_rows={processed_rows}
          total_rows={total_rows}
          status={status}
          formatFileName={formatFileName}
        />
      )
    :
      <Empty />
    }
  </div>
  )
}

export default StatusBodyContainer
