# Episode 3: Drupal: Why Is Everything an Entity?

**Series:** Modern CMS Development
**Hosts:** Parisa, Jules
**Production:** September 2026. Audio-first finished script; recording handled separately.

[INTRO MUSIC]

PARISA: I've opened the Drupal documentation. Our event is an entity. Its author is an entity. Its photograph has an entity. The configuration may also be an entity.

JULES: How are you feeling?

PARISA: Like I should check whether my coffee has a bundle.

JULES: Only if there are several configured kinds of coffee.

PARISA: That was dangerously close to making sense. Continue.

## Start With Something We Know

JULES: Welcome to Okay, But Why? We're translating Drupal. Today the core sequence is entity type, bundle, entity, fields. We'll keep attaching those words to Bellweather University's actual information.

PARISA: In an application I might have an Event object backed by database records. It has a title, date, and location. Why doesn't Drupal simply call it an Event?

JULES: It can, in the editor interface. Internally, Drupal needs reusable ways to load, save, validate, render, reference, and check access to different kinds of data. An entity is an individual object managed through that system.

PARISA: So the abstraction exists because lots of objects need similar infrastructure. We shouldn't write a completely separate revision system for events, people, and news if the common system works for them.

JULES: Exactly. Entity type tells Drupal what general kind of object it is dealing with and which handlers and capabilities apply. Bundle supplies a configured subtype where that entity type supports bundles.

PARISA: And a bundle isn't automatically a PHP subclass?

JULES: Correct. That is one of today's most useful distinctions. Several content types can use the same underlying node entity implementation. Their field configuration and behavior can differ without each becoming a different PHP class.

## Four Steps, One Event

JULES: Node is an entity type. Despite the name, this has nothing to do with Node.js. A Drupal node is a kind of content object commonly used for site content.

PARISA: Thank you. I was not prepared for npm to enter the greenhouse.

JULES: Event is a content type, which is a bundle of the node entity type. Moss After Dark is one individual node in that bundle. Its title, date, and location reference are fields or properties represented through the field system.

PARISA: General kind: node. Configured subtype: Event. Individual record: Moss After Dark. Structured information on that record: its fields.

JULES: Yes. News Article could be another node bundle. It shares the broad node infrastructure but has a different field arrangement and different editorial requirements.

PARISA: If I make forty events, I haven't made forty bundles. I've made forty entities using the Event bundle.

JULES: Exactly. Bundle defines a kind of thing editors can create. Entity is the thing they created.

[CODE CARD: Translate the Drupal]
```text
ENTITY TYPE       BUNDLE             INDIVIDUAL ENTITY        FIELDS
node              event              Moss After Dark          title, start, location
node              news_article       New greenhouse opens     title, body, topics
media             image              Greenhouse photograph    image, attribution
taxonomy_term     subject            Botany                   name, description
user              no separate        Editor account           name, email, roles
                  bundle selection

Bundle is a configured subtype, not necessarily a PHP subclass.
Not every entity type has several bundles or supports all capabilities.
```

## The Definition Is Not the Content

PARISA: Where does Event itself live? Is the content type also a node?

JULES: No. The content type definition is configuration. In Drupal it is represented by a node-type configuration entity. The individual events are content entities.

PARISA: So content entities hold the changing information, while configuration entities describe parts of how the site is arranged.

JULES: Broadly, yes. Views definitions, roles, and content-type definitions are examples of configuration entities. Not all configuration uses a configuration entity; some is simple configuration. We'll separate those deployment concerns later.

PARISA: But for now, creating the Event type and creating an event are different operations on different things. One changes the application's model; the other adds content to that model.

JULES: Exactly. That's why an admin click can turn out to be a deployable application change.

PARISA: And entity does not mean one database row. A revisionable, translated object with several fields may span multiple tables.

JULES: Right. Think managed data object, not a promise about physical storage. Drupal's entity storage API handles that mapping. Knowing SQL helps you reason about it, but bypassing the API to update one table can leave the larger object inconsistent.

## Fields Are More Than Labels

JULES: A field has a data type and a definition. A date isn't merely a text input with Date written above it. Its type informs storage, validation, editing widgets, and display formatters.

PARISA: The widget is how an editor supplies the value. The formatter is how the value is displayed. The stored value is neither of those interfaces.

JULES: Exactly. You can change a date's display format without changing the meaning of the date. A field can also contain multiple values if its cardinality permits them.

PARISA: Cardinality: how many values the field allows. One venue, several speakers, potentially many topics. Familiar database modeling with an admin form attached.

JULES: Drupal distinguishes base fields defined by an entity type from configurable fields attached through configuration. Field storage configuration describes storage-related properties; field configuration on a bundle controls how that field is used there.

PARISA: We don't need to memorize those configuration filenames yet, but the distinction explains why changing a field label is not the same operation as changing the underlying field type.

JULES: Yes. Some storage changes are restricted after data exists. A convenient dropdown does not make a data migration unnecessary.

PARISA: If someone asks us to turn a multi-value text field full of free-form dates into a proper date field, that is a conversion problem. We need to inspect and migrate the existing values.

## References Create Relationships

JULES: Moss After Dark happens at the Greenhouse. We could copy the building name, address, and directions into every event. Or the event can reference a Location entity.

PARISA: Like a foreign-key relationship conceptually. The event identifies another record instead of duplicating all its information.

JULES: That's the useful translation. Drupal references can carry additional conventions, and not every integrity rule is enforced by a database foreign-key constraint. We need to understand the entity API and deletion behavior.

PARISA: Important. A reference field does not automatically mean the system prevents every dangling relationship or archives dependent content exactly as we want.

JULES: A standard entity reference points to the target entity. It generally doesn't mean “freeze this exact target revision forever.” Revision-specific relationships require the appropriate design or contributed functionality.

PARISA: So updating the greenhouse address may affect every event that renders the current location. That's helpful unless our requirement was to preserve the historical address as it appeared on the event date.

JULES: Exactly. Shared current information and historical snapshots are different requirements. Reuse is a decision, not a moral virtue.

## Taxonomy Is a System of Meaning

PARISA: Let's translate taxonomy carefully. We used it in WordPress, and now Drupal has vocabularies and terms.

JULES: In Drupal, taxonomy terms are content entities. A vocabulary groups terms and acts as the bundle for the taxonomy-term entity type. Subject could be a vocabulary; Botany and Computer Science could be terms.

PARISA: The vocabulary definition is configuration. The actual terms are content. That's a distinction we will care about when moving a site between environments.

JULES: Exactly. Terms can have their own fields, descriptions, and hierarchy. Taxonomy is structured classification, not just tags appended to articles.

PARISA: A controlled subject list lets news and events share a classification. A visitor can find everything about Botany without us matching random strings in body text.

JULES: But a Department might deserve a real content record rather than only a classification term if it has substantial editorial information, contact details, people, and its own lifecycle.

PARISA: Or a taxonomy term could be sufficient for a simpler site. We choose based on the work the object must support, not a rule that all nouns become nodes.

JULES: Precisely. Translate the Drupal, then decide whether the model fits.

## Media Is Not Just a Filename

JULES: Media is another content entity type. Its bundles are media types, such as Image or Remote Video. A particular photograph is a media entity of the Image type.

PARISA: The media source determines how it represents the underlying asset. A local image can refer to a managed file; a remote video can refer to an external resource. Different sources, common editorial management.

JULES: And the file itself can be represented by a file entity. That doesn't mean “file” and “media” are redundant synonyms. One concerns the managed file; the other supplies a reusable media abstraction and associated metadata.

PARISA: The photo has bytes, a filename, perhaps a credit and rights information, and a role in content. Those are related responsibilities, not necessarily one record.

JULES: Also, referencing restricted media from public content doesn't grant access. Rendering and access checks must respect both sides of a relationship.

PARISA: If I can see a public event, it doesn't follow that I may download every file mentioned somewhere in its editing form.

## Users and the Block Trap

JULES: User accounts are entities too. They share entity-system capabilities, but they aren't nodes and don't normally present editors with a menu of user bundles like Event and News Article.

PARISA: What about a Person profile? Our university has people who never log in.

JULES: Good reason to distinguish a public Person content record from an authentication account. They might be related, but employment information and login identity have different lifecycles and access needs.

PARISA: Now blocks. This word seems particularly determined to be several things.

JULES: It is. A block plugin supplies a piece of functionality or output, such as a menu or a custom computed panel. A placed block is configuration describing placement and settings. A reusable content block can be a block-content entity with a block type as its bundle.

PARISA: So “move the block” could mean change its placement. “Edit the block” could mean change a content entity. “Build a block” could mean write a plugin. We need the sentence around the noun.

JULES: Exactly. Treating all three as the same object is how someone edits PHP when the actual problem is a visibility setting.

[CODE CARD: Three block-related responsibilities]
```text
Block plugin           Produces a kind of block output/behavior
Placed block config    Chooses where/when an instance appears
Block content entity   Stores reusable editorial block content

A content block can be displayed through the block system.
These objects cooperate; they are not interchangeable.
```

## Revisions and Translations Are Capabilities

PARISA: Do all entities have revisions?

JULES: No. Entity types declare capabilities. Some content entities are revisionable or translatable; others aren't. Even when a capability exists, site configuration and code determine how it is used.

PARISA: A revision is a saved version of an entity. A translation is a language variation of its information. Those are different axes.

JULES: Yes, and combining translations with revisions and moderation can get subtle. We should test the exact editorial workflow rather than assuming each translated field is an independent miniature website.

PARISA: And a new pending revision need not be the default revision visitors see. “Latest” and “currently published” aren't always the same record version.

JULES: That's an important debugging question: which revision did this code load, in which language, under whose access? A correct entity ID alone doesn't answer all three.

## When Would We Make a Custom Entity Type?

PARISA: If a bundle is so flexible, why ever define a custom entity type?

JULES: When the domain needs behavior or storage that doesn't fit existing types well. A specialized application record might need distinct handlers, lifecycle rules, or integration behavior. But custom entities come with work: access, forms, routes, storage definitions, updates, and testing.

PARISA: So “our noun isn't Article” is not sufficient reason. A node bundle may already supply the capabilities we need.

JULES: Exactly. We should be able to explain what existing infrastructure we're keeping and what problem justifies new code.

PARISA: Conversely, forcing financial transactions into ordinary editorial nodes just because the admin screen is convenient could be a terrible fit.

JULES: Right. The entity API is extensible; that doesn't make every possible application model a sensible CMS project.

## Read an Unfamiliar Site

JULES: Suppose a colleague asks why Moss After Dark has the wrong building. What do you inspect first?

PARISA: Identify the record and its bundle. Check the location reference value. Inspect the target Location record. Then determine whether the output uses that reference or some separately entered text.

JULES: Good. If the location field doesn't appear in the editor?

PARISA: Check its definition and form display configuration, plus permissions. Don't conclude the database lost it because one form hides it.

JULES: And if it appears in the editor but not on the public page?

PARISA: That's probably a rendering or access question, not evidence that the field isn't stored. Different layer, different investigation.

JULES: That's the payoff. The vocabulary lets us separate problems instead of calling all of them Drupal being weird.

PARISA: Node, Event, Moss After Dark, start time. Type, bundle, entity, field. I can work with that.

JULES: Next time we'll decide which fields and relationships Bellweather actually needs.

PARISA: My coffee remains unmodeled. I would like one small part of my life to survive this series without configuration export.

[OUTRO MUSIC]

## Production References

- Entity API: https://www.drupal.org/docs/drupal-apis/entity-api/introduction-to-entity-api
- Content entities and fields: https://www.drupal.org/docs/user_guide/en/understanding-data.html
- Taxonomy: https://www.drupal.org/docs/user_guide/en/structure-taxonomy.html
- Blocks: https://www.drupal.org/docs/user_guide/en/block-concept.html
- Entity reference analogy is conceptual; it does not promise database-enforced foreign-key semantics or revision pinning.
