# Episode 3: React Runs WHERE?

**Series:** Next.js
**Runtime:** Approximately 30-minute target; confirm with the recorded read.
**Hosts:** Parisa, Jules

[INTRO MUSIC]

PARISA: I added a click handler to our session page, and the framework objected.

JULES: Was it a Server Component?

PARISA: It was a component. In a file. On my computer. I had not assigned it a geopolitical identity.

JULES: Today we establish borders.

PARISA: Wonderful. My button needs a passport.

[STING]

## Two Environments, Different Capabilities

JULES: Welcome to Okay, But Why? In Next's App Router, pages and layouts are Server Components by default. They execute in a server environment, which can include build time. Their component implementation isn't shipped to the browser as interactive client code.

PARISA: Location, not timing. Server doesn't automatically mean a fresh execution for every request.

JULES: Exactly. A Server Component can access server-side resources through suitable code. It cannot directly handle a visitor's DOM click or use browser state Hooks as though it lived in the browser.

PARISA: Because something in the browser has to notice that click. It might then send a request to a server, but the server isn't sitting inside my mouse.

JULES: A Client Component supplies browser interactivity: state, event handlers, effects, and appropriate access to browser APIs. Now the naming trap: Client Components can also participate in server prerendering for an initial page load.

PARISA: Client Component does not mean “this function can never execute on a server.”

JULES: Correct. It means the component belongs to the client-capable part of the application. That's why reading window during render can fail even in a file marked use client.

PARISA: The directive isn't a request to switch off HTML generation. Good. That misconception makes every subsequent explanation wobble.

## Content With One Interactive Piece

JULES: DemoCon's detail page contains a title, a speaker, an abstract, and a favorite button. Only the button needs local interaction.

PARISA: The abstract is perfectly happy being a paragraph. It doesn't need to attend a state-management retreat.

JULES: So the page reads public data on the server and renders a small FavoriteButton Client Component. It passes only what the button needs, such as a public title.

PARISA: Not the entire database row, including an unpublished speaker email and our internal scheduling notes.

JULES: Exactly. Anything serialized to the client is available to the user, even if our visible interface doesn't display every field.

PARISA: Server execution gives us somewhere to keep secrets. It doesn't make the result secret after we send it to somebody.

JULES: Right. That's why a public data representation is valuable. Our getPublicSession helper should return the fields intended for public use. We don't ask every component to remember which pieces to remove.

PARISA: A clear contract beats a collection of optimistic omissions.

[CODE CARD]
~~~jsx
// app/components/FavoriteButton.jsx
'use client';

import { useState } from 'react';

export default function FavoriteButton({ title }) {
  const [favorite, setFavorite] = useState(false);
  return (
    <button
      type="button"
      aria-pressed={favorite}
      onClick={() => setFavorite(value => !value)}
    >
      Favorite: {title}
    </button>
  );
}
~~~

JULES: Spoken version: begin unfavorited, then toggle the Boolean when someone activates the button. Expose the pressed state and keep a stable label naming the talk.

PARISA: Syntax customs inspection. Use client is a React directive supported by the framework's build integration. It goes before imports. UseState is React. Destructuring, arrow functions, and the exclamation mark for Boolean negation are JavaScript. The element expression is JSX.

JULES: onClick is React's event prop, and aria-pressed is an accessibility attribute represented in the resulting HTML. Type button avoids an accidental submission if this component later appears in a form.

PARISA: The updater receives the previous state, so the toggle doesn't depend on an old captured state value. And this version is deliberately local. Reloading can reset it. It doesn't follow me to another device.

JULES: Correct. Persistence would be a separate requirement. We are not claiming that one useState call created account preferences.

## The Import Graph Is the Border

PARISA: What exactly does use client apply to? The screen rectangle occupied by the button?

JULES: It establishes a module boundary. The module and its imported dependencies enter the client graph where applicable. Put it high in your import tree and you can include much more code than intended.

PARISA: So putting it on the root layout because one tiny button needs state is a fairly expensive way to avoid thinking about the button.

JULES: Often, yes. Extract the appropriate interactive piece. You don't need the directive on every file already imported under a client boundary.

