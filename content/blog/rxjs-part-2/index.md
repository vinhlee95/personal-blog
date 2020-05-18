---
title: Reactive Programming with RxJS (Part 2)
date: "2019-11-10"
---

## Part 2: RxJS Creation operator
### RxJS Operators
One of the greatest feature of RxJS is its rich and powerful [operators](http://reactivex.io/rxjs/manual/overview.html#operators). They are methods/functions that *do not change existing [stream](https://javascript.tutorialhorizon.com/2017/04/28/rxjs-tutorial-getting-started-with-rxjs-and-streams/)* but *return a new one*. In other words, an operator is a [pure function](https://en.wikipedia.org/wiki/Pure_function) in which input is an [Observable](http://reactivex.io/rxjs/class/es6/Observable.js~Observable.html) and output is another Observable.

The notion and implementation of **pure functions** with specific, explicit *input*, *output* and *immutability* embrace [functional programming](https://en.wikipedia.org/wiki/Functional_programming) principles. This **declarative style** greatly reduces *side effects* and improve *code readability*. The [first part of this series](https://medium.com/shot-code/reactive-programming-with-rxjs-9a34d77e758) clarified those in great details 🕵️‍🤗

### Creation operators
RxJS operators are grouped based on their distinctive purposes. Its categories include: `creation, transformation, filtering, combination`, etc.

In a RxJS program, the first and foremost phase is to *create a stream*. RxJS [treats every data source as stream](https://medium.com/shot-code/reactive-programming-with-rxjs-9a34d77e758). Therefore, its *creation operators* allow us to create a data stream from almost everything. They include simple DOM events such as button clicks, input keypresses to more complicated data sources like Promises.

In this blog, I would like to introduce first two primary RxJS *creation* operators: `from, fromEvent, of, create` and more importantly, their *real-world usages*. Now, let's grab a cup of coffee ☕️ and dive into it 🕵️‍

### `create`
`create` is a *low-level machenisim* allowing us to create any Observable. It is the most generic and thus powerful among creation operators that we will dive in today.

#### Data source
`create` does not receive values as data source but *a list of events* called *function subscriptions*. These functions will instruct how values get emitted to observer.
```js
import { Observable } from 'rxjs'

const observable = Observable.create(subscriptionFn)
```

`create` essentially gives you complete control over the data source. But how? 🤔

By taking a look at the [official docs](reactivex.io/rxjs/class/es6/Observable.js~Observable.html#static-method-create), we could see that `create` accepts a parameter - a `onSubscription` function. This function accepts an observer and explicitly use `next`, `complete` and `error` to *emit a value, finish and throw an error* respectively when an observer subscribes to it.

Let's see how `create` controls the flow of data source in action:

```js
import { Observable } from 'rxjs'

const observable = new Observable(observer => {
	const array = [1,2,3,4,5]
	array.forEach(number => {
		if(!isOdd(number)) {
			observer.error('Invalid even number')
		}

		observer.next(number)
	})

	observer.complete()

	return () => cleanUp();
})

observable.subscribe(console.log) // 1, 'Invalid even number'
```

In above example, we *only emit odd numbers* to observers. Thanks to `next` function, every value that meets our condition gets distributed. Otherwise, an error is thrown by `error` method. Eventually, we call `complete` to notify observers that the observable has finished emitting and the process is done.

Note that after either `complete` or `error` is called, the observable will stop emitting and not doing anything else. This termination is called [Observable Contract](http://reactivex.io/rxjs/manual/overview.html#executing-observables).

#### Cleaning up before unsubscribing`
`onSubscription` parameter of `create` operator can optionally `return` function. By using this, we could clean up resources before unsubscribing from original observable.

#### Do you really need `create`?
The answer is not most of the time!

We already saw how powerful and flexible other creation operators are. Besides, RxJS also has a wide range of other operators for filtering, transforming, error handling...etc. Therefore, `create` is only necessary when you really need that level of control over the observable's data source.

### `from`
[`from`](https://rxjs.dev/api/index/function/from) operator turns [array](https://www.learnrxjs.io/operators/creation/from.html), Promise or iterable into an observable (stream). The closest real-world scenario would be to create an Observable from Promise. Let's create a strem from `getCakes` Promise via [Fetch API](https://developer.mozilla.org/en-US/docs/Web/API/FetchAPI)
```js
import {from} from 'rxjs/operators'

const fetchCakesPromise = fetch(getCakesEndpoint, {method: 'GET'}).then(res => res.data.cakes)

// Get cakes stream creation 🌈
const cakeSource = from(fetchCakesPromise)

// Subscribe cake data and consume received cakes 🍽
cakeSource.subscribe(console.log)
```
Now you might wonder: *Is it this simple?* Well, yes but no 🤗.

Lemme get this straight. It is simple once your mindset shifts to a *data-driven model*. Meaning your program does not really care about *where or how `fetchCakesPromise`  is call/executed*. All it pays attention to is there is a *stream of cakes* flows through and it need to distribute each value that the stream emits to its **subscribers**. As long as its **observer - subscriber** got their required data, the job is done successfully.

### `fromEvent`
[`fromEvent`](https://www.learnrxjs.io/operators/creation/fromevent.html) creates an Observable from events. One of the most simple implementation of `fromEvent` is to create a stream of `clicks` events. Let's see it in action 🖱
```js
import {fromEvent} from 'rxjs/operators'

const submitButton = document.getElementById('button-submit')

// Submit click stream creation 🕹
const submitClickSource = fromEvent(submitButton, 'click')

// Subcribe to this stream 🚶🏻‍
submitClickSource.subscribe(e => console.log('Click!'))
```
You can easily notice that `fromEvent` take first argument as a DOM node submit button. The second argument is essentially *name of the event*, which in our case is `click`.

From this simple example, it is difficult to understand why we need RxJS to handle this simple `click` event. However, things get more interesting when we do not stop at a one-operation-handler.

In RxJS, regardless of simple or complicated flow, we always treat data source as a stream. `fromEvent` is kind of a gateway for transforming pure DOM events into a stream. Only after that we could use other powerful RxJS operators to reshape and handle logics in the flow.

### `of`
[`of`](https://rxjs.dev/api/index/function/of) transforms *a list of values* into an observable sequence. Values as arguments could be a sequence of number, an object, an array. At this point, you might find `off` oddily similar to `from`. Let's dig out difference between them 🕵️‍♂️
```js
import {of, from} from 'rxjs'

// Let's use 1 source for creating 2 observables
const numberArray = [1, 2, 3]

const ofObservable = of(numberArray)
const fromObservable = from(numberArray)

// Log emitted values
ofObservable.subscribe(console.log) // [1,2,3]
fromObservable.subscribe(console.log) // 1,2,3
```
It did not take long for you to spot the difference didn't it? We could see that `of` does not *flattern* the source. Thus, it emits the whole value of `numberArray` at once. On the other side, `from` performs the flatterning of the array source. It therefore emits each value from `numberArray` one by one.

## Key takeaways
* `create` is a low-level Observable factory that gives total control over how values get emitted to observers
* `create` is overkilled in many situations. So it is worth considering the cost of complicating your API.
* `from` turns array, promise or iterable into an Observable
* `fromEvent` turns event into an Observable
* When we use either `from` or `fromEvent` to create a new stream. RxJS only cares about values that the stream produces, not each individual event.
* `of` transforms *a list of values* into an observable sequence. In comparision with `from`, `of` does not flattern the data source. Thus, it emits each argument *as a whole* instead of *one by one*

## Sources
* [create - Official docs](http://reactivex.io/rxjs/class/es6/Observable.js~Observable.html#static-method-create)
* [from - Official docs](https://rxjs.dev/api/index/function/from)
* [fromEvent - Official docs](https://rxjs.dev/api/index/function/fromEvent)
* [of - Official docs](https://rxjs.dev/api/index/function/fromEvent)
