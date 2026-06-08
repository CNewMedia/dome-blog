import { createBuyerPageRoute } from '../../../../lib/buyerPageRoute'

const { Page, generateMetadata, generateStaticParams } = createBuyerPageRoute('bg')

export default Page
export { generateMetadata, generateStaticParams }
