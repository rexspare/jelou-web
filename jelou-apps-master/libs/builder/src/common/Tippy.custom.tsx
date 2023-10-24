import Tippy from "@tippyjs/react";

type TippyWrapperProps = {
  content: string;
  children: JSX.Element;
};

export function TippyWrapper(props: TippyWrapperProps) {
  const { children, content } = props;
  return (
    <Tippy
      theme="jelou"
      // animation='shift-away'
      arrow
      content={content}>
      {children}
    </Tippy>
  );
}
