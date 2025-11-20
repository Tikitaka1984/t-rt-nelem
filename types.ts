
export interface RelatedConcept {
  term: string;
  explanation: string;
}

export interface Article {
  id: string;
  title: string;
  definition: string;
  relatedConcepts: RelatedConcept[];
}

export type EventCategory = 'politikai' | 'kulturalis' | 'gazdasagi' | 'katonai' | 'vallasi' | 'egyeb';

export interface TimelineEvent {
  date: string;
  title: string;
  description: string;
  category?: EventCategory;
  importance?: number; // 1-10 skála
}

export interface Person {
  name: string;
  description: string;
}

export interface EventDetail {
  id: string;
  title: string;
  explanation: {
    antecedents: string;
    main_events: string;
    significance: string;
    consequences: string;
  };
  relatedConcepts: RelatedConcept[];
  relatedPersons: Person[];
}

export interface JournalEntry {
  term: string;
  shortDefinition: string;
}

export interface ComparisonData {
  id: string;
  item1: {
    title: string;
    type: 'event' | 'person' | 'concept';
    description: string;
    date?: string;
    significance: string;
  };
  item2: {
    title: string;
    type: 'event' | 'person' | 'concept';
    description: string;
    date?: string;
    significance: string;
  };
  similarities: string[];
  differences: string[];
  temporalRelation: string;
  historicalContext: string;
  causality: string;
}
