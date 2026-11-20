import { z } from "zod";

export const ProjectStatusSchema = z.enum([
  "built",
  "in-progress",
  "research",
  "learning",
  "proposed",
]);

export type ProjectStatus = z.infer<typeof ProjectStatusSchema>;

export const ContentVisibilitySchema = z.enum(["draft", "approved", "published"]);

export type ContentVisibility = z.infer<typeof ContentVisibilitySchema>;

export const DiagramIdSchema = z.enum([
  "real-estate-tokenization",
  "financial-intelligence-lakehouse",
  "transaction-risk-engine",
  "distributed-systems-simulator",
  "financial-document-forensics",
]);

export type DiagramId = z.infer<typeof DiagramIdSchema>;

export const ProjectLinkSchema = z.object({
  label: z.string().min(1),
  url: z
    .string()
    .url()
    .refine(
      (value) => value.startsWith("https://"),
      "Approved external links must use the https:// scheme"
    ),
  kind: z.enum(["github", "demo", "video", "article", "notes"]),
  approved: z.boolean(),
});

export type ProjectLink = z.infer<typeof ProjectLinkSchema>;

const IsoDateStringSchema = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, "Date must follow YYYY-MM-DD format");

export const PortfolioProjectSchema = z.object({
  slug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug must be lowercase kebab-case"),
  title: z.string().min(1),
  summary: z.string().min(1),
  domains: z.array(z.string().min(1)).min(1),
  status: ProjectStatusSchema,
  visibility: ContentVisibilitySchema,
  ownerApproved: z.boolean(),
  featured: z.boolean(),
  lastUpdated: IsoDateStringSchema,
  publicationNotice: z.string().min(1).optional(),
  overview: z.string().min(1),
  problemContext: z.string().min(1),
  scopeAndStatus: z.object({
    implemented: z.array(z.string().min(1)).min(1),
    prototypeOrPlanned: z.array(z.string().min(1)).min(1),
    statusRationale: z.string().min(1),
  }),
  constraints: z
    .array(
      z.object({
        category: z.string().min(1),
        detail: z.string().min(1),
      })
    )
    .min(1),
  systemModel: z.object({
    actors: z.array(z.string().min(1)).min(1),
    components: z.array(z.string().min(1)).min(1),
    boundaries: z.array(z.string().min(1)).min(1),
    dependencies: z.array(z.string().min(1)).min(1),
  }),
  architecture: z.object({
    summary: z.string().min(1),
    diagramId: DiagramIdSchema,
    diagramCaption: z.string().min(1),
    diagramTextAlternative: z.string().min(1),
    layers: z
      .array(
        z.object({
          name: z.string().min(1),
          responsibility: z.string().min(1),
        })
      )
      .min(1),
  }),
  dataFlow: z
    .array(
      z.object({
        stage: z.string().min(1),
        description: z.string().min(1),
      })
    )
    .min(1),
  controlFlow: z
    .array(
      z.object({
        stage: z.string().min(1),
        description: z.string().min(1),
      })
    )
    .min(1),
  decisions: z
    .array(
      z.object({
        decision: z.string().min(1),
        alternatives: z.string().min(1),
        rationale: z.string().min(1),
        tradeoff: z.string().min(1),
      })
    )
    .min(1),
  securityAndFailures: z
    .array(
      z.object({
        threatOrMode: z.string().min(1),
        trustBoundary: z.string().min(1),
        mitigation: z.string().min(1),
        residualRisk: z.string().min(1),
      })
    )
    .min(1),
  implementation: z.object({
    technologies: z.array(z.string().min(1)).min(1),
    ownerContribution: z.string().min(1),
    structureNotes: z.string().min(1),
  }),
  validation: z
    .array(
      z.object({
        method: z.string().min(1),
        status: z.string().min(1),
        scopeAndResult: z.string().min(1),
        date: IsoDateStringSchema.optional(),
      })
    )
    .min(1),
  limitations: z.array(z.string().min(1)).min(1),
  nextSteps: z.array(z.string().min(1)).min(1),
  links: z.array(ProjectLinkSchema),
  coverImage: z.string().min(1).optional(),
  coverImageAlt: z.string().min(1).optional(),
});

export type PortfolioProject = z.infer<typeof PortfolioProjectSchema>;

export const ContactChannelSchema = z.object({
  id: z.string().min(1),
  label: z.string().min(1),
  kind: z.enum(["github", "email", "linkedin", "other"]),
  value: z.string().min(1).optional(),
  href: z
    .string()
    .refine(
      (value) => value.startsWith("https://") || value.startsWith("mailto:"),
      "Contact href must use https:// or mailto:"
    )
    .optional(),
  note: z.string().min(1),
  approved: z.boolean(),
  devPlaceholderHint: z.string().min(1).optional(),
});

export type ContactChannel = z.infer<typeof ContactChannelSchema>;

export const ProfileSchema = z.object({
  displayName: z.string().min(1),
  displayNameConfirmed: z.boolean(),
  workingTitle: z.string().min(1),
  githubUrl: z
    .string()
    .url()
    .refine((value) => value.startsWith("https://"), "GitHub URL must use https://"),
  githubHandle: z.string().min(1),
  portrait: z.object({
    src: z.string().startsWith("/"),
    width: z.number().int().positive(),
    height: z.number().int().positive(),
    alt: z.string().min(1),
  }),
  logo: z.object({
    src: z.string().startsWith("/"),
    width: z.number().int().positive(),
    height: z.number().int().positive(),
    alt: z.string().min(1),
  }),
  hero: z.object({
    eyebrow: z.string().min(1),
    headline: z.string().min(1),
    supportingCopy: z.string().min(1),
    primaryCtaLabel: z.string().min(1),
    secondaryCtaLabel: z.string().min(1),
  }),
  systemsThinking: z.object({
    statement: z.string().min(1),
    pillars: z
      .array(
        z.object({
          index: z.string().min(1),
          title: z.string().min(1),
          detail: z.string().min(1),
        })
      )
      .min(1),
  }),
  about: z.object({
    headline: z.string().min(1),
    intro: z.string().min(1),
    paragraphs: z.array(z.string().min(1)).min(1),
    intersections: z
      .array(
        z.object({
          pair: z.string().min(1),
          explanation: z.string().min(1),
        })
      )
      .min(1),
    principles: z
      .array(
        z.object({
          title: z.string().min(1),
          description: z.string().min(1),
        })
      )
      .min(1)
      .optional(),
    contentStandardsNote: z.string().min(1).optional(),
  }),
  contact: z.object({
    headline: z.string().min(1),
    invitation: z.string().min(1),
    topics: z.array(z.string().min(1)).min(1),
    channels: z.array(ContactChannelSchema).min(1),
  }),
});

export type ProfileContent = z.infer<typeof ProfileSchema>;

export const FocusAreaSchema = z.object({
  id: z.string().min(1),
  index: z.string().min(1),
  title: z.string().min(1),
  summary: z.string().min(1),
  topics: z.array(z.string().min(1)).min(1),
  framingNote: z.string().min(1),
});

export type FocusArea = z.infer<typeof FocusAreaSchema>;

export const NowItemSchema = z.object({
  id: z.string().min(1),
  topic: z.string().min(1),
  category: z.string().min(1),
  statusLabel: z.string().min(1).optional(),
  summary: z.string().min(1),
});

export const NowContentSchema = z.object({
  lastUpdated: IsoDateStringSchema,
  intro: z.string().min(1),
  items: z.array(NowItemSchema).min(1),
  openQuestions: z.array(z.string().min(1)).min(1).optional(),
});

export type NowContent = z.infer<typeof NowContentSchema>;

export const GitHubRepositorySchema = z.object({
  slug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug must be lowercase kebab-case"),
  name: z.string().min(1),
  url: z
    .string()
    .url()
    .refine(
      (value) => value.startsWith("https://github.com/waqas-cpu/"),
      "Repository URL must belong to https://github.com/waqas-cpu/"
    ),
  description: z.string().min(1),
  domains: z.array(z.string().min(1)).min(1),
  language: z.string().min(1),
  status: ProjectStatusSchema,
  highlights: z.array(z.string().min(1)).min(1),
  updatedAt: IsoDateStringSchema,
  featured: z.boolean(),
  relatedCaseStudySlug: z.string().min(1).optional(),
  approved: z.boolean(),
});

export type GitHubRepository = z.infer<typeof GitHubRepositorySchema>;
