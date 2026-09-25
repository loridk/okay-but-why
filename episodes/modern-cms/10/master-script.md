# Episode 10: Drupal 10/11: What Changed, What Stayed & Should We Use a CMS?

**Series:** Modern CMS Development
**Hosts:** Parisa, Jules
**Production:** September 2026. Version-sensitive notes checked September 16, 2026; recording handled separately.

[INTRO MUSIC]

JULES: We have reached the architecture decision.

PARISA: Excellent. I have prepared five cards: static site, WordPress, Drupal, custom application, and headless CMS.

JULES: Which one wins?

PARISA: I have prepared a sixth card that says “What are the requirements?” and a small spray bottle for anyone who ignores it.

## The Part That Stayed

JULES: Welcome to Okay, But Why? This is the final episode of Modern CMS Development. We aren't reading a changelog aloud. We're using what we've learned to reason about a real choice.

PARISA: Our fictional Bellweather University needs people to manage information reliably. That's still the problem, even after we have learned enough nouns to qualify for a conference badge.

JULES: Drupal's central model remains recognizable: entities, bundles, fields, references, Views, modules, configuration, permissions, and caching. Those ideas didn't disappear when the PHP and frontend tooling evolved.

PARISA: Entity type: broad kind of managed data object. Bundle: configured subtype. Entity: individual object. Field: structured information. Reference: relationship. Those are now things I can translate into database and application reasoning.

JULES: A View selects and presents results. A view mode describes a named entity presentation. A render array carries output structure and cacheability through rendering. A module extends behavior; a theme presents it.

PARISA: And configuration isn't the same as content, even when both are edited in the browser and stored in the database. That one should be printed above the deployment button.

## Modern PHP Didn't Remove the CMS

JULES: Drupal's modernization includes current PHP capabilities and Symfony foundations. Namespaces, interfaces, typed dependencies, and attributes give developers more explicit ways to describe code and its relationships.

PARISA: The language feature and the framework convention are still different. PHP attributes attach structured metadata. Drupal decides that a particular attribute identifies a hook or plugin implementation.

JULES: Exactly. Services and dependency injection make collaborators visible. Composer coordinates package versions and autoloading. These are improvements to how the application is assembled and maintained, not replacements for its editorial purpose.

PARISA: A project can have beautifully injected services and a terrible content model. Technical modernization doesn't absolve us from asking whether editors can find the room field.

JULES: And a procedural hook in an existing module isn't automatic evidence that the whole project is obsolete. Drupal 11's object-oriented hooks coexist with legacy implementations and documented procedural exceptions.

PARISA: We should modernize where the supported API, maintenance benefit, and tests justify it. Not because a file extension caused aesthetic distress.

## Version Numbers Need Dates

JULES: We're producing this in September 2026. Drupal 11.4 is the current stable feature line reflected in the release documentation we've checked. Drupal 10's final minor line is 10.6, and its published end-of-life date is December ninth, 2026.

PARISA: That's close enough that a team maintaining Drupal 10 should have a concrete upgrade plan. It doesn't mean we announce a random emergency based only on the number ten. We inspect supported versions, security releases, and the site's actual dependencies.

JULES: Exactly. Drupal's schedule also shows the next major release in development for December. A scheduled beta or future release is not a reason to describe it as the stable production baseline today.

PARISA: And an episode isn't an update service. When listeners act on this later, check the current release schedule and advisories. The companion records our research date so the temporal claim has a boundary.

JULES: For Drupal 11, PHP 8.3 is the minimum across the current eleven-four compatibility matrix, with newer supported versions listed. Exact supported and recommended versions depend on the Drupal minor and its dependencies.

PARISA: So don't hear “Drupal 11 uses modern PHP” and assume the old hosting plan already supports everything. Check PHP, database, extensions, Composer, and contributed packages before planning the upgrade.

## Upgrade Is a Compatibility Project

JULES: The path from Drupal 10 to 11 is generally an update within the modern architecture, not the same kind of rebuild as moving from Drupal 7's older architecture.

PARISA: But generally manageable doesn't mean press a button and ignore custom code. Audit deprecated APIs, module and theme compatibility, platform requirements, and the actual user journeys.

JULES: Update tools and compatibility analysis can help identify work. Composer constraints reveal dependency conflicts. A staging upgrade tells you whether the whole site behaves correctly with its content and configuration.

PARISA: If a contributed module has no supported compatible release, that's a real project decision. Replace it, help update it, maintain a justified alternative, or adjust the feature. Don't force the dependency solver and pretend the risk disappeared.

JULES: Also, passing static checks doesn't verify the editor can publish a translated event. Test the workflows and outputs people rely on.

PARISA: Including recovery. The best time to learn whether we can restore the database is before the deployment that needs restoration.

