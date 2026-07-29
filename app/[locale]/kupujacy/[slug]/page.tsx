import { createBuyerPageRoute } from '../../../../lib/buyerPageRoute'

/** Hourly ISR safety net if a webhook is missed. */
export const revalidate = 3600

const { Page, generateMetadata, generateStaticParams } = createBuyerPageRoute('pl')

export default Page
export { generateMetadata, generateStaticParams }
