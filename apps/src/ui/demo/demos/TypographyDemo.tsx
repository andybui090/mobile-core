import React from 'react';
import { Section } from '../components/Section';
import { CText } from '@/ui';

export function TypographyDemo() {
  return (
    <Section title="Typography">
      <CText variant="display" weight="bold">
        Display Text
      </CText>
      <CText variant="title" weight="bold">
        Title Text
      </CText>
      <CText variant="subtitle" color="textSecondary">
        Subtitle Text
      </CText>
      <CText variant="body">
        Body text – nội dung chính của app
      </CText>
      <CText variant="caption" color="textSecondary">
        Caption / helper text
      </CText>
    </Section>
  );
}