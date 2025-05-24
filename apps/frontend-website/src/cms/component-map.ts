
import { PageLayout } from "./components/page-layout"
import { ContentRegion } from "./components/content-region"
import { Section } from "./components/section"
import { Column } from "./components/column"
import { OneColumnLayout } from "./components/1-column-layout"
import { TwoColumnLayout } from "./components/2-column-layout"
import { HorizontalRule } from "./components/horizontal-rule"
import { Image } from "./components/image"
import { WYSIWYG } from "./components/wysiwyg"
import { Heading } from "./components/heading"
import { UnorderedList } from "./components/unordered-list"

export const component_map = {
	"container.page-layout-v1": PageLayout,

	"container.content-region-v1": ContentRegion,

	"container.section-v1": Section,
	"container.column-v1": Column,
	"container.columns-1-v1": OneColumnLayout,
	"container.columns-2-v1": TwoColumnLayout,

	"miscellaneous.horizontal-rule-v1": HorizontalRule,
	"media.image-v1": Image,
	"text.wysiwyg-v1": WYSIWYG,
	"text.heading-v1": Heading,
	"text.unordered-list-v1": UnorderedList,
}
