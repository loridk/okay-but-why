# Episode 4: SSR, SSG, CSR and Please Stop Inventing Acronyms

**Series:** Next.js
**Runtime:** Approximately 30-minute target; confirm with the recorded read.
**Hosts:** Parisa, Jules

[INTRO MUSIC]

JULES: We could use SSR with streaming, mix SSG and CSR, and consider PPR.

PARISA: Are we building a website or reading an airport departures board?

JULES: Depends whether the build is delayed.

PARISA: One sentence containing a verb I recognize. That's all I'm asking.

[STING]

## Two Questions Before the Acronyms

JULES: Welcome to Okay, But Why? Rendering discussions get easier when we separate where work happens from when its result is produced.

PARISA: Server or browser describes location. Before requests or in response to requests describes timing. Those are different axes.

JULES: Then ask how the result arrives: all together or incrementally. And whether we can reuse something already produced, which brings in caching.

PARISA: Our conference name hardly changes. A room assignment can change on the morning of the talk. A local favorite changes when someone presses a button. Three pieces of one screen, three different needs.

JULES: Exactly. We don't need one acronym to describe every piece and every phase of the entire application. These mechanisms can cooperate.

PARISA: Excellent. I was worried we'd have to choose teams and buy scarves.

## Server Rendering

JULES: SSR means server-side rendering. People often use it specifically for producing HTML in response to a request: a visit arrives, server work runs, and the resulting HTML goes back.

PARISA: That's the part I recognize from PHP. We have a request before producing this response, so we can incorporate information from it.

JULES: Provided we apply the right validation and access rules. Useful content can reach the browser before the application JavaScript has executed.

PARISA: But the browser still parses HTML, applies CSS, performs layout, and paints. Server rendering doesn't send finished pixels directly into somebody's eyeballs.

JULES: Correct. And slow server work can delay the response. Moving a database query to a server is sensible, but calling it SSR doesn't make a bad query fast.

PARISA: An eight-second query remains an eight-second query with a conference badge.

JULES: Streaming can let other content arrive while that query runs. That improves when users can see useful information; it doesn't necessarily reduce the slow operation's completion time.

## Static Generation

JULES: SSG means static site generation. Output is prepared ahead of incoming visits, commonly at build time, and requests receive that prepared result.

PARISA: Like composing the conference program before people arrive. Distribution is easier because the composition work is finished.

JULES: With an important limit to the analogy: web output can be regenerated under a supported policy. Static doesn't necessarily mean permanently frozen.

PARISA: And static doesn't mean noninteractive. A page prepared yesterday can load a favorite button that responds in the browser today.

JULES: Exactly. Preparation timing and browser behavior are different questions. A request-rendered page can be mostly plain content, and a statically generated page can contain rich interaction.

PARISA: Our bracket-slug route can have known session paths prepared in advance. A variable URL segment doesn't require a new render on every visit.

JULES: Right. Conversely, a fixed path such as slash my-schedule can need request-specific work because it depends on the visitor.

PARISA: Dynamic path shape versus dynamic rendering. The word dynamic is working two jobs and causing scheduling conflicts.

## Client Rendering

JULES: CSR means client-side rendering: browser JavaScript produces or updates UI. In a browser-rendered application's initial load, meaningful content may wait for JavaScript and then a data fetch.

PARISA: But client rendering also happens after initial loading. When our favorite state changes, React updates the button in the browser. That doesn't turn every other piece of the website into a browser-only application.

JULES: Exactly. These terms describe work and phases, not necessarily exclusive categories for repositories.

PARISA: A rich schedule editor might deserve a substantial client interface. Fast local interactions matter there. The published abstract might not need that same machinery.

JULES: That's the useful decision. What does this piece require? Not which rendering acronym has the most enthusiastic social media account.

## Hydration Is the Handoff

PARISA: The server can send a button that looks unfavorited. What makes it respond to a click?

JULES: Client code loads, and React hydrates the interactive UI. It connects the expected component behavior to the already-rendered structure.

PARISA: Not just attaching an arbitrary event listener to arbitrary HTML. The initial output must agree with what React expects on the client.

JULES: Correct. A mismatch can happen if the server prints one timestamp and the first client render generates another. Or if the initial browser render reads a local preference that wasn't available to the server and changes the markup.

PARISA: The fix begins by deciding what both environments can know initially. Pass consistent server-known data, and handle truly browser-only information at the appropriate point.

