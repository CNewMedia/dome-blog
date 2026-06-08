import { createBuyerPageRoute } from '../../../../lib/buyerPageRoute'

const { Page, generateMetadata, generateStaticParams } = createBuyerPageRoute('sl')

export default Page
export { generateMetadata, generateStaticParams }
