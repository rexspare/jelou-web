
import { components } from "react-select";

export function OptionCustom(props) {
  const { innerProps, innerRef, data } = props;
  return (
      <div ref={innerRef} {...innerProps} className="flex cursor-pointer flex-row items-center gap-4 p-4">
          <div className="h-[2.73438rem] w-[2.73438rem] overflow-hidden rounded-full">
              <img src={data.picture.data.url} alt={data?.name} />
          </div>
          <span className="text-base font-normal text-gray-610">{data?.name}</span>
      </div>
  );
}

export function Control({ children, ...props }) {
  const { value } = props.selectProps;
  return (
      <components.Control {...props}>
          <div className={`flex w-full flex-row ${!value && "py-2"} items-center gap-2`}>
              {value && (
                  <div className="w-[2.73438rem] overflow-hidden rounded-full">
                      <img className="scale-75  rounded-full" src={value?.picture?.data?.url} alt={value?.name} />
                  </div>
              )}
              {children}
          </div>
      </components.Control>
  );
}

export const InputCustom = ({ children, ...props }) => {
  if (!props.isHidden) {
      return <components.Input {...props} />;
  }
  return (
      <components.Input style={{ display: "none" }} {...props}>
          {children}
      </components.Input>
  );
};
