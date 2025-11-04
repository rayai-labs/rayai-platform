export const siteContent = {
  header: {
    logo: {
      src: "/logo.svg",
      alt: "RayAI Logo",
    },
    brand: {
      name: "Ray",
      highlight: "AI",
    },
    nav: [
      { label: "Home", href: "#home" },
      { label: "Community", href: "#community" },
      { label: "Features", href: "#features" },
      { label: "Pricing", href: "/pricing" },
      { label: "Careers", href: "/careers" },
    ],
    cta: "Talk to us",
  },
  hero: {
    badge: {
      logo: "/ocv-logo.webp",
      text: "Backed by Open Core Ventures",
    },
    headline: "Scale AI Agents ",
    headlineHighlight: "without Infra complexity",
    subheadline:
      "Production-ready infrastructure with distributed tool execution, granular compute control, sandboxing, and fault tolerance. Built on Ray—run it yourself or on our managed platform.",
    primaryCta: "Talk to us",
    secondaryCta: "Learn More",
  },
  rayFoundation: {
    headline: "Building on Ray OSS, the compute engine trusted by",
    description: "",
    descriptionEnd:
      "Ray's core runtime has scaled to thousands of nodes for training and serving the world's largest language models. We're adapting this proven open-source foundation specifically for Agentic AI workloads.",
    companies: ["Uber", "OpenAI", "Spotify", "Instacart", "Amazon", "Reddit", "Ebay", "Pinterest", "Canva"],
  },
  features: {
    headline: "For",
    rotatingPhrases: ["coding", "research", "finance", "analytics", "sales"],
    keyFeatures: [
      "Distributed Runtime",
      "Agent Primitives",
      "Stateful Execution",
      "Tool Distribution",
      "Sandbox Isolation",
      "Framework Compatible",
      "Laptop to Cluster",
    ],
    items: [
      {
        icon: "Puzzle",
        title: "Framework-agnostic runtime",
        description:
          "Bring your agent code or use our adapters for LangGraph, CrewAI, Pydantic-AI, and other frameworks. Your tools, your workflow—Ray handles the infrastructure.",
      },
      {
        icon: "Network",
        title: "Distributed Tool Execution",
        description:
          "Parallelize tool calls across hundreds of nodes with automatic retries and failure recovery. Ray manages scheduling, resource planning, and distributed execution seamlessly.",
      },
      {
        icon: "Container",
        title: "Secure Code Sandboxing",
        description:
          "Execute untrusted or dynamically generated code—within secure gVisor sandboxes. Leverage kernel-level isolation without sacrificing the high-throughput execution needed for function calling.",
      },
      {
        icon: "ShieldCheck",
        title: "Fault-Tolerant by default",
        description:
          "Automatic checkpointing, retry logic, and failover handling. Your agents keep running even when individual nodes fail—no manual intervention required.",
      },
      {
        icon: "Chip",
        title: "Heterogeneous Compute",
        description:
          "Mix and match hardware as needed—CPU nodes for logic, GPU nodes for inference, custom accelerators for specialized tasks. Ray handles the orchestration seamlessly.",
      },
      {
        icon: "CloudStack",
        title: "Cloud Agnostic Deployment",
        description:
          "Deploy to AWS, GCP, Azure, or on-premise infrastructure. Same API, whether self-hosted or on our managed platform.",
      },
    ],
    whatIsIncluded: {
      headline: "What's Included",
      cloud: [
        "Unlimited Agent deployments",
        "Unlimited MCP Server deployments",
        "Unlimited Tool executions",
        "Secure sandboxes",
        "CPU/GPU resource allocation",
        "Autoscaling",
        "Agent observability",
        "Multi-model gateway with LLM Tracing",
        "Community Slack Support",
      ],
      enterprise: [
        "Everything included in Cloud",
        "Deploy in your AWS, GCP, Azure, or on-premise",
        "SSO, OIDC, and SCM support",
        "Private LLM serving endpoints",
        "Dedicated Support and Custom SLAs",
        "Your security policies + HIPAA, PCI, etc.",
        "Priority roadmap input",
      ],
    },
  },
  independent: {
    headline: "The Agent Compute Platform",
    description:
      "Built from first principles for AI agents. While others focus on training clusters and model serving, we've reimagined distributed computing for agent orchestration.",
    items: [
      "Built on Ray open-source for proven distributed computing",
      "Laser-focused on agent orchestration and tool execution",
      "From engineers who contribute to Ray and ship agents",
      "Part of the Ray ecosystem, purpose-built for agents",
    ],
  },
  cta: {
    headline: "Want to build with us?",
    subheadline: "Join thousands of engineers already building on Ray.",
    button: "Join Ray slack ->",
    careersButton: "View Open Roles",
    careersLink: "https://rayai.notion.site/open-roles",
  },
  footer: {
    logo: {
      src: "/logo.svg",
      alt: "RayAI Logo",
    },
    brand: {
      name: "Ray",
      highlight: "AI",
    },
    links: [],
    copyright: "© 2025 Ray AI Technologies Inc. Built on open-source Ray. Ray™ is a trademark of Anyscale, Inc.",
  },
  pricing: {
    headline: "Pricing",
    subheadline: "Pay only for what you use. No setup fees, no minimums.",
    description:
      "Starter - Only pay for what you use. No hidden fees, no base subscription.\nEnterprise - Custom pricing based on your scale and requirements. White-glove support included.",
    tiers: [
      {
        name: "Starter",
        tagline: "Deploy your agents in minutes",
        bestFor: "Startups and teams that want zero DevOps overhead",
        pricing: ["$0 + compute/mo"],
        cta: "Talk to us",
        ctaLink: "https://calendly.com/pavitra-rayai/25-min",
        highlighted: true,
      },
      {
        name: "Enterprise",
        tagline: "Your infrastructure, your control",
        bestFor: "Self-hosted deployment with enterprise compliance",
        pricing: ["Custom"],
        cta: "Talk to us",
        ctaLink: "https://calendly.com/pavitra-rayai/25-min",
        highlighted: false,
      },
    ],
    comparisonRows: [
      {
        label: "Deployment",
        cloud: "Fully managed",
        enterprise: "Deploy in your AWS, GCP, Azure, or on-premise",
      },
      { label: "Data Residency", cloud: "Multi-region, Global", enterprise: "Your infrastructure" },
      { label: "Security", cloud: "SOC 2 compliant", enterprise: "Your security policies + HIPAA, PCI, etc." },
      { label: "Scaling", cloud: "Autoscaled", enterprise: "Custom limits" },
      { label: "Support", cloud: "Community Slack", enterprise: "Dedicated, Custom SLAs" },
      { label: "Pricing Model", cloud: "Pay-as-you-go", enterprise: "Annual platform license" },
      { label: "Base Fee", cloud: "None - pay only for usage", enterprise: "Custom" },
      { label: "Contract", cloud: "No commitment", enterprise: "Annual commitment" },
    ],
    features: {
      headline: "What's Included",
      starter: [
        "Unlimited Agent deployments",
        "Unlimited MCP Server deployments",
        "Unlimited Tool executions",
        "Secure sandboxes",
        "CPU/GPU resource allocation",
        "Autoscaling",
        "Agent observability",
        "Multi-model gateway with LLM Tracing",
        "Community Slack Support",
      ],
      enterprise: [
        "Everything included in Starter",
        "Deploy in your AWS, GCP, Azure, or on-premise",
        "SSO, OIDC, and SCM support",
        "Private LLM serving endpoints",
        "Dedicated Support and Custom SLAs",
        "Your security policies + HIPAA, PCI, etc.",
        "Priority roadmap input",
      ],
    },
    faq: {
      headline: "Frequently Asked Questions",
      items: [
        {
          question: "When will the platform be generally available?",
          answer: "We're currently in private beta. Talk to us to get early access.",
        },
        {
          question: "Can I migrate from Cloud to Enterprise?",
          answer: "Yes. Start on Cloud and migrate to Enterprise anytime with zero code changes.",
        },
        {
          question: "Do you support existing Ray users?",
          answer: "Yes. We give free onboarding support for teams already using Ray. Talk to us.",
        },
      ],
    },
  },
  careers: {
    headline: "Careers at RayAI",
    subheadline: "Help us build the future of Agentic AI Infrastructure",
    cta: "View Open Roles",
    ctaLink: "https://rayai.notion.site/open-roles",
    badge: {
      logo: "/ocv-logo.webp",
      text: "Backed by Open Core Ventures",
    },
  },
}
