# Episode 7: Did We Just Put the Backend in the Component?

**Series:** Next.js
**Runtime:** Approximately 30-minute target; confirm with the recorded read.
**Hosts:** Parisa, Jules

[INTRO MUSIC]

PARISA: This form has a function attached to it.

JULES: A Server Function.

PARISA: It looks like a normal function call.

JULES: There's still a network request.

PARISA: Of course there is. Distributed systems in a cardigan.

[STING]

## We Still Have a Boundary

JULES: Welcome to Okay, But Why? DemoCon needs a proposal form. A speaker enters a talk title and abstract. The server validates the submission and stores it for review.

PARISA: Review is important. Submitting a proposal doesn't instantly publish it on the conference schedule. Our form is not a remote keynote installation service.

JULES: Exactly. React Server Functions, integrated by Next, let client-facing UI invoke server work through a function-oriented interface. Used for mutations in an action context, they're commonly called Server Actions.

PARISA: So Server Function is the broader concept. Server Action describes its use for an action such as a form mutation. The names overlap in everyday conversation, but they aren't a reason to treat every server helper as a remotely callable action.

JULES: Right. A plain server data helper isn't automatically a Server Function. The use server directive marks functions for the framework's server invocation mechanism.

PARISA: And use server does not mean “make this a Server Component.” Server Components are the default in our App Router context without that directive.

JULES: Correct. Use client defines a client module boundary. Use server identifies callable server functions. Similar-looking directives, different jobs.

## The Form We Already Know

PARISA: Before the modern machinery, a form submitted fields to a server endpoint. The server read the request, validated data, checked access, stored a result, and returned a response or redirect.

JULES: Those responsibilities remain. Server Actions reduce some transport wiring for UI mutations and integrate the response with React and Next.

PARISA: They don't remove the network, latency, failures, retries, or malicious callers.

JULES: Exactly. A function reference in JSX isn't an ordinary in-process callback when the function lives on the server. Framework code carries the request and result across the boundary.

PARISA: Which means arguments are untrusted. A caller can submit values different from those our visible form offers.

JULES: Yes. Treat an exposed action as a public-facing operation. Authenticate and authorize inside the server operation. Don't rely on hiding a button or trusting a disabled field.

## A Server Function With Explicit Responsibilities

JULES: Our code card illustrates the action contract. The authentication and storage helpers are application infrastructure we would implement, not features that appear when we import Next.

[CODE CARD]
~~~js
// app/lib/proposal-actions.js
'use server';

import { requireUser } from './auth';
import { createPendingProposal } from './proposals';

export async function submitProposal(previousState, formData) {
  const user = await requireUser();
  const titleValue = formData.get('title');
  const abstractValue = formData.get('abstract');

  if (typeof titleValue !== 'string' || typeof abstractValue !== 'string') {
    return { message: 'Enter a title and an abstract.' };
  }

  const title = titleValue.trim();
  const abstract = abstractValue.trim();
  if (title.length < 5 || title.length > 120) {
    return { message: 'Use a title between 5 and 120 characters.' };
  }
  if (abstract.length < 40 || abstract.length > 2000) {
    return { message: 'Use an abstract between 40 and 2000 characters.' };
  }

  await createPendingProposal({ ownerId: user.id, title, abstract });
  return { message: 'Proposal received for review.' };
}
~~~

PARISA: The directive belongs at the top of the separate action module. Async, await, typeof, object literals, and comparisons are JavaScript. FormData is a Web API. The action's invocation and integration come from React and Next.

JULES: Correct. The previousState argument is here because we'll call it through useActionState. We don't trust that state for authorization, and this example doesn't need it to validate the new fields.

PARISA: FormData values may be strings or files, so checking their types matters before calling trim. TypeScript annotations alone wouldn't perform that check.

JULES: Exactly. We also impose length rules. They are illustrative product limits, not universal rules for talks. Request-size and abuse controls still belong in the real deployment and storage boundary.

PARISA: The owner identifier comes from server-verified identity. Not a hidden ownerId field supplied by the browser.

JULES: Right. RequireUser must actually verify identity or reject the request. CreatePendingProposal must store a pending record using safe database operations. This card isn't a substitute for implementing those contracts.

## Expected Errors Are Useful Results

PARISA: A title that's too short is an expected user-correctable condition. Returning a message makes more sense than treating it as a mysterious server crash.

JULES: Exactly. A real form can return field-specific errors and preserve entered values. An unexpected database failure belongs in the application's error handling and server logging, with a safe user-facing message.

PARISA: No database connection string in the error paragraph. No stack trace containing somebody else's submission.

