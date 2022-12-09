/**
 * This file was generated from BizzomateReactSelect.xml
 * WARNING: All changes made to this file will be overwritten
 * @author Mendix UI Content Team
 */
import { ActionValue, DynamicValue, ListValue, ListAttributeValue, ListExpressionValue, ReferenceValue, ReferenceSetValue } from "mendix";

export interface BizzomateReactSelectContainerProps {
    name: string;
    tabIndex?: number;
    id: string;
    placeholderText?: DynamicValue<string>;
    linkedAssociation: ReferenceValue | ReferenceSetValue;
    objectsDatasource: ListValue;
    assocCaption: ListExpressionValue<string>;
    onChangeAction?: ActionValue;
    unstyled: boolean;
    disabledAttr?: ListAttributeValue<boolean>;
}

export interface BizzomateReactSelectPreviewProps {
    readOnly: boolean;
    placeholderText: string;
    linkedAssociation: string;
    objectsDatasource: {} | { type: string } | null;
    assocCaption: string;
    onChangeAction: {} | null;
    unstyled: boolean;
    disabledAttr: string;
}
