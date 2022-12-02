/**
 * This file was generated from BizzomateReactSelect.xml
 * WARNING: All changes made to this file will be overwritten
 * @author Mendix UI Content Team
 */
import { ActionValue, ListValue, ListAttributeValue, ListExpressionValue, ReferenceValue, ReferenceSetValue } from "mendix";

export interface BizzomateReactSelectContainerProps {
    name: string;
    tabIndex?: number;
    id: string;
    linkedAssociation: ReferenceValue | ReferenceSetValue;
    assocCaption: ListExpressionValue<string>;
    objectsDatasource: ListValue;
    onChangeAction?: ActionValue;
    unstyled: boolean;
    disabledAttr?: ListAttributeValue<boolean>;
}

export interface BizzomateReactSelectPreviewProps {
    readOnly: boolean;
    linkedAssociation: string;
    assocCaption: string;
    objectsDatasource: {} | { type: string } | null;
    onChangeAction: {} | null;
    unstyled: boolean;
    disabledAttr: string;
}
