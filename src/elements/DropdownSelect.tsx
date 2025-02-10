import {useState} from "react";
import { FaAngleRight} from "react-icons/fa";


type ValidOptionValue = string | number;

type Option<T extends ValidOptionValue> = {
    label: string;
    value: T;
}

type IProps<T extends ValidOptionValue> = {
    options: Option<T>[];
    selected?: T;
    onChange: (value: T) => void;
}

export default function DropdownSelect<T extends ValidOptionValue>(props: IProps<T>) {
    const [isOpened, setIsOpened] = useState(false);

    const activeOption: Option<T>|undefined = props.selected ?
        props.options.find(o => o.value === props.selected) : props.options[0];

    return <div className={'dropdown-select'}>

        <div className={`dropdown-select-active ${isOpened ? 'opened' : ''}`}
            onClick={() => setIsOpened(!isOpened)}
        >
            <FaAngleRight />
            {activeOption?.label}
        </div>

        <div className={`dropdown-select-options ${isOpened ? 'show' : ''}`}>
            {props.options.map(option =>
                <div key={option.value}
                     className={'dropdown-select-option'}
                     onClick={() => {
                         setIsOpened(false);
                         props.onChange(option.value);
                     }}
                >
                    {option.label}
                </div>
            )}
        </div>

    </div>
}