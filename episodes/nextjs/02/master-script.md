# Episode 2: The Folder That Controls Reality

**Series:** Next.js
**Runtime:** Target approximately 30 minutes; final timing depends on the recorded performance.
**Hosts:** Parisa, Jules

[INTRO MUSIC]

JULES: I made a page.

PARISA: Where did you register the route?

JULES: I put it in a folder.

PARISA: That's where I put tax documents I hope will stop existing.

JULES: In this case, the folder makes something exist.

PARISA: Disturbing escalation.

[STING]

## The URL Needs an Answer

JULES: Welcome back to Okay, But Why? DemoCon needs a sessions page. Before we discuss special filenames, what is routing?

PARISA: Matching an incoming location to the code or content that should answer it. In a traditional application, I might define an explicit route table: this path calls this controller, which renders this template.

JULES: Next's App Router uses the file system to express much of that relationship. Folders correspond to route segments, and special files define the UI or behavior for those segments.

PARISA: A convention instead of a route registration statement for every page.

JULES: Exactly. It reduces repetition and gives the framework a tree it can use for layouts, loading states, and navigation. The tradeoff is that filenames and folder placement become part of the application's behavior.

PARISA: So renaming a folder is not necessarily housekeeping. It can change a public address.

JULES: Yes. An address that might exist in bookmarks, search results, printed programs, or a QR code on a conference sign.

PARISA: The printed program does not automatically rebase itself. Ask me how I know.

## A Small Tree You Can Hear

JULES: Picture a folder called app. Inside it, page dot jsx supplies the homepage. A sessions folder contains its own page dot jsx for the session list. Inside sessions, a folder named slug in square brackets contains a page for individual sessions.

PARISA: The square brackets mean this part of the path is variable. We don't literally send people to a URL containing bracket slug bracket.

[CODE CARD]
~~~text
app/
  layout.jsx
  page.jsx
  sessions/
    page.jsx
    [slug]/
      page.jsx
~~~

JULES: This is a file-tree diagram, not JavaScript. The folder and filename conventions are Next.js-specific. JSX inside the files is React UI syntax. We use JavaScript examples unless there is a reason to introduce a type.

PARISA: Slash sessions maps to the list page. Slash sessions slash boring-deployments maps to the dynamic detail page, with boring-deployments as the slug value.

JULES: Right. The dynamic segment gives us an input. It doesn't produce a real session automatically. We still look up the data and handle a missing result.

PARISA: A routing match is not a database match. Slash sessions slash unicorn-tax-law might match the route shape and still identify absolutely nothing.

JULES: Unless you add that talk.

PARISA: I would attend. I would not organize it.

## A Folder Alone Is Not a Public Page

JULES: An important detail: putting a folder under app doesn't, by itself, create a navigable page. A page file makes UI available at that route. A route handler file can expose an HTTP endpoint, which we'll cover later.

PARISA: So I can colocate a component next to the page that uses it without creating an address for that component.

JULES: Yes. A SessionCard file isn't automatically another page. Conventions distinguish route entry points from supporting files.

PARISA: That helps. Otherwise my helper function would receive search-engine traffic and develop an ego.

JULES: You can also use private folders prefixed with an underscore to opt a subtree out of routing. And route groups in parentheses organize routes without adding their names to the URL.

PARISA: Give me one reason for a group, then stop before we invent a filing cabinet certification.

JULES: Grouping public and organizer sections for layout organization. The parentheses indicate organizational structure, not a literal public path segment. For DemoCon's basic routes, we don't need groups yet.

PARISA: Good. Recognize the syntax when reading a project; don't add it because the syntax exists.

## What Is a Page, Actually?

JULES: A page file exports a React component as its default export. Next finds that component through the file convention and uses it for the route's UI.

[CODE CARD]
~~~jsx
// app/sessions/page.jsx
export default function SessionsPage() {
  return (
    <main>
      <h1>DemoCon sessions</h1>
      <p>Find a talk worth missing the coffee queue for.</p>
    </main>
  );
}
~~~

PARISA: Export default is JavaScript module syntax. It says this module has a default exported value. The framework looks for that export in this special file.

JULES: And the function is a React component. The markup is JSX. The elements it describes become ordinary semantic HTML in the rendered page.

PARISA: The component doesn't have to be named Page?

JULES: Correct. The default export and file convention matter. A descriptive function name is useful to humans and debugging tools.

PARISA: Which is refreshing. The filesystem is already being quite dramatic; the function can have a normal name.

JULES: Notice the main landmark and heading. We'll make pages own the main element and keep the shared layout outside it, so we don't accidentally nest a main inside another main.

