# Episode 3: State — Why Didn’t My Variable Update the Screen?

**Series:** React / Modern Front-End Frameworks
**Runtime:** Determined by the final recorded read; coverage takes priority over a fixed length.
**Hosts:** Parisa, Jules

[INTRO MUSIC]

PARISA: I changed the variable.

JULES: Congratulations.

PARISA: The screen did not change.

JULES: Ah.

PARISA: I changed it very clearly. I can show you the line.

JULES: React does not monitor every JavaScript variable like a suspicious neighborhood association.

PARISA: Then what is state, and why does it have opinions?

[STING]

## A Variable Is Not a Subscription

JULES: In ordinary JavaScript, assigning a new value changes that variable. It does not inherently tell React to render a component.

PARISA: JavaScript did its job. React was not notified.

JULES: Exactly. React state is data React tracks for a component across renders. Updating state requests another render.

[CODE CARD]

~~~jsx
const [count, setCount] = useState(0);
~~~

PARISA: Syntax labels.

JULES: const, array destructuring, and the function call are JavaScript. useState is a React Hook. Zero is the initial state. count is the state value for this render. setCount is the function React gives us to request an update.

PARISA: Why an array?

JULES: useState returns a two-item array. Destructuring gives those items useful local names. You could access positions zero and one manually, but nobody deserves that.

PARISA: Wait, that is just JavaScript.

[GAME-SHOW BELL]

## Initial Means Initial

PARISA: If zero is passed to useState every time the component function runs, why does the count not reset to zero on every render?

JULES: Because React uses that argument when it creates the state for that component position. On later renders, React gives us the stored state instead of initializing it again.

PARISA: So useState with a prop as its initial value does not mean “keep this state synchronized with the prop.”

JULES: Correct. It means “start here.” After that, the state has its own life. If the prop changes, React does not automatically copy the new prop into that existing state.

PARISA: Which means I should not duplicate a prop into state unless the component genuinely needs an independently editable snapshot.

JULES: Exactly. Otherwise, use the prop directly. And if calculating the initial state is expensive, you can pass useState a JavaScript function so React calls it for initialization rather than recalculating the result on every render.

PARISA: Passing the function, not calling it. Our old friend from Episode Two.

## A Render Is a Snapshot

JULES: Here is the mental model that prevents several headaches: each render gets a snapshot of state.

PARISA: Meaning count is fixed for that particular run of the component.

JULES: Yes. Calling setCount does not reach backward in time and mutate the count variable inside the already-running event handler. It queues or requests a future render.

PARISA: So this can surprise people:

[CODE CARD]

~~~jsx
setCount(count + 1);
console.log(count);
~~~

PARISA: The log may show the old count.

JULES: Because the handler closes over the snapshot from the render that created it. That is JavaScript closure behavior meeting React’s render model.

PARISA: Not “React is randomly slow.”

JULES: Correct.

## Render Versus Commit

PARISA: Define render carefully.

JULES: Rendering means React calls components to calculate what the UI should be. Committing is when React applies necessary changes to the actual DOM.

PARISA: A component can render and produce the same result.

JULES: Yes. A render does not guarantee a visible DOM change.

PARISA: And React may batch multiple state updates.

JULES: Correct. Batching lets React process updates efficiently instead of committing after every setter call.

PARISA: Which is why treating the setter like immediate assignment is a trap.

## Updating From Previous State

JULES: If the next value depends on the previous value, use an updater function.

[CODE CARD]

~~~jsx
setCount(previousCount => previousCount + 1);
~~~

PARISA: Arrow function: JavaScript.

JULES: Setter contract: React. React provides the pending previous value, and the function returns the next one.

PARISA: Useful if I increment several times in one event.

JULES: Yes. Three setCount(count plus one) calls may all be based on the same snapshot. Three updater functions are applied in sequence to the queued value.

PARISA: This is not a reason to triple-click users into chaos.

JULES: Educational buttons only.

## What Deserves to Be State?

PARISA: Everything that changes?

JULES: No. State is for information that must survive renders and whose change should affect rendering.

PARISA: Form input value.

JULES: Often state.

PARISA: Whether a disclosure is open.

JULES: State.

PARISA: A calculated full name when first and last name are already state.

JULES: Usually derive it during rendering.

PARISA: Why not store it?

JULES: Because duplicated state can disagree. If fullName is always firstName plus lastName, calculating it keeps one source of truth.

PARISA: Fewer whiteboards.

JULES: Exactly.

PARISA: A value that never affects rendering and only needs to persist?

JULES: A ref may be more appropriate, which we will touch next episode. State updates cause rendering; do not use state as a junk drawer.

## State Is Local by Position

PARISA: Where does React keep state?

JULES: Conceptually, React associates it with a component’s position in the rendered tree.

PARISA: Not inside the function variable itself, because the function runs again.

JULES: Right. React returns the appropriate state snapshot each time.

PARISA: And if the component disappears?

JULES: Its state is normally destroyed. If it returns at a new position, that is a new component instance from React’s perspective.

PARISA: Keys can affect identity here too.

JULES: Yes. A stable key can preserve identity across reordered siblings. Changing a key can intentionally reset a component.

PARISA: Or accidentally wipe somebody’s form.

JULES: Please Don’t Do This with random keys.

## Lifting State Up

PARISA: Two sibling components need the same selected item. Who owns it?

