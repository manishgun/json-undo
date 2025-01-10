# JSON Undo

`JSON Undo` is a lightweight library for tracking changes in JSON objects with undo and redo functionality. It is designed for memory-sensitive applications by efficiently managing changes without duplicating entire objects.

## Installation

```bash
npm install json-undo
```

## Usage

### Example 1: Basic Usage with Undo and Redo

```javascript
const JSONChangesTracker = require('json-undo');

const original = { name: "Alice", age: 25 };
const tracker = new JSONChangesTracker(original);

console.log(tracker.get()); 
// Output: { name: "Alice", age: 25 }

original.name = "Bob"; 
tracker.update(original); 

console.log(tracker.get()); 
// Output: { name: "Bob", age: 25 }

original.age = 26; 
tracker.update(original);

console.log(tracker.get()); 
// Output: { name: "Bob", age: 26 }

// Undo the last change
tracker.undo();
console.log(tracker.get()); 
// Output: { name: "Bob", age: 25 }

// Redo the undone change
tracker.redo();
console.log(tracker.get()); 
// Output: { name: "Bob", age: 26 }
```

### Example 2: Complex JSON Object with Nested Changes

```javascript
const JSONChangesTracker = require('json-undo');

const original = { 
  user: { name: "Charlie", details: { age: 30, city: "New York" } }, 
  active: true 
};

const tracker = new JSONChangesTracker(original);

console.log(tracker.get()); 
// Output: { user: { name: "Charlie", details: { age: 30, city: "New York" } }, active: true }

original.user.name = "David"; 
tracker.update(original);

console.log(tracker.get()); 
// Output: { user: { name: "David", details: { age: 30, city: "New York" } }, active: true }

original.user.details.city = "San Francisco"; 
tracker.update(original);

console.log(tracker.get()); 
// Output: { user: { name: "David", details: { age: 30, city: "San Francisco" } }, active: true }

original.active = false; 
tracker.update(original);

console.log(tracker.get()); 
// Output: { user: { name: "David", details: { age: 30, city: "San Francisco" } }, active: false }

// Undo all changes
tracker.undo();
console.log(tracker.get()); 
// Output: { user: { name: "David", details: { age: 30, city: "New York" } }, active: true }

tracker.undo();
console.log(tracker.get()); 
// Output: { user: { name: "Charlie", details: { age: 30, city: "New York" } }, active: true }

// Redo the last undo
tracker.redo();
console.log(tracker.get()); 
// Output: { user: { name: "David", details: { age: 30, city: "New York" } }, active: true }

tracker.redo();
console.log(tracker.get()); 
// Output: { user: { name: "David", details: { age: 30, city: "San Francisco" } }, active: true }
```

### Example 3: Checking if Undo/Redo is Possible

```javascript
const JSONChangesTracker = require('json-undo');

const original = { item: "Laptop", price: 1000 };
const tracker = new JSONChangesTracker(original);

console.log(tracker.canUndo()); // Output: false (No changes yet)
console.log(tracker.canRedo()); // Output: false (No undone changes)

original.price = 1200; 
tracker.update(original);
console.log(tracker.get()); // Output: { item: "Laptop", price: 1200 }

console.log(tracker.canUndo()); // Output: true (Undo possible)
console.log(tracker.canRedo()); // Output: false (No redo yet)

tracker.undo();
console.log(tracker.get()); // Output: { item: "Laptop", price: 1000 }

console.log(tracker.canUndo()); // Output: false (No more undo)
console.log(tracker.canRedo()); // Output: true (Redo possible)

tracker.redo();
console.log(tracker.get()); // Output: { item: "Laptop", price: 1200 }
```

## Features

- Track JSON object changes.
- Undo and redo functionality.
- Memory-efficient change tracking.
- Suitable for large objects.

## API

### `new JSONChangesTracker(initialJson: object)`

Creates an instance of `JSONChangesTracker`.

### `update(updatedJson: object)`

Tracks the changes in the provided JSON object.

### `undo(): object`

Reverts the JSON object to the previous state.

### `redo(): object`

Restores the JSON object to the state before the undo.

### `get(): object`

Returns the current state of the JSON object.

### `canUndo(): boolean`

Returns `true` if there is a history of changes to undo.

### `canRedo(): boolean`

Returns `true` if there are undone changes to redo.

## License

This project is licensed under the MIT License.

## Author

**Manish Gun**  
- [GitHub](https://github.com/manishgun)  
- [Website](https://manishgun.com)