JULES: Correct. Also, catching everything can accidentally swallow framework control flow such as redirects. If using redirect after a write, place it appropriately rather than wrapping it in a broad catch that interprets it as failure.

PARISA: Good. We should understand what our error handling catches, not merely write catch because the linter enjoys punctuation.

## Connect the Form to Feedback

[CODE CARD]
~~~jsx
// app/components/ProposalForm.jsx
'use client';

import { useActionState } from 'react';
import { submitProposal } from '../lib/proposal-actions';

const initialState = { message: '' };

export default function ProposalForm() {
  const [state, formAction, pending] = useActionState(
    submitProposal,
    initialState,
    '/submit',
  );

  return (
    <form action={formAction}>
      <label htmlFor="proposal-title">Talk title</label>
      <input id="proposal-title" name="title" required minLength={5} maxLength={120} />
      <label htmlFor="proposal-abstract">Abstract</label>
      <textarea id="proposal-abstract" name="abstract" required minLength={40} maxLength={2000} />
      <button type="submit" disabled={pending}>
        {pending ? 'Submitting…' : 'Submit proposal'}
      </button>
      <p role="status">{state.message}</p>
    </form>
  );
}
~~~

JULES: UseActionState is a React Hook. It connects an action result to component state and exposes the action dispatch function and pending state. The three-item destructuring is JavaScript.

PARISA: HtmlFor is React's spelling of the label association. Name supplies the key the server reads. Required and the length attributes provide browser-side assistance, while the server repeats the actual trust checks.

JULES: Exactly. Pending feedback tells the user something is happening. The status region makes the resulting message available without requiring the user to guess where it appeared.

PARISA: A production form should associate specific field errors with their fields and manage focus when a summary needs attention. This compact card demonstrates the response loop, not every form behavior we would ship.

JULES: Right. And the submitted values need preservation on validation failure. React's action form behavior can reset uncontrolled fields after a successful action invocation, so returning a validation message alone isn't a complete value-preservation strategy.

PARISA: Important distinction. We would return safe field values and deliberately restore them, or use a controlled form strategy. We mustn't erase a carefully written abstract because its title was one character short.

## Progressive Enhancement Is a Contract to Verify

JULES: A form using a Server Action can have a baseline that works before client JavaScript finishes loading. That's one benefit of integrating with actual form semantics.

PARISA: But the exact behavior depends on where and how the form is rendered. Server Component forms can submit without JavaScript. Client Component flows need care around hydration and action state.

JULES: Yes. Our useActionState example supplies a stable permalink, slash submit. For the pre-hydration navigation path to preserve the action state, that destination must render the same form with the same action and permalink.

PARISA: It's not enough to paste a URL into a Hook and declare progressive enhancement complete. The destination route must exist, the form contract must match, and we should test with delayed or disabled JavaScript.

JULES: Exactly. Client-only embellishments, such as a live character counter, can enhance the form. They shouldn't be the sole place essential validation or the ability to submit exists if we're promising that baseline.

PARISA: Browser validation is also assistance, not server security. A direct request can bypass it completely.

## Pending Does Not Mean Exactly Once

PARISA: We disabled the button while pending. Does that prevent duplicate submissions?

JULES: It reduces accidental repeated clicks in that UI. It doesn't guarantee exactly-once processing. Network retries, multiple tabs, or deliberate requests can still duplicate an operation.

PARISA: So if duplicates matter, the server needs a policy. Maybe a unique submission token scoped to the authenticated user, with a database constraint or idempotency record.

JULES: Exactly. That's an application and storage design. A disabled button isn't a distributed lock.

PARISA: And if the request times out, the write may already have succeeded. “No response” doesn't necessarily mean “nothing happened.”

JULES: Right. A retry-safe operation and a way to inspect the resulting submission help users recover without creating duplicates. We don't need to implement that infrastructure in a syntax card, but we need to understand why it exists.

PARISA: Distributed systems in a cardigan, as promised.

## Authorization Is About This Operation

JULES: Submitting one's own proposal and publishing any proposal are different permissions.

PARISA: Our submit action uses the authenticated user's identifier. A publish action must independently verify organizer privileges and the target record's eligibility.

JULES: Exactly. Binding an argument to an action or hiding it in a form doesn't make it trustworthy. Check identifiers, ownership, allowed transitions, and current state on the server.

PARISA: If a speaker can edit only their own draft, an action must enforce that condition in its data operation. Otherwise changing an identifier can turn an edit form into someone else's edit form.

JULES: Right. Good checks are close enough to the read or write that alternate callers can't accidentally bypass them.

PARISA: Next also has request protections around actions, including origin-related checks, but those don't replace our business authorization. Framework protections and application permissions solve different problems.

