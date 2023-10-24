import { useState } from "react";

import { EmptyPictureIcon, SpinnerIcon } from "../../../../../Icons";

export const UploadFile = () => {
  const [isDragOverActive, setDragOverActive] = useState(false);
  const [loading, setLoading] = useState(false);
  const [, setDocPreview] = useState(null);

  const handleDropImage = (evt) => {
    evt.preventDefault();
    evt.stopPropagation();

    setDragOverActive(false);
    setLoading(true);

    const file = evt.dataTransfer.files[0];

    if (!file) return;

    const url = URL.createObjectURL(file);
    setDocPreview({ ...file, url });
  };

  const handleChangeDropState = (value) => () => setDragOverActive(value);

  if (loading) {
    return (
      <section className="w-full h-full py-3 px-7">
        <div className="grid w-full h-32 place-content-center">
          <span className="text-primary-200">
            <SpinnerIcon width={36} heigth={36} />
          </span>
        </div>
      </section>
    );
  }

  return (
    <section className="w-full h-full py-3 px-7">
      <div
        onDrop={handleDropImage}
        onDragOver={handleChangeDropState(true)}
        onDragLeave={handleChangeDropState(false)}
        className={`anim grid h-full w-full  place-content-center gap-5 rounded-12 border-1 ${
          isDragOverActive ? "border-primary-200" : "border-gray-330"
        }`}>
        <div className="grid h-32 text-gray-230 place-content-center">
          <span className="onDragOverAnimationFile"></span>
          <EmptyPictureIcon />
        </div>
        <p className="font-semibold text-center text-gray-400 w-52">Arrastra tu documento aquí para empezar a cargar</p>
      </div>
    </section>
  );
};
