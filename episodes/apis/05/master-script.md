# Episode 5: JSON: Why Are We Passing This Stuff Around Everywhere?

**Series:** APIs — How Software Talks to Other Software
**Runtime:** Unrecorded; final timing depends on performance.
**Hosts:** Parisa, Jules

[INTRO MUSIC]

JULES: The server returns a JavaScript object.

PARISA: Does it?

JULES: It returns JSON.

PARISA: Those aren't the same sentence.

JULES: Fine. The server returns a textual representation of structured data that our JavaScript can parse into a value.

PARISA: Much better. Slightly less marketable.

JULES: Our slogan needs a larger mug.

[STING]

## You Cannot Mail a Memory Address

PARISA: Welcome to Okay, But Why? Today, JSON. Not an architectural style, not a protocol, and not a small person employed by your backend.

JULES: It stands for JavaScript Object Notation. It's a text-based data interchange format. The problem it solves starts before any curly braces: one program has data, and another program needs a representation it can interpret.

PARISA: In one JavaScript process, I can pass an object reference to a function. Both pieces of code are operating in that environment. A PHP server on another machine doesn't share that object reference.

JULES: Exactly. A reference to memory in your process isn't a portable description of the order. We need to encode the information into something that can be transferred or stored.

PARISA: Serialization means turning data into that transferable representation. Deserialization means interpreting the representation back into values.

JULES: Yes. It isn't necessarily text. Binary formats serialize data too. JSON happens to use text, which is convenient to inspect and widely supported.

PARISA: A packing list, not the original living room. If I serialize a chair, I haven't given the receiving program the actual chair from my memory.

JULES: And we should choose what goes on the packing list. Sending every private field merely because an object has it isn't an API design strategy.

## Object Here, Text There

[CODE CARD: A JavaScript value and its JSON text]
```javascript
const order = { id: 42, status: "baking", estimatedMinutes: 18 };
const text = JSON.stringify(order);
const receivedOrder = JSON.parse(text);
```

JULES: This is JavaScript, not TypeScript. Const declares bindings we won't reassign. The first value is a JavaScript object. Stringify produces a string containing JSON text. Parse reads that text and produces a JavaScript value.

PARISA: For listeners: we had an object, made a textual description, and read that description back into a new value. No HTTP request is happening in that card.

JULES: Right. JSON can be used in files, messages, configuration, and other places. Its relationship with HTTP is common, not exclusive.

PARISA: And receivedOrder is not a live connection to order. If I change one, the other doesn't automatically change. We've reconstructed data rather than shared an object identity.

JULES: Exactly. That distinction matters for remote communication. Updating your local copy doesn't update the server unless you make a supported request that asks the server to do so.

PARISA: The server cannot hear me muttering at my variables. A relief for everyone involved.

## What JSON Can Describe

JULES: JSON has objects with string member names, arrays, strings, numbers, booleans, and null. Those are the core data shapes.

PARISA: Objects group named values. Arrays hold an ordered sequence. Booleans are true or false. Null is an explicit empty value whose application meaning we still need to define.

JULES: Correct. Objects can contain arrays and other objects, so the structure can be nested. A valid top-level JSON value doesn't have to be an object; an array, string, or other JSON value can also be valid.

PARISA: But our API might require a particular top-level shape. “Valid JSON” and “valid order request” are different tests.

JULES: Exactly. The format tells us how to read the structure. The application contract tells us which structure is acceptable and what it means.

[CODE CARD: JSON text]
```json
{
  "id": 42,
  "status": "baking",
  "estimatedMinutes": 18,
  "contactless": true,
  "deliveredAt": null,
  "items": [
    { "menuItemId": "margherita", "quantity": 1 }
  ]
}
```

PARISA: That describes an order. It doesn't contain a function that calculates its delivery estimate or a method that calls the driver.

JULES: Exactly. JSON is data. If we need an operation, the receiving application implements it. Sending a property called function doesn't turn the string into executable behavior.

## Wait, That's Not Quite JavaScript

PARISA: The syntax resembles a JavaScript object literal closely enough to cause trouble.

JULES: JSON member names require double quotes. Strings use double quotes too. Standard JSON doesn't allow comments or trailing commas. JavaScript object literals allow several things JSON doesn't.

PARISA: No undefined value. No function values. No symbol values. No BigInt value. No special NaN or Infinity numbers in the JSON grammar.