JULES: Correct. Use a maintained patched release, understand deployment origin configuration, and don't disable protections casually to get a proxy setup working.

## Mutation and Cache Invalidation

PARISA: Does a new pending proposal invalidate the public schedule tag from last episode?

JULES: No. Pending proposals aren't public sessions. Invalidating public-sessions on every private submission would be unnecessary and would imply a product relationship that doesn't exist.

PARISA: Excellent. The public schedule changes when an organizer publishes or edits a public session.

JULES: Exactly. After an authorized publication successfully commits, the Server Action can call updateTag for the affected public data so subsequent reads don't reuse the old result.

[CODE CARD]
~~~js
// Excerpt inside an organizer-authorized publication action:
await publishProposal(proposalId);
updateTag('public-sessions');
~~~

PARISA: PublishProposal is application code. UpdateTag is imported from next slash cache and is allowed in Server Actions. Authorization, validation, transaction handling, and imports are omitted from this excerpt, not optional in the real operation.

JULES: Correct. A private proposal queue might have its own freshness strategy. We aren't caching it with the public tag. The invalidation should match data relationships, not just use the same string everywhere.

PARISA: And expiration doesn't push updates to every open attendee tab. It governs later reads. If we need live schedule updates, that's an additional requirement.

## Optimistic UI Is a Separate Choice

JULES: We could immediately show a proposal as submitted before the response arrives. That's optimistic UI: predicting success to make interaction feel faster.

PARISA: Useful sometimes, but we need pending and failure states. We can't permanently tell someone “received” before the server has received and stored it.

JULES: Exactly. React has tools for optimistic state, but using them responsibly means defining rollback or correction behavior.

PARISA: For our modest proposal form, a clear pending message and confirmed success might be perfectly good. No need to make uncertainty more theatrical.

JULES: Agreed. Optimism is a product decision, not a required accompaniment to Server Actions.

## Reads Are Still Reads

PARISA: Could I call a Server Action to fetch every piece of data in my page?

JULES: You can misuse many mechanisms, but actions are designed around mutations and action flows. Initial server reads belong naturally in Server Components or shared server data helpers. Public HTTP data contracts belong in Route Handlers when needed.

PARISA: So we don't replace the unnecessary self-fetch from last episode with an unnecessary action invocation.

JULES: Exactly. Use the simplest appropriate boundary. A normal server function call is enough when we're already on the server reading data.

PARISA: And a client needing ongoing polling may fit an HTTP endpoint and a client data strategy better than treating every read as a form action.

## Test the User's Failure Path

JULES: How would we verify this form without starting a giant new test project?

PARISA: Submit a valid proposal and verify a pending record owned by the caller. Submit invalid values directly to the server operation and confirm rejection. Try another user's identifier in an edit operation. Slow the request and inspect pending feedback. Fail storage and make sure no false success appears.

JULES: And keyboard and screen-reader behavior?

PARISA: Labels, focus order, visible focus, error association, announcement of results, and preservation of the abstract after validation failure. Test the pre-hydration path if we promise it.

JULES: That's a meaningful set because it checks the actual boundary and user experience, not merely whether the code contains a use server string.

PARISA: A test asserting we wrote the directive would tell me that we can read our own file. Lovely skill. Limited threat model.

## Follow One Submission All the Way

PARISA: A speaker types a title and an abstract. The labels identify the controls, the browser can provide immediate constraint feedback, and activating Submit starts the action path.

JULES: The submitted fields cross the network. The server verifies the caller, reads the values, checks their types and limits, and attempts the pending-proposal write.

PARISA: Then the response returns a result. Our interface announces confirmed success or explains an expected validation problem. Pending feedback ends when the operation resolves.

JULES: Exactly. Each stage has a different responsibility. Browser validation helps the person. Server validation protects the operation. Storage establishes persistence. The response communicates what happened.

PARISA: If we confuse those stages, we might show success when the browser merely accepted the field lengths, before anything was saved.

JULES: Or assume a correctly typed frontend guarantees correctly shaped requests. The operation must withstand a caller who never loaded our form.

## Keep the User's Work

PARISA: Let's fix the experience implied by our compact card. Someone writes a long abstract, submits, and the title is invalid. What should they see?

JULES: Their abstract should remain available, the title error should be clearly associated with the title field, and they should know how to correct it. We should not make them reconstruct their work.

PARISA: A real action result can carry safe submitted values and field errors. The component then deliberately uses them to preserve or restore the form. Or it can use controlled values with an appropriate reset policy.

JULES: Exactly. That is additional form implementation around the compact example, not something the message string alone accomplishes.

PARISA: And errors need both text and association. Red borders alone aren't enough. An error summary can link to the affected fields, and the fields can reference their messages.

