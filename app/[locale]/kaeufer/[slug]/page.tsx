import { createBuyerPageRoute } from '../../../../lib/buyerPageRoute'

const { Page, generateMetadata, generateStaticParams } = createBuyerPageRoute('de')

export default Page
export { generateMetadata, generateStaticParams }
