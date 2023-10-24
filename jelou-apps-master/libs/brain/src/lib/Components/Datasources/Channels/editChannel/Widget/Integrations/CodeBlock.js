import Prism from "prismjs";
import { useEffect, useRef } from "react";

const CodeBlock = ({ language, code }) => {
    const codeRef = useRef();

    useEffect(() => {
        Prism.highlightElement(codeRef.current);
    }, []);

    return (
        <pre className="h-auto w-auto">
            <code ref={codeRef} className={`language-${language}`}>
                {code}
            </code>
        </pre>
    );
};

export default CodeBlock;
