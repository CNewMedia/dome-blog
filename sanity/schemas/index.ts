import { postSchema } from './post'
import { sectorPageSchema } from './sectorPage'
import { siteSettingsSchema } from './siteSettings'
import { teamMemberSchema } from './teamMember'

import siteChrome from './siteChrome'
import menuItem from './objects/menuItem'
import footerColumn from './objects/footerColumn'
import footerBottomLink from './objects/footerBottomLink'
import socialLink from './objects/socialLink'

export const schemaTypes = [
  postSchema,
  sectorPageSchema,
  siteSettingsSchema,
  teamMemberSchema,
  siteChrome,
  menuItem,
  footerColumn,
  footerBottomLink,
  socialLink,
]