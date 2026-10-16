/**
 * The knowledge graph behind /knowledge.
 *
 * Three areas that grew separately: the web and API material that goes back to
 * the book, the engineering practice built on top of it, and the production
 * work that only shows up once something is actually running. They are joined
 * by BRIDGES: explicit edges between an idea in one area and the place it is
 * put to work in another. The bridges are what make this one graph rather than
 * three lists.
 */

export type SourceKey = "api" | "practice" | "field";
export interface GraphNode {
  id: string;
  label: string;
  parent: string | null;
  source: SourceKey;
  depth: number;
  /** Children count, filled in by the flattener. */
  weight: number;
  note?: string;
}

export interface GraphEdge {
  id: string;
  source: string;
  target: string;
  kind: "tree" | "bridge";
  why?: string;
}

/** A node in one of the two source trees, before flattening. */
interface Raw {
  /** Label. */
  l: string;
  /** Note shown in the readout. */
  n?: string;
  /** Children. */
  c?: Raw[];
}

const slug = (value: string) =>
  value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

// ---------------------------------------------------------------------------
// Tree 1 — the web, HTTP and API design
// ---------------------------------------------------------------------------

const API_TREE: Raw = {
  l: "API knowledge",
  n: "The REST and API-design board kept since the book, from what the web is made of down to what an API costs to run.",
  c: [
    {
      l: "Universal definitions",
      n: "The vocabulary everyone assumes is shared, and usually is not.",
      c: [
        {
          l: "General definition of an API",
          c: [
            { l: "Types of API" },
            { l: "What a private API actually means" },
            {
              l: "Design approaches",
              c: [{ l: "Code first" }, { l: "API first" }, { l: "Design first" }],
            },
          ],
        },
      ],
    },
    {
      l: "Foundations of an HTTP API",
      n: "Where HTTP comes from, what a request is made of, and what a correct answer looks like.",
      c: [
        {
          l: "What HTTP rests on",
          c: [
            {
              l: "The one who inspired it, Vannevar Bush",
              c: [
                { l: "The Rapid Selector" },
                { l: "The Memex" },
                { l: "Hyperlinks" },
                { l: "As We May Think" },
              ],
            },
            { l: "The one who tried, Ted Nelson" },
            { l: "The one who set it free, Sir Tim Berners-Lee" },
            { l: "The one with a thesis, Roy Thomas Fielding" },
            { l: "Three standards: HTML, HTTP, URI" },
            {
              l: "The web",
              c: [{ l: "The thesis" }, { l: "The architecture of the web" }],
            },
            {
              l: "Network-based application architecture",
              c: [
                {
                  l: "The network",
                  c: [
                    { l: "Arpanet and Cyclades" },
                    { l: "TCP and UDP" },
                    { l: "The OSI model" },
                    {
                      l: "System resilience",
                      c: [
                        { l: "Centralised, decentralised, distributed" },
                        { l: "IP, DNS, packet switching" },
                      ],
                    },
                  ],
                },
              ],
            },
            {
              l: "Representational State Transfer",
              n: "The style itself: six constraints, and the properties they buy.",
              c: [
                { l: "The constraints" },
                { l: "The properties" },
                { l: "REST applied to URIs" },
                { l: "REST applied to HTTP" },
              ],
            },
          ],
        },
        {
          l: "Receiving an HTTP request",
          c: [
            {
              l: "Anatomy of an HTTP request",
              c: [
                { l: "HTTP verbs" },
                { l: "Request headers" },
                {
                  l: "Anatomy of a URL",
                  c: [
                    { l: "URN, URL, URI, IRI" },
                    { l: "REST, resource and IRI" },
                  ],
                },
              ],
            },
            {
              l: "The Richardson maturity model",
              c: [{ l: "Level 0" }, { l: "Level 1" }, { l: "Level 2" }],
            },
            {
              l: "Safe, idempotent, neither",
              n: "The property that decides whether a client may retry at all, and the one most often assumed rather than checked.",
              c: [
                { l: "Which verb is which" },
                {
                  l: "Idempotent is not the same as safe",
                  n: "DELETE changes the world and may still be repeated; GET may not change it at all. The two guarantees answer different questions.",
                },
                {
                  l: "Retrying a write with an idempotency key",
                  n: "The caller names the attempt, the server remembers the answer it already gave, and a repeated POST stops being a second order.",
                },
              ],
            },
          ],
        },
        {
          l: "Answering properly",
          c: [
            {
              l: "HTTP status codes",
              c: [
                { l: "The common ones" },
                { l: "The lesser-known ones" },
                { l: "Specification versus implementation" },
              ],
            },
            { l: "Response headers" },
            {
              l: "Values in a generic format",
              c: [
                { l: "Widespread formats" },
                { l: "Protobuf" },
                { l: "JSON" },
                { l: "XML" },
              ],
            },
          ],
        },
        {
          l: "The versions of HTTP",
          n: "The same semantics carried over three different wires, each solving the previous one's bottleneck and inheriting a new one.",
          c: [
            { l: "HTTP/1.1 and its connection limit" },
            {
              l: "HTTP/2 multiplexing",
              n: "Many requests over one connection, which removes the queue in the browser and leaves it in TCP.",
            },
            {
              l: "HTTP/3 and QUIC",
              n: "The transport swapped for UDP, so a lost packet stops stalling every other stream on the connection.",
            },
            { l: "Where head-of-line blocking moves" },
          ],
        },
        {
          l: "Pushing instead of polling",
          n: "Where the request/response pair stops being enough, and what the alternatives cost.",
          c: [
            { l: "WebSockets" },
            {
              l: "Server-sent events and Mercure",
              n: "The option Symfony and API Platform hand you for free, and the one a plain WebSocket server is usually standing in for.",
            },
          ],
        },
      ],
    },
    {
      l: "What is at stake in building an API",
      n: "Why the thing is being built at all, which is rarely a technical answer.",
      c: [
        { l: "Fields of application" },
        {
          l: "Building an API over an existing system",
          c: [{ l: "Bimodal IT" }, { l: "Business technology" }],
        },
        {
          l: "APIs at the heart of the economy",
          c: [{ l: "APIs as accelerators of digital transformation" }],
        },
        {
          l: "Principles of hyper-connectivity",
          c: [
            { l: "Hypermedia as the means" },
            { l: "HATEOAS" },
            { l: "SOA versus WOA" },
            { l: "Event-driven APIs" },
            {
              l: "Webhooks",
              n: "The callback half of an event-driven API, and the half that has to survive a hostile network.",
              c: [
                { l: "Signing the payload" },
                {
                  l: "Storing the signature to refuse a replay",
                  n: "The receiver keeps what it has already accepted, so a retried delivery is idempotent at the edge.",
                },
                { l: "Retrying a failed delivery" },
              ],
            },
          ],
        },
        { l: "Buy off the shelf, or build bespoke" },
      ],
    },
    {
      l: "The hypermedia representation of a resource",
      n: "Nine ways to put links in a payload, compared rather than assumed.",
      c: [
        {
          l: "Resource Description Framework",
          c: [
            { l: "Collection+JSON" },
            { l: "UBER" },
            { l: "HAL" },
            { l: "Siren" },
            { l: "Mason" },
            { l: "JSON-LD" },
            { l: "Hydra" },
            { l: "Activity Streams" },
            { l: "JSON:API" },
          ],
        },
      ],
    },
    {
      l: "The ecosystem of an API",
      n: "Who is around the API, and what their presence demands of it.",
      c: [
        { l: "Types of actor" },
        { l: "Watching your API for a better experience" },
        { l: "What makes an API succeed inside an ecosystem" },
        { l: "Advice for building an API from scratch" },
      ],
    },
    {
      l: "Designing your API",
      n: "The decisions taken before a single route exists.",
      c: [
        { l: "Writing an API guideline" },
        { l: "Writing an infrastructure guideline" },
        { l: "Choosing partner APIs" },
        { l: "Living with heterogeneous languages" },
        { l: "Listing and prioritising the steps" },
        { l: "The essentials of design" },
        { l: "Prototyping and its limits" },
      ],
    },
    {
      l: "Opening your API to its ecosystem",
      n: "Publication, versioning, documentation: everything that happens after the API works.",
      c: [
        {
          l: "Promoting your API",
          c: [
            { l: "Public changelogs" },
            { l: "Social media aimed at developers" },
            { l: "Publishing on external marketplaces" },
            { l: "Notifying clients waiting on a feature" },
          ],
        },
        {
          l: "Coordinating the evolution of the API",
          c: [
            {
              l: "Delivery methods",
              c: [
                { l: "Big bang" },
                { l: "Rolling" },
                { l: "Blue / green" },
                { l: "Canary" },
                { l: "Feature flag" },
              ],
            },
            {
              l: "Version management methods",
              c: [
                {
                  l: "Semantic versioning",
                  c: [
                    { l: "Definition" },
                    { l: "Good practice" },
                    { l: "Constraints" },
                  ],
                },
                {
                  l: "Evolution strategy",
                  c: [
                    { l: "Definition" },
                    { l: "Good practice" },
                    { l: "Constraints" },
                  ],
                },
              ],
            },
          ],
        },
        {
          l: "Taking care of developers",
          c: [
            { l: "Collecting consumer needs" },
            { l: "Offering SDKs and libraries" },
            { l: "Collecting consumer usage" },
            { l: "Offering user support" },
          ],
        },
        {
          l: "Documenting your API",
          c: [
            { l: "WADL, OpenAPI, Hydra, OData, IDL, protobuf" },
            { l: "Publishing documentation for humans" },
            { l: "Running a developer portal" },
          ],
        },
        {
          l: "Taking care of consumers",
          c: [
            {
              l: "Choosing or creating an ontology",
              c: [
                { l: "What is an ontology" },
                { l: "Private or public OWL" },
                { l: "Examples of ontologies" },
              ],
            },
          ],
        },
      ],
    },
    {
      l: "Functional responsibility",
      n: "Who owns what, and which box in the middle is allowed to know about it.",
      c: [
        {
          l: "ESB, API gateway and API management",
          c: [
            { l: "Definitions and application" },
            { l: "What an API gateway does" },
            { l: "The BFF approach" },
            { l: "The SPARQL approach" },
          ],
        },
        { l: "Mapping the organisation" },
        {
          l: "Distributing responsibility",
          c: [
            { l: "Orchestration or choreography" },
            { l: "Orchestrating services" },
            { l: "Choreographing services" },
            { l: "Holding state together with sagas" },
          ],
        },
      ],
    },
    {
      l: "API granularity",
      n: "How finely to cut, and what the cutting costs when something fails.",
      c: [
        {
          l: "Approaches to communication and synchronisation",
          c: [{ l: "Micro-gateway" }, { l: "Mesh" }, { l: "Sidecar" }],
        },
        { l: "Finding the right granularity" },
        {
          l: "Surviving a failure with fine granularity",
          c: [{ l: "Circuit breaker" }],
        },
      ],
    },
    {
      l: "Testing your API",
      n: "What to test, how much it is worth, and with what.",
      c: [
        { l: "The test pyramid" },
        { l: "Managing the cost and effort ratio" },
        { l: "Distributing test execution" },
        {
          l: "The domains of testing",
          c: [
            { l: "Usability and UX testing" },
            { l: "Unit testing" },
            { l: "Integration testing" },
            { l: "Property testing" },
            { l: "Security testing" },
            { l: "Production testing" },
          ],
        },
        {
          l: "Testing tools",
          c: [
            { l: "Postman and Newman" },
            { l: "SmartBear" },
            { l: "API management" },
            { l: "Tooling built into the language" },
          ],
        },
      ],
    },
    {
      l: "Securing your API",
      n: "Identity, permission, transport and the discipline of watching all of it.",
      c: [
        {
          l: "Users and permissions",
          c: [
            { l: "Separating users, authorisation, clients and resources" },
            {
              l: "Permission models",
              c: [
                { l: "MAC" },
                { l: "DAC" },
                { l: "RBAC" },
                { l: "ABAC" },
                { l: "CAAC" },
              ],
            },
            { l: "Good practice" },
          ],
        },
        {
          l: "Authentication methods",
          c: [
            {
              l: "OIDC",
              c: [
                { l: "Authorization code flow with PKCE" },
                { l: "Grant flow with PKCE" },
                { l: "Reference tooling" },
              ],
            },
            {
              l: "OAuth 2",
              n: "Most often met as a misconfigured OIDC, and in many cases still enough for the job in front of you.",
            },
            { l: "Through a browser" },
            { l: "Between APIs" },
            {
              l: "Other methods worth knowing",
              c: [
                { l: "mTLS" },
                { l: "PAKE" },
                { l: "WebAuthn" },
                { l: "Multi-factor" },
                { l: "OTP" },
              ],
            },
          ],
        },
        {
          l: "Sharing the access token with JOSE",
          c: [
            { l: "JWT" },
            { l: "JWS" },
            { l: "JWE and JWK" },
            {
              l: "Key rotation and JWKS",
              n: "Clients refetch the key set; how often the signing key itself turns over is a per-environment decision, not a universal one.",
            },
          ],
        },
        {
          l: "Where the client keeps the token",
          n: "A bearer token is the preferable shape. Where a bearer header is not an option, the JWT is split across two cookies rather than kept whole in one.",
        },
        {
          l: "Monitoring every layer of the application",
          c: [{ l: "Watching health" }, { l: "Watching communications" }],
        },
        {
          l: "Applying OWASP good practice",
          n: "The items worth naming separately, rather than hiding them behind one line.",
          c: [
            { l: "SQL injection" },
            { l: "Cross-site scripting" },
            {
              l: "Cross-site request forgery",
              n: "Only a problem once the token rides in a cookie; a bearer header is not forgeable this way.",
            },
            { l: "Server-side request forgery" },
            {
              l: "CORS as a security boundary",
              n: "A browser-side convention, not a server-side permission: it restrains the caller, never the API.",
            },
          ],
        },
        { l: "SAST, DAST, IAST" },
        { l: "Following a request with a correlation ID" },
      ],
    },
    {
      l: "Deploying your API",
      n: "From a commit to a running thing someone can call.",
      c: [
        { l: "Continuous integration pipeline" },
        { l: "Continuous deployment pipeline" },
        { l: "Bare metal versus cloud" },
        { l: "Choosing a host" },
      ],
    },
    {
      l: "Performance",
      n: "Where the time goes, and the three places you can take it back.",
      c: [
        { l: "What counts as a slow response" },
        {
          l: "The web architecture and the platform layers",
          c: [
            {
              l: "Caching",
              c: [
                { l: "Application cache" },
                {
                  l: "HTTP cache",
                  c: [
                    { l: "Expiration" },
                    { l: "Validation" },
                    { l: "Invalidation" },
                    {
                      l: "Stale responses",
                      c: [
                        { l: "stale-on-error" },
                        { l: "stale-while-revalidate" },
                      ],
                    },
                  ],
                },
              ],
            },
            { l: "Load balancing" },
            {
              l: "Asynchrony",
              c: [
                { l: "Queues" },
                { l: "Messages: event, command, query" },
              ],
            },
          ],
        },
      ],
    },
    {
      l: "Getting value from your API",
      n: "The part that decides whether the API gets a second year.",
      c: [
        {
          l: "Commercial strategy",
          c: [
            { l: "Outside-in strategy" },
            { l: "Adopting the ecosystem principle" },
            { l: "Collaborating with partners" },
            { l: "Observe, measure, iterate, repeat" },
          ],
        },
        { l: "Dealing with dependencies" },
        {
          l: "KPIs",
          c: [
            { l: "Commercial KPIs" },
            { l: "Operational KPIs" },
            { l: "Adoption KPIs" },
          ],
        },
      ],
    },
  ],
};

