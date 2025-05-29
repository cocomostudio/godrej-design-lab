
import { PageLayout } from "./components/page-layout"
import { HeadingRegion } from "./components/heading-region"
import { SideRegion } from "./components/side-region"
import { MainRegion } from "./components/main-region"
import { Section } from "./components/section"
import { Column } from "./components/column"
import { OneColumnLayout } from "./components/1-column-layout"
import { TwoColumnLayout } from "./components/2-column-layout"
import { HorizontalRule } from "./components/horizontal-rule"
import { Image } from "./components/image"
import { WYSIWYG } from "./components/wysiwyg"
import { Heading } from "./components/heading"
import { UnorderedList } from "./components/unordered-list"
import { ButtonLink } from "./components/button-link"
import { ImageLink } from "./components/image-link"
import { Fellowship } from "./components/fellowship"
import { Quote } from "./components/quote"

export const component_map = {
	"container.page-layout-v1": PageLayout,

	"container.heading-region-v1": HeadingRegion,
	"container.side-region-v1": SideRegion,
	"container.main-region-v1": MainRegion,

	"container.section-v1": Section,
	"container.column-v1": Column,
	"container.columns-1-v1": OneColumnLayout,
	"container.columns-2-v1": TwoColumnLayout,

	"miscellaneous.horizontal-rule-v1": HorizontalRule,
	"media.image-v1": Image,
	"text.wysiwyg-v1": WYSIWYG,
	"text.heading-v1": Heading,
	"text.unordered-list-v1": UnorderedList,
	"navigation.button-link-v1": ButtonLink,
	"navigation.image-link-v1": ImageLink,

	"fellowships.fellowship-v1": Fellowship,
	"text.quote-v1": Quote // Placeholder for Quote component, to be implemented
}
