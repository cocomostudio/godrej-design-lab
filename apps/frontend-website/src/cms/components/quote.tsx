
/**
 |
 | Quote Component
 |
 |
 */

import { shallow_clone_props } from "../utilities/shallow-clone-props";

export class Quote {

    static id = "text.quote-v1";

static process_node(props) {
    return shallow_clone_props(props); 
}

static Renderer({ text }) {
    console.log("Quote component rendered with text:", text);
    return text
}
}