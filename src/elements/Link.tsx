import {ReactNode, useState} from "react";
import {FaCheck, FaLink} from "react-icons/fa";
import ContextMenu, {AnchorPosition} from "./ContextMenu.tsx";

type IPropsLink = {
    raw: string
} | {
    element: {
        external_urls: {
            spotify: string
        }
    }
}

type IProps = IPropsLink & {
    children: ReactNode
}

export default function Link(props: IProps) {
    const [copySuccess, setCopySuccess] = useState(false);
    const [contextAnchor, setContextAnchor] = useState<AnchorPosition | undefined>(undefined);

    const link = ("raw" in props) ?
        props.raw :
        props.element.external_urls.spotify;


    return (
        <a href={link}
           target={'_blank'}
           onContextMenu={(event) => setContextAnchor({x: event.clientX, y: event.clientY})}
        >
            {props.children}

            {contextAnchor &&
                <ContextMenu closeCallback={() => setContextAnchor(undefined)} anchor={contextAnchor}>
                    <div className={'context-menu-button'} onClick={() => {
                        window.navigator.clipboard.writeText(link).then(() => {
                            setCopySuccess(true);
                            setTimeout(() => {
                                setContextAnchor(undefined);
                                setCopySuccess(false);
                            }, 1000);
                        });
                    }}>
                        {copySuccess ? <FaCheck/> : <FaLink/>} Copy Link
                    </div>
                </ContextMenu>
            }
        </a>
    );
}