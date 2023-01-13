import { BizzomateReactSelectPreviewProps } from "../typings/BizzomateReactSelectProps";

type Properties = PropertyGroup[];

type PropertyGroup = {
    caption: string;
    propertyGroups?: PropertyGroup[];
    properties?: Property[];
};

type Property = {
    key: string;
    caption: string;
    description?: string;
    objectHeaders?: string[]; // used for customizing object grids
    objects?: ObjectProperties[];
    properties?: Properties[];
};

type Problem = {
    property?: string; // key of the property, at which the problem exists
    severity?: "error" | "warning" | "deprecation"; // default = "error"
    message: string; // description of the problem
    studioMessage?: string; // studio-specific message, defaults to message
    url?: string; // link with more information about the problem
    studioUrl?: string; // studio-specific link
};

type ObjectProperties = {
    properties: PropertyGroup[];
    captions?: string[]; // used for customizing object grids
};

export function getProperties(_values: BizzomateReactSelectPreviewProps, defaultProperties: Properties): Properties {
    // Do the values manipulation here to control the visibility of properties in Studio and Studio Pro conditionally.
    /* Example
    if (values.myProperty === "custom") {
        delete defaultProperties.properties.myOtherProperty;
    }
    */

    return defaultProperties;
}

export function check(_values: BizzomateReactSelectPreviewProps): Problem[] {
    const errors: Problem[] = [];
    // Add errors to the above array to throw errors in Studio and Studio Pro.
    /* Example
    if (values.myProperty !== "custom") {
        errors.push({
            property: `myProperty`,
            message: `The value of 'myProperty' is different of 'custom'.`,
            url: "https://github.com/myrepo/mywidget"
        });
    }
    */
    return errors;
}

export const getPreview = (_values: BizzomateReactSelectPreviewProps, _isDarkMode: boolean, _version: number[]) => (
    {
        type: "Container",
        borders: true,
        borderRadius: 2,
        children: [
            {
                type: "RowLayout",
                columnSize: "grow",
                children: [
                    {
                        type: "Container",
                        borders: false,
                        padding: 6,
                        children: [
                            {
                                type: "Text",
                                fontColor: "#6DB1FE",
                                fontSize: 8,
                                content: "[" + _values.linkedAssociation + "]"
                            }
                        ]
                    },
                    {
                        type: "Text",
                        content: "⏷",
                        fontSize: 14,
                        grow: 0
                    }
                ]
            }
        ]
    }
);