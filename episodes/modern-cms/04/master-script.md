# Episode 4: Content Modeling: Why Drupal People Won't Shut Up About Structure

**Series:** Modern CMS Development
**Hosts:** Parisa, Jules
**Production:** September 2026. Audio-first finished script; recording handled separately.

[INTRO MUSIC]

JULES: I made Bellweather University a content model.

PARISA: Excellent. Why does it have sixty-three entity types?

JULES: I may have modeled every noun in the requirements meeting.

PARISA: Including Meeting?

JULES: And Requirement.

PARISA: Put down the diagramming tool. We're going to talk to an editor.

## Structure Should Earn Its Place

JULES: Welcome to Okay, But Why? Last time, entity type, bundle, entity, fields. Today we're deciding what those fields and relationships should be.

PARISA: Content modeling is designing the information the system manages. Not drawing the final homepage and turning every rectangle into a database object.

JULES: Drupal emphasizes this because its fields, references, Views, displays, and APIs can all use the structure. But more structure isn't automatically a better model.

PARISA: Let's start with tasks. A student wants to find a program, see which department runs it, understand the courses, and locate a contact. An editor wants to update that contact once without hunting across twenty pages.

JULES: A visitor wants upcoming events at a particular location. A communications editor wants to reuse a person's profile in news and department listings.

PARISA: Those are reasons for relationships. “The architecture diagram will look impressive” is not.

JULES: We'll use node bundles for the main editorial records in our example. That's a design choice for this fictional site, not a declaration that every university must use nodes for all its data.

## Seven Useful Kinds of Content

PARISA: Person stores a public profile: name, biography, photograph, perhaps contact information. It's separate from a login account.

JULES: Department stores organizational information and contact details. Program describes a degree or other course of study. Course describes a catalog offering. Event has time and place. News Article is an editorial story. Location represents a building or venue.

PARISA: And already I have a question about Course. Do we mean the enduring catalog course or this semester's scheduled class with a particular instructor?

JULES: Good catch. Those are different concepts. In our model, Course means the catalog entry. Timetabled sections remain in the university's authoritative scheduling system unless requirements justify modeling or synchronizing them here.

PARISA: That distinction prevents us from quietly rebuilding a registrar system because somebody wanted a course list.

JULES: Exactly. Content modeling includes deciding where the CMS stops. A reference to an external course identifier can be more appropriate than pretending Drupal owns the official enrollment record.

PARISA: And if the authoritative system changes a course title, we need a synchronization policy. Which fields are editable here? Which are imported? Who wins when values disagree?

JULES: Otherwise “single source of truth” becomes a phrase both systems use while contradicting each other.

## Relationships Answer Questions

JULES: Program references Department. Person can reference one or more Departments. Event references Location and may reference its speakers. News Article can reference related people or programs.

PARISA: References let us ask meaningful questions. Show people associated with Botany. Show events at the Greenhouse. Show news related to this program.

JULES: And the reverse listing usually doesn't need a second manually maintained field. If events reference a location, we can query events whose location reference matches this location.

PARISA: Otherwise editors maintain both “this event uses the greenhouse” and “the greenhouse contains this event,” and those two lists eventually divorce.

JULES: Relationship direction and ownership should be deliberate. Some relationships need their own attributes. If a person's department membership has a job title and a start date, a simple list of department references may not represent enough information.

PARISA: Then we consider a richer relationship model. We don't add it preemptively to every field because one hypothetical person might someday have a committee.

[CODE CARD: Bellweather relationship sketch]
```text
Program --------> Department <-------- Person
   |                                      ^
   v                                      |
Course                                  Event ------> Location
                                          ^
                                          |
News Article ----> related Program / Person / Event

Arrows mean an explicit reference field in this example.
Reverse listings can be queries; do not maintain duplicate lists by hand.
Course is a catalog record, not a student's enrollment or class section.
```

## Cardinality Makes Promises

PARISA: Let's say Event has one required Location reference. What happens to an online event?

JULES: Our first model has a hole. We need to support online and hybrid events, perhaps with a format choice and appropriate venue or joining information.

