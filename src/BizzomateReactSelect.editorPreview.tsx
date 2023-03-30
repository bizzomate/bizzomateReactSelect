import { ReactElement, createElement } from "react";
import { BizzomateReactSelectPreviewProps } from "../typings/BizzomateReactSelectProps";
import Select from "react-select";

export function preview(props: BizzomateReactSelectPreviewProps): ReactElement {
    return <Select unstyled={props.unstyled} />;
}