// ---------------------------------------------------------------------------
// Tree 2 — engineering practice
// ---------------------------------------------------------------------------

const PRACTICE_TREE: Raw = {
  l: "Technical practice",
  n: "Eleven domains of day-to-day engineering: how a model is shaped, how a message crosses a boundary, and who proves the boundary held.",
  c: [
    {
      l: "Domain modelling",
      n: "The tactical patterns, and the discipline of keeping them out of the infrastructure.",
      c: [
        { l: "Aggregate roots", n: "Invariants enforced in the constructor, mutators named for the intent, no setters, reconstitution restricted to the persistence adapter." },
        { l: "Value objects", n: "Final readonly types that validate on construction: money, identifiers, non-empty strings, translated text, time ranges." },
        { l: "Bounded contexts", n: "Contexts named for the business they serve, each owning its own model and its own language." },
        { l: "Ubiquitous language", n: "A glossary the code is held to, so the word in the conversation is the word in the class name." },
        { l: "Domain events", n: "Facts in the past tense, dispatched after the aggregate is stored, never naming what the consumer should do." },
        { l: "Domain exceptions", n: "Translatable messages carried by a per-context throwable marker interface, mapped to HTTP at the edge." },
        { l: "Anti-corruption layer", n: "Upstream facts translated into local vocabulary by an adapter before anything else sees them." },
        { l: "Tell, don't ask", n: "Traversal of an aggregate's collections stays on the aggregate; callers ask a question instead of reaching in." },
      ],
    },
    {
      l: "Architecture",
      n: "Layering, and the written decisions that keep the layering honest.",
      c: [
        { l: "Hexagonal layering", n: "Domain, Application, Infrastructure, with ports declared by the inside and adapters supplied by the outside." },
        { l: "CQRS and CQS", n: "Commands return void, queries return a model, both travel on a bus rather than through a repository call in a controller." },
        { l: "Read models", n: "Reads served by projections and dedicated read ports, never by filtering inside a repository." },
        { l: "Context map", n: "Which context holds what, and the shape of every edge between them, kept as a document that reviews are held against." },
        { l: "Published contracts", n: "A consumer owns the message and its routing key; the producer answers on the same key through a reader seam that validates the answer." },
        { l: "Delivery adapter", n: "API Platform demoted to one adapter among several, so no serializer or validator import reaches the application layer." },
        { l: "Adapter-grouped infrastructure", n: "Infrastructure split by adapter rather than by artefact type: a mapper sits under the representation it translates." },
        { l: "Polyglot decomposition", n: "A deployable per workload rather than one runtime for everything: a socket tier, a web front office, an admin console, a mobile client." },
      ],
    },
    {
      l: "Messaging and events",
      n: "Buses, transports and the discipline of crossing a boundary asynchronously.",
      c: [
        { l: "Ecotone buses", n: "Command, query and event buses with handlers resolved by attribute, wired through the Symfony bundle." },
        { l: "RabbitMQ transport", n: "Asynchronous channels for event handlers, consumed by a dedicated worker container." },
        { l: "Routed message keys", n: "Snake-case wire names that replace type routing across a context boundary, with the payload crossing as plain values." },
        { l: "Dead letters", n: "Failed messages parked and inspectable rather than lost, with the retry path made explicit." },
        { l: "Outbox relay", n: "Messages written in the same transaction as the aggregate, then relayed by a separate command." },
        { l: "Redis Streams", n: "Per-shard queues consumed by a socket server and replayed on reconnect." },
        { l: "WebSockets", n: "Live state pushed over a socket, with heartbeats and automatic reconnection." },
        { l: "Event key hygiene", n: "An unknown routing key is silent on the event bus, so a new edge is covered by a test that drives the real producer." },
      ],
    },
    {
      l: "Distributed systems",
      n: "Many nodes, shared state, and partial failure.",
      c: [
        { l: "UUIDv7 sharding", n: "The connection parameter picks the Redis shard, so routing needs no lookup table." },
        { l: "Multi-tenant isolation", n: "Free and paid tenants routed to different Redis structures, with isolation and fairness written down before the code." },
        { l: "Circuit breaker", n: "Ganesha wrapped around outbound HTTP clients through a compiler pass, so a failing upstream degrades instead of cascading." },
        { l: "Rate limiting", n: "Middleware in front of the socket and REST handlers." },
        { l: "Load balancing", n: "NGINX in front of two socket instances: sticky sessions by IP hash, SSL termination, health checks and failover." },
        { l: "Redundancy", n: "Two socket servers and two Redis shards running side by side rather than one of each." },
        { l: "Ephemeral state", n: "Queues and tickets that expire on their own, so cleanup is a property of the store rather than a cron." },
        { l: "Retry and reconnect", n: "Clients resume where they left off; the server treats a reconnect as normal traffic, not as an error." },
        {
          l: "Eventual consistency",
          n: "Once a write and the thing that reads it stop sharing a transaction, there is a window where they disagree. The work is deciding how wide it may be and who is allowed to notice.",
        },
      ],
    },
    {
      l: "API and delivery",
      n: "The REST constellation, expanded by what production demanded of it.",
      c: [
        { l: "REST design", n: "Resources, verbs, status codes and the discipline of not inventing an RPC endpoint when a resource will do." },
        { l: "API Platform 4", n: "Resource DTOs with explicit operations, and no controllers anywhere." },
        { l: "Providers and processors", n: "Reads through a provider that dispatches a query, writes through a processor that dispatches a command and re-queries." },
        { l: "OpenAPI as contract", n: "A snapshot committed to the test suite; any change to it is reviewed as a contract change against a front end that deploys separately." },
        { l: "Backward compatibility", n: "New capability ships as a nullable property, a reshape ships as a new name with the old one deprecated, removal ships in its own merge request." },
        { l: "JSON-LD and Hydra", n: "Hypermedia formats served alongside plain JSON, with IRIs as the identity of a resource." },
        { l: "Problem details", n: "RFC 7807 responses, with domain exceptions mapped to the status they deserve and translated per locale." },
        { l: "Filters and pagination", n: "Query parameters declared as first-class metadata, with pagination kept on the read side." },
        { l: "REST versus RPC", n: "Where a command genuinely is not a resource, and what that costs at the edge." },
      ],
    },
    {
      l: "Data and persistence",
      n: "Five ways to store an aggregate, compared rather than assumed.",
      c: [
        { l: "PostgreSQL", n: "The default store, with a schema per bounded context." },
        { l: "Doctrine ORM 3", n: "Entities kept as a persistence detail, never as the domain model." },
        { l: "Custom Doctrine types", n: "Value objects crossing to columns through Doctrine types: identifiers, money, pure enums without a backing value." },
        { l: "XML mapping", n: "Mapping kept out of the domain class entirely, plus embeddables spreading one value object over two columns." },
        { l: "Two entity managers", n: "A write manager and a read-model manager sharing one connection, which is where schema:update stops being usable." },
        { l: "Migrations", n: "Versioned schema changes, plus a separate data-migration mechanism for the ones that move rows." },
        {
          l: "Schema versioning",
          n: "Expand, migrate, contract: the old and new shapes coexist for a release so that deploying and rolling back are both survivable.",
        },
        { l: "Redis", n: "Cache and locks on one side, the primary store for ephemeral queues on the other." },
        { l: "Eloquent", n: "Active record where the model is a form and a table, not an aggregate." },
      ],
    },
    {
      l: "Identity and security",
      n: "One identity provider, four client types, and the question of who a message is from.",
      c: [
        { l: "Keycloak and OIDC", n: "Realms, clients and roles defined once, consumed by an API, a SaaS shell, a console and a phone app." },
        { l: "JWT verification", n: "Signature and claim checks at the edge in three languages: web-token, firebase/php-jwt, jsonwebtoken." },
        { l: "PKCE public clients", n: "The mobile app authenticates without a secret; the host application uses one." },
        { l: "Authorization rules", n: "Role groups and per-operation expressions, with security factories declared per context rather than centrally." },
        { l: "Message identity", n: "An asynchronous message carries who asked for it, and the trust boundary that header crosses is written down." },
        { l: "UMA entitlements", n: "Keycloak's authorization services consulted for what a host may do with a queue." },
        { l: "Social login", n: "Socialite with the Keycloak provider for the console's sign-in." },
        { l: "Secrets and TLS", n: "Local certificates, terminated at the proxy, so development runs on the same scheme as production." },
      ],
    },
    {
      l: "Quality and analysis",
      n: "Rules a machine can check, so review can spend itself on design.",
      c: [
        { l: "PHPUnit 12", n: "Unit and functional suites, attribute-driven, with parallel runs and a transactional database wrapper." },
        { l: "Foundry factories", n: "Fixtures built from domain factories with a fixed faker seed, so runs are deterministic." },
        { l: "Mutation testing", n: "Infection over the diff against main, at a minimum 80% MSI." },
        { l: "Custom PHPStan rules", n: "Naming and call-site rules the analyser enforces: provider and processor names, repository injection, reconstitution call sites." },
        { l: "PHPat architecture tests", n: "Layer and context boundaries expressed as tests, with allow-listed exceptions that must state a reason." },
        { l: "Rector and codemods", n: "Mechanical upgrades and project-specific codemods, including the rule that makes every class final." },
        { l: "Style and dead code", n: "PHP-CS-Fixer on a Symfony ruleset, a banned-code list, a dead-code detector and a dependency analyser." },
        { l: "Contract snapshots", n: "The generated OpenAPI file committed and diffed, so a schema change cannot land unnoticed." },
      ],
    },
    {
      l: "Platform and ops",
      n: "How each project is built, shipped, watched and reproduced on a laptop.",
      c: [
        { l: "Docker Compose", n: "The whole stack declared per project, down to the mail catcher and the document renderer." },
        { l: "GitLab CI", n: "Build, test, deploy and post-deploy stages, with a pinned PHP version shared between the pipeline and the local stack." },
        { l: "Clever Cloud", n: "Deploy and undeploy scripts, scheduled jobs, and review environments torn down when a branch dies." },
        { l: "Traefik and NGINX", n: "A reverse proxy for routing and TLS, a load balancer for the socket tier." },
        { l: "FrankenPHP", n: "PHP served from a single binary with worker mode, instead of a php-fpm and web server pair." },
        { l: "Prometheus and Grafana", n: "Connection, message and latency metrics exported from the Rust server and charted." },
        { l: "Loki and Vector", n: "Structured logs shipped through a pipeline rather than read from a container." },
        { l: "Gotenberg", n: "Offer documents rendered to PDF by a service, from a Twig template." },
      ],
    },
    {
      l: "Languages and runtimes",
      n: "What the code is written in, and the features each version brought worth using.",
      c: [
        { l: "PHP 8.5", n: "Readonly classes, enums, attributes, property hooks and first-class callables used as design tools, not novelties." },
        { l: "Symfony 7.4", n: "Configured in PHP rather than YAML, with services autodiscovered per context." },
        { l: "Rust", n: "An axum and tokio service: ownership, async tasks, typed errors and a release profile tuned for the socket tier." },
        { l: "Laravel 12", n: "Used for a web front office, and for an admin console built with Filament and Livewire." },
        { l: "TypeScript and React", n: "React 19 with React Native 0.81 and Expo Router, typed end to end." },
        { l: "SQL", n: "Written directly where a projection or a median needs it, not only generated by an ORM." },
        { l: "Twig and Blade", n: "Server-rendered templates for documents and admin screens." },
        { l: "Shell and Make", n: "Every command goes through a Makefile target into a container." },
      ],
    },
    {
      l: "Practice and transmission",
      n: "The part that outlives any one system: what gets written down, and for whom.",
      c: [
        { l: "ADR writing", n: "Decision records that each carry the option they rejected, and why." },
        { l: "Docs as a product", n: "A mkdocs site with guides per subject, published by the pipeline alongside the API." },
        { l: "Teaching by commits", n: "A git history staged deliberately, where each commit demonstrates one step and earlier stages are left intact." },
        { l: "Executable documentation", n: "Two console commands that walk every storage and read path and report what each one does." },
        { l: "Review workflow", n: "Merge-request conventions, an automated reviewer, and a rule that nitpicks get answered too." },
        { l: "Ticket writing", n: "Backlog items written in French for the whole team, keeping code names untranslated, each one a shippable increment with its reasons." },
        { l: "Agent guardrails", n: "Project rules written for an AI collaborator: layer boundaries, naming, comment policy, what never to touch." },
        { l: "Bounded-context guides", n: "One document per context describing what it owns and how it is spoken to." },
      ],
    },
  ],
};

