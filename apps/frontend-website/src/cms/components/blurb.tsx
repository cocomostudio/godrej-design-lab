/**
 |
 | Blurb Component
 |
 |
 */

import { shallow_clone_props } from "../utilities/shallow-clone-props";

export class Blurb {

    static id = "miscellaneous.blurb-v1";

static process_node(props) {
    return shallow_clone_props(props); 
}

static Renderer({ blurb }) {
    console.log("Blurb component rendered with text:", blurb);
    return (
        <blockquote className="border-l-4 border-gray-300 pl-4 italic text-gray-700">
            <p>{blurb || "No Blurb provided."}</p>
        </blockquote>
    );
}
}