PARISA: But everything visually nested inside a Client Component isn't necessarily client implementation code?

JULES: Correct. The rendered tree and the import graph are different. A Server Component can prepare server-rendered content and pass that content as children to a client wrapper.

PARISA: Such as a server page giving session details to a client panel that controls whether those details are expanded.

JULES: Exactly. The client panel owns the open state. It doesn't import the server-only database module to generate the details in the browser.

PARISA: So “inside” has two meanings: imported by this module, or appearing inside its rendered output. We must specify which one we mean.

JULES: Yes. Otherwise people see a client wrapper and assume every paragraph beneath it has become browser code. Composition lets us arrange output without moving every implementation across the boundary.

PARISA: My button passport metaphor has encountered international shipping law.

## What Can Cross?

JULES: The title string is easy to pass. More generally, props crossing from server to client must use values React supports serializing across that boundary.

PARISA: Often simple data: strings, numbers, arrays, suitable objects. But “exactly JSON and nothing else” is too narrow for React's supported set.

JULES: Right. Still, arbitrary class instances, database connections, and ordinary function closures aren't a transport format. Design a small public data shape instead of handing the browser a live server object.

PARISA: And when we later pass a Server Function reference, that works because React and Next provide a particular remote invocation mechanism. It doesn't mean all JavaScript closures can teleport.

JULES: Exactly. We will distinguish those references from normal callback props within client code.

PARISA: Data size counts too. A server can do the query and still send an enormous array to a client filter. “The query ran on the server” doesn't make the array disappear from the network.

JULES: Yes. Fewer client implementation bytes and fewer transferred data bytes are related performance goals, but one doesn't guarantee the other.

## Follow the Initial Request

JULES: Someone directly opens boring-deployments. The server renders the Server Component tree into a React-specific representation, commonly called the RSC payload. It contains output and the information needed to connect Client Components into the tree.

PARISA: React Server Components payload. Not simply a fancy name for the HTML document.

JULES: Correct. For the initial request, the framework also produces HTML the browser can display. The browser uses React's coordination data and client code to reconcile the tree and hydrate the interactive components.

PARISA: Hydration connects the interactive behavior to existing rendered UI. The Server Component itself isn't downloaded and revived in the browser.

JULES: Exactly. Its implementation remains on the server side. The Client Component implementation is the part needed for browser interactions.

PARISA: And later navigation may request updated React server output and merge it into the existing application. That's different from throwing away the whole document on every internal link.

JULES: Yes. You don't need to memorize the wire format, but understanding that there is a coordination protocol explains why this is more than a template returning an HTML string.

PARISA: It also explains why my browser log and server log don't show the same events. They belong to different execution environments.

## Why It Is Not Simply PHP Again

PARISA: Here's what is familiar: server-side code accesses data and produces UI. We can avoid asking the browser to do work it doesn't need to do. That motivation is old and sensible.

JULES: Completely. Servers were not invented at a React conference.

PARISA: Thank God. Someone would have given them a gradient logo and a waitlist.

JULES: The different part is this particular integration with React components, client navigation, streamed output, and explicit client boundaries.

PARISA: Traditional server-rendered applications can also stream and use rich JavaScript. We aren't claiming Next owns those ideas. We're describing how this system connects them.

JULES: Exactly. A PHP template doesn't ordinarily participate in the React Server Component protocol just because it returns HTML. Familiar motivation, different implementation contract.

PARISA: The analogy helps me reason about trusted data access and initial content. It stops helping if I assume a complete document response and page reload for every interaction.

JULES: That's a good boundary for the analogy itself. We keep the familiar part without forcing the new system into the old implementation.

## Browser APIs Need a Browser Moment

PARISA: Suppose we eventually save favorites in localStorage. Can I just read that in the state initializer?

JULES: Not safely without thinking through server rendering and the initial client render. The server has no access to a visitor's localStorage, and the initial markup must agree across the handoff.

PARISA: So a common simple approach is a consistent initial value, then reading browser storage in an effect and handling the update. But that may visibly change after hydration.

JULES: Yes. That's a tradeoff, not magic. If a preference controls important initial content, we might need a different design, perhaps something the server can know through a request.

