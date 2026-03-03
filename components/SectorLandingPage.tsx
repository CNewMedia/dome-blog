import '../styles/sector-landing.css'
import {
  Hero,
  StatsBar,
  UspGrid,
  MachinesGrid,
  TeamSection,
  ProcessSteps,
  SuccessStory,
  ContactForm,
  ContentBlock,
  Reveal,
  type SectorPageData,
} from './sector'

export type { SectorPageData }

export default function SectorLandingPage({ data }: { data: SectorPageData }) {
  const {
    heroTitle,
    heroSubtitle,
    heroImage,
    content,
    uspBlocks,
    machines,
    successStory,
    ctaFormTitle,
    hubspotFormId,
  } = data

  return (
    <div className="sector-lp">
      <Hero
        title={heroTitle || 'Industrial Auctions'}
        subtitle={heroSubtitle}
        image={heroImage}
      />
      <StatsBar />

      {content && Array.isArray(content) && content.length > 0 && (
        <Reveal>
          <ContentBlock content={content} />
        </Reveal>
      )}

      {uspBlocks && uspBlocks.length > 0 && (
        <Reveal>
          <UspGrid items={uspBlocks} />
        </Reveal>
      )}

      {machines && machines.length > 0 && (
        <Reveal>
          <MachinesGrid machines={machines} />
        </Reveal>
      )}

      <Reveal>
        <ProcessSteps />
      </Reveal>

      {successStory && (successStory.quote || successStory.company) && (
        <SuccessStory
          quote={successStory.quote}
          company={successStory.company}
          result={successStory.result}
        />
      )}

      <TeamSection />

      <Reveal>
        <ContactForm
          formId={hubspotFormId}
          title={ctaFormTitle}
        />
      </Reveal>
    </div>
  )
}