JULES: Right. And JSON doesn't contain a Date type. A date usually crosses the boundary as an agreed string or number, then the receiver interprets it according to the contract.

PARISA: If we send a string saying Friday, the parser hasn't secretly figured out which Friday, whose timezone, and whether lunch counts as a business day.

JULES: Sadly, no. We choose a defined date-time representation and document the interpretation. The JSON format doesn't solve calendar semantics.

PARISA: Nor currency. An amount called 1299 needs a currency and a unit. Cents? Dollars? Loyalty points issued by an unstable pizza monarchy?

JULES: The monarchy has been dissolved. Please use documented minor currency units where appropriate.

PARISA: A format can preserve a number while the API completely fails to explain it. This is why I don't want people confusing parseable with meaningful.

## Stringify Makes Choices

JULES: Here's a trap: JSON.stringify doesn't preserve every JavaScript value unchanged. Object properties whose values are undefined or functions are normally omitted. In arrays, unsupported values such as undefined become null.

PARISA: Which means a round trip can silently change the shape if we assume our entire JavaScript object is representable.

JULES: Yes. Non-finite numbers such as NaN and Infinity are serialized as null. BigInt values normally cause an error unless you deliberately provide custom handling. Circular references also cause an error.

PARISA: Circular meaning an object eventually refers back to itself. A tree-shaped textual representation can't simply keep following the loop forever.

JULES: Exactly. Dates have defined serialization behavior in JavaScript, commonly producing a string through their toJSON method. Parsing that string does not automatically reconstruct a Date object.

PARISA: So stringify and parse are not a universal cloning spell. They are a data conversion process with rules and losses.

JULES: Right. When designing an API, explicitly create the transferable data shape. Don't assume whatever happens to be in memory makes a good contract.

## Why Not XML?

PARISA: Before JSON became the default mental picture, I used XML. We should explain it without staging a retirement party.

JULES: XML is another text-based way to represent structured information. It uses elements and attributes and supports capabilities such as namespaces. It's useful in document-oriented and established integration systems, among other contexts.

PARISA: A small order response in XML might have an order element, a status element, and an estimated-minutes element. In JSON, similar information might be named values in an object.

JULES: JSON's smaller set of constructs and close fit with common programming data structures made it convenient for many web API payloads. JavaScript developers also found its syntax familiar, and other languages developed broad support.

PARISA: That doesn't mean JSON won a scientific contest proving all angle brackets bad. Existing standards, document needs, tooling, and interoperability can justify XML.

JULES: Exactly. CSV can be useful for flat tables. Binary formats can prioritize compactness, speed, or explicit schemas. Plain text might be sufficient for a simple value.

PARISA: The choice depends on what the systems need to exchange. Sending JSON because that's what both sides support is sensible. Sending it because every other format is ancient witchcraft is less persuasive.

## Text Becomes Bytes

JULES: There's one layer underneath “JSON is text.” Networks and files store or carry bytes. The text must be encoded.

PARISA: UTF-8 is the interoperable encoding required for JSON exchanged between systems outside a closed ecosystem. Which helps everyone agree how characters become bytes and back.

JULES: Right. An HTTP Content-Type of application/json identifies JSON content. That label doesn't perform the conversion by itself.

PARISA: If I attach that label to an HTML error page, the body is still an HTML error page. The label is a claim that the content needs to fulfill.

JULES: Exactly. And strings require escaping for characters such as quotation marks and line breaks. Use the language's serializer rather than manually concatenating a response string.

PARISA: Because the customer can have an apostrophe, a quote, an emoji, or a line break in a perfectly reasonable value. “It worked with Bob” is not an encoding strategy.

## Parsing Is Not Validation

JULES: Suppose we parse this response successfully: order ID 42, status baking, estimated minutes negative seven hundred.

PARISA: Valid JSON. Extremely optimistic delivery service.

JULES: Exactly. Parsing established that the text conformed to JSON syntax. It didn't establish our business rules or expected field types.

PARISA: The response might have a string where we expect a number, an unknown status, or fields that aren't there. We need runtime checks where that data crosses a trust boundary.

JULES: And a TypeScript assertion doesn't inspect a remote response. It can tell the compiler what we claim, but the server didn't sign a pact with our type definition.

PARISA: Our program must actually check the data if it depends on the shape. A schema validator is one tool, but even a schema doesn't automatically answer whether this caller may see this order.

