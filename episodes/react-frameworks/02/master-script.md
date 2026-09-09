# Episode 2: Components, Props, and JSX — Whose HTML Is This?

**Series:** React / Modern Front-End Frameworks
**Runtime:** Determined by the final recorded read; coverage takes priority over a fixed length.
**Hosts:** Parisa, Jules

[INTRO MUSIC]

PARISA: Last time, React survived the question “why do you exist?”

JULES: A rigorous peer review.

PARISA: Today it faces charges of putting HTML in JavaScript.

JULES: JSX has retained counsel.

[STING]

## Start With the Component

JULES: A React component is commonly a JavaScript function that returns a description of UI.

PARISA: Label it.

JULES: Function: JavaScript. Component convention: React. Markup-looking return value: JSX.

PARISA: Already better than most tutorials.

[CODE CARD]

~~~jsx
function Greeting() {
  return <h1>Hello, neighbor.</h1>;
}
~~~

PARISA: In audio: a function named Greeting returns an h-one-looking thing.

JULES: The function declaration is ordinary JavaScript. Capitalizing the component name is a React convention that helps JSX distinguish a component from a built-in HTML element.

PARISA: Lowercase h-one means browser element. Capital-G Greeting means our component.

JULES: Exactly.

PARISA: And that angle-bracket syntax?

JULES: JSX. It is not a string, not HTML pasted into a script, and not syntax the browser natively runs.

## What JSX Actually Becomes

JULES: Tooling transforms JSX into JavaScript calls that create React element descriptions.

PARISA: So this:

[CODE CARD]

~~~jsx
<button type="button">Save</button>
~~~

PARISA: Becomes JavaScript that effectively asks React to create an element description for a button with a type and child text.

JULES: Yes. Modern transforms may use JSX runtime helpers rather than the older React.createElement spelling, but the mental model is the same.

PARISA: JSX is authoring syntax.

JULES: Correct. React can be used without JSX, but JSX makes nested UI easier for many people to read.

PARISA: Many people who did not spend twenty years being told to separate structure, presentation, and behavior.

JULES: Here comes the prosecution.

## Separation of Concerns, Not File Extensions

PARISA: We spent years pulling JavaScript out of HTML. Unobtrusive JavaScript. Semantic markup. Separate concerns. Then React arrives with a button and an onClick in one file.

JULES: React’s argument is that the meaningful concern is the component’s behavior and UI, not whether every language occupies a separate file.

PARISA: So it colocates things that change together.

JULES: Right. A component can contain the rendering rules and interaction logic for one meaningful piece. CSS might still live elsewhere—or use one of many other arrangements—but the boundary is the component.

PARISA: That can be coherent. It can also become a casserole.

JULES: Absolutely. Colocation is not permission to make a thousand-line component.

PARISA: Nor permission to forget HTML because it resembles HTML.

JULES: Especially that.

## JSX Is Not HTML

[GAME-SHOW BELL]

PARISA: Differences.

JULES: In JSX, JavaScript expressions go inside curly braces.

PARISA: Curly braces mean “evaluate JavaScript here,” not “React invented variables.”

JULES: Correct. Some attributes use JavaScript property-style names. class becomes className. for on a label becomes htmlFor.

PARISA: Because class and for already mean things in JavaScript, historically?

JULES: That influenced the API, and JSX maps closely to DOM property naming. Event props use camelCase, like onClick.

PARISA: React-specific convention.

JULES: Yes. Tags must close. A component must return one root value, though a Fragment can group siblings without adding a DOM element.

PARISA: Fragment syntax looks like empty angle brackets, which is very considerate of nobody listening to audio.

JULES: Companion page.

PARISA: Good.

JULES: Also, JSX escapes text values by default, which helps prevent accidental HTML injection.

PARISA: Helps. Does not make all input safe everywhere.

JULES: Correct. URLs, server queries, authorization, storage, and explicitly injecting raw HTML have their own risks. The frighteningly named dangerouslySetInnerHTML deserves the frightening name.

PARISA: Please Don’t Do This casually.

