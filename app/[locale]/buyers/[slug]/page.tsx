import { createBuyerPageRoute } from '../../../../lib/buyerPageRoute'

const { Page, generateMetadata, generateStaticParams } = createBuyerPageRoute('en-be')

export default Page
export { generateMetadata, generateStaticParams }