JULES: Yes. A warning-suppression option isn't a general synchronization strategy. Sometimes a deliberate client update is appropriate, but we should understand the transition.

PARISA: Invalid HTML nesting can also create trouble because the browser repairs it. React then encounters a different structure than the one the code appears to describe.

JULES: Exactly. Semantic HTML isn't a separate decoration added after performance work. It affects correctness and interaction too.

## Streaming Starts the Useful Part Earlier

JULES: Suppose the main session information is quick, while related sessions require a slow request. If we wait for both before returning anything, the slow optional region delays the essential information.

PARISA: Instead, send the available content and complete the slower region later.

JULES: That's the idea behind streaming here. React and Next coordinate incremental delivery and the replacement of fallback content.

PARISA: Streaming doesn't make a query finish earlier. It changes what has to wait for that query.

JULES: Precisely. That distinction keeps us honest about performance. Users may be able to read the abstract and find the room while related talks are still loading.

PARISA: If the room number itself is the slow part, an instantly delivered logo isn't the same as solving the attendee's problem.

JULES: Right. Measure when the user can do the important thing, not just when the first branded rectangle arrives.

PARISA: “Our page loads in a hundred milliseconds; your destination arrives after lunch.” Technically active. Functionally a screensaver.

## Suspense Describes a Waiting Boundary

JULES: Suspense is React's way to provide fallback UI around work that can suspend. With supported asynchronous rendering, it says what to display while a subtree isn't ready.

[CODE CARD]
~~~jsx
import { Suspense } from 'react';

export default function SessionPage() {
  return (
    <main id="main-content">
      <h1>Boring Deployments, Happy Humans</h1>
      <p>A practical session about predictable releases.</p>
      <Suspense fallback={<p role="status">Loading related sessions…</p>}>
        <RelatedSessions />
      </Suspense>
    </main>
  );
}
~~~

PARISA: This card illustrates the boundary. RelatedSessions stands for an asynchronous Server Component we would define or import. It isn't built into Next.

JULES: Suspense comes from React. The elements are JSX. The status role is an accessibility feature, not a React data-loading instruction.

PARISA: And wrapping a div in Suspense doesn't cause ordinary fetch calls in effects to become Suspense-aware. The child must use a supported suspending mechanism.

JULES: Correct. The boundary also needs to sit above the work that waits. If our page awaits the slow operation before returning the boundary, that boundary can't travel backward in time and show a fallback.

PARISA: Put the wait inside the child when that is the intended delivery design. I like explanations that tell me why moving a line changes behavior.

JULES: Also, a concise loading message should identify what's loading. We don't want five identical spinners with no useful meaning.

PARISA: Or an assertive announcement every time a skeleton blinks. Assistive technology users don't need a sports commentator for every network request.

## Loading Files Package a Common Pattern

JULES: A loading file in Next provides loading UI for a route segment through its Suspense integration. It gives us a conventional boundary around the relevant page content beneath the layout.

PARISA: So loading dot jsx is Next-specific. Suspense is React-specific. Related layers, different ownership.

JULES: Exactly. Explicit boundaries let us choose smaller regions when the product benefits from independent delivery.

PARISA: But slicing every sentence into a separate boundary would make the page assemble like an extremely annoying jigsaw puzzle.

JULES: Right. Group information users need together. Keep layout shifts reasonable. Avoid replacing focused controls unnecessarily. A skeleton isn't automatically good just because it resembles the content that will arrive.

PARISA: A plain “Loading session details” paragraph is a legitimate starting point. We can improve the visual treatment without abandoning semantics.

## Partial Prerendering

JULES: Partial prerendering means preparing the parts that can be known ahead of time while leaving request-dependent regions to complete later.

PARISA: Conference title and public shell: ready. A visitor-specific region: wait until we know the visitor.

JULES: Exactly. In the Next.js 16 approach we're teaching, Cache Components is an explicit configuration choice that integrates cached work and Suspense boundaries into that model. We'll enable it deliberately in Episode Six.

PARISA: Not a claim that every Next 16 app has it enabled. Our earlier examples use the ordinary App Router baseline.

JULES: Correct. After enabling it, we need to account for how uncached and request-specific work fits under boundaries. We must not mix incompatible configuration recipes from different models.

PARISA: And a Suspense wrapper doesn't itself make a synchronous paragraph request-dependent. There has to be actual work requiring the request or asynchronous result.

JULES: Exactly. The boundary provides a way to wait. It doesn't manufacture a reason to wait.

## Regeneration Is About Freshness