JULES: Correct. Syntax, shape, business validity, and authorization are separate concerns.

PARISA: I like a format that does one job. I dislike assigning it four jobs and then blaming it for the three it never accepted.

## Numbers Can Survive the Format and Still Lose Precision

JULES: JSON's number syntax can represent numbers that a receiving language's ordinary numeric type cannot represent exactly.

PARISA: JavaScript's Number type uses floating-point representation. Integers beyond its safe range can lose precision. That matters for long identifiers even if nobody does arithmetic with them.

JULES: Exactly. An API may transmit identifiers as strings to preserve their exact characters across implementations. The contract must make that choice consistently.

PARISA: And money deserves an explicit precision policy. A decimal-looking value in JSON doesn't somehow fix floating-point arithmetic in every consumer.

JULES: Right. Integer minor units can work within a suitable range; decimal strings or decimal-aware libraries can be appropriate in other designs. Explain the representation instead of hoping every language makes the same assumptions.

PARISA: Which takes us back to the actual API contract. JSON supplies the envelope's grammar. We supply the meaning.

## Missing, Null, and Empty Aren't Interchangeable

PARISA: Our deliveredAt field is null because the order hasn't been delivered. What if we omit it?

JULES: That might mean something different. Perhaps the field wasn't requested, isn't known, or isn't available to this caller. Or the API may define omission and null as equivalent. The important thing is to choose and document the behavior.

PARISA: An empty string is a third possibility. It may mean a value is present but empty. If we use all three randomly, clients start writing archaeology instead of applications.

JULES: Update operations make this especially important. Missing could mean leave unchanged; null could mean clear the value. If the server mixes them up, a small patch can delete information unintentionally.

PARISA: And duplicate member names in one JSON object are another interoperability hazard. Different parsers may handle them differently. Emit unique names rather than relying on whichever value wins today.

JULES: Exactly. Well-behaved data exchange avoids ambiguous structures, not merely invalid syntax.

## Don't Execute the Delivery Instructions

JULES: Historically, some code evaluated JSON-looking text as JavaScript. Don't do that. Use a JSON parser.

PARISA: Parsing data and executing code are profoundly different invitations. A response from outside your program should not become arbitrary instructions merely because it resembles an object literal.

JULES: And parsing safely doesn't make every later use safe. Put a string into the DOM as text when it's meant to be text. If you deliberately support HTML, handle that as a separate security decision.

PARISA: Likewise, JSON values used in database queries still need safe query construction. A serializer is not a universal disinfectant.

JULES: Exactly. Also keep payload sizes and nesting within reasonable limits. A valid format can still carry an unreasonably expensive input.

PARISA: “It's just data” has never prevented data from ruining an afternoon.

## Inspect the Value at Each Stage

PARISA: I want to debug a common confusion. I log something and the console shows curly braces. How do I know whether it's an object or JSON text?

JULES: Inspect the actual value and its type. Developer tools may render an object attractively. A string can contain characters that look exactly like an object literal. Visual resemblance isn't the runtime type.

PARISA: So I ask where it came from. Did I just call JSON.stringify? Then I expect a string. Did I call JSON.parse or await response.json? Then I expect the resulting JavaScript value, which might be an object or something else allowed by JSON.

JULES: Exactly. Naming variables can help: responseText for the text, orderData for the parsed representation. Names don't enforce correctness, but they reduce cognitive confusion.

PARISA: And if I stringify something that's already JSON text, I don't get a more official JSON object. I get a JSON string value containing the original characters, with necessary escaping.

JULES: Right. Double serialization is why people sometimes see extra quotation marks and backslashes and start removing them manually.

PARISA: Which can corrupt valid data. The fix is understanding how many serialization boundaries we crossed, not deleting punctuation until the console looks comforting.

JULES: Exactly. Ask what the next interface expects: a JavaScript value, a string, or already encoded bytes. Let each layer do its own conversion once.

## The Server Doesn't Need to Speak JavaScript

JULES: Picture a PHP server building an associative structure with an order identifier and status. It uses its JSON encoder, then sends the resulting representation with the appropriate response metadata.

PARISA: The browser parses that JSON into JavaScript values. It doesn't receive a PHP array, and it doesn't need a PHP runtime to understand the response.

JULES: Right. A Python client could parse the same representation into its own dictionaries, lists, and primitive values. A mobile app uses its platform's parser and types.