## Frontend Modernization Has a Purpose

JULES: SDC gives reusable components a discoverable home with metadata, Twig, and optional assets. It became stable in Drupal 10.3, so it's part of the modern Drupal 10 story as well as Drupal 11.

PARISA: Its purpose is component organization and contracts. It doesn't automatically turn every Drupal site into a React application, isolate all CSS, or give editors a visual builder.

JULES: Recipes package setup and configuration actions. They reduce repeated assembly work, but applying a recipe isn't an ongoing subscription to every future change in that recipe.

PARISA: APIs let content serve other consumers. They don't require abandoning integrated rendering, and they don't remove authorization or cache-invalidation work.

JULES: These changes solve different problems. Grouping them under modern is convenient marketing, but we should still ask which one helps our project.

## Admin and Editorial Direction

PARISA: What should a frontend developer know about the current editor experience without memorizing a product launch schedule?

JULES: Drupal core's administrative navigation has evolved; the 11.4 release announcement describes Navigation being enabled in the standard administrative interface. Existing sites can have different configuration and administration themes, so don't expect identical screenshots everywhere.

PARISA: And Drupal CMS is a separately versioned assembled product built on core. Drupal CMS 2.0 launched with Canvas, a visual building experience. Canvas is also its own project with compatibility requirements.

JULES: Exactly. These efforts aim to reduce setup and authoring friction. They don't make every existing Drupal site automatically adopt a new editing model.

PARISA: Evaluate the editor's actual task. Can they create a well-structured page, understand its state, preview it, and publish it accessibly? A more visual interface helps only if it improves that work.

JULES: And new AI-assisted features, where used, still require review of accuracy, access, privacy, and the external services involved. Their presence isn't evidence that the underlying content is trustworthy.

## Performance Improvements Still Need Measurement

JULES: Recent Drupal releases have reduced internal database and cache work and improved asset handling. The 11.4 announcement specifically describes field-loading optimizations and better asset compression.

PARISA: Good improvements, but we should not turn a core benchmark into a promise that every university site becomes a fixed percentage faster. Custom queries, contributed modules, media, network conditions, and cache configuration still matter.

JULES: Exactly. Measure representative pages and user states. A warm anonymous homepage, a personalized dashboard, and an editor form stress different parts of the system.

PARISA: And performance includes the human task. A form that takes four seconds to load and ten minutes to understand has more than one problem.

## Scenario One: A Small Research Group

JULES: Six pages, occasional publications, two technically comfortable maintainers, and no formal approval workflow. What would you consider?

PARISA: A static site. Write content in a manageable format, build HTML, and host it simply. If the maintainers can comfortably use the workflow, that might be the smallest useful arrangement.

JULES: Benefits include simple public delivery and fewer moving application parts. But editing, previews, forms, search, and deployment still need suitable solutions where required.

PARISA: Exactly. Static doesn't mean maintenance-free or impossible to compromise. The build pipeline and dependencies still exist. It means a different public runtime shape.

JULES: What if the maintainers change and the new people don't use Git?

PARISA: Revisit the authoring workflow. A CMS-backed static site could be appropriate, or a conventional CMS. The architecture should serve the current team, not preserve the original developer's comfort as a monument.

## Scenario Two: A Publication With Familiar Work

JULES: A campus magazine publishes articles, author profiles, images, and a few custom content types. Its editors already know WordPress, and its team has a reliable maintenance arrangement.

PARISA: WordPress is a strong candidate. Its publishing model and ecosystem fit the job. We'd review plugin choices, permissions, structured fields, accessibility, and backup and update procedures.

JULES: What would make you pause?

PARISA: Requirements for unusually complex relationships, granular workflows, or integrations that require layers of awkward customization. But I'd examine actual implementation options, not reject WordPress because someone once installed twelve conflicting plugins.

JULES: So its popularity is useful context, not the entire decision.

PARISA: Exactly. Availability of people and tools matters. Suitability still has to be demonstrated.

## Scenario Three: Bellweather's Whole Public Estate

JULES: Shared people, departments, programs, courses, events, locations, several languages, many editors, and approval rules. Content appears in several contexts.

PARISA: Drupal is a serious candidate because its structured content, references, Views, display systems, and editorial capabilities align with those needs. We'd still prototype the difficult workflows and integrations.

JULES: And budget for the expertise required to build and operate it. Configurability can save custom implementation, but it adds concepts and maintenance responsibilities.

PARISA: We should ask editors to test the model early. If they need to open seven forms to correct one public fact, we haven't earned the architecture's complexity.

JULES: What if the organization has no Drupal maintenance capacity?

PARISA: Then staffing, a suitable partner, or a different platform is part of the decision. Choosing software without an operating plan is choosing future panic on installments.

## Scenario Four: A Specialized Application

