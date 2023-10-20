import { ReactElement, useEffect, useState, createElement, Fragment } from "react";
import Select, { MultiValue, PropsValue, SingleValue } from "react-select";
import { GUID, ListAttributeValue, ListExpressionValue, ObjectItem, ValueStatus, ListValue } from "mendix";

import { BizzomateReactSelectContainerProps } from "../typings/BizzomateReactSelectProps";
import { Alert } from "./components/Alert";

import "./ui/BizzomateReactSelect.css";

interface MxOption {
    readonly value: GUID;
    readonly label: string | undefined;
    readonly searchlabel: string | undefined;
    readonly isDisabled?: boolean;
}

const getOptionList = (
    items: readonly ObjectItem[],
    assocCaption: ListExpressionValue<string>,
    searchCaption: ListExpressionValue<string> | undefined,
    disabled: ListAttributeValue<boolean> | undefined
): MxOption[] => {
    return items.map(
        (item): MxOption => ({
            value: item.id,
            label: assocCaption.get(item).value,
            searchlabel: searchCaption ? searchCaption.get(item).value : undefined,
            isDisabled: disabled ? disabled.get(item).value : undefined
        })
    );
};

const getSelectedSingle = (options: readonly MxOption[], item: ObjectItem): MxOption[] => {
    return options.filter(option => option.value === item.id);
};

const getSelectedMulti = (options: readonly MxOption[], itemList: ObjectItem[]): MxOption[] => {
    const optionIds = new Set(itemList.map(({ id }) => id));
    return options.filter(option => optionIds.has(option.value));
};

const notEmptyAndLoaded = (
    objectsDatasource: ListValue,
    assocCaption: ListExpressionValue<string>,
    searchCaption: ListExpressionValue<string> | undefined,
    disabledAttr: ListAttributeValue<boolean> | undefined
): boolean => {
    if (objectsDatasource?.items) {
        const assocCaptionLoading = objectsDatasource.items.some(
            i => assocCaption.get(i).status !== ValueStatus.Available
        );
        const searchCaptionLoading = searchCaption
            ? objectsDatasource.items.some(i => searchCaption.get(i).status !== ValueStatus.Available)
            : false;
        const disabledAttrLoading = disabledAttr
            ? objectsDatasource.items.some(i => disabledAttr.get(i).status !== ValueStatus.Available)
            : false;

        return !assocCaptionLoading && !searchCaptionLoading && !disabledAttrLoading;
    }
    return false;
};

export function BizzomateReactSelect({
    linkedAssociation,
    objectsDatasource,
    assocCaption,
    searchCaption,
    disabledAttr,
    unstyled,
    placeholderText,
    tabIndex,
    menuPlacement,
    menuPosition
}: BizzomateReactSelectContainerProps): ReactElement {
    const [options, setOptions] = useState<readonly MxOption[]>();
    const [value, setValue] = useState<PropsValue<MxOption>>();
    const [items, setItems] = useState<readonly ObjectItem[]>();
    const [disabled, setDisabled] = useState<boolean>(false);
    const [clearable, setClearable] = useState<boolean>(true);
    const [placeholder, setPlaceholder] = useState<string | undefined>();

    // Get the placeholder
    useEffect(() => {
        if (placeholderText?.value) {
            setPlaceholder(placeholderText.value);
        } else {
            setPlaceholder(undefined);
        }
    }, [placeholderText?.value]);

    // Check if the item is editable
    useEffect(() => {
        setDisabled(!!linkedAssociation?.readOnly);
        setClearable(!linkedAssociation?.readOnly);
    }, [linkedAssociation?.readOnly]);

    // Populate the options list when dataSource items change
    useEffect(() => {
        if (
            objectsDatasource.items &&
            notEmptyAndLoaded(objectsDatasource, assocCaption, searchCaption, disabledAttr)
        ) {
            setItems(objectsDatasource.items);
            setOptions(getOptionList(objectsDatasource.items, assocCaption, searchCaption, disabledAttr));
        } else {
            setItems([]);
            setOptions([]);
        }
    }, [objectsDatasource?.items, linkedAssociation.status, assocCaption, searchCaption, disabledAttr]);

    // Keep the selected items in sync with assoc in Mx
    useEffect(() => {
        if (linkedAssociation?.value && options) {
            if (linkedAssociation?.type === "ReferenceSet") {
                setValue(getSelectedMulti(options, linkedAssociation.value));
            } else {
                setValue(getSelectedSingle(options, linkedAssociation.value));
            }
        } else {
            setValue([]);
        }
    }, [linkedAssociation?.value, options]);

    /*
    Handle changes done in the react-select widget and send the updates back to Mx
    */
    const handleSetChange = (newValue: MultiValue<MxOption>): void => {
        // Update the UI
        setValue(newValue);

        // Update the assoc in Mx
        if (!newValue || newValue.length === 0 || linkedAssociation?.type !== "ReferenceSet") {
            linkedAssociation?.setValue(undefined);
        } else {
            const selected = new Set(newValue.map(({ value }) => value));
            linkedAssociation.setValue(items?.filter(item => selected.has(item.id)));
        }
    };

    const handleChange = (newValue: SingleValue<MxOption>): void => {
        // Update the UI
        setValue(newValue);

        // Update the assoc in Mx
        if (!newValue || linkedAssociation?.type !== "Reference") {
            linkedAssociation?.setValue(undefined);
        } else {
            linkedAssociation.setValue(items?.find(item => item.id === newValue.value));
        }
    };

    /*
    Render the actual react-select widget
    */
    const isMulti = linkedAssociation?.type === "ReferenceSet" ? true : undefined;
    return (
        <Fragment>
            <Select
                tabIndex={tabIndex ? tabIndex : undefined}
                options={options}
                value={value}
                // @ts-ignore
                getOptionValue={option => (option.searchlabel ? option.searchlabel : option.label)}
                isClearable={clearable}
                // @ts-ignore
                onChange={isMulti ? handleSetChange : handleChange}
                isMulti={isMulti}
                isDisabled={disabled}
                unstyled={unstyled}
                menuPlacement={menuPlacement}
                menuPosition={menuPosition}
                placeholder={placeholder && !disabled ? placeholder : null}
                className={unstyled ? "mx-compound-control" : undefined}
                classNamePrefix="react-select"
                classNames={
                    unstyled
                        ? {
                              control: () => "form-control"
                          }
                        : undefined
                }
            />
            <Alert>{linkedAssociation?.validation}</Alert>
        </Fragment>
    );
}
