---
title: Reactive Programming with RxJS
date: "2019-09-24"
---

During previous summer, one of my biggest achievement was to get the hang of [RxJS](https://rxjs-dev.firebaseapp.com/) and [Reactive programming](https://en.m.wikipedia.org/wiki/Reactive_programming) philosophy in general. Approaching these really calls for a different mindset. It could also be challenging to understand [declarative programming](https://en.wikipedia.org/wiki/Declarative_programming) while [imperative progamming](https://en.wikipedia.org/wiki/Imperative_programming) is deeply in your daily toolset.

Therefore, I hope that throughout this **RxJS** series, we can go through ideas and real-world implementations together. Then who knows if this could be a game-changer for your project. So, let's dive in the first part 🚀

## Part 1: Why RxJS?
----
### RxJS in a nutshell
Before figuring out why we should use RxJS, I think it is worth metioning why RxJS is created at the first place. Here is a nutshell from the [doc](https://rxjs-dev.firebaseapp.com/guide/overview):
> RxJS is a library for composing asynchronous and event-based programs by using observable sequences

> Think of RxJS as Lodash for events.

Essentially, RxJS was born to solve problems that JavaScript developers encounter most notably in event-based and async actions.

However, for these two, [Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) and [Callback](https://codeburst.io/javascript-what-the-heck-is-a-callback-aba4da2deced) have been standard solutions for years. So why bothering to have a new paradigm? 🙄 And which use cases can we get the most out of RxJS?

In this blog, I will show you 4 primary reasons why RxJS is a perfect replacement for Promise and Callback. Now, get yourself some coffee ☕️ and let's get into it 🚀

### Handling different *data sources* at ease
In a program, we retrieve and manipulate data from different sources. It could be DOM events such as mouse clicks, key presses. We typically use Callback to handle this type of event:
```js
getCakeButton.addEventListener('click', (e) => console.log('Give me cakes!'))
```
Another source of data comes from server/database level. We can use *either* Callback or Promise to handle this. Here is an example of handling API request by Promise:
```js
const getCakes = async () => {
	// Get cakes 🍰
	const myCakes = await )
	// Consume cakes 🍽
	consumeCake(myCakes)
}
```
On the other hand, RxJS treats all sources of data as *streams* in an exact manner. These sources include reading a file, making an API request, clicking a button or moving the mouse. Let's see how RxJS handle our previous button click and getCakes 🍰 API request:
```js
const source = fromEvent(getCakeButton, 'click')
source.pipe(
	tap(e => console.log('Be quick!'))
)
```
```js
const promise = fetch(cakeEndpoint, {method: 'GET'}.then(cakes => cakes)
const source = from(promise)
source.pipe(
	map(cakes => consumeCakes(cakes))
)
```
From here, we can see that RxJS *does not necessarily reduce the amount of code* dealing with these 2 particular problems. Nonetheless, it shows a consistent way of handling  various types of event.

This actually calls for a shift in mindset. *Thingking in stream* is one key principle of RxJS. It treats all sources of data as streams. Besides, RxJS does not handle *individual event* but rather combining *all of them* to a stream and handling only values created by that stream.

If you look closely on RxJS codes above, it is apparent to notice `source` of the data. It could either be button clicks or API requests. All button clicks are combined into 1 single stream. RxJS does not care if user actually clicks it once, or twice. It treats all of those clicks similarly and care only about value *emitted* from each click. *API request stream* works in a similar pattern.

### Minimise side effects
RxJS embraces principles of [functional programming](https://en.wikipedia.org/wiki/Functional_programming). One of them is to reduce [side effects](https://en.wikipedia.org/wiki/Side_effect_(computer_science)) from functions or expressions inside our applications.

In a brief, when a function relies on data whose source is *outside of its local scope*, it is prone to side effects. Let's inspect side effects in action by complicate our get cakes *a little bit* 🕵️‍🧐

Now imagine we are allowed to eat only **3 first cakes** regardless of how many we asked for 😔. In this case, we need to have a *state variable* to keep track of the amount of cakes we already consumed:

`side-effects.js` 🐛
```js
let consumedAmount = 0
const consumeCake = cakes => {
	// check if we still can consume it 😱
	if(consumedAmount === 3) {
		return
	}
	// do something with cake ☕️
	alert('This cake is great')
	// update the consumed amount
	consumedAmount = consumedAmount + 1
}
```
Our `consumedAmount` variable seems to be a good fit for above solution. However, it is barely optimal. We need to *update* this variable everytime we consume our cakes. In other words, we *mutated* this state variable.

When more features arise and further complicate this tracking logics, our application is prone to bugs. Because our variable is exposed and mutated by other functions. In debugging, we also need to examine every single logics that mutated this variable. This could be a challenging and daunting task when we scale our application larger.

In other hand, here is how RxJS simplifies the puzzle:

`side-effects-free.js` ✅
```js
cakeSource.pipe(
	take(3),
	map(cakes => consumeCakes(cakes)),
)
```
Dead simple isn't it? By treating data source as a stream, RxJS skips the job of keeping track of each time we consume the cake. Rather than that, it only cares about how many cakes that the stream is allowed to produces. In fact, `take` operator helps this out and free out logics from side effects and potential issues 🚀

In truth, functional programming (FP) does not guarantee a program to be entirely free from side-effects. However, it aims to *minimise* them by locking variables within function scopes. Besides, FP *explicitly* shows where sides effects are performed. So when our application is buggy, we could expect to jump directly to those places to hunt those 🐛

If you want to learn more about functional programming, [Functional-Light JavaScript](https://github.com/getify/Functional-Light-JS/blob/master/manuscript/ch5.md) is a good place to start.

### Declarative coding style
RxJS has *declarative coding style*. Meaning each function or operator *handle solely 1 operation*. Therefore, you can already told what the function is used for by simply looking at it. This closely follows **functional programming** principle as well as [declarative programming](https://en.wikipedia.org/wiki/Declarative_programming) in general.

Additionally, a rich set of operation functions (operators) are provided in RxJS. Each operator follows this notion of having no side-effects and being declarative. We therefore can have *stream handler* like:
```js
const source = from(cakes)
source
	.pipe(
		filter(isCakeOk),
		tap(cake => console.log('This cake is fine: ', cake.name)),
		map(cake => cake.name),
	)
	.subscribe(cakeName => alert('Here is your cake 🍰: ', cakeName))
```
In here, each *operator* such as `filter`, `tap`, `map` is *declarative* and free from side effects. They neither mutate the source nor depend on any out-of-scope variables.

This is a rock-foundation for even more complicated operations that we might need to add to existing program. This comes to the 3rd benefit of RxJS.

### Powerful in managing complicated streams
When data sources become more complex is also the time RxJS comes very handy. In scenarios where we want to *debounce, throttle, retry, cancel, handle errors*, the power of RxJS is undeniable.

Imagining an use case where we want to *search for cakes* instead of just clicking get cake button to get them. Our API supports for filtering by name, so we will do just that on client side. The flow will look like:
```js
// Input handlers to take input value for searching

// Only make an API request for searching after 0.5s since user stopped pressing a key

// Retry 3 times if an API request fails

// Cancel the search when press Esc or clear input

// Handling errors by showing an error alerts
```
Now, please take a seat and spend some times brainstorming how to implement this feature. In our normal way, we will use:
* Callback to handle each input `onChange` event
* Promise to make API request
* Having a variable to store the status of API request. And another one to store the amount of retrying when one request fails.
* Callback to handle ESC `keyup` event
* Another variable to decide if we makes API request. ESC `keyup` event or Input `onChange` event will mutate this variable to either `true` or `false`
* A wrapper `try-catch` or Promise `.then().catch()` to handle error

Hmmm..it is challenging isn't it? 🤔 What do you see from those? I see a tons of *side effects* and a tons of *nested callbacks* and another ton of *helper functions* which are very inclined to bring interesting bugs 🐛 to the program.

Let's see how we could use RxJS to solve this at ease while ceasing side effects and potential bugs:
```js
keyPressSources.pipe(
	// Input handlers to take input value for searching
	switchMap(value => {
		return from(fetchCakesByName(value)).pipe(
			// Only make an API request for searching after 0.5s since user stopped pressing a key
			debounce(0.5),
			// Retry 3 times if an API request fails
			retry(3),
			// Cancel the search when press Esc or clear input
			takeUntil(value => value === 'Esc' || value === ''),
			// Handling errors by showing an error alerts
			catchError(error => alert('Error in getting cakes'))
		)
	}),
)
```
This implementation in real life would be not as simple as this. Because we also need to actually create an input keypress stream. However, the logics in handling data should more or less similar. So, what can we takeaway from RxJS implementation:

✅ All keypress events are combined into *1 single stream*, so as all API requests

✅ Non-existence of state variables

✅ Declarative functions in which each one takes care of 1 specific operation

✅ Side-effects free

## Key takeaways
* RxJS treats all sources of events as data streams. It does not bother caring individual event. But rather combining all of them into 1 single stream.
* RxJS embraces functional programming principles including declarative and side-effects free functions. This helps our applications less prone for potential bugs
* RxJS brings code readability to the next level