PARISA: That's an application markup decision, not a magical Next rule. We still have to arrange the resulting document sensibly.

## Layouts Are Shared Structure

JULES: DemoCon needs a shared header and navigation. Copying that into every page would be tedious and make updates inconsistent. A layout wraps the pages and nested layouts below its segment.

PARISA: Familiar template inheritance territory. Where does the page go?

JULES: Through the children prop. That's a React composition convention: the nested content passed into this component. The layout chooses where it appears.

[CODE CARD]
~~~jsx
// app/layout.jsx
import Link from 'next/link';

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <a href="#main-content">Skip to content</a>
        <header>
          <nav aria-label="Main">
            <Link href="/">DemoCon</Link>
            <Link href="/sessions">Sessions</Link>
          </nav>
        </header>
        {children}
      </body>
    </html>
  );
}
~~~

PARISA: Destructuring children from the argument is JavaScript. The curly braces inside JSX mean “evaluate this expression.” Link comes from Next. The nav and anchor are HTML elements expressed through JSX.

JULES: The root layout includes html and body. Each page should give its main element the main-content identifier, matching that skip link. Our earlier minimal page needs that id when used with this layout.

PARISA: And our CSS needs visible keyboard focus. A skip link doesn't help if someone cannot see where they are going.

JULES: Nested layouts can add structure for a subsection. A sessions layout could add session-specific navigation around both the list and detail routes.

PARISA: Could. We have two routes, so we should first ask whether another layout earns its existence.

JULES: Yes. Also, layouts are preserved across client navigations that share them. That can preserve interactive state and avoid unnecessarily rebuilding shared UI.

PARISA: Which means I shouldn't assume a layout is rerun from scratch on every click and use that assumption for sensitive checks.

JULES: Exactly. A layout is not an authorization boundary for every operation below it. Permissions need enforcement where protected data is read or changed.

## The Dynamic Part Is Input

PARISA: Let's follow boring-deployments into the detail route. How does our component receive it?

JULES: Next supplies route props. In the Next.js 16 App Router, params is asynchronous. In an async Server Component page, we await it before reading slug.

[CODE CARD]
~~~jsx
// app/sessions/[slug]/page.jsx
import { notFound } from 'next/navigation';
import { getPublicSession } from '../../lib/sessions';

export default async function SessionPage({ params }) {
  const { slug } = await params;
  const session = await getPublicSession(slug);

  if (!session) notFound();

  return (
    <main id="main-content">
      <h1>{session.title}</h1>
      <p>{session.abstract}</p>
    </main>
  );
}
~~~

PARISA: That helper is our application data-access function. Its implementation is coming later; installing Next doesn't create it. The import assumes it lives in app slash lib slash sessions.

JULES: Right. Async and await are JavaScript. They let the function wait for promises without writing a chain of then callbacks. Next's params contract is the reason we await that particular value. notFound is a Next function that stops this rendering path and uses the not-found handling.

PARISA: We aren't calling a helper named notFound and then casually continuing to render an undefined session.

JULES: Correct. It interrupts that path. The framework provides a default not-found experience, or we can supply an appropriate file to customize it.

PARISA: And the slug is untrusted input. Even if the route matched, data access should use a safe query, not concatenate it into SQL.

JULES: Yes. The square brackets establish the URL shape. They don't sanitize input, authorize the caller, or ensure a record exists.

PARISA: Three jobs the folder has wisely declined.

## A Path Parameter Is Not a Query Parameter

JULES: The slug identifies the session in our route. A query string can express something else, such as a filter: slash sessions question mark track equals web.

PARISA: Same route, additional input. It doesn't require a separate track-equals-web folder.

JULES: Exactly. App Router pages can receive searchParams, also asynchronous in this version. Values still need parsing and validation. A user can send repeated query keys or an unexpected value.

PARISA: URLSearchParams is a Web API people may know, but the page's searchParams prop isn't simply that exact object.

JULES: Correct. Don't mix contracts because the names resemble each other. Read the API you are using. Next's navigation hooks provide another context, especially in client code.

PARISA: We will not enumerate every hook today. The concept is that the URL can carry shareable application state, and routing gives us access to it.

JULES: A filter in a query string is useful because someone can bookmark or share the filtered schedule. A transient open tooltip probably doesn't need an address.

PARISA: Not every sneeze belongs in browser history.

## Navigating Without Breaking the Web

JULES: Next's Link component integrates internal navigation with the framework. It renders an anchor and can participate in prefetching and client navigation.

