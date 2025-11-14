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

export interface TimelineEvent {
  date: string;
  title: string;
  description: string;
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