PARISA: Effects run on the client after commit. They are useful for synchronization with external browser systems. They aren't a rule that every piece of data must be fetched after the page appears.

JULES: Correct. Our session description is already available through server data access. Fetching it again in an effect just because useEffect is familiar can add a waterfall and duplicate work.

PARISA: The API we know best isn't automatically the place every requirement belongs.

## Guard the Dependency Direction

JULES: A server data module can import the server-only marker to help catch accidental use from the client graph during a build.

PARISA: A guardrail, not encryption or permission enforcement.

JULES: Exactly. It can catch a database module entering client code. It cannot stop us deliberately returning sensitive fields, or replace validation and authorization.

PARISA: Nor does TypeScript make returned data safe. A typed object containing someone's private email is a very precisely described privacy mistake.

JULES: And publicly exposed environment variables are public. A name containing environment doesn't make a value secret. Keep credentials in server configuration and out of client bundles, responses, and careless logs.

PARISA: We can also avoid overly powerful helpers. The public session reader should select published content. An organizer reader needs its own permission checks. The component's location isn't proof the current caller is an organizer.

JULES: Yes. A server can receive requests from anyone. Server-side is the place to enforce trust, not evidence that trust has already been established.

## Debug the Boundary

PARISA: Three symptoms. First, useState produces an error in our page.

JULES: Ask whether that whole page needs to be interactive. Usually extract the piece requiring state into an appropriate Client Component.

PARISA: Second, window is not defined even with use client.

JULES: Check when the access occurs. Client-component rendering can run during server prerendering. Place browser-only work in a suitable client lifecycle or event rather than assuming the directive disables initial rendering.

PARISA: Third, a button suddenly needs our database package.

JULES: Follow the imports. Something crossed into the client graph incorrectly. Keep the read on the server and pass its minimal public result.

PARISA: None of those starts with “disable everything until the red box stops.”

JULES: Right. Error messages become more useful when we understand which environment and dependency path they describe.

## A Small Design Review

PARISA: Let's say the organizer requests a live character count on the proposal form. Does that force the action that stores a proposal into client code?

JULES: No. The character counter is client behavior. The mutation still belongs on the server. We can compose them through the framework's form machinery, which we'll reach later.

PARISA: What about a session list with a client-side search field?

JULES: Decide how much data is reasonable to send. For a small public list, passing the public records to a client filter can be simple. For thousands of records or private information, query-driven server filtering might fit better.

PARISA: So we can't answer by counting interactive controls. We need the data size, privacy, and user experience.

JULES: Exactly. What if the entire application is a highly interactive editing canvas? Then a substantial client subtree can be reasonable. Server Components aren't a contest to reach zero client code.

PARISA: Good. A framework shouldn't make us ashamed of the browser doing browser things.

## The Wrapper Thought Experiment

PARISA: I want to test the composition idea because it's where the words get slippery. We have a client component called ExpandablePanel. It owns whether a panel is open. We also have server-rendered session details.

JULES: The server page can create those details and pass them into ExpandablePanel as children. The wrapper can show or hide the supplied content without knowing how the server obtained it.

PARISA: But if ExpandablePanel directly imports a module that queries the database, we're crossing a different boundary. That's not the same arrangement just because the screen looks identical.

JULES: Exactly. Same possible visual result, different dependency graph. The client wrapper should not import server-only data access. The server parent does the composition.

PARISA: Is the hidden content necessarily secret because the panel is closed?

JULES: No. If it was sent to the client as part of the result, the user may inspect it. A collapsed panel is a display choice, not an authorization mechanism.

PARISA: “Not currently visible” and “not delivered” are different claims.

JULES: Right. If information requires separate authorization, enforce that before returning it. Don't rely on a client toggle to protect already-delivered content.

## A Button That Calls the Server Later

PARISA: Our favorite is local now. Suppose we later save it to an account. Does the button become a Server Component because it talks to the server?

JULES: No. It still handles browser interaction. It can invoke an appropriate server operation, but the event handler and local feedback remain client behavior.