PARISA: That is the real interoperability benefit. We agree at the boundary without requiring identical internal objects.

JULES: Exactly. But each runtime can have different limits and behavior, particularly around numbers, duplicate members, and application-specific types. Designing interoperable data means staying within the shared guarantees we need.

PARISA: Which is why a giant numeric account identifier may be better represented as a string. It isn't a number we're adding or averaging. It's an exact label whose digits must survive.

JULES: Right. The format choice should reflect semantics, not merely whether the value happens to contain digits.

## A Date Is an Agreement About Time

PARISA: Let's make the date problem concrete. The server sends deliveredAt as a string with a date and time but no timezone offset. What can the client infer?

JULES: Only what the contract defines. Without a clear rule, one client might interpret it as local time and another as UTC. The same text could produce different moments.

PARISA: So use a documented representation that communicates the intended instant or local date-time semantics. A delivery completion timestamp and a restaurant's recurring opening time are different kinds of time data.

JULES: Exactly. An opening time of nine in the morning may belong to a location's timezone and calendar rules. It isn't automatically the same kind of value as the instant a payment completed.

PARISA: JSON happily carries both as strings. It doesn't know the difference. We do, or at least we are now aware that we need to.

JULES: And when displaying the result, the client can format it for the user's locale. The transferable representation and human presentation have different jobs.

PARISA: We don't force every API consumer to parse a friendly phrase such as yesterday around lunchtime. Unless we're deliberately designing an API for poets.

## Choose a Public Shape on Purpose

JULES: Suppose the internal order object includes a customer address, fraud-review notes, and a function used to calculate a discount. Stringify omits the function. Does that make the result safe to expose?

PARISA: Absolutely not. It can still include the sensitive data fields. Accidental omission of one unsupported value isn't a security policy.

JULES: Exactly. Build the response representation explicitly and select fields based on the caller's permission and the operation's purpose.

PARISA: This also makes evolution easier. If we add an internal warehouseNote next month, it doesn't automatically appear in every client's response because somebody serialized the whole database entity.

JULES: Right. A deliberate response boundary protects both confidentiality and compatibility.

PARISA: The same applies to input. Parsing a JSON object doesn't mean we should copy every property into storage. The caller might send fields our interface never offered.

JULES: Exactly. Serialization connects systems; validation and authorization constrain what that connection permits.

## When JSON Isn't the Best Parcel

PARISA: Could we send a photo in JSON?

JULES: We could encode binary data as text, for example using base64, but that adds size and processing overhead. A direct upload, multipart request, or separate object storage flow may be more appropriate depending on the system.

PARISA: And a huge stream of measurements might benefit from a different representation or streaming design. We shouldn't put an entire growing universe into one enormous JSON array just because our parser understands brackets.

JULES: Right. JSON is convenient for many ordinary structured messages. It doesn't guarantee compactness, efficient random access, or incremental parsing in every client API.

PARISA: Choosing the format means considering message size, schema needs, available tools, readability, and how receivers consume the data. The right answer can be boring and familiar, including JSON, as long as it fits.

JULES: Exactly. We wanted the format to become understandable, not compulsory.

## Follow the Whole Conversion

JULES: The server has trusted order information in its own runtime. It selects allowed fields and serializes a defined representation. HTTP carries the bytes with relevant metadata.

PARISA: The client receives the body, decodes and parses it, checks the expected shape, then uses the resulting values. That client may be JavaScript, Swift, Python, or something else with JSON support.

JULES: Exactly. Shared representation lets different internal systems communicate without sharing object identity or implementation language.

PARISA: That is why JSON is everywhere. It's a widely understood, fairly small data format that fits many ordinary application exchanges. Not because every server is secretly JavaScript.

JULES: And not because every API has to use it.

PARISA: Next episode, we put the pieces together in frontend code. Fetch, promises, async and await, and the delicate art of admitting a request failed.

JULES: Loading states included.

PARISA: The spinner cannot be our permanent answer to uncertainty.

[OUTRO MUSIC]

## Production References

- JSON data interchange standard: https://www.rfc-editor.org/rfc/rfc8259
- JSON.stringify behavior: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/stringify
- JSON.parse: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/parse
- JSON examples are data illustrations, not a delivered ordering service. Currency, dates, nullability, and identifier representations require application contracts.