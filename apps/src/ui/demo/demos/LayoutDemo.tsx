import React from 'react';
import { Section } from '../components/Section';
import { Row, Column, Container, CButton, spacing } from '@/ui';

export function LayoutDemo() {
  return (
    <>
      <Section title="Row">
        <Row gap={spacing.lg}>
          <CButton title="SM" size="sm" />
          <CButton title="MD" size="md" />
          <CButton title="LG" size="lg" />
        </Row>
      </Section>

      <Section title="Column">
        <Column gap={spacing.lg}>
          <CButton title="SM" size="sm" />
          <CButton title="MD" size="md" />
          <CButton title="LG" size="lg" />
        </Column>
      </Section>

      <Section title="Container">
        <Container center="both">
          <CButton title="Centered Button" />
        </Container>
      </Section>
    </>
  );
}