# Episode 7: Tools & Function Calling: Letting the Robot Do Things

**Series:** AI
**Hosts:** Parisa, Jules

[INTRO MUSIC]

JULES: Support Assistant has read the policy. Now the employee asks, “Where is order 1234?”

PARISA: The answer is in the order system. An exciting opportunity to consult the order system.

JULES: Instead of inviting the model to imagine a parcel.

PARISA: Welcome to Okay, But Why? Today our robot gets capabilities. Carefully selected capabilities. It has not earned the company credit card.

## A Request to Call a Function

JULES: A tool is a capability our application makes available. For example, getOrderStatus. We describe its purpose and the inputs it accepts, often using a JSON Schema.

PARISA: The schema says an order ID is required and what shape it has. The model sees a description and can request that tool with structured arguments.

JULES: Yes. The model's output may be a tool call instead of a final answer. Our application receives that request, validates it, checks authorization, executes approved code, and returns the result as tool information. The model can then use it to answer.

PARISA: Crucial verb: requests. The generated tool call isn't the model magically reaching into our database. It's a proposal crossing an application boundary.

JULES: Some frameworks handle much of that execution loop. But somebody's software still dispatches the call, and we must understand what checks it performs.

PARISA: “The framework did it” doesn't sound promising in a data-access incident report.

## Follow Order 1234

JULES: The employee asks where order 1234 is. The model requests getOrderStatus with that ID. What happens before the database query?

PARISA: We already have the authenticated employee's identity from the server session. We don't accept “I am an administrator” as a tool argument. Validate the proposed arguments, confirm the tool is allowed, then check that this employee may view that order in this account or tenant.

JULES: So even a perfectly valid order ID can be unauthorized.

PARISA: Exactly. Syntax isn't permission. A four-digit number can identify somebody else's private record just as correctly as ours.

JULES: The controlled function queries the order service and returns limited fields: perhaps status and last update time. No payment details or complete customer profile unless the task and permission require them.

PARISA: Data minimization makes the result easier to use and limits exposure. Then the model says, “The order system reports it was dispatched, last updated at this time.”

JULES: And if the lookup fails?

PARISA: We report failure or unavailable status. We don't convert a timeout into “Your package is definitely on its way.” A missing result is not a shipping event.

JULES: Good. The model might need a tool-call identifier to associate the returned result with its request; exact wire formats vary by provider.

PARISA: The important sequence is stable: propose, validate, authorize, execute, return result, then generate the explanation.

## Schemas Are Useful, Not Omnipotent

JULES: Our companion shows a schema allowing an order ID string and rejecting extra fields. Why reject extras?

PARISA: It makes the contract narrow. We don't want a model inventing a field called bypassSecurity and an overly flexible dispatcher doing something creative with it.

JULES: That's a distressingly plausible field name.

PARISA: Also, TypeScript interfaces are compile-time help. Runtime validation checks what actually arrived. A JSON Schema descriptor tells the model what we expect; our execution path still enforces the expectation.

JULES: In the example, we use an explicit allowlisted function rather than evaluating a model-generated code string.

PARISA: Wait, that's just JavaScript: receive data, check it, call a known function. The model changes who proposes the input. It doesn't change why executing arbitrary input is a bad idea.

JULES: Tool descriptions matter, too. “Get current status for one authorized order” is easier to use correctly than “Do order stuff.”

PARISA: A sentence sadly applicable to human API documentation.

## Read Is Not the Same as Refund

JULES: The employee follows up: “Cancel it and refund the shipping.”

PARISA: We have crossed from reading information to changing the business. Different risk, permissions, and recovery requirements.

JULES: Could we expose a refund tool?

PARISA: We could, but not as a universal executeAnything function. Use a narrow action with business validation. Check the specific order, permitted amount, currency, current eligibility, and the employee's authority.

JULES: And require human approval for this workflow.

PARISA: Meaning a person sees the exact proposed action: this order, this amount, this reason, this consequence. “Let the AI help?” is not meaningful approval for a refund it hasn't proposed yet.

JULES: If the model changes the amount after approval, that approval no longer covers the new action.

PARISA: Correct. Bind approval to the concrete proposal and authenticated approver. Recheck permission and current state when executing. A policy change or already-issued refund can make an earlier proposal invalid.

JULES: And if a network timeout leaves us unsure whether the refund happened, don't blindly send another one.

PARISA: Use the service's idempotency mechanism where available and reconcile the recorded action state. “Exactly once” is not created by typing it in a prompt.

## The Confirmation Has to Be Usable

JULES: This is also an interface problem. The confirmation needs a clear name, amount, consequences, and actual confirm and cancel controls.

PARISA: Keyboard reachable. Visible focus. Readable context. No color-only warning. If a dialog appears, handle focus properly and return it sensibly when the dialog closes. Don't approve on a vague natural-language sentence buried in the chat.

JULES: We should also make denied or expired approval understandable, so the user knows whether anything changed.

PARISA: Exactly. A spinner isn't a transaction receipt. The application reports the confirmed execution result, including failure or uncertainty, separately from the model's draft.

JULES: This is more work than adding a tool definition.

PARISA: Yes. The definition is the menu. It isn't the kitchen's safety procedures, payment system, or fire exit.

## Tools Bring More Text Into the Room

JULES: Tool results may include customer notes or ticket text. That can contain instructions trying to manipulate the assistant.

PARISA: So a tool response is not automatically trustworthy just because it came through our tool. The order status might be authoritative for status; a customer's note saying “ignore the rules” has no authority over the application.

JULES: We keep that boundary. We also log enough to investigate who requested which operation, which checks passed, and what the service reported, while avoiding unnecessary private content in logs.

PARISA: Reading can be harmful too. A read-only tool with access to every customer's data can leak plenty without changing one record.

JULES: So least privilege applies to read tools as well as write tools.

## Do We Need a Model to Choose This?

PARISA: One more question. If the user clicks a button labeled “Check order status,” do we need a model to decide to call getOrderStatus?

JULES: No. The application can call it directly. Tool calling is useful when interpreting a broader request or selecting among capabilities adds value.

PARISA: Excellent. The humble button retains employment.

JULES: Our Support Assistant now retrieves policy and can request a constrained live lookup. It can propose a refund, but the application controls approval and execution.

PARISA: Next problem: documentation, orders, customer records, and ticketing all need integrations. And suddenly everyone is saying MCP.

JULES: We already have APIs and tool calling. Why another protocol?

PARISA: I have placed that exact question on the agenda, with an unnecessarily large font.

[OUTRO MUSIC]
