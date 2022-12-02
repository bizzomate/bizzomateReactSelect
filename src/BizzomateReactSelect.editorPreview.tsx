import { ReactElement, createElement } from "react";
import { BizzomateReactSelectPreviewProps } from "../typings/BizzomateReactSelectProps";

export function preview({  }: BizzomateReactSelectPreviewProps): ReactElement {
    return <div />;
}

export function getPreviewCss(): string {
    return require("./ui/BizzomateReactSelect.css");
}