JULES: Right. Manage focus deliberately when needed, without yanking it around for every keystroke. Preserve the useful native behavior of labels and controls.

PARISA: This is why form quality can't be judged by whether the happy-path screenshot looks tidy.

## The Caller Chooses More Than We Think

JULES: Suppose the form contains a hidden field saying status equals pending. Is that how we guarantee proposals stay pending?

PARISA: No. The server chooses the allowed status. A caller can change a hidden input or construct a request without the form.

JULES: Exactly. The same applies to owner identifiers, prices, role names, and permissions. Hidden means visually hidden, not trustworthy.

PARISA: Our helper should explicitly create the pending state and use the verified user's identifier. It shouldn't spread every submitted field into a database write.

JULES: Right. Broad object spreading from untrusted input can accept fields we never meant the user to control. Select the permitted fields and perform the required checks.

PARISA: Modern JavaScript makes copying properties concise. It doesn't decide which properties a stranger is allowed to set.

## Authentication Can Expire Mid-Workflow

JULES: A user opens the proposal form, writes for twenty minutes, and their session expires. What happens on submit?

PARISA: The server checks current authentication. It can't rely on the fact that the page was visible twenty minutes earlier.

JULES: Correct. The experience should help them recover without unnecessarily losing the draft. Exactly how we preserve a draft depends on privacy and product choices.

PARISA: We should avoid casually storing sensitive content in browser storage forever. But we also shouldn't silently discard it because a session timed out.

JULES: Right. That is a real design decision. The form operation still rejects unauthorized persistence, while the interface offers a clear next step.

PARISA: Another reason an initial route check isn't enough. Permission is relevant when the operation executes, not just when someone first sees the page.

## Duplicate Requests and Idempotency

JULES: Imagine the server saves the proposal, but the response is lost. The user sees a timeout and presses Submit again.

PARISA: Without a duplicate policy, we might create two pending proposals. Disabling the button during the first request didn't prevent the second attempt after uncertainty.

JULES: Exactly. An idempotency mechanism associates repeat attempts with the same intended operation and returns or recognizes the existing result. The server and database must enforce it.

PARISA: A random token generated for each retry wouldn't identify the same operation. The token lifecycle matters.

JULES: Correct. Nor should one user's token authorize another user's operation. Scope it appropriately and validate the caller independently.

PARISA: We don't need to implement that machinery in the small teaching card. But it's useful to explain why a production submission flow may need more than a spinner.

## Publishing Is a State Transition

JULES: An organizer publishes a pending proposal. What else should be true besides “the caller has an organizer role”?

PARISA: The target exists, it's in an eligible state, and the intended transition is allowed. If two people act concurrently, the storage operation should handle the conflict according to the product's rules.

JULES: Exactly. Authorization asks who may act. Validation also asks whether this action makes sense for the current resource state.

PARISA: After publication commits, we invalidate the appropriate public cached data. Before that, attendees shouldn't see the proposal simply because the author submitted it.

JULES: Correct. A state transition gives us a natural place to connect the write and its public freshness effect.

PARISA: That's much clearer than “every mutation invalidates everything.” We can explain why this particular operation affects this particular view.

## Convenience Without Pretending

JULES: The framework saves us some transport wiring and integrates the response with the UI. That's useful even though all these responsibilities remain.

PARISA: We don't need a feature to abolish every problem before it counts as helpful. We just need to know which work it actually removes.

JULES: Exactly. Server Actions remove some repetitive coordination. They don't remove the need to design a trustworthy, recoverable operation.

## The Backend Is Still There

JULES: Server Actions can reduce plumbing around UI mutations and integrate forms, pending state, responses, and cache updates. The network operation remains real.

PARISA: We still validate, authorize, store safely, handle failures, and think about retries. Colocating code doesn't eliminate architectural boundaries; it changes how we express them.

JULES: Exactly. The form is more connected to the server operation, but the browser hasn't acquired a database connection or permission to publish arbitrary talks.

PARISA: Next time, actual HTTP endpoints. Because sometimes another application wants data and does not wish to participate in our React family traditions.

JULES: Route Handlers.

PARISA: Finally, something whose name describes a job without requiring a passport interview.

[OUTRO MUSIC]

## Production References

- https://nextjs.org/docs/app/getting-started/mutating-data
- https://nextjs.org/docs/app/guides/forms
- https://nextjs.org/docs/app/guides/data-security
- https://react.dev/reference/rsc/use-server
- https://react.dev/reference/react/useActionState
- https://nextjs.org/docs/app/api-reference/functions/updateTag
- Code cards are teaching excerpts. Authentication, persistence, abuse controls, field-value restoration, and deployment are explicit implementation responsibilities.