// ---------------------------------------------------------------------------
// Tree 3 — what only exists in production
// ---------------------------------------------------------------------------

const FIELD_TREE: Raw = {
  l: "Production experience",
  n: "The parts that only exist once something is running: clusters, databases, perimeters, and the numbers underneath a retry.",
  c: [
    {
      l: "Clusters and infrastructure",
      n: "The move off bare metal, and what had to be written to make it repeatable.",
      c: [
        { l: "Kubernetes", n: "A multi-region cluster on AWS, reached by migrating a platform off bare metal." },
        { l: "Helm charts", n: "Written for that migration, alongside the Dockerfiles the cluster builds from." },
        { l: "Terraform", n: "Used for part of the estate rather than all of it." },
        { l: "Multi-region deployment", n: "The shape the cluster was built in, for availability rather than for latency." },
        {
          l: "Vertical scaling",
          n: "Reached for instead of adding instances when the need is a small peak rather than a sustained load.",
        },
        {
          l: "Docker layer caching",
          n: "Tuned deliberately for GitLab CI, because shared runners start cold and pay for every uncached layer.",
        },
        {
          l: "Scheduled jobs",
          n: "Work on a clock rather than on a queue. The question is never the schedule, it is what happens when a run is still going when the next one starts.",
        },
        {
          l: "Cost optimisation",
          n: "The reason the migration was worth doing at all: the same availability for less, rather than more capacity for more.",
        },
      ],
    },
    {
      l: "Database operations",
      n: "The part product engineers inherit and rarely own: plans, pooling, copies and the ability to get it all back.",
      c: [
        { l: "Indexes and query plans", n: "Set up rather than inherited, on systems where nobody else was going to." },
        { l: "Query optimisation" },
        { l: "N+1 queries", n: "The standing tax of an ORM, and the first thing to look for when a list endpoint drifts." },
        { l: "Connection pooling" },
        { l: "Read replicas" },
        { l: "Replication" },
        { l: "Backups" },
        { l: "Disaster recovery" },
        { l: "Encryption at rest" },
        {
          l: "Sharding and partitioning",
          n: "Studied in depth for a shard design, never run in production. Listed because knowing it and having run it are not the same claim.",
        },
      ],
    },
    {
      l: "Perimeter and tokens",
      n: "What sits in front of the API, and where the credential lives once it is issued.",
      c: [
        { l: "Cloudflare as a WAF", n: "The usual perimeter: a managed WAF in front, rather than rules maintained by hand." },
        {
          l: "Where the browser keeps a bearer token",
          n: "A bearer token in local storage by preference; when a bearer header is not available, the JWT split across two cookies.",
        },
        {
          l: "JWKS and signing-key rotation",
          n: "Clients fetch the key set from Keycloak; how aggressively the signing key rotates depends on whether the realm is production or staging.",
        },
      ],
    },
    {
      l: "Observability in production",
      n: "Instrumentation that somebody is actually watching, and what happens when it fires.",
      c: [
        { l: "OpenTelemetry", n: "The instrumentation layer, rather than per-service metric code." },
        { l: "Tempo with Loki", n: "Traces in Tempo joined to logs in Loki, read through one Grafana." },
        {
          l: "Escalation to a dedicated SRE team",
          n: "Alerting and the on-call rota belong to an SRE team with its own escalation phone. Worth stating plainly: that part is theirs, not mine.",
        },
        {
          l: "Rollback by redeploy",
          n: "The previous version goes back out, unless a schema change has made that impossible — which is the case worth planning for.",
        },
        {
          l: "Postmortems",
          n: "Written after the fact, about the system rather than the person. Worth nothing unless something changes because of it.",
        },
      ],
    },
    {
      l: "Resilience tuning",
      n: "A circuit breaker is decorative without the numbers underneath it. These are the numbers.",
      c: [
        {
          l: "Per-target initial timeouts",
          n: "Set per upstream rather than globally, because a slow partner and a slow internal service deserve different patience.",
        },
        {
          l: "Exponential backoff",
          n: "Used for upstreams outside my control, and for the ones whose failure costs the most.",
        },
        {
          l: "Fixed-interval retry",
          n: "Used where the upstream is reliable, or known to scale back up quickly, so backing off only adds delay.",
        },
        {
          l: "Redis as the buffer under load",
          n: "When inbound outruns the consumer, Redis absorbs it rather than the producer being pushed back.",
        },
        {
          l: "Memory leaks in long-running workers",
          n: "The failure mode that only appears once PHP stops dying between requests: worker mode and message consumers both hold what you forget to release.",
        },
      ],
    },
    {
      l: "Transport choices",
      n: "Decisions taken with their reasons, including the one that would be taken differently now.",
      c: [
        { l: "JSON-RPC rather than gRPC", n: "The RPC style actually reached for when a call genuinely is not a resource." },
        {
          l: "WebSockets chosen for simplicity",
          n: "Picked for directness. Mercure is the better answer for that job and is where it should go.",
        },
      ],
    },
  ],
};