## Expressions, Not Statements

PARISA: Why can I put a ternary inside JSX but not an if statement directly?

JULES: Curly braces accept JavaScript expressions—things that produce values. A ternary produces a value. An if statement controls execution but is not itself a value.

PARISA: JavaScript distinction, revealed by JSX.

JULES: Exactly. You can use an if before the return, assign a value, call a helper, use a ternary, or use logical AND carefully.

PARISA: Carefully?

JULES: Rendering count && SomeComponent can display a zero when count is zero, because JavaScript’s AND expression returns the first falsy operand.

PARISA: Wait, that is just JavaScript.

JULES: Causing a React surprise.

PARISA: Better to be explicit when zero is possible.

## Props: Inputs to a Component

JULES: Props are values passed from a parent component to a child component.

PARISA: Function arguments for UI pieces.

JULES: That analogy is useful. A ProductCard component might receive a product name, price, image information, and an event handler.

[CODE CARD]

~~~jsx
function ProductCard({ name, price, onAdd }) {
  return (
    <article>
      <h2>{name}</h2>
      <p>{price}</p>
      <button type="button" onClick={onAdd}>
        Add to cart
      </button>
    </article>
  );
}
~~~

PARISA: Label the syntax pile.

JULES: Function and object destructuring in the parameter: JavaScript. ProductCard as a component and props as its input contract: React’s component model. Angle-bracket markup: JSX. article, h-two, paragraph, and button: HTML elements represented through JSX. onClick: React event prop.

PARISA: onAdd is a function value passed as a prop.

JULES: Yes. The child does not need to know how the cart works. It reports the event through the callback it received.

PARISA: Data down, events up.

JULES: A useful default model.

## Pass the Function; Do Not Call It During Render

PARISA: Why does onClick get onAdd instead of onAdd with parentheses?

JULES: Because we are passing React a function to call later when the click happens. The function itself is a JavaScript value.

PARISA: If I write onClick equals onAdd with parentheses, JavaScript calls onAdd immediately while the component is rendering.

JULES: Right. Then whatever onAdd returns becomes the value of onClick. That is usually not what you intended, and if the call updates state it can create a render loop.

PARISA: So onClick is a React event prop. onAdd is our own prop name. Passing a function without calling it is JavaScript.

JULES: Exactly. If the click needs arguments, pass a new function that calls your function later.

PARISA: The arrow function is JavaScript. React's job is deciding when to invoke the event handler.

## Props Are Read-Only

PARISA: Can ProductCard change its name prop?

JULES: It should not. Props are read-only inputs for that render.

PARISA: Like a function should not secretly rewrite its arguments.

JULES: Similar principle. If data must change, the owner of that data updates it, React renders again, and the child receives new props.

PARISA: That gives us one direction of ownership rather than components grabbing each other’s whiteboard markers.

JULES: Exactly.

PARISA: Can I pass objects, arrays, functions, booleans?

JULES: Any JavaScript value. But passing a giant object because it is convenient can hide what the component actually depends on.

PARISA: Explicit props document the boundary.

## Children

JULES: There is a special prop called children. It represents content nested inside a component’s JSX.

PARISA: Like a reusable Card that wraps different content.

JULES: Yes. Composition lets components combine without one component needing a prop for every conceivable arrangement.

PARISA: A slot-shaped idea.

JULES: Very much. Different frameworks name and express it differently, but the composition problem is common.

## Reuse Is Not the Only Point

PARISA: People say components are reusable. Then I make one used exactly once and feel I have violated React.

JULES: Reuse is one benefit, not the entrance exam. A component can be valuable because it gives a meaningful name, contains a coherent responsibility, or isolates complexity.

PARISA: CheckoutSummary may appear once but still deserve a boundary.

JULES: Right. Meanwhile, extracting every wrapper div creates indirection without clarity.

PARISA: What is the granularity test?

JULES: Does this piece have a meaningful job, repeated structure, independent behavior, or enough complexity that naming it improves understanding?

PARISA: And can I describe it without saying “the thing around the other thing”?