PARISA: So “communicates with the server” isn't the definition of Server Component. Almost every browser app communicates with a server at some point.

JULES: Exactly. Server Component describes where that component's implementation executes in this model. A Client Component can request server work without becoming server implementation itself.

PARISA: And the server operation rechecks the user and session identifier. It doesn't trust the button's props as proof that saving that favorite is allowed.

JULES: Correct. The browser is an untrusted caller even if we wrote the UI. The action can return success or an expected failure, and the client can update feedback accordingly.

PARISA: Pending and failure states enter the design. A local toggle was immediate. A persisted toggle now has latency and uncertainty.

JULES: Exactly. Persistence is more than adding one await. It's a changed product promise with a changed failure model.

## The Bundle Has an Import History

JULES: Imagine the favorite imports a general utilities file. That file imports a large formatting library and unrelated helpers. What should we ask?

PARISA: Whether the browser bundle includes more than the button needs. Tree shaking can remove some unused code, but we shouldn't assume every package structure makes that perfect.

JULES: Right. Keep imports purposeful and inspect the resulting bundle if size matters. A tiny visual component can pull a large dependency graph.

PARISA: Some pure utilities can work in both environments. Others contain secrets or browser-only assumptions and belong on a particular side.

JULES: Exactly. Even a pure formatting function can produce different output if server and browser defaults differ.

PARISA: Dates and timezones. A conference schedule is a particularly bad place to discover that the server and attendee disagree about what local means.

JULES: Correct. Explicit display rules help both hydration consistency and user understanding.

## State Ownership Is Still React

JULES: What if two favorite controls need to display the same local preference on one page?

PARISA: We need a shared source of client state at an appropriate common owner, or another deliberate mechanism. Server Components don't synchronize independent useState calls.

JULES: Exactly. Familiar React rules still apply within the client subtree. Context can supply client values, but Server Components don't consume browser context as though they ran there.

PARISA: A client provider can wrap an interactive region while server-rendered content passes through by composition. But server data access can't consult a value existing only in the visitor's memory.

JULES: Correct. If the server needs a preference, it must arrive through an appropriate request or server-readable state, with the usual trust checks.

PARISA: Separate where state lives for interaction from what must cross the network for an operation. Otherwise someone eventually imports a browser store into a database helper.

## What We Would Inspect

JULES: The initial document can show useful HTML arriving. Network requests reveal client assets and later navigation. Browser and server logs reveal different execution paths.

PARISA: But a single log isn't proof of the entire model. Development tools may rerun work, and caches can avoid work. We need to correlate the request with the path.

JULES: Exactly. A production claim needs a production check. We can also inspect whether private fields appear in responses rather than assuming a clean-looking page has a clean payload.

PARISA: And use a keyboard on the favorite. Space should activate the native button, focus should be visible, and the pressed state should be available.

JULES: That's evidence about both sides of the boundary: the data we deliver and the interaction users actually receive.

PARISA: Much better than awarding ourselves points for placing a directive in a small file.

## Why This Boundary Helps

JULES: Server Components can keep data access near server resources and avoid shipping some implementation code to the browser. Client Components provide the interactivity users need. The benefit comes from assigning responsibilities deliberately.

PARISA: A slow query remains slow. An enormous client dependency remains enormous. But now we have a clear place to ask which work belongs where.

JULES: Exactly. DemoCon's page reads public data. FavoriteButton owns local interaction. The props are small and public. That is a useful working boundary.

PARISA: Use client marks a module boundary. It doesn't mean no server HTML. Visual nesting is not the import graph. And server output can expose anything we include in it.

JULES: The button has its papers.

PARISA: Next time, SSR, SSG, CSR, hydration, streaming. The acronym drawer has fallen down the stairs.

JULES: We'll label the pieces.

PARISA: Please use actual words on some of the labels.

[OUTRO MUSIC]

## Production References

- https://nextjs.org/docs/app/getting-started/server-and-client-components
- https://react.dev/reference/rsc/use-client
- https://react.dev/reference/rsc/server-components
- https://nextjs.org/docs/app/guides/data-security
- The example favorite is local and nonpersistent. No complete DemoCon application is implied.