JULES: A system manages complex laboratory reservations with resource conflicts, approvals, transaction rules, and specialized integrations. Public editorial content is a small part of it.

PARISA: A custom application or an existing specialist product may fit better. Start from the domain's core operations instead of forcing everything into content fields because the CMS already has a login screen.

JULES: Drupal can support application behavior, but technical possibility isn't the same as an economical model.

PARISA: And custom application means we own more: admin interfaces, validation, audit trails, access control, and maintenance. We shouldn't choose it merely to avoid learning a CMS vocabulary and then rebuild the same capabilities badly.

JULES: We might integrate a CMS for public information while a specialized system owns reservations.

PARISA: A boundary that matches responsibilities can be better than making one product do everything.

## Scenario Five: Several Channels and an Independent Frontend

JULES: Public website, mobile app, campus screens, and an established frontend team that needs independent release cycles.

PARISA: A headless CMS approach deserves evaluation. Drupal could be the content backend, or another CMS might fit. We compare content modeling, editor experience, API capabilities, preview, access, hosting, cost, and portability.

JULES: And the separate frontend owns its rendering, routing integration, accessibility, and cache behavior. Publication freshness and preview need explicit contracts.

PARISA: We also test an outage. Can the public frontend serve appropriate cached content? What happens to previews? What does the editor see if a publish webhook fails? Two systems create coordination work even when each is individually good.

JULES: If the only reason is that the team likes React, is that enough?

PARISA: Team expertise is legitimate evidence, but we should include the full cost. Preference can influence a decision without becoming a universal architectural law.

[CODE CARD: Compare the actual problem]
```text
Choice              Strong candidate when...          Work you still own
Static site         Small, manageable publishing      Editing/build workflow
WordPress           Familiar publishing requirements  Plugin/theme upkeep
Drupal              Shared structured editorial data Modeling/config/operations
Custom application  Specialized domain behavior      Application/admin/security
Headless CMS        Multiple consumers or deliberate API/preview/cache contracts
                    frontend separation

These categories overlap. A static frontend can use a headless CMS.
A Drupal site can keep its theme while also exposing an API.
```

## The Questions That Change the Answer

JULES: Before choosing, ask who edits, what they edit, how often, and who approves. Ask which content is shared, which relationships matter, and which languages and channels must be supported.

PARISA: Ask what data is sensitive, what systems are authoritative, what failure looks like, and who will maintain the result. Ask how we'll migrate out if our needs change.

JULES: Then build a small example around the hardest real requirement. Not only a pretty homepage, which most systems can produce.

PARISA: For Bellweather, that might be a translated event with a pending room change, a restricted internal note, a public listing, and an API consumer. Can the editor complete the workflow? Does the visitor see the correct approved information? Does the cache update?

JULES: That's a much better experiment than comparing how fast five products can display a hero image.

## Translate the Drupal One Last Time

PARISA: If I open unfamiliar Drupal code now, I can ask whether I'm looking at data structure, query configuration, output preparation, presentation, extension behavior, or deployment state.

JULES: Then identify the layer: PHP syntax, Drupal API, Symfony component, Twig template, Composer dependency, JavaScript behavior, or contributed functionality.

PARISA: I don't need to memorize every class. I need a map that lets me ask the next useful question and look up the correct contract.

JULES: That's the goal. Expertise includes knowing what to inspect and when to check documentation, especially as versions evolve.

PARISA: And the original CMS problem remains gloriously unglamorous: help people maintain correct information without making every update a developer emergency.

JULES: The system should serve the content, the editors, and the people trying to use the result.

PARISA: So before the framework preference, the procurement spreadsheet, the drag-and-drop demo, or the enthusiastic announcement that everything is now an entity—

JULES: One question.

PARISA: What problem are we actually solving?

[OUTRO MUSIC]

## Production References

- Current schedule and Drupal 10 end of life, checked September 16, 2026: https://www.drupal.org/about/core/policies/core-release-cycles/schedule
- Drupal 11.4 release: https://www.drupal.org/blog/drupal-11-4-0
- Current PHP matrix: https://www.drupal.org/docs/getting-started/system-requirements/php-requirements
- Hook API and procedural exceptions: https://api.drupal.org/api/drupal/core%21lib%21Drupal%21Core%21Hook%21Attribute%21Hook.php/class/Hook/11.x
- SDC and Workspaces stable in 10.3: https://www.drupal.org/blog/drupal-10-3-0
- Drupal CMS 2.0: https://www.drupal.org/blog/drupal-cms-20-is-here-visual-building-ai-and-site-templates-transform-drupal
- Canvas compatibility: https://www.drupal.org/project/canvas
- Architecture scenarios are reasoned hypothetical comparisons, not universal product rankings or measured benchmarks.