// ---------------------------------------------------------------------------
// Flattening
// ---------------------------------------------------------------------------

function flatten(tree: Raw, rootId: string, source: SourceKey): GraphNode[] {
  const out: GraphNode[] = [];

  const walk = (raw: Raw, id: string, parent: string | null, depth: number) => {
    out.push({
      id,
      label: raw.l,
      parent,
      source,
      depth,
      weight: raw.c?.length ?? 0,
      note: raw.n,
    });
    for (const child of raw.c ?? []) {
      walk(child, `${id}/${slug(child.l)}`, id, depth + 1);
    }
  };

  walk(tree, rootId, null, 0);
  return out;
}

export const nodes: GraphNode[] = [
  ...flatten(API_TREE, "api", "api"),
  ...flatten(PRACTICE_TREE, "practice", "practice"),
  ...flatten(FIELD_TREE, "field", "field"),
];

const byId = new Map(nodes.map(node => [node.id, node]));

// A duplicate id would silently merge two different ideas into one dot.
if (byId.size !== nodes.length) {
  const seen = new Set<string>();
  const dupes = nodes.filter(n => (seen.has(n.id) ? true : (seen.add(n.id), false)));
  throw new Error(
    `knowledge-graph: duplicate node ids: ${dupes.map(d => d.id).join(", ")}`
  );
}

