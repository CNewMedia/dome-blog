import { createBuyerPageRoute } from '../../../../lib/buyerPageRoute'

const { Page, generateMetadata, generateStaticParams } = createBuyerPageRoute('fr-be')

export default Page
export { generateMetadata, generateStaticParams }
