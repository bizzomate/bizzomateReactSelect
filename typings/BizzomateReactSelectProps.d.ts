/**
 * This file was generated from BizzomateReactSelect.xml
 * WARNING: All changes made to this file will be overwritten
 * @author Mendix UI Content Team
 */
import { ActionValue, ListValue, ListExpressionValue, ReferenceValue, ReferenceSetValue } from "mendix";

export interface BizzomateReactSelectContainerProps {
    name: string;
    tabIndex?: number;
    id: string;
    linkedAssociation?: ReferenceValue | ReferenceSetValue;
    assocCaption?: ListExpressionValue<string>;
    onChangeAction?: ActionValue;
    objectsDatasource?: ListValue;
}

export interface BizzomateReactSelectPreviewProps {
    readOnly: boolean;
    linkedAssociation: string;
    assocCaption: string;
    onChangeAction: {} | null;
    objectsDatasource: {} | { type: string } | null;
}