PARISA: There's another acronym in the drawer.

JULES: ISR: incremental static regeneration. Broadly, updating reusable generated output after the original build under a revalidation policy.

PARISA: So the schedule needn't remain forever in the state it had when we deployed last Tuesday.

JULES: Right. But policy matters. Some approaches can serve an existing result while refreshing it. Some make a later read wait for fresh data. We'll distinguish those in the caching episode.

PARISA: “Revalidates after sixty seconds” might not mean a timer proactively visits every page exactly once a minute.

JULES: Correct. It can mean the cached result becomes eligible for revalidation, with work triggered by a request. Don't translate implementation settings into freshness promises without checking the behavior.

PARISA: A room change ten minutes before a talk isn't just an optimization setting. It affects where actual humans stand.

## One Page, Several Strategies

JULES: Compose DemoCon mentally. Shared header prepared early. Public session data perhaps reused. Fresh or personalized region completed at request time. Favorite interaction running in the browser.

PARISA: Static preparation, server rendering, streaming, client updates. One screen. No need to make them fight for the repository's identity.

JULES: Exactly. Initial document navigation also differs from later framework navigation. Later visits may request updated React server output and preserve existing layout and client state where appropriate.

PARISA: So performance measurements need to name the journey. Direct entry on a slow phone is different from clicking a prefetched link on my development laptop.

JULES: Yes. Warm caches can hide slow cold paths. Local services can hide geographic latency. Development mode can behave differently from a production build.

PARISA: This is why I don't accept a number followed by three rocket emojis as a complete performance report.

## Response Timing Affects Failure

PARISA: If a slow region fails after streaming has started, can we always change the response status to 500?

JULES: Once headers have been sent, we can't replace the already-sent status. The framework can render an error experience, but HTTP timing still matters.

PARISA: Which means we can't casually defer essential access decisions until after protected output is already on the wire.

JULES: Correct. Check permissions where protected data is obtained and before disclosing it. A loading boundary isn't a security boundary.

PARISA: And loading and failure are different states. “Loading…” forever is not an error strategy. It's a hostage situation with an ellipsis.

JULES: Optional related-session failure needn't erase the main talk. Good boundary placement expresses which information can fail independently.

## A Useful Thought Experiment

JULES: Suppose our conference has three pages. A public code of conduct, a published schedule, and an organizer's private submission queue. What do you ask first?

PARISA: Code of conduct: does it change often, and can prepared content satisfy the requirement? Probably. Schedule: how quickly must edits appear? Submission queue: who is asking, what are they allowed to see, and how fresh must it be?

JULES: Notice you didn't begin with framework flags.

PARISA: Because requirements tell me what the flags need to accomplish. If the schedule can be five minutes old, reuse might be fine. If it's showing whether the last seat is available, a stale display cannot authorize the booking.

JULES: Good distinction. Even a fresh display can become outdated before the mutation. The server operation needs its own consistency checks.

PARISA: Rendering strategy and transaction correctness are separate. A page can be fast, pretty, and confidently wrong about the last chair.

JULES: Exactly. Now suppose the organizer queue has an expensive analytics sidebar.

PARISA: I don't make the queue wait for the sidebar if organizers need to process submissions immediately. That's a possible streaming boundary. But I also investigate the expensive query rather than treating a spinner as a permanent cure.

## Measure the Whole Experience

JULES: What would we observe in a small production check?

PARISA: First meaningful content, time until controls work, data freshness, navigation behavior, and what happens on slow or failed requests. I'd also use a keyboard, because a fast page I can't operate is still broken.

JULES: We can inspect network timing, server logs, and the rendered output to explain what happened. A number alone doesn't tell us which dependency caused the delay.

PARISA: And if the simplest strategy already meets our needs, we stop. We don't add streaming just to create an opportunity to measure streaming.

JULES: Exactly. These are mechanisms for serving a user, not a syllabus the production app must complete.

## Three Timelines for the Same Talk

JULES: Let's narrate three visits. First, a browser-rendered application. The browser receives a document, downloads and runs application code, then requests session data before displaying the abstract.

PARISA: The sequence can be optimized, but those dependencies may put JavaScript execution and data fetching before the content the visitor wanted.

JULES: Second, request-time server rendering. The server obtains data and produces HTML. The browser can display it, then client code makes interactive pieces work.

PARISA: We reduce some browser prerequisites, but server response time includes the work needed before sending that output.

JULES: Third, prepared output. The session content was produced earlier. The response reuses it while the favorite still becomes interactive through client code.

