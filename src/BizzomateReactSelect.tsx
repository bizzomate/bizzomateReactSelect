import { ReactElement, createElement, useState, useEffect } from "react";
import Select, { PropsValue, MultiValue, SingleValue } from 'react-select';
import { ObjectItem, ListExpressionValue, GUID } from "mendix";

import { BizzomateReactSelectContainerProps } from "../typings/BizzomateReactSelectProps";

import "./ui/BizzomateReactSelect.css";

interface MxOption {
    readonly value: GUID;
    readonly label: string | undefined;
    readonly isFixed?: boolean;
    readonly isDisabled?: boolean;
}

const getOptionList = (items: readonly ObjectItem[], textTemplate: ListExpressionValue<string>) => {
    return items.map((item): MxOption => ({
        value: item.id,
        label: textTemplate.get(item).value
    }));
}

const getSelectedSingle = (options: readonly MxOption[], item: ObjectItem) => {
    return options.filter(option => option.value == item.id);
}

const getSelectedMulti = (options: readonly MxOption[], itemList: ObjectItem[]) => {
    const optionIds = new Set(itemList.map(({ id }) => id));
    return options.filter(option => optionIds.has(option.value));
}

export function BizzomateReactSelect(props: BizzomateReactSelectContainerProps): ReactElement {

    const
        [options, setOptions] = useState<readonly MxOption[]>(),
        [value, setValue] = useState<PropsValue<MxOption>>(),
        [items, setItems] =useState<readonly ObjectItem[]>();

    //Populate the options list when dataSource items change
    useEffect(() => {
        setItems(props.objectsDatasource?.items);
        if (props.objectsDatasource?.items && props.assocCaption) {
            setOptions(getOptionList(props.objectsDatasource.items, props.assocCaption));
        } else {
            setOptions([]);
        }
    }, [props.objectsDatasource?.items]);


    //Keep the selected items in sync with assoc in Mx
    useEffect(() => {
        if (props.linkedAssociation?.value && options) {
            if (props.linkedAssociation?.type == "ReferenceSet") {
                setValue(getSelectedMulti(options, props.linkedAssociation.value))
            } else {
                setValue(getSelectedSingle(options, props.linkedAssociation.value))
            }
        } else {
            setValue([]);
        }
    }, [props.linkedAssociation?.value])


    /*
    Handle changes done in the react-select widget and send the updates back to Mx
    */
    const handleSetChange = (newValue: MultiValue<MxOption>) => {

        //Update the UI
        setValue(newValue);

        //Update the assoc in Mx
        if (!newValue || newValue.length == 0 || props.linkedAssociation?.type !== "ReferenceSet") {
            props.linkedAssociation?.setValue(undefined);
        } else {
            const selected = new Set(newValue.map(({value}) => value));
            props.linkedAssociation.setValue(items?.filter(item => selected.has(item.id))); 
        } 
    }

    const handleChange = (newValue: SingleValue<MxOption>) => {
        //Update the UI
        setValue(newValue);

        //Update the assoc in Mx
        if (!newValue || props.linkedAssociation?.type !== "Reference" ) {
            props.linkedAssociation?.setValue(undefined);
        } else {
            props.linkedAssociation.setValue(items?.find(item => item.id == newValue.value));
        } 
    }

    /*
    Render the actual react-select widget
    */
    if (props.linkedAssociation?.type == "ReferenceSet") {
        return <Select
            options={options}
            value={value}
            isClearable
            onChange={handleSetChange}
            isMulti
            classNamePrefix="react-select" />;
    }
    return <Select
        options={options}
        value={value}
        isClearable
        onChange={handleChange}
        classNamePrefix="react-select" />;
}