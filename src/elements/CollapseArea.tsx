import {ReactNode, useState} from "react";
import {FaAngleDown, FaAngleUp} from "react-icons/fa";

type IProps = {
    children: ReactNode;
}

export default function CollapseArea(props: IProps) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className={`collapse-area ${isOpen ? 'show' : ''}`}>
            <div className={'collapse-container'}>
                {props.children}
            </div>

            <div className={'collapse-handle'} onClick={() => setIsOpen(!isOpen)}>
                {isOpen ? <FaAngleUp/> : <FaAngleDown/>}
            </div>
        </div>
    );
}