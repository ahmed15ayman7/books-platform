import { SectionBlock } from "@/components/sections/section-block";

interface AboutIntroProps {
  eyebrow: string;
  title: string;
  paragraphs: string[];
}

export function AboutIntro({ eyebrow, title, paragraphs }: AboutIntroProps) {
  return (
    <SectionBlock id="introduction" eyebrow={eyebrow} title={title}>
      <div className="max-w-3xl space-y-4">
        {paragraphs.map((paragraph, index) => (
          <p
            key={index}
            className="text-base leading-relaxed text-[var(--brand-gray-700)] md:text-lg"
          >
            {paragraph}
          </p>
        ))}
      </div>
    </SectionBlock>
  );
}

interface AboutConceptProps {
  eyebrow: string;
  title: string;
  paragraphs: string[];
}

export function AboutConcept({ eyebrow, title, paragraphs }: AboutConceptProps) {
  return (
    <SectionBlock id="concept" eyebrow={eyebrow} title={title} variant="card">
      <div className="max-w-3xl space-y-4">
        {paragraphs.map((paragraph, index) => (
          <p
            key={index}
            className="text-base leading-relaxed text-[var(--brand-gray-700)] md:text-lg"
          >
            {paragraph}
          </p>
        ))}
      </div>
    </SectionBlock>
  );
}
