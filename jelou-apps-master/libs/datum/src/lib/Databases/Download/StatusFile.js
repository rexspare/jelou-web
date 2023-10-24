import { CheckCircleIconPrimary } from "@apps/shared/icons";
import ExcelIcon from "../Illustrations/ExcelIcon";
import { useContext } from "react";
import { DataManagmentContext } from "../../context/DataManagmentContext";


const statusType = {
  COMPLETED: "completed",
  PENDING: "pending",
  ERROR: "error"
}

const StatusFile = ({file_name,processed_rows,total_rows, status, formatFileName}) => {
  const {
    calculatingPorcentage,
    calculateTimeEstimate,
  } = useContext(DataManagmentContext);
  return (
    <>
      <div key={file_name} className="w-full flex flex-row justify-around items-center border-b-gray-border border-1 border-transparent">
            <ExcelIcon className="scale-50"/>
            <div className="flex flex-col w-[75%]">
              <span className={`font-bold break-words  ${processed_rows === total_rows ? 'text-primary-200' : 'text-gray-400'} text-sm`}>{formatFileName(file_name)}</span>
              {status !== statusType.COMPLETED &&
                 <>
                    <div className="flex w-full my-1 mr-2 overflow-hidden rounded-default text-xs" style={{ height: "7px", backgroundColor: "#f2f2f2" }}>
                      <div style={{ width: `${calculatingPorcentage(processed_rows,total_rows)}%` }} className="flex flex-col justify-center whitespace-nowrap rounded-default bg-primary-200 text-center text-white shadow-none"></div>
                    </div>
                    <span className="font-medium text-[#B0B6C2] text-10">{calculateTimeEstimate(processed_rows,total_rows)}</span>
                  </>
              }
            </div>
            { status === statusType.COMPLETED &&
              <CheckCircleIconPrimary className="w-full" width="1.5rem" height="1.5rem" fill="none"/>
            }
          </div>
    </>
  )
}

export default StatusFile;
