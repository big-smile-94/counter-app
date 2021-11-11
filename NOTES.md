# Notes

## Keyword this

In JavaScript the keyword `this` can behave differently compare to other languages. Depending on how a function is called `this` can reference different objects. 

```
const person = {
  name: 'Hassan',
  greet() {
    console.log(`Hello ${this.name}`)
  }
}
```

If a function is called as part of a method in an object i.e. `person.greet()` and that method has a reference to `this` keyword. `this` in that function will always return a reference to that obj i.e. person in this case.

However, if that function is called as a stand alone function without an object reference e.g. `handleIncrement()` in the example below. Then `this` by default returns a reference to the window object, but if the `strict mode` is enabled `this` will return `undefined`. This is the reason we don't have acces to `this` when clicking on the increment button example below.   

```
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

```
constructor() {
  super(); // have to call the super() because extending Component
  this.handleIncrement = this.handleIncrement.bind(this);
}
```

#### Solution 2
We can use arrow function syntax to fix the same problem. As the arrow functions don't rebind `this` keyword, they inherit it.   
```
handleIncrement = () => {
  console.log('Increment Clicked', this.state.count);
}
```
