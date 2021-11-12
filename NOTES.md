- [Notes](#notes)
  * [Raising and Handling Events](#raising-and-handling-events)
  * [Controlled Components](#controlled-components)
  * [Keyword this](#keyword-this)
    + [Solution 1](#solution-1)
      - [Solution 2](#solution-2)
  * [Correct way to modify state for array of counters (increment)](#correct-way-to-modify-state-for-array-of-counters--increment-)
    + [Solution](#solution)

<small><i><a href='http://ecotrust-canada.github.io/markdown-toc/'>Table of contents generated with markdown-toc</a></i></small>


# Notes

# Setting state 
In React we do not modify the state directly. In other words we don't write code like the following to update the state. 

```javascript
 handleIncrement = () => {
    this.state.count++;
}
``` 
The above will not update the state. Technically, the value of the count property is being incremented but React is not aware of it. That's why it will not update the view. To solve this issue we will need to use one of the method that we inherit from the base component in React i.e. setState(). When we call this.setState we tell React that we're updating the state and it will figure out what part of the sate has changed and based on that it will bring the DOM in sync with the virtual DOM. 

`this.setState()` is telling React that the state of this component is going to change. React will then schedule a call to the render method. So sometime in the future, this method is going to be called, we don't know when, this is an asynchronous call which means it's going to happen in the future. It may happen 5 or 10 milliseconds later, we don't know. So at somepoint in the future the render method is going to be called. The render method as can be seen below returns a new React element i.e. the `div` and it's children i.e. the `span` and `button`. So our virtual DOM is a tree of three elements as can be seen in the diagram. React will put the new virtual DOM tree and old virtual DOM tree side by side and compare them to figure out what elements in a virtual DOM are modified, In this case it realises that our `span` is modified because it is where we have used count property. React will react out to the real browser DOM, and update the corresponding span so it matches the one we have in the virtual DOM (new one after counter is incremented). No where else in the DOM is updated only that span element.

![Virtual DOM - What happens when state changes](/public/virtualDOM-WhatHappensWhenStateChanges.png)

```javascript
class Counter extends Component {
  state = {
    count: 0
  }
  //... reset of the code
  
  handleIncrement = () => {
    this.setState({ count: this.state.count + 1 })
  }

  render() {
    return (
      <div>
        <span className={this.getBadgeClasses()}>{this.formatCount()}</span>
        <button
          onClick={this.handleIncrement)}
          className="btn btn-secondary btn-sm"
        >
          Increment
        </button>
      </div>
    );
}
```


## Raising and Handling Events
The component that owns a piece of the state, should be the one modifying it. An example of this is how `Counters` component updates the state and only passes data via props to the `Counter` components. 

The two classes below shows how the `Counter` compoent raises different events such as `onDelete`, `onIncrement` and `onClick` and the `Counters` components handling those events by having `handleDelete`, `handleIncrement` and `handleReset`.

Wrapper for `Counter` components handling events

```javascript
class Counters extends Component {
  state = {
    counters: [
      { id: 1, value: 4 },
      { id: 2, value: 0 },
      { id: 3, value: 0 },
      { id: 4, value: 0 },
    ],
  };

  handleIncrement = (counter) => {
    const counters = [...this.state.counters];
    const index = counters.indexOf(counter);
    counters[index] = { ...counter };
    counters[index].value++;
    this.setState({ counters });
  };

  handleDelete = (counter) => {
    const counters = this.state.counters.filter((c) => c.id !== counter.id);
    this.setState({ counters });
  };

  handleReset = () => {
    const counters = this.state.counters.map((c) => {
      c.value = 0;
      return c;
    });
    this.setState({ counters });
  };

  render() {
    return (
      <>
        <button
          onClick={this.handleReset}
          className="btn btn-primary btn-sm m-2"
        >
          Reset
        </button>
        {this.state.counters.map((counter) => (
          <Counter
            key={counter.id}
            counter={counter}
            onIncrement={this.handleIncrement}
            onDelete={this.handleDelete}
          />
        ))}
      </>
    );
  }
```
`Counter` component raising events

```javascript
class Counter extends Component {
  formatCount() {
    const { value } = this.props.counter;
    return value === 0 ? 'Zero' : value;
  }

  render() {
    const { counter, onDelete, onIncrement } = this.props;
    return (
      <div>
        <span className={this.getBadgeClasses()}>{this.formatCount()}</span>
        <button
          onClick={() => onIncrement(counter)}
          className="btn btn-secondary btn-sm"
        >
          Increment
        </button>
        <button
          onClick={() => onDelete(counter)}
          className="btn btn-danger btn-sm m-2"
        >
          Delete
        </button>
      </div>
    );
  }

  getBadgeClasses() {
    let classes = 'badge m-2 badge-';
    return (classes += this.props.counter.value === 0 ? 'warning' : 'primary');
  }
}
```
![Raising and Handling events](/public/raisingAndHandlingEvents.png)
## Controlled Components 
A controlled components is a component which has no state and receives all its data through props and raises events whenenver data needs to be changed. So, the component is entirely controlled by it's parent. An example of this is the `Counter` component.

![Controlled component diagram](/public/controlledComponent.png)
## Keyword this

In JavaScript the keyword `this` can behave differently compare to other languages. Depending on how a function is called `this` can reference different objects. 

```javascript
const person = {
  name: 'Hassan',
  greet() {
    console.log(`Hello ${this.name}`)
  }
}
```

If a function is called as part of a method in an object i.e. `person.greet()` and that method has a reference to `this` keyword. `this` in that function will always return a reference to that obj i.e. person in this case.

However, if that function is called as a stand alone function without an object reference e.g. `handleIncrement()` in the example below. Then `this` by default returns a reference to the window object, but if the `strict mode` is enabled `this` will return `undefined`. This is the reason we don't have acces to `this` when clicking on the increment button example below.   

```javascript
// Throws an exception: Cannot read properties of undefined (reading 'state') because of this.state.cound in the handleIncrement()
class Counter extends Component {
  state = {
    count: 0,
  };

  handleIncrement() {
    console.log('Increment Clicked', this.state.count);
  }

  render() {
    return (
      <>
        <button onClick={this.handleIncrement}>
          Increment
        </button>
      </>
    );
  }
}
```

There are a few solutions to overcome this problem. 

### Solution 1
We can use the `bind` function in the constructor of the Counter class. The bind function will return a new instance of `handleIncrement` and in that function `this` is always referencing the current object i.e. Counter. No matter how the fucntion is then called it `this` will always reference the Counter object/class.

```javascript
constructor() {
  super(); // have to call the super() because extending Component
  this.handleIncrement = this.handleIncrement.bind(this);
}
```

#### Solution 2
We can use arrow function syntax to fix the same problem. As the arrow functions don't rebind `this` keyword, they inherit it.   
```javascript
handleIncrement = () => {
  console.log('Increment Clicked', this.state.count);
}
```
## Correct way to modify state for array of counters (increment) 

If we try the following way to clone the list of counters and then update the value of any of the counters (when the increment button is pressed). It will actually modify the main counters object within the state. The reason for this is because the new cloned counters array has the exact same objects as the state counters array i.e. both references the same objects. Hence, modifying any of the objects in the new cloned array effects the state counters object. Therefore, we end up modifying the state directly and this is a no no in React.
```javascript
state = {
    counters: [
      { id: 1, value: 4 },
      { id: 2, value: 0 },
      { id: 3, value: 0 },
      { id: 4, value: 0 },
    ],
  };

  handleIncrement = (counter) => {
    const counters = [...this.state.counters];
    counters[0].value++;
    console.log(this.state.counters[0]);
  };
``` 
To solve the above problem, we will need to clone the counter object at the given location, so we will have a different object than the one in the state. We don't need to clone the other counter objects as we need that particular one which is being incremented.

The counter object is being passed to the handleIncrement when the Increment button is clicked.
### Solution
```javascript
state = {
    counters: [
      { id: 1, value: 4 },
      { id: 2, value: 0 },
      { id: 3, value: 0 },
      { id: 4, value: 0 },
    ],
  };

  handleIncrement = (counter) => {
    const counters = [...this.state.counters];
    const index = counters.indexOf(counter)
    counters[index] = {...counter}
    counters[index].value++;
    this.setState({ counters })
  };
``` 

## Multiple Components in Sync 

Below is the component tree diagram of the Counter App at this point. However, a new requirement came to show the number of counters in the `NavBar` component.

Earlier we passed the state of the counters component, to the counter component via props. That's because we have a parent and clild relationship between these two components. But as can be seen there is there is no parent child relationship between the counters component and navbar component. 

### Problem 
How can we display the total number of counters on our navigation bar? 

![Old Counter App component tree diagram](/public/multipleComponentsInSync1.png)

### Solution 
In situation like the one above when there is no parent child relationship between the two components, and we want to keep them in sync, you want to share the data between them. You will need to lift the state up. So, in this case we want to lift the state of the counters component to it's parent which is the App component. Now both the `Counters` and `NavBar` components will have the same parent, this is where we have the state so we pass it to all the children using props.

We will have to move the state i.e. the counters and all the functions that modify the state to the parent App component from Counters component.
![New Counter App component tree diagram](/public/multipleComponentsInSync2.png)

## Lifecycle Hooks 
The components goes through different phases during their lifecycle. The first phase is the `Mounting` phase. and this is when an instance of a component is created and inserted into the DOM (Document Object Model). There are a few special method that we can add to our components and React will automatically call these methods. We refer to these methods as lifecycle hooks as they allow us to hook into certain moments during the lifecycle of a component and do something.

React will call these functions in order in each phase. 

There are more lifecycle hooks but these are the one which are commonly used.

![React Lifecycle Hooks diagram](/public/lifecycleHooks.png)

### 1. Mount
  #### Constructor
  Constructor is called only once when an instance of a class is created. This is where you can initialise the default state to the properties received in props from the outside. We can't use `this.setState()` to initialise the state.    

  ```javascript
    constructor(props) {
      super(props);
      console.log('App - Constructor', this.props);
      this.state = this.props.something;
    }
  ```
  #### Render
  Render basically returns a react element that represents our virtual DOM. Then React gets that virtual DOM and render it in the actual browser DOM and then our component is mounted. So When a component is mounted that means the component is in the DOM. When a component is rendered all it's children are also rendered recursively in order i.e. the following will be the order in which all the components are rendered. 

  ![React Lifecycle Hooks proof diagram](/public/lifecycleHooksProof.png)

  ```javascript
  render() {
      console.log('App - Rendered');
  }
  ```
  #### componentDidMount
  componentDidMount is called after our component is rendered into the actual browser DOM. Basically this lifecycle hook is called when a component is mounted that means the component is in the actual browser DOM and not the Virtual React DOM. It's a perfect place to make AJAX/api calls to get data from server. 
     
  ```javascript
  componentDidMount() {
    console.log('App - Mounted');
  }
  ```


### 2. Update 
This happens whenever the state or the props of a component changes.

As an example we can look at the increment button which updates the state of the App component (by using setState). So the setState will schedule a call to the render method so our app is going to be rendered which means all it's children are going to be rendered as well. When we click on the increment button our entire component tree is rendered (this does not mean the entire DOM is updated). When a cmponent is rendered, we basically get a React element, so that is updating our virtual DOM. React will then look at the virtual DOM, it also has a copy of the old virtual DOM, that's why we should not update the state directly, so we can have two different object references in memory. We have the old virtual DOM as well as the new virtual DOM. Then React will figure out what has changed, and based on that it will update the real DOM accordingly. Even though we have several counters in this App when we click on an increment button only the span which contains the counts is updated. Nothing else will be updated. (Can look into the broswer console window to see which element updates)

componentDidUpdate method is called after a component is updated. Which means we have new state or new props, so we can compare this new state with the old state or the new props with the old props. If there is a change we can make an AJAX/api call to get new data from the server. If there are no changes perhaps we don't want to make an additional AJAX request, this is an optimisation technique. componentDidUpdate(preProps, prevState) can be logged to see the old and the new props/state when we click on the increment button. 


```javascript
//App.jsx
handleIncrement = (counter) => {
  ...
  this.setState({ counters });
};

// Counter.jsx
componentDidUpdate(prevProps, prevState) {
  console.log('prevProps', prevProps);
  console.log('prevState', prevState);

  // prevProps counter vlaue is different from the current props counter value 
  // we can make an ajax call and get the new data 
  // else don't make any request i.e. we can decide
  if (prevProps.counter.value !== this.props.counter.value) {
    // Ajax call to the server to get new data from the server
  }
}
```
### 3. Unmount 
When a component is removed from the DOM i.e. deleting a counter.
The componentWillUnmount method is called just before a component is removed from the DOM. 

When we delete a counter we will be able to see the unmount message in the console. As a result of deleting the counter, the state of the App component is changed. So, our entire component is re rendered, i.e. we endup with `app -> navbar/counters -> 3x counter`. We have a new virtual DOM which has one less counter. React will compare this new Virtual DOM with the old one, it figures out that one of the counter is removed, so then it will call the componentWillUnmount <strong>before<strong> removing the (deleted) counter from the actual DOM. 

This gives us an oppurtunity to do any kind of cleanup such as if we have setup timers, or listeners, we can clean those up before this component is removed from the DOM. Otherwise, we'll end up with memory leaks.

```javascript
//counter.jsx
componentWillUnmount() {
  console.log('Counter - Unmounted');
}
```



