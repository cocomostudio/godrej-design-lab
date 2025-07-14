
import { PageLayout } from "./components/page-layout/page-layout"
import { HeaderRegion } from "./components/header-region"
import { SideRegion } from "./components/side-region"
import { MainRegion } from "./components/main-region"
import { Section } from "./components/section"
import { HorizontalRule } from "./components/horizontal-rule"
import { Image } from "./components/image"
import { Gallery } from "./components/gallery"
import { WYSIWYG } from "./components/wysiwyg"
import { Heading } from "./components/heading"
import { UnorderedList } from "./components/unordered-list"
import { ButtonLink } from "./components/button-link"
import { ImageLink } from "./components/image-link"
import { Fellowship } from "./components/fellowship"

import { HeadingAndContentList } from "./components/gdl/heading-and-content-list"
import { ImageAndContentList } from "./components/gdl/image-and-content-list"
import { Promo } from "./components/gdl/promo"
export const component_map = {
	"container.page-layout-v1": PageLayout,

	"container.header-region-v1": HeaderRegion,
	"container.side-region-v1": SideRegion,
	"container.main-region-v1": MainRegion,

	"container.section-v1": Section,

	"miscellaneous.horizontal-rule-v1": HorizontalRule,
	"media.image-v1": Image,
	"media.gallery-v1": Gallery,
	"text.wysiwyg-v1": WYSIWYG,
	"text.heading-v1": Heading,
	"text.unordered-list-v1": UnorderedList,
	"navigation.button-link-v1": ButtonLink,
	"navigation.image-link-v1": ImageLink,

	"fellowships.fellowship-v1": Fellowship,
	"gdl.promo-v1": Promo,
	"gdl.heading-and-content-list-v1": HeadingAndContentList,
	"gdl.image-and-content-list-v1": ImageAndContentList,
}
