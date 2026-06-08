import { createBuyerPageRoute } from '../../../../lib/buyerPageRoute'

export const dynamic = 'force-dynamic'

const { Page, generateMetadata, generateStaticParams } = createBuyerPageRoute('ro')

export default Page
export { generateMetadata, generateStaticParams }
