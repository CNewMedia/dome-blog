import { createBuyerPageRoute } from '../../../../lib/buyerPageRoute'

const { Page, generateMetadata, generateStaticParams } = createBuyerPageRoute('nl-be')

export default Page
export { generateMetadata, generateStaticParams }