PARISA: We avoid repeating work per visit but must decide when prepared information becomes too old. Same talk, different critical paths.

JULES: Exactly. None wins without knowing freshness, latency, infrastructure, and interaction requirements.

PARISA: Any of them can also be ruined by a ten-megabyte hero image. Rendering doesn't cancel the rest of the web.

## The Slow Region Exercise

JULES: The abstract is quick, but an optional speaker biography service is slow. Where might you put the boundary?

PARISA: Around the biography, if the session remains useful without it. Essential information shouldn't wait for an optional service.

JULES: Now the slow result is the session itself, and we don't know whether the slug identifies a public talk.

PARISA: Different problem. We shouldn't send a made-up title and hope the record exists. Show an honest loading shell, then the session or missing state.

JULES: Boundaries express what the interface knows and doesn't know. A placeholder shouldn't make unestablished claims.

PARISA: If prepared content supplies the title but a room assignment must be fresh, we might separate those regions. The room's pending state must be unmistakable.

JULES: Right. A blank spot might imply no room is assigned. A loading message communicates uncertainty instead.

## A Hydration Mismatch Without Mysticism

PARISA: Server renders favorite false. The first client render reads localStorage and renders true. Why is React upset?

JULES: The client's expected initial output differs from the server output. React is connecting behavior to an existing structure, and the computations didn't start from the same information.

PARISA: It isn't evidence that storage is evil. We used browser-only information at a point requiring agreement.

JULES: Exactly. A deliberate post-hydration update can read it. Or another storage design can make the preference available to the server. Each has tradeoffs.

PARISA: The first may briefly display the default. The second introduces server-readable state and its privacy, caching, and request implications.

JULES: Right. Choose according to how important that initial preference is. Suppressing the warning doesn't settle the design question.

## Server Time Is Not Attendee Time

JULES: Dates give another example. The server formats a conference time using its default timezone. The browser formats it using the attendee's timezone. Initial strings differ.

PARISA: We need a product decision before a formatting trick. Are we showing venue time, visitor time, or both? The schedule should say which.

JULES: Exactly. A consistent timestamp and explicit formatting policy avoid ambiguity. If browser-local formatting is intentionally applied later, design that transition.

PARISA: Deterministic output needs consistent inputs, not merely identical source code. Environment defaults are inputs too.

JULES: Correct. Clocks, random values, locale, and storage all reveal the difference.

## Faster Feedback Has Limits

PARISA: Can streaming make the experience worse?

JULES: Too many independently arriving regions can shift layout or confuse reading order. Someone may start using one region while another moves it.

PARISA: Reserve space where practical, group related information, and don't repeatedly steal focus when content arrives.

JULES: Exactly. Also verify the deployment. A proxy buffering the whole response can prevent the incremental delivery we expected.

PARISA: The presence of Suspense in a file isn't proof of the user's actual network experience.

JULES: Right. We check what arrives and when under realistic conditions.

## Preparation Is Not a Security Shortcut

PARISA: If we prepare content for broad public distribution, it must actually be public. Build-time database access doesn't make every record appropriate for output.

JULES: Exactly. Select the public representation before generation. If a record later becomes private, remove or invalidate prepared output according to the distribution model.

PARISA: Changing one database flag isn't automatically a recall of every cached copy. Publication and unpublication have lifecycles.

JULES: Correct. Rendering and caching must support those lifecycles. Faster delivery comes with an obligation to manage what we're distributing.

## The Departures Board Makes Sense

JULES: Server rendering produces output on the server. Static generation prepares output ahead of visits. Client rendering produces or updates UI in the browser. Hydration connects interactive code to existing output. Streaming sends useful output incrementally. Partial prerendering combines prepared regions with later work in a supported model.

PARISA: And caching is reuse with a policy. It isn't a geographical location or proof the result is fresh.

JULES: Next time: why make an HTTP request to our own application when our Server Component can already call the data-access code?

PARISA: I have sent emails to myself. I try not to put them on the critical path.

[OUTRO MUSIC]

## Production References

- https://react.dev/reference/react/Suspense
- https://react.dev/reference/react-dom/client/hydrateRoot
- https://nextjs.org/docs/app/api-reference/file-conventions/loading
- https://nextjs.org/docs/app/getting-started/caching
- https://nextjs.org/docs/app/api-reference/functions/generate-static-params
- Cache Components is enabled explicitly in Episode 6. No runtime measurements are claimed.

