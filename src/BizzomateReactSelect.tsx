import { ReactElement, useEffect, useState, createElement } from "react";
import Select, { MultiValue, PropsValue, SingleValue } from 'react-select';
import { GUID, ListAttributeValue, ListExpressionValue, ObjectItem, ValueStatus, ListValue } from "mendix";

import { BizzomateReactSelectContainerProps } from "../typings/BizzomateReactSelectProps";

import "./ui/BizzomateReactSelect.css";

interface MxOption {
    readonly value: GUID;
    readonly label: string | undefined;
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
    const optionIds = new Set(itemList.map(({ id }) => id));
    return options.filter(option => optionIds.has(option.value));
}

const notEmptyAndLoaded = (objectsDatasource: ListValue, assocCaption: ListExpressionValue<string>, disabledAttr: ListAttributeValue<boolean> | undefined): boolean => {
    if (!objectsDatasource?.items) {
        return false;
    } else {
        if (disabledAttr) {
            return objectsDatasource.items.some(i => assocCaption.get(i).status !== ValueStatus.Available) || objectsDatasource.items.some(i => disabledAttr.get(i).status !== ValueStatus.Available) ? false : true;
        } else {
            return !objectsDatasource.items.some(i => assocCaption.get(i).status !== ValueStatus.Available);
        }
    }
}

export function BizzomateReactSelect({
    linkedAssociation,
    objectsDatasource,
    assocCaption,
    disabledAttr,
    unstyled,
    placeholderText
}: BizzomateReactSelectContainerProps): ReactElement {

    const
        [options, setOptions] = useState<readonly MxOption[]>(),
        [value, setValue] = useState<PropsValue<MxOption>>(),
        [items, setItems] = useState<readonly ObjectItem[]>(),
        [disabled, setDisabled] = useState<boolean>(false),
        [clearable, setClearable] = useState<boolean>(true),
        [placeholder, setPlaceholder] = useState<string | undefined>();


    //Get the placeholder
    useEffect(() => {
        if (placeholderText?.value) {
            setPlaceholder(placeholderText.value);
        } else {
            setPlaceholder(undefined);
        }
    }, [placeholderText?.value])

    //Check if the item is editable
    useEffect(() => {
        setDisabled(!!linkedAssociation?.readOnly);
        setClearable(!linkedAssociation?.readOnly);
    }, [linkedAssociation?.readOnly])

    // Populate the options list when dataSource items change
    useEffect(() => {
        if (objectsDatasource.items && notEmptyAndLoaded(objectsDatasource, assocCaption, disabledAttr)) {
            setItems(objectsDatasource.items);
            setOptions(getOptionList(objectsDatasource.items, assocCaption, disabledAttr));
        } else {
            setItems([]);
            setOptions([]);
        }
    }, [objectsDatasource?.items, linkedAssociation.status, assocCaption, disabledAttr])

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
    }, [linkedAssociation?.value, options])

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
            const selected = new Set(newValue.map(({ value }) => value));
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
    const isMulti = linkedAssociation?.type == "ReferenceSet" ? true : undefined;
    return <Select
        options={options}
        value={value}
        isClearable={clearable}
        // @ts-ignore
        onChange={isMulti ? handleSetChange : handleChange}
        isMulti={isMulti}
        isDisabled={disabled}
        unstyled={unstyled}
        placeholder={placeholder && !disabled ? placeholder : null}
        className={unstyled ? 'mx-compound-control' : undefined}
        classNamePrefix="react-select"
        classNames={unstyled ? {
            control: () => 'form-control',
        } : undefined} />;
}
