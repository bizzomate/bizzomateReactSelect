/**
 * This file was generated from BizzomateReactSelect.xml
 * WARNING: All changes made to this file will be overwritten
 * @author Mendix UI Content Team
 */
import { ActionValue, DynamicValue, ListValue, ListAttributeValue, ListExpressionValue, ReferenceValue, ReferenceSetValue } from "mendix";

export type MenuPlacementEnum = "auto" | "bottom" | "top";

export type MenuPositionEnum = "fixed" | "absolute";

export interface BizzomateReactSelectContainerProps {
    name: string;
    tabIndex?: number;
    id: string;
    placeholderText?: DynamicValue<string>;
    linkedAssociation: ReferenceValue | ReferenceSetValue;
    objectsDatasource: ListValue;
    assocCaption: ListExpressionValue<string>;
    onChangeAction?: ActionValue;
    menuPlacement: MenuPlacementEnum;
    menuPosition: MenuPositionEnum;
    unstyled: boolean;
    searchCaption?: ListExpressionValue<string>;
    disabledAttr?: ListAttributeValue<boolean>;
}

export interface BizzomateReactSelectPreviewProps {
    readOnly: boolean;
    placeholderText: string;
    linkedAssociation: string;
    objectsDatasource: {} | { type: string } | null;
    assocCaption: string;
    onChangeAction: {} | null;
    menuPlacement: MenuPlacementEnum;
    menuPosition: MenuPositionEnum;
    unstyled: boolean;
    searchCaption: string;
    disabledAttr: string;
}
