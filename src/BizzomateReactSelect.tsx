import {ReactElement, useEffect, useState, createElement} from "react";
import Select, {MultiValue, PropsValue, SingleValue} from 'react-select';
import {GUID, ListAttributeValue, ListExpressionValue, ListValue, ObjectItem, ValueStatus} from "mendix";

import {BizzomateReactSelectContainerProps} from "../typings/BizzomateReactSelectProps";

import "./ui/BizzomateReactSelect.css";

interface MxOption {
    readonly value: GUID;
    readonly label: string | undefined;
    readonly isFixed?: boolean;
    readonly isDisabled?: boolean;
}

const getOptionList = (items: readonly ObjectItem[], textTemplate: ListExpressionValue<string>, disabled: ListAttributeValue<boolean> | undefined) => {
    return items.map((item): MxOption => ({
        value: item.id,
        label: textTemplate.get(item).value,
        isDisabled: disabled ? disabled.get(item).value : undefined
    }));
}

const getSelectedSingle = (options: readonly MxOption[], item: ObjectItem) => {
    return options.filter(option => option.value == item.id);
}

const getSelectedMulti = (options: readonly MxOption[], itemList: ObjectItem[]) => {
    const optionIds = new Set(itemList.map(({id}) => id));
    return options.filter(option => optionIds.has(option.value));
}

const notEmptyAndLoaded = (objectsDatasource: ListValue, assocCaption: ListExpressionValue<string>): boolean => {
    return !!(objectsDatasource?.items && !objectsDatasource.items.some(i => assocCaption.get(i).status !== ValueStatus.Available))
}

export function BizzomateReactSelect({
                                         linkedAssociation,
                                         objectsDatasource,
                                         assocCaption,
                                         disabledAttr,
                                         unstyled
                                     }: BizzomateReactSelectContainerProps): ReactElement {

    const
        [options, setOptions] = useState<readonly MxOption[]>(),
        [value, setValue] = useState<PropsValue<MxOption>>(),
        [items, setItems] = useState<readonly ObjectItem[]>(),
        [disabled, setDisabled] = useState<boolean>(false),
        [clearable, setClearable] = useState<boolean>(true);

    //Check if the item is editable
    useEffect(() => {
        setDisabled(!!linkedAssociation?.readOnly);
        setClearable(!linkedAssociation?.readOnly);
    }, [linkedAssociation?.readOnly])

    // Populate the options list when dataSource items change
    useEffect(() => {
        if (notEmptyAndLoaded(objectsDatasource, assocCaption)) {
            setItems(objectsDatasource?.items);
            // @ts-ignore TODO had geen zin om deze te fixen :)
            setOptions(getOptionList(objectsDatasource.items, assocCaption, disabledAttr));
        } else {
            setItems([]); // TODO heb deze even hier gezet om rerenders te voorkomen maar kijk maar of dat ook daadwerkelijk nodig is
            setOptions([]);
        }
    }, [objectsDatasource?.items?.map(item => assocCaption.get(item).status)])

    //Keep the selected items in sync with assoc in Mx
    useEffect(() => {
        if (linkedAssociation?.value && options) {
            if (linkedAssociation?.type == "ReferenceSet") {
                setValue(getSelectedMulti(options, linkedAssociation.value))
            } else {
                setValue(getSelectedSingle(options, linkedAssociation.value))
            }
        } else {
            setValue([]);
        }
    }, [linkedAssociation?.value])

    /*
    Handle changes done in the react-select widget and send the updates back to Mx
    */
    const handleSetChange = (newValue: MultiValue<MxOption>) => {

        //Update the UI
        setValue(newValue);

        //Update the assoc in Mx
        if (!newValue || newValue.length == 0 || linkedAssociation?.type !== "ReferenceSet") {
            linkedAssociation?.setValue(undefined);
        } else {
            const selected = new Set(newValue.map(({value}) => value));
            linkedAssociation.setValue(items?.filter(item => selected.has(item.id)));
        }
    }

    const handleChange = (newValue: SingleValue<MxOption>) => {
        //Update the UI
        setValue(newValue);

        //Update the assoc in Mx
        if (!newValue || linkedAssociation?.type !== "Reference") {
            linkedAssociation?.setValue(undefined);
        } else {
            linkedAssociation.setValue(items?.find(item => item.id == newValue.value));
        }
    }

    /*
    Render the actual react-select widget
    */
    if (linkedAssociation?.type == "ReferenceSet") {
        return <Select
            options={options}
            value={value}
            isClearable={clearable}
            onChange={handleSetChange}
            isMulti
            isDisabled={disabled}
            unstyled={unstyled}
            classNamePrefix="react-select"/>;
    }
    return <Select
        options={options}
        value={value}
        isClearable={clearable}
        onChange={handleChange}
        isDisabled={disabled}
        unstyled={unstyled}
        classNamePrefix="react-select"/>;
}
