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
    heroEyebrow,
    heroCtaLabel,
    heroCtaHref,
    heroSectionVisible,
    statsSection,
    processSection,
    contentSectionVisible,
    content,
    contentImage,
    uspBlocks,
    uspSectionEyebrow,
    uspSectionTitle,
    uspSectionVisible,
    machines,
    machinesSectionVisible,
    successStory,
    testimonialSectionVisible,
    teamSectionEyebrow,
    teamSectionTitle,
    teamSectionVisible,
    contactSectionEyebrow,
    contactSectionSubtitle,
    contactSectionVisible,
    ctaFormTitle,
    hubspotFormId,
  } = data

  const contentBlockImage = contentImage ?? heroImage
  const showHero = heroSectionVisible !== false
  const showContent = contentSectionVisible !== false && content && Array.isArray(content) && content.length > 0
  const showUsp = uspSectionVisible !== false && uspBlocks && uspBlocks.length > 0
  const showMachines = machinesSectionVisible !== false && machines && machines.length > 0
  const showTestimonial = testimonialSectionVisible !== false && successStory && (successStory.quote || successStory.company)
  const showTeam = teamSectionVisible !== false && teamMembers?.length
  const showContact = contactSectionVisible !== false

  return (
    <div className="sector-lp">
      {showHero && (
        <Hero
          title={heroTitle || 'Industrial Auctions'}
          subtitle={heroSubtitle}
          image={heroImage}
          eyebrow={heroEyebrow}
          ctaLabel={heroCtaLabel}
          ctaHref={heroCtaHref}
        />
      )}
      <StatsBar statsSection={statsSection} />

      {showContent && (
        <Reveal>
          <ContentBlock content={content} image={contentBlockImage} />
        </Reveal>
      )}

      {showUsp && (
        <Reveal>
          <UspGrid
            items={uspBlocks}
            eyebrow={uspSectionEyebrow}
            title={uspSectionTitle}
          />
        </Reveal>
      )}

      {showMachines && (
        <Reveal>
          <MachinesGrid machines={machines} />
        </Reveal>
      )}

      <Reveal>
        <ProcessSteps processSection={processSection} />
      </Reveal>

      {showTestimonial && (
        <SuccessStory
          quote={successStory!.quote}
          company={successStory!.company}
          result={successStory!.result}
        />
      )}

      {showTeam && (
        <TeamSection
          teamMembers={teamMembers}
          locale={data.language || data.locale || 'nl-be'}
          eyebrow={teamSectionEyebrow}
          title={teamSectionTitle}
        />
      )}

      {showContact && (
        <Reveal>
          <ContactForm
            formId={hubspotFormId}
            title={ctaFormTitle}
            subtitle={contactSectionSubtitle}
            eyebrow={contactSectionEyebrow}
          />
        </Reveal>
      )}
    </div>
  )
}
