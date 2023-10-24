/** @typedef {import('reactflow').Node<HttpNodeData>} Node */

import { useMultiPartFormHttp } from "./hook.multipartFrom-http";
import { MultiForm } from "./MultiForm";

/** @param {{ dataNode: Node }} props */
export const MultipartFormBodyHttp = ({ dataNode }) => {
  const { multipartFormData, debounceEvent, handleAddMultipartForm, handleDeleteMultiFormData } = useMultiPartFormHttp(dataNode);

  return (
    <>
      {multipartFormData.map((multiForm) => {
        const disableDeleteBtn = multipartFormData.length === 1;

        return (
          <MultiForm
            key={multiForm.id}
            debounceEvent={debounceEvent}
            disableDeleteBtn={disableDeleteBtn}
            handleDeleteMultiFormData={handleDeleteMultiFormData}
            multiForm={multiForm}
          />
        );
      })}

      <button onClick={handleAddMultipartForm} className="mt-4 pl-6 text-13 font-semibold text-teal-953">
        + Agregar variable
      </button>
    </>
  );
};