PARISA: And validation that matches those choices. A physical event requires a venue; a public online event may need a public registration URL rather than a private meeting password stored in public content.

JULES: Exactly. Cardinality tells us how many values are allowed, but conditional requirements need additional validation or suitable tools. A field's existence doesn't implement every business rule.

PARISA: Can an event have several speakers?

JULES: Yes, so that reference is multi-value. We also need to decide whether order matters. A list of panelists might be alphabetical; a running order might be editorially significant.

PARISA: These details become user-interface decisions. Can an editor reorder values with a keyboard? Does the label explain what the order means? Are errors attached to the right field?

JULES: The data model and authoring experience are connected. A technically valid schema can still produce a miserable form.

## Taxonomy or Content Record?

JULES: We want to classify events by subject. Botany, Computing, History. A Subject vocabulary is useful because these are controlled labels shared across content.

PARISA: But Department also sounds like classification. Why not put departments in a vocabulary?

JULES: We could on a simpler site. Here, departments have substantial managed information and relationships. Treating them as editorial records fits our chosen lifecycle. Taxonomy terms can have fields too, so the distinction isn't “terms are tiny and nodes are big.”

PARISA: It's what capabilities, ownership, and interfaces we need. If a term changes from Computing to Computer Science, what should happen to historical content? If two departments merge, is that a rename or a new organization?

JULES: Exactly. Technical identifiers should remain stable where possible, while human labels can change. But sometimes the meaning changes enough that a new record is appropriate.

PARISA: The database can't resolve institutional history by itself. Someone has to define the rule.

## The Giant WYSIWYG Blob

JULES: Why not let editors create everything in a rich-text body? Heading for the location, paragraph for the address, bold text for the time.

PARISA: Because then a human can read the date, but the system may not reliably sort events by it. We would be scraping our own content and hoping everyone bolded the same words.

JULES: Separate fields support validation, querying, reuse, and alternative presentations. The mobile app doesn't need to parse the event's visual layout to discover its start time.

PARISA: But prose still belongs in prose fields. The event description can have paragraphs and useful links. The answer isn't replacing every sentence with a textbox labeled Sentence.

JULES: Right. A rich-text editor can coexist with structure. We restrict allowed formatting to what the site supports and give editors a usable set of tools.

PARISA: And text formats are security boundaries. A permission to enter unrestricted HTML is powerful. We shouldn't give it to everyone to fix one formatting complaint.

JULES: Instead, improve the supported markup or component. If editors routinely fight the system, that's feedback about the model and design—not evidence that they are bad at content.

## Reuse Has an Editorial Cost

PARISA: We reuse a person's biography in several places. They update it once, and every current display can use the new version. Lovely.

JULES: Until a news story from five years ago is meant to preserve their title at the time. A live reference to the current title might rewrite the apparent history.

PARISA: So perhaps the story references the person for identity but records their quoted role as part of the historical story. Deliberate duplication can preserve meaning.

JULES: Exactly. Normalize shared facts where reuse is useful, but don't erase time and context. “Never duplicate data” is an unhelpful absolute for editorial material.

PARISA: Also, deleting a reused record needs a policy. Prevent deletion while referenced? Archive it? Replace it? Preserve a snapshot? We need to know before the editor presses Delete.

JULES: Drupal gives us mechanisms. Our content model and extensions define the actual behavior. A reference field doesn't write the organization's retention policy.

## View Modes and Form Modes

JULES: Now the same Event record appears as a full detail page, a compact card, and a search result. Drupal view modes name those presentation arrangements.

PARISA: So Teaser might show title, date, and location. Full might include the description and registration link. We're selecting and formatting existing content, not duplicating the event.

JULES: Exactly. The view-mode definition and display configuration are distinct pieces, but the practical mental model is a named way to render an entity.

PARISA: A field hidden in a display still exists. Hiding it is not necessarily an access restriction, especially if another output or API exposes it.

JULES: Yes. Display configuration is presentation, not a universal privacy policy.

PARISA: Form modes are the editing counterpart: named arrangements of widgets for editing the entity.

JULES: Right. A streamlined editorial form can expose fewer fields than a more complete administrative form. But merely defining a form mode doesn't automatically route every editor to it. The relevant form or route must use it.

PARISA: And hiding a widget still isn't server-side authorization. We keep finding that lesson because it keeps being true.

[CODE CARD: One entity, separate display decisions]
```text
Event entity
  Public full view: title + date + location + description + registration
  Teaser view:      title + date + location
  Editorial form:  appropriate widgets for permitted edits

View mode = named output context
Form mode = named editing context
Access rules = who may read/change the underlying information

Do not use a hidden display field as a confidentiality control.
```

## Workflow Is Part of the Model

JULES: Bellweather's event coordinator drafts a room change. Communications reviews it. The old published revision stays visible until approval.

PARISA: Drupal's Workflows and Content Moderation modules can support those states and transitions for suitable content. We configure which bundles participate and which roles can make transitions.

JULES: A revision records a version. A moderation state describes its editorial position. The published/default revision and a newer pending revision can differ.

PARISA: We need a preview that shows the pending revision to authorized reviewers without making it public. An anonymous acceptance test is part of the workflow, not an afterthought.

JULES: And scheduled publishing may require additional functionality. Core moderation isn't a universal calendar scheduler simply because it has states.

PARISA: What about a coordinated launch across several pages?

JULES: Workspaces addresses sets of content changes that can be prepared together. It became stable in Drupal 10.3. It's a separate capability from staging code and configuration on another server.

PARISA: Good distinction. Editorial workspace is not a synonym for our staging environment. Similar words, different boundaries.

## Multilingual Means More Than Translation Boxes

JULES: A university may publish in several languages. Structured fields help identify what needs translation and what should be shared.

PARISA: A biography may be translated. A stable external course identifier probably shouldn't be independently translated. A date value can stay the same while its presentation uses the visitor's language and locale.

JULES: Drupal has separate systems for interface translation, content translation, and configuration translation. Enabling one isn't a promise that every string and editorial workflow is complete.

PARISA: And translating a location name doesn't mean every translation has been reviewed for emergency directions. Content ownership and publication rules still matter.

JULES: The model should make those decisions visible. Which fields are translatable? What is the fallback behavior? Can one translation be pending while another is published? Test the actual configuration with the people using it.

## Try the Model Before Filling It

PARISA: Before we import ten thousand records, I want five awkward examples: an online event, a hybrid event, a person in two departments, an archived program, and a course whose source system changes its title.

JULES: Then ask editors to create and update them. Watch where they hesitate, duplicate information, or put important facts into the wrong field because the right field doesn't exist.

PARISA: Also ask visitors to find them. A beautiful form that produces unusable search filters has only solved half the problem.

JULES: This is cheaper than discovering the mismatch after migration. Schema changes can require data conversion, integration updates, display changes, and retraining.

PARISA: And don't try to predict every future use. We need enough structure for established requirements, with a reasonable path to change. A model that anticipates all possible universities is probably unusable by this one.

## Why This Fits Some Organizations

JULES: Universities, governments, and large organizations often have shared content, many editors, multiple languages, and complicated publication responsibilities. Drupal's configurable structure can be valuable there.

PARISA: But complexity isn't a badge of seriousness. If a small club needs six pages and occasional news, a simpler CMS or static workflow might produce a better result with less maintenance.

JULES: The benefit is coordinated information, not the number of Drupal nouns in the proposal.

PARISA: We now have records the system understands. Next time, we ask how those records become an actual page.

JULES: Views, display modes, render arrays, and caching.

PARISA: Four more nouns. Fine. But they each have to pay rent.

[OUTRO MUSIC]

## Production References

- Content structure: https://www.drupal.org/docs/user_guide/en/structure-content-type.html
- Display modes: https://www.drupal.org/docs/drupal-apis/entity-api/display-modes-view-modes-and-form-modes
- Content Moderation: https://www.drupal.org/docs/core-modules-and-themes/core-modules/content-moderation-module
- Workspaces stable in 10.3: https://www.drupal.org/blog/drupal-10-3-0
- Bellweather model is an illustrative design, not a shipped Drupal configuration package.