JULES: Strong signal.

## Component Trees

JULES: React applications form a tree. App renders Header and Main. Main renders ProductList. ProductList renders ProductCards.

PARISA: The browser DOM is also a tree, but these are not identical trees.

JULES: Important. A React component may return several DOM elements, another component, or no DOM output. Components are conceptual and rendering boundaries; DOM nodes are browser objects.

PARISA: React Developer Tools shows the component tree. Browser tools show the DOM.

JULES: Exactly.

PARISA: If I confuse them, debugging gets weird.

## Lists and Keys

PARISA: Here comes map.

JULES: Array.prototype.map is JavaScript. It transforms each array item into a value. In React, we often map data into JSX elements.

PARISA: And React demands a key.

JULES: A stable key helps React identify which sibling item corresponds to which prior item across renders.

PARISA: Database ID?

JULES: Often excellent if it is stable and unique among siblings.

PARISA: Array index?

JULES: Sometimes acceptable for a static list that never reorders, inserts, deletes, or carries item-specific state. Dangerous as a casual default.

PARISA: Because React may associate the wrong prior item with the new position.

JULES: Yes. The key is not displayed, and it is not automatically passed as a normal prop. It is identity information for React.

PARISA: Do not generate a fresh random key while rendering.

JULES: Correct. That tells React everything is brand new every time, defeating the identity.

## Accessibility Lives Inside Components

PARISA: Components make one accessibility decision multiply.

JULES: For better or worse. A genuinely accessible Button component can standardize semantics, focus styles, disabled behavior, and labeling expectations.

PARISA: A broken fake button component can distribute inaccessible behavior across the whole product.

JULES: Use native elements when they match. A button is already keyboard-operable and exposes button semantics. A clickable div makes you rebuild all of that, usually incompletely.

PARISA: Props should not create impossible combinations either.

JULES: Right. A component API can require an accessible name where visible text is absent. TypeScript may help at compile time, but runtime content and rendered behavior still require testing.

PARISA: Compile-time guidance is not a screen-reader test.

## Styling Is a Separate Decision

PARISA: Does React tell me how to write CSS?

JULES: Core React does not. Plain stylesheets, CSS Modules, utility classes, CSS-in-JS, design systems—those are ecosystem choices.

PARISA: So className belongs to JSX, but the CSS architecture does not belong to React.

JULES: Correct.

PARISA: Another opinion I must select later.

JULES: Episode Five has a clipboard.

## The Parent Is Not a God Object

PARISA: If data flows down, do I put everything in App and pass props through twelve floors?

JULES: Please do not. State should live as close as practical to the components that need it. Composition can avoid some prop drilling. Context can share values across a subtree. External stores can help when the problem genuinely requires one.

PARISA: But we have not learned state yet.

JULES: Correct. I am placing warning cones, not opening the highway.

## What a Component Really Is

[MUSIC BED]

PARISA: Let me try.

JULES: Go.

PARISA: A modern function component is a JavaScript function participating in React’s rendering model.

JULES: Good.

PARISA: It receives read-only props, which are JavaScript values.

JULES: Yes.

PARISA: It commonly returns JSX, a nonstandard syntax extension transformed into JavaScript that describes elements.

JULES: Yes.

PARISA: HTML element names inside JSX still represent real semantic HTML choices.

JULES: Very yes.

PARISA: Components form a conceptual tree, help create boundaries, and may be useful even when not reused.

JULES: You have passed JSX court.

PARISA: I have reached a plea agreement.

JULES: Next time: state. Why a regular variable does not make React update, what causes a render, and why “render” does not mean “the DOM definitely changed.”

PARISA: We are going back to the whiteboards.

JULES: Steve has filed an appeal.

[OUTRO MUSIC]

## Production Notes

- Read code conceptually; never dictate punctuation. Put exact examples on the companion page.
- Explicitly name JavaScript, JSX, React, and HTML layers whenever syntax first appears.
- Companion material should include the component, props, children, list, and key examples.
- Accessibility example must use a native button and explain why semantics survive abstraction.