// ---------------------------------------------------------------------------
// Bridges — where a concept on the board meets the place it is exercised
// ---------------------------------------------------------------------------

const BRIDGES: [string, string, string][] = [
  [
    "api/foundations-of-an-http-api/what-http-rests-on/representational-state-transfer",
    "practice/api-and-delivery/rest-design",
    "The six constraints, and the discipline of actually being held to them.",
  ],
  [
    "api/the-hypermedia-representation-of-a-resource/resource-description-framework/json-ld",
    "practice/api-and-delivery/json-ld-and-hydra",
    "Of the nine formats compared here, this is the pair that earns its place.",
  ],
  [
    "api/the-hypermedia-representation-of-a-resource/resource-description-framework/hydra",
    "practice/api-and-delivery/json-ld-and-hydra",
    "Hydra serves the operations alongside the data, with IRIs as identity.",
  ],
  [
    "api/opening-your-api-to-its-ecosystem/documenting-your-api/wadl-openapi-hydra-odata-idl-protobuf",
    "practice/api-and-delivery/openapi-as-contract",
    "Documentation stops being documentation once it is diffed in CI.",
  ],
  [
    "api/opening-your-api-to-its-ecosystem/documenting-your-api",
    "practice/practice-and-transmission/docs-as-a-product",
    "A mkdocs site published by the pipeline alongside the API itself.",
  ],
  [
    "api/opening-your-api-to-its-ecosystem/coordinating-the-evolution-of-the-api/version-management-methods/evolution-strategy",
    "practice/api-and-delivery/backward-compatibility",
    "The strategy written down as three rules a merge request is held to.",
  ],
  [
    "api/opening-your-api-to-its-ecosystem/coordinating-the-evolution-of-the-api/delivery-methods",
    "practice/platform-and-ops/gitlab-ci",
    "The pipeline that picks one of those delivery methods and runs it.",
  ],
  [
    "api/opening-your-api-to-its-ecosystem/taking-care-of-developers",
    "practice/architecture/published-contracts",
    "Caring for a consumer means letting them own the message they receive.",
  ],
  [
    "api/opening-your-api-to-its-ecosystem/taking-care-of-consumers/choosing-or-creating-an-ontology",
    "practice/domain-modelling/ubiquitous-language",
    "An ontology inside one team is just the glossary, enforced.",
  ],
  [
    "api/securing-your-api/authentication-methods/oidc",
    "practice/identity-and-security/keycloak-and-oidc",
    "One realm, four client types: an API, a SaaS shell, a console, a phone.",
  ],
  [
    "api/securing-your-api/authentication-methods/other-methods-worth-knowing",
    "practice/identity-and-security/pkce-public-clients",
    "The mobile app authenticates with no secret; the host application has one.",
  ],
  [
    "api/securing-your-api/sharing-the-access-token-with-jose",
    "practice/identity-and-security/jwt-verification",
    "The same signature and claim checks, written three times in three languages.",
  ],
  [
    "api/securing-your-api/users-and-permissions/permission-models",
    "practice/identity-and-security/authorization-rules",
    "RBAC plus per-operation expressions, declared per context rather than centrally.",
  ],
  [
    "api/securing-your-api/monitoring-every-layer-of-the-application",
    "practice/platform-and-ops/prometheus-and-grafana",
    "Connection, message and latency metrics, exported and charted.",
  ],
  [
    "api/securing-your-api/following-a-request-with-a-correlation-id",
    "practice/platform-and-ops/loki-and-vector",
    "A correlation ID is only useful once the logs are shipped somewhere queryable.",
  ],
  [
    "api/securing-your-api/applying-owasp-good-practice",
    "practice/quality-and-analysis/style-and-dead-code",
    "A banned-code list is the cheapest half of OWASP, checked on every commit.",
  ],
  [
    "api/testing-your-api/the-domains-of-testing",
    "practice/quality-and-analysis/phpunit-12",
    "Unit and functional suites, attribute-driven, run in parallel.",
  ],
  [
    "api/testing-your-api/managing-the-cost-and-effort-ratio",
    "practice/quality-and-analysis/mutation-testing",
    "Infection over the diff is how the ratio stops being a matter of opinion.",
  ],
  [
    "api/testing-your-api/testing-tools",
    "practice/quality-and-analysis/contract-snapshots",
    "The committed OpenAPI file is a test, not a document.",
  ],
  [
    "api/api-granularity/surviving-a-failure-with-fine-granularity/circuit-breaker",
    "practice/distributed-systems/circuit-breaker",
    "Ganesha wrapped around outbound clients through a compiler pass.",
  ],
  [
    "api/api-granularity/approaches-to-communication-and-synchronisation",
    "practice/architecture/polyglot-decomposition",
    "Four deployables, each chosen for the workload it carries.",
  ],
  [
    "api/performance/the-web-architecture-and-the-platform-layers/caching",
    "practice/data-and-persistence/redis",
    "Cache and locks on one side, the primary store for ephemeral queues on the other.",
  ],
  [
    "api/performance/the-web-architecture-and-the-platform-layers/load-balancing",
    "practice/distributed-systems/load-balancing",
    "NGINX in front of two socket instances, sticky by IP hash.",
  ],
  [
    "api/performance/the-web-architecture-and-the-platform-layers/asynchrony",
    "practice/messaging-and-events/rabbitmq-transport",
    "Asynchronous channels consumed by a dedicated worker container.",
  ],
  [
    "api/performance/the-web-architecture-and-the-platform-layers/asynchrony/messages-event-command-query",
    "practice/messaging-and-events/ecotone-buses",
    "The three message kinds, each with its own bus and its own rules.",
  ],
  [
    "api/functional-responsibility/esb-api-gateway-and-api-management",
    "practice/platform-and-ops/traefik-and-nginx",
    "The reverse proxy is the only part of the gateway idea that earned its place.",
  ],
  [
    "api/functional-responsibility/esb-api-gateway-and-api-management/the-bff-approach",
    "practice/architecture/delivery-adapter",
    "API Platform demoted to one adapter, so the edge never reaches the model.",
  ],
  [
    "api/functional-responsibility/distributing-responsibility/holding-state-together-with-sagas",
    "practice/messaging-and-events/outbox-relay",
    "Messages written in the aggregate's transaction, then relayed separately.",
  ],
  [
    "api/what-is-at-stake-in-building-an-api/principles-of-hyper-connectivity/event-driven-apis",
    "practice/domain-modelling/domain-events",
    "Facts in the past tense, never naming what the consumer should do.",
  ],
  [
    "api/foundations-of-an-http-api/answering-properly/http-status-codes",
    "practice/api-and-delivery/problem-details",
    "RFC 7807, with domain exceptions mapped to the status they deserve.",
  ],
  [
    "api/foundations-of-an-http-api/receiving-an-http-request/anatomy-of-an-http-request/anatomy-of-a-url",
    "practice/api-and-delivery/filters-and-pagination",
    "Query parameters declared as metadata rather than parsed by hand.",
  ],
  [
    "api/universal-definitions/general-definition-of-an-api/design-approaches/design-first",
    "practice/api-and-delivery/api-platform-4",
    "Resource DTOs with explicit operations, and no controllers anywhere.",
  ],
  [
    "api/designing-your-api/writing-an-api-guideline",
    "practice/practice-and-transmission/adr-writing",
    "Decision records that each carry the option they rejected.",
  ],
  [
    "api/deploying-your-api/continuous-integration-pipeline",
    "practice/platform-and-ops/gitlab-ci",
    "Build, test, deploy and post-deploy, on a pinned PHP version.",
  ],
  [
    "api/deploying-your-api/choosing-a-host",
    "practice/platform-and-ops/clever-cloud",
    "Review environments torn down when the branch dies.",
  ],
  [
    "api/deploying-your-api/bare-metal-versus-cloud",
    "practice/platform-and-ops/docker-compose",
    "The whole stack declared per project, reproducible on a laptop.",
  ],
  [
    "api/getting-value-from-your-api/kpis",
    "practice/platform-and-ops/prometheus-and-grafana",
    "An operational KPI is a chart someone is on the hook for.",
  ],
  [
    "api/securing-your-api/applying-owasp-good-practice",
    "field/perimeter-and-tokens/cloudflare-as-a-waf",
    "The managed perimeter that catches the classes of attack before the code has to.",
  ],
  [
    "api/securing-your-api/where-the-client-keeps-the-token",
    "field/perimeter-and-tokens/where-the-browser-keeps-a-bearer-token",
    "The rule as taught, and the fallback used when a bearer header is not on offer.",
  ],
  [
    "api/securing-your-api/sharing-the-access-token-with-jose/key-rotation-and-jwks",
    "field/perimeter-and-tokens/jwks-and-signing-key-rotation",
    "The key set clients fetch, and how often the key behind it actually turns over.",
  ],
  [
    "api/securing-your-api/monitoring-every-layer-of-the-application",
    "field/observability-in-production/opentelemetry",
    "One instrumentation layer instead of per-service metric code.",
  ],
  [
    "api/securing-your-api/following-a-request-with-a-correlation-id",
    "field/observability-in-production/tempo-with-loki",
    "The correlation ID stops being a convention once a trace and its logs meet in one pane.",
  ],
  [
    "api/deploying-your-api/bare-metal-versus-cloud",
    "field/clusters-and-infrastructure/kubernetes",
    "The question in the abstract, answered once by moving a platform off bare metal.",
  ],
  [
    "api/deploying-your-api/continuous-deployment-pipeline",
    "field/observability-in-production/rollback-by-redeploy",
    "Five delivery methods, and the one undo that is actually used.",
  ],
  [
    "api/designing-your-api/writing-an-infrastructure-guideline",
    "field/clusters-and-infrastructure/terraform",
    "A guideline nobody can drift from, because the cluster is declared rather than described.",
  ],
  [
    "api/api-granularity/surviving-a-failure-with-fine-granularity/circuit-breaker",
    "field/resilience-tuning/per-target-initial-timeouts",
    "A breaker is decorative until each upstream has its own patience.",
  ],
  [
    "practice/distributed-systems/circuit-breaker",
    "field/resilience-tuning/exponential-backoff",
    "Backoff for the upstreams outside my control; a fixed interval for the ones that scale back fast.",
  ],
  [
    "api/performance/the-web-architecture-and-the-platform-layers/load-balancing",
    "field/clusters-and-infrastructure/multi-region-deployment",
    "Balancing inside one region, and the availability story that spans several.",
  ],
  [
    "api/foundations-of-an-http-api/pushing-instead-of-polling/server-sent-events-and-mercure",
    "field/transport-choices/websockets-chosen-for-simplicity",
    "The decision taken, and the one that would be taken differently now.",
  ],
  [
    "api/foundations-of-an-http-api/pushing-instead-of-polling/websockets",
    "practice/messaging-and-events/websockets",
    "Live ticket state over axum, with heartbeats and automatic reconnection.",
  ],
  [
    "api/what-is-at-stake-in-building-an-api/principles-of-hyper-connectivity/webhooks",
    "practice/messaging-and-events/dead-letters",
    "A delivery that keeps failing needs the same parking lot a message does.",
  ],
  [
    "field/database-operations/indexes-and-query-plans",
    "practice/data-and-persistence/postgresql",
    "The default store in all three projects, and the one whose plans have to be read.",
  ],
  [
    "field/database-operations/n-1-queries",
    "practice/data-and-persistence/doctrine-orm-3",
    "Lazy loading is the convenience that bills you later.",
  ],
  [
    "field/database-operations/connection-pooling",
    "practice/platform-and-ops/frankenphp",
    "Worker mode changes how long a connection is held, which changes how many you need.",
  ],
  [
    "field/resilience-tuning/memory-leaks-in-long-running-workers",
    "practice/platform-and-ops/frankenphp",
    "PHP stops dying between requests, so what you forget to release is now yours to keep.",
  ],
  [
    "field/clusters-and-infrastructure/docker-layer-caching",
    "practice/platform-and-ops/gitlab-ci",
    "Shared runners start cold, so an untuned layer order is paid on every pipeline.",
  ],
  [
    "field/transport-choices/json-rpc-rather-than-grpc",
    "practice/api-and-delivery/rest-versus-rpc",
    "Where a command genuinely is not a resource, and which RPC style is reached for.",
  ],
  [
    "api/foundations-of-an-http-api/receiving-an-http-request/safe-idempotent-neither/retrying-a-write-with-an-idempotency-key",
    "field/resilience-tuning/exponential-backoff",
    "A retry policy is only safe if the write it repeats is. Backoff decides when; idempotency decides whether.",
  ],
  [
    "api/foundations-of-an-http-api/receiving-an-http-request/safe-idempotent-neither",
    "practice/messaging-and-events/outbox-relay",
    "At-least-once delivery is a promise to repeat yourself, so the consumer carries the same duty the HTTP client does.",
  ],
  [
    "api/foundations-of-an-http-api/the-versions-of-http/http-3-and-quic",
    "field/perimeter-and-tokens/cloudflare-as-a-waf",
    "The edge speaks the newest version of the protocol long before the origin behind it does.",
  ],
  [
    "practice/distributed-systems/eventual-consistency",
    "api/performance/the-web-architecture-and-the-platform-layers/asynchrony",
    "The window between a write and a read is the price of not waiting for it.",
  ],
  [
    "field/clusters-and-infrastructure/scheduled-jobs",
    "practice/distributed-systems/ephemeral-state",
    "A store that expires its own keys is the version of this job that cannot overlap itself.",
  ],
  [
    "practice/data-and-persistence/schema-versioning",
    "field/observability-in-production/rollback-by-redeploy",
    "Rolling back the code is only possible while the schema still accepts it.",
  ],
  [
    "practice/data-and-persistence/schema-versioning",
    "api/opening-your-api-to-its-ecosystem/coordinating-the-evolution-of-the-api/version-management-methods",
    "The same expand-and-contract discipline, one layer below the contract.",
  ],
  [
    "field/clusters-and-infrastructure/cost-optimisation",
    "api/getting-value-from-your-api/kpis",
    "An operational KPI that nobody converts into a bill is only half read.",
  ],
  [
    "field/observability-in-production/postmortems",
    "practice/practice-and-transmission/adr-writing",
    "Same genre, opposite ends: one records what was chosen, the other what that choice turned out to cost.",
  ],
];

