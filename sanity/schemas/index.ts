import { postSchema } from './post'
import { sectorPageSchema } from './sectorPage'
import { siteSettingsSchema } from './siteSettings'
import { teamMemberSchema } from './teamMember'
import { tagSchema } from './tag'

import siteChrome from './siteChrome'
import menuItem from './objects/menuItem'
import footerColumn from './objects/footerColumn'
import footerBottomLink from './objects/footerBottomLink'
import socialLink from './objects/socialLink'
import tableRow from './objects/tableRow'
import tableBlock from './objects/tableBlock'

export const schemaTypes = [
  postSchema,
  sectorPageSchema,
  siteSettingsSchema,
  teamMemberSchema,
  tagSchema,
  siteChrome,
  menuItem,
  footerColumn,
  footerBottomLink,
  socialLink,
  tableRow,
  tableBlock,
]