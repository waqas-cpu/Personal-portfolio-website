import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { ContactForm } from "@/components/contact/ContactForm";
import { ArchitectureDiagram } from "@/components/diagrams/ArchitectureDiagram";
import { MobileNav } from "@/components/navigation/MobileNav";
import { GitHubRepoGrid } from "@/components/projects/GitHubRepoGrid";
import { ProjectCard } from "@/components/projects/ProjectCard";
import { ProjectDirectory } from "@/components/projects/ProjectDirectory";
import { DraftBadge, StatusBadge } from "@/components/ui/StatusBadge";
import { githubRepositoriesContent } from "@/content/github-projects";
import { allProjects } from "@/content/projects";

vi.mock("next/navigation", () => ({
  usePathname: () => "/projects",
}));

describe("UI components & accessibility contracts", () => {
  it("renders readable status text alongside non-color SVG markers", () => {
    const { container } = render(<StatusBadge status="in-progress" />);
    expect(screen.getByText("In progress")).toBeInTheDocument();
    expect(container.querySelector("svg")).toHaveAttribute("aria-hidden", "true");
  });

  it("renders DraftBadge only for unapproved or non-published states", () => {
    const { rerender } = render(<DraftBadge visibility="draft" ownerApproved={false} />);
    expect(screen.getByText("Draft · Dev preview only")).toBeInTheDocument();

    rerender(<DraftBadge visibility="published" ownerApproved={true} />);
    expect(screen.queryByText("Draft · Dev preview only")).not.toBeInTheDocument();
  });

  it("renders ProjectCard with title, status, domains, and case-study link", () => {
    const draftProject = allProjects.find((item) => item.visibility === "draft");
    expect(draftProject).toBeDefined();
    if (!draftProject) return;

    render(<ProjectCard project={draftProject} showDraftBadge />);

    expect(screen.getByText(draftProject.title)).toBeInTheDocument();
    expect(screen.getByText("Proposed")).toBeInTheDocument();
    expect(screen.getByText("Draft · Dev preview only")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /Inspect case study/i })).toHaveAttribute(
      "href",
      `/projects/${draftProject.slug}`
    );
  });

  it("filters projects by domain and announces result counts", async () => {
    const user = userEvent.setup();
    render(<ProjectDirectory projects={allProjects} showDraftBadge={false} />);

    expect(screen.getByText(/Showing 5 of 5 projects/i)).toBeInTheDocument();

    const rustButton = screen.getByRole("button", { name: "Rust" });
    await user.click(rustButton);

    expect(rustButton).toHaveAttribute("aria-pressed", "true");
    expect(screen.getByText(/Showing 1 of 5 projects/i)).toBeInTheDocument();
    expect(screen.getByText(/Transaction Risk Engine/i)).toBeInTheDocument();
  });

  it("toggles MobileNav accessibly and closes on Escape", async () => {
    const user = userEvent.setup();
    render(<MobileNav githubUrl="https://github.com/waqas-cpu" />);

    const trigger = screen.getByRole("button", { name: /Open navigation menu/i });
    expect(trigger).toHaveAttribute("aria-expanded", "false");

    await user.click(trigger);
    expect(trigger).toHaveAttribute("aria-expanded", "true");
    expect(screen.getByRole("navigation", { name: /Mobile navigation/i })).toBeInTheDocument();

    await user.keyboard("{Escape}");
    expect(trigger).toHaveAttribute("aria-expanded", "false");
    expect(trigger).toHaveFocus();
  });

  it("renders ArchitectureDiagram with accessible role, caption, and text walkthrough", () => {
    render(
      <ArchitectureDiagram
        diagramId="real-estate-tokenization"
        caption="Two-plane tokenization architecture"
        textAlternative="Detailed walkthrough text for screen readers."
      />
    );

    expect(
      screen.getByRole("img", { name: /Two-plane tokenization architecture/i })
    ).toBeInTheDocument();
    expect(
      screen.getAllByText("Two-plane tokenization architecture").length
    ).toBeGreaterThanOrEqual(1);
    expect(screen.getByText("Accessible text walkthrough of diagram")).toBeInTheDocument();
    expect(
      screen.getAllByText("Detailed walkthrough text for screen readers.").length
    ).toBeGreaterThanOrEqual(1);
  });

  it("renders ContactForm with accessible labels and unconfigured server disclosure", () => {
    render(<ContactForm deliveryConfigured={false} />);

    expect(screen.getByLabelText("Name")).toBeInTheDocument();
    expect(screen.getByLabelText("Email")).toBeInTheDocument();
    expect(screen.getByLabelText("Topic")).toBeInTheDocument();
    expect(screen.getByLabelText("Message")).toBeInTheDocument();
    expect(screen.getByText("Server Delivery Pending Configuration")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Send inquiry/i })).toBeInTheDocument();
  });

  it("renders GitHubRepoGrid with repository names, descriptions, and external links", () => {
    const sample = githubRepositoriesContent.slice(0, 2);
    render(<GitHubRepoGrid repositories={sample} />);

    expect(screen.getByText("Financial-intelligence-lakehouse")).toBeInTheDocument();
    expect(screen.getByText("distributed-ai-networking")).toBeInTheDocument();
    expect(screen.getAllByRole("link", { name: /^GitHub repo/i })).toHaveLength(2);
    expect(screen.getAllByRole("link", { name: /^Case study/i })).toHaveLength(2);
  });
});
