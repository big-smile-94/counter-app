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