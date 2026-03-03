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
  type TeamMember,
} from './sector'

export type { SectorPageData, TeamMember }

export default function SectorLandingPage({
  data,
  teamMembers = [],
}: {
  data: SectorPageData
  teamMembers?: TeamMember[]
}) {
  const {
    heroTitle,
    heroSubtitle,
    heroImage,
    content,
    contentImage,
    uspBlocks,
    machines,
    successStory,
    ctaFormTitle,
    hubspotFormId,
  } = data

  const contentBlockImage = contentImage ?? heroImage

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
          <ContentBlock content={content} image={contentBlockImage} />
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

      <TeamSection teamMembers={teamMembers} />

      <Reveal>
        <ContactForm
          formId={hubspotFormId}
          title={ctaFormTitle}
        />
      </Reveal>
    </div>
  )
}