JULES: Find their closest common parent and move—or lift—the state there. The parent passes the value and callbacks down as props.

PARISA: Single source of truth.

JULES: For that piece of data, yes.

PARISA: But not “put all state at the top of the application.”

JULES: Correct. Lift it only as high as necessary. Too-low state cannot coordinate consumers. Too-high state makes unrelated regions depend on a distant owner and can increase needless complexity.

PARISA: State ownership is architecture in miniature.

## Controlled Inputs

JULES: A controlled input gets its current value from React state and reports changes through an event handler.

[CODE CARD]

~~~jsx
<label>
  Search
  <input
    value={query}
    onChange={event => setQuery(event.target.value)}
  />
</label>
~~~

PARISA: Input and label are HTML elements represented in JSX. value and onChange are React props. Arrow function and event property access are JavaScript.

JULES: Beautiful.

PARISA: Every keystroke updates state and renders again.

JULES: Usually. That is often fine, but be thoughtful if rendering or downstream work is expensive.

PARISA: And accessible labeling is still HTML’s job. React does not bless an unlabeled input.

JULES: Exactly.

## Do Not Mutate State

PARISA: Here be dragons.

JULES: Treat objects and arrays in state as immutable. Do not modify the existing object and pass the same reference back.

PARISA: Because React commonly uses identity to recognize that a value changed.

JULES: Yes, and mutation also corrupts prior render snapshots. Create a new object or array containing the updated data.

[CODE CARD]

~~~jsx
setProfile(previous => ({
  ...previous,
  displayName: "Parisa"
}));
~~~

PARISA: Spread syntax and object literals: JavaScript. The setter updater contract: React.

JULES: And shallow spread is not deep cloning magic. Nested objects still share references unless replaced too.

PARISA: Excellent footgun labeling.

JULES: For an array, methods like map, filter, and spread can produce new arrays. push mutates the existing array.

PARISA: JavaScript behavior, relevant to React state.

## Events Are Where Changes Usually Begin

PARISA: Button click changes state. Input change changes state. Request completes and changes state.

JULES: Yes. Event handlers are a natural place for user-caused updates.

PARISA: Does state update during rendering?

JULES: Generally, do not do that. Rendering should calculate UI, not trigger an endless chain of more rendering.

PARISA: Infinite render machine goes brrrr.

JULES: React will eventually stop you with an error, but your design should stop you first.

## Stale Closures Without Mysticism

PARISA: People say “stale closure” like we found yogurt behind the fridge.

JULES: A closure is a JavaScript function retaining access to variables from the scope where it was created.

PARISA: Each render creates handlers closing over that render’s state snapshot.

JULES: Right. If an asynchronous callback runs later, it may still see values from the render that created it.

PARISA: Sometimes that is exactly correct.

JULES: Yes. Sometimes you need an updater function, a ref, or a differently structured effect. The answer depends on what value the callback should mean.

PARISA: Do not randomly add dependencies until the warning disappears.

JULES: We are approaching Episode Four with torches.

## State Is Not Global Truth

PARISA: Is React state my database?

JULES: No. Component state is client-side UI memory. Refreshing may erase it. Other users do not share it. The server can reject it. It is not an authorization boundary.

PARISA: A button hidden because isAdmin is false is interface behavior, not security.

JULES: Correct. The server must enforce permissions.

PARISA: Form state can also contain sensitive data.

JULES: So avoid retaining secrets unnecessarily, do not log them, and understand what persistence tools do before using them.

## State Categories Help

JULES: It helps to distinguish kinds of state.

PARISA: Local UI state: open menu, selected tab.

JULES: Form state: current values, validation messages, submission status.

PARISA: Server state: data fetched from elsewhere, with loading, errors, caching, and freshness.

JULES: URL state: filters, page numbers, selected resources that should be shareable or survive navigation.

PARISA: And derived values that should not be state at all.

JULES: Exactly. React gives you primitives, but choosing where truth lives is the real work.

## The Cart Revisited

PARISA: Cart items live in state owned by the part of the application that coordinates the cart.

JULES: The count and subtotal can be derived from those items.

PARISA: Product cards receive add callbacks as props.

JULES: The header receives the count.

PARISA: When the cart state updates, React renders the dependent UI descriptions from the same current source.

JULES: Steve can retire from whiteboard duty.

PARISA: He has opened a taco truck.

JULES: There are finally tacos.

## The Actual Model

[MUSIC BED]

PARISA: State is data React preserves for a component across renders.

JULES: Updating it requests a render.

PARISA: Each render sees a snapshot. Setters do not mutate the existing snapshot.

JULES: Render calculates; commit changes the DOM where necessary.

PARISA: Derive values instead of storing duplicates.

JULES: Keep ownership as local as practical and lift it when consumers need coordination.

PARISA: Treat objects and arrays immutably.

JULES: And remember that React state is not a database or security boundary.

PARISA: Next: Hooks and useEffect, the tool developers use when they need to synchronize with the world outside React.

JULES: And occasionally when they absolutely do not.

PARISA: Effect season.

[OUTRO MUSIC]

## Production Notes

- Companion material should show snapshot behavior, functional updates, immutable object and array updates, and controlled inputs.
- Keep render, commit, and browser paint conceptually distinct without overpromising exact scheduling.
- Accessibility: retain the visible label in the controlled-input example.
- Security: explicitly keep authorization on the server.
