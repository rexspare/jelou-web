import { RenderImg } from "../Image/RenderImg";

/**
 * @param {{block: FileBlock}} props
 */
export const DocsBlock = ({ block }) => {
  const { name, url } = block;

  return (
    <div aria-label="mediaBlock" className="w-full overflow-hidden shadow-nodo rounded-10">
      <RenderImg url={url} isImageRender={false} type="file" />
      {name && <p className="w-full p-3 text-gray-400 break-words bg-white text-13">{name}</p>}
    </div>
  );
};
