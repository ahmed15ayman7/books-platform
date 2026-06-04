import { SectionBlock } from "@/components/sections/section-block";
import { NumberedFeatureList } from "@/components/sections/numbered-feature-list";

interface AboutUniquenessProps {
  eyebrow: string;
  title: string;
  items: string[];
}

export function AboutUniqueness({ eyebrow, title, items }: AboutUniquenessProps) {
  return (
    <SectionBlock id="unique" eyebrow={eyebrow} title={title}>
      <NumberedFeatureList items={items} columns={2} />
    </SectionBlock>
  );
}

interface AboutEffortsProps {
  eyebrow: string;
  title: string;
  items: string[];
}

export function AboutEfforts({ eyebrow, title, items }: AboutEffortsProps) {
  return (
    <SectionBlock id="efforts" eyebrow={eyebrow} title={title}>
      <NumberedFeatureList items={items} columns={1} />
    </SectionBlock>
  );
}