export const edges: GraphEdge[] = [
  ...nodes
    .filter(node => node.parent !== null)
    .map(node => ({
      id: `t:${node.parent}>${node.id}`,
      source: node.parent as string,
      target: node.id,
      kind: "tree" as const,
    })),
  ...BRIDGES.map(([a, b, why]) => {
    // A typo here would quietly drop a bridge, so fail the build instead.
    if (!byId.has(a)) throw new Error(`knowledge-graph: unknown bridge end "${a}"`);
    if (!byId.has(b)) throw new Error(`knowledge-graph: unknown bridge end "${b}"`);
    return { id: `b:${a}>${b}`, source: a, target: b, kind: "bridge" as const, why };
  }),
];

/** Bridge partners for a node, used by the readout and the static fallback. */
export const bridgesByNode = new Map<string, { to: GraphNode; why: string }[]>();
for (const edge of edges) {
  if (edge.kind !== "bridge") continue;
  const a = byId.get(edge.source) as GraphNode;
  const b = byId.get(edge.target) as GraphNode;
  const why = edge.why as string;
  if (!bridgesByNode.has(a.id)) bridgesByNode.set(a.id, []);
  if (!bridgesByNode.has(b.id)) bridgesByNode.set(b.id, []);
  bridgesByNode.get(a.id)?.push({ to: b, why });
  bridgesByNode.get(b.id)?.push({ to: a, why });
}

export const ROOTS: Record<SourceKey, { id: string; label: string; blurb: string }> = {
  api: {
    id: "api",
    label: "API knowledge",
    blurb:
      "What the web is made of, and what an API owes the people who call it.",
  },
  practice: {
    id: "practice",
    label: "Technical practice",
    blurb:
      "How a model is shaped, how a message crosses a boundary, and who proves the boundary held.",
  },
  field: {
    id: "field",
    label: "Production experience",
    blurb:
      "Clusters, databases and perimeters: the parts that only matter once something is actually serving traffic.",
  },
};

export const stats = {
  nodes: nodes.length,
  apiNodes: nodes.filter(n => n.source === "api").length,
  practiceNodes: nodes.filter(n => n.source === "practice").length,
  fieldNodes: nodes.filter(n => n.source === "field").length,
  bridges: BRIDGES.length,
};
