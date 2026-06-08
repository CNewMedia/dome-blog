import { createBuyerPageRoute } from '../../../../lib/buyerPageRoute'

const { Page, generateMetadata, generateStaticParams } = createBuyerPageRoute('ro')

export default Page
export { generateMetadata, generateStaticParams }
