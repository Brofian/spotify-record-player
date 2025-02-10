import {ReactNode, useEffect, useRef} from "react";
import {createPortal} from "react-dom";

type IProps = {
    closeCallback: { (): void },
    children: ReactNode,
    anchor: {x: number, y: number},
}

export default function ContextMenu(props: IProps) {
    const contextMenuRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        const handler = (event: MouseEvent) => {
            if (!contextMenuRef.current) {
                return;
            }
            if (event.target && !contextMenuRef.current.contains(event.target as Node)) {
                props.closeCallback();
            }
        };
        // the key is using the `true` option
        // `true` will enable the `capture` phase of event handling by browser
        document.addEventListener("click", handler, true);
        return () => {
            document.removeEventListener("click", handler);
        };
    }, [props]);

    return createPortal(
        <div className={'context-menu'}
             ref={contextMenuRef}
             style={{
                 left: props.anchor.x,
                 top: props.anchor.y,
             }}
        >
            {props.children}
        </div>
        ,
        document.getElementById("root") || document.body
        );
}