PARISA: So users still get a link destination, keyboard activation, and familiar link behaviors. We aren't turning a span into a navigation device.

JULES: Exactly. For our session card, a Link points to slash sessions slash boring-deployments. You can provide the slug using a JavaScript template literal. That's the backtick string with an expression inserted into it.

PARISA: Label the link with the talk title. Ten links all called “Learn more” become an unpleasant guessing game when read out of context.

JULES: And don't nest a favorite button inside that link. Navigation and favoriting are separate actions with separate controls.

PARISA: A card can contain both. It doesn't need to be one enormous interactive nesting accident.

JULES: Prefetching means the framework may prepare navigation data before the click. The amount depends on route behavior and configuration. It can make navigation feel faster, but it still uses resources.

PARISA: So seeing a request in developer tools before I click isn't necessarily a ghost. It may be the router doing anticipatory work.

JULES: Right. And development behavior may differ from production. We'll evaluate production navigation when diagnosing performance.

## Dynamic Name, Separate Rendering Decision

PARISA: Here's a terminology trap. We called bracket slug a dynamic route. Does that mean its HTML must be generated anew on every request?

JULES: No. Dynamic segment means the path contains a variable value. Rendering timing is a separate question. Known paths can be prepared ahead of time using mechanisms such as generateStaticParams.

PARISA: So boring-deployments and accessible-forms can be concrete paths from the same route pattern. The pattern is variable; those pages may still be prepared in advance.

JULES: Exactly. And a fixed path can require request-time work if it depends on the current visitor. Slash my-schedule has no bracket folder but might be personalized.

PARISA: The word dynamic is doing two shifts. We should pay it overtime or qualify it.

JULES: We'll qualify it. Dynamic URL segment versus request-time rendering. That distinction will save us pain next episode and the one after.

## When Conventions Help and When They Chafe

PARISA: I like being able to inspect a small tree and understand the site. What gets awkward?

JULES: Large routing needs can introduce many conventions: groups, parallel routes, intercepting routes, templates, nested error boundaries. Those solve particular problems, but learning all of them at once is unnecessary.

PARISA: The basic tree isn't a failure just because the documentation has advanced pages.

JULES: Exactly. File-based routing helps when the tree matches the application's structure. It can be less obvious when product URLs and organizational code boundaries don't align neatly. Then you need to understand the framework's organizational mechanisms.

PARISA: Compared with an explicit route table, the registration is distributed through filenames. That's easier for some questions and harder for others.

JULES: Yes. There isn't a universal readability winner. The team needs a convention it can explain and maintain.

## Walk Through a Real Navigation

JULES: Let's slow down one visit. An attendee enters slash sessions slash boring-deployments in a new tab. This is a direct document request, not a click handled by an already-running application.

PARISA: Next matches the route segments. Sessions is fixed. The bracket-slug segment supplies boring-deployments. The page's default component gets the route props, and the shared root layout participates in the result.

JULES: Correct. The data helper then decides whether a published session exists for that slug. Routing only got us to the appropriate code.

PARISA: If the session exists, the result contains a main landmark, a heading, and the public description. If it doesn't, not-found handling gives the user an understandable path forward.

JULES: Such as a link back to the schedule. A missing page doesn't need to be a dead end with a giant number and no navigation.

PARISA: Now the attendee clicks Sessions in the shared navigation. The Link component can use the framework's client navigation system, preserving the shared layout where appropriate.

JULES: Exactly. The public URL still changes. Browser history still matters. Framework navigation should enhance those web behaviors, not make them disappear.

PARISA: Back should take me where I expect. Opening a link in another tab should still work. Copying the URL should identify the same resource for another visitor who is allowed to see it.

JULES: Those are useful checks because they verify that the route model serves people, not just the framework.

## Layout State Can Be Useful and Surprising

PARISA: Suppose our header contains a small client menu. I open it, then navigate between session pages. A preserved layout may preserve the component state too.

JULES: Yes. That's useful for some state and surprising for other state. The application should intentionally close a navigation menu when appropriate rather than relying on every route change to remount everything.

PARISA: Another example: I put a value derived from a query string into a layout and assume it updates with each page visit.

JULES: That can conflict with how layouts are preserved and what props they receive. Query-dependent page content belongs in the appropriate page or client navigation context. Don't use a shared layout as a dumping ground for all route data.

PARISA: Shared structure is the reason for the layout. It isn't proof that every piece of changing information belongs there.

JULES: Exactly. Templates are another convention that can create different remount behavior, but we don't need to introduce one until we actually need that behavior.

PARISA: I appreciate an advanced feature being allowed to remain advanced for more than nine seconds.

## Addresses Are Part of the Product

JULES: What happens if an organizer changes the talk title?

PARISA: We should decide whether the slug stays stable. A readable slug is useful, but constantly changing the address with every editorial tweak breaks links unnecessarily.

JULES: Exactly. A stable internal identifier and a human-friendly slug serve different purposes. The database can keep the identifier while the application defines a URL policy.

PARISA: If a slug does change, we may retain an old-to-new mapping and redirect. That's an application content decision, not something the bracket folder infers from the new title.

JULES: Right. The framework knows the route pattern. It doesn't know that two titles describe the same talk across an edit.

PARISA: And if two talks have similar titles, we need unique slugs or another clear identifier strategy. A folder convention won't resolve content collisions.

JULES: Correct. That's why our demo uses a stable boring-deployments example rather than generating a new address every time someone edits the punctuation.

## A Catch-All Is Not a Default Requirement

PARISA: People will eventually see three dots inside square brackets. What should they recognize without learning every routing feature today?

JULES: A catch-all segment matches multiple path segments. An optional catch-all can also match the absence of those segments. Those conventions are useful for structures such as documentation paths with varying depth.

PARISA: Our session detail needs one slug, so a single dynamic segment is clearer. More flexible matching can also mean more input shapes to handle.

JULES: Exactly. Don't use a catch-all because it seems future-proof. It can make missing-route behavior and validation less obvious.

PARISA: The smallest route that describes the product is often the easiest one to explain and verify.

JULES: Yes. The same applies to route groups and nested layouts. They exist for real organizational and UI needs, not because a serious project must contain every punctuation mark the router recognizes.

## Read the Resulting HTML, Not Just the Tree

PARISA: Our root layout owns the header, and pages own main. What happens if somebody later wraps children in another main inside the layout?

JULES: We'd have nested main landmarks in our current design. The code might look locally reasonable in each file, but the combined document would be wrong.

PARISA: That's an important component-system habit: inspect composition, not just individual files. A page and layout cooperate to make one document.

JULES: Exactly. The same issue appears with headings and navigation labels. Two separate nav elements may need distinct accessible names so their purposes are clear.

PARISA: A session sidebar called Session navigation and a header called Main navigation are more useful than two unexplained landmarks.

JULES: And the skip-link target must exist on every page using that layout. The id isn't a styling ornament; it's the destination of a real interaction.

PARISA: So a route check includes opening the page and using that link, not merely seeing that the file exists.

## A Small Refactor Without a New URL

JULES: Suppose the session list grows a reusable SessionCard component. How would we organize it?

PARISA: Put a supporting component near the list or in a shared components location according to who uses it. Import it into the page. The route remains slash sessions because the page file remains the route entry.

JULES: Exactly. Moving supporting code doesn't need to change the public address. Moving the route segment can.

PARISA: That's a useful separation. We can improve internal organization while treating public URLs as a compatibility promise.

JULES: And if a component becomes shared later, move it then. We don't need a complicated global components taxonomy for a two-page demo.

PARISA: Small working structure first. The folders can apply for management positions when they have staff.

## Trace It Once

JULES: Quick check. Someone requests slash sessions. Which file provides the leaf UI?

PARISA: The page file inside app slash sessions. The root layout wraps it.

JULES: Someone requests slash sessions slash boring-deployments?

PARISA: The page inside the bracket-slug folder. It awaits params, reads the slug, looks up public data, and handles no match. Routing doesn't perform the data lookup for us.

JULES: Someone adds SessionCard dot jsx beside the list page?

PARISA: Supporting component, not a new public URL. We import it where needed.

JULES: Someone renames sessions to talks?

PARISA: They've changed an address, not merely tidied a drawer. We consider links and redirects before breaking everyone's printed QR code.

JULES: And a favorite button inside a navigation link?

PARISA: We separate the controls and quietly confiscate the mouse until the keyboard behavior works.

JULES: That's the App Router foundation. Files describe a route tree, layouts provide shared structure, and pages answer particular locations.

PARISA: Next time: where those components actually execute. Because a file being on my laptop has not answered that question at all.

[OUTRO MUSIC]

## Production References

- Layouts and pages: https://nextjs.org/docs/app/getting-started/layouts-and-pages
- Dynamic segments: https://nextjs.org/docs/app/api-reference/file-conventions/dynamic-routes
- Linking and navigation: https://nextjs.org/docs/app/getting-started/linking-and-navigating
- Examples use the default App Router before enabling Cache Components in Episode 6. Data helper imports are illustrative application code.


