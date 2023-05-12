# React Application Coding Standards and Best Practices

This document outlines the coding standards and best practices for Eclipton React application. Adhering to these guidelines will ensure that the code is consistent, readable, and maintainable across the entire team. Please follow the conventions detailed below for file naming, constants, functions, variables, components, enums, and other best practices.

## 1. File Naming Conventions

1. **Use PascalCase for component file names:** Component file names should use PascalCase (e.g., UserProfile.js).

2. **Use camelCase for non-component file names:** Non-component file names should use camelCase (e.g., apiRequests.js).

3. **Group related files in a folder:** Organize related files in a folder and use an index.js file to export the components (e.g., components/UserProfile/index.js)(Only for files that needs to be grouped).

### Example for Grouping

```javascript
// Example folder structure for related files
components / UserProfile / UserProfile.js;
UserProfileAvatar.js;
UserProfileInfo.js;
index.js;
```

## 2. Functions

1. **Use camelCase for function names:** Function names should use camelCase convention, where the first word is in lowercase and subsequent words are in uppercase. This makes the function names more readable and easier to understand.

```javascript
// Good function name
function calculateTotalAmount(price, quantity) {
  // implementation
}

// Bad function name
function calculatetotalamount(price, quantity) {
  // implementation
}
```

2. **Name functions based on their purpose:** The function name should reflect its purpose or the task it performs. For example, use `getUserName` instead of `getData`, or `filterCompletedTasks` instead of `filterData`.

```javascript
// Example function name
function getUserName(user) {
  return user.name;
}
```

3. **Prefix boolean functions with `is`, `has`, or `can`:** When a function returns a boolean value, prefix the name with words like `is`, `has`, or `can`. For example, use `isValidEmail`, `hasAccess`, or `canSubmitForm`.

```javascript
// Example boolean function name
function isValidEmail(email) {
  // ...
}
```

3. **Use consistent naming for event handlers:** For event handlers, use the `on` or `handle` prefixes followed by the event and the target element. For example, use `onSubmitButtonClick` or `handleInputChange`.

```javascript
// Example event handler function name
function handleSubmitButtonClick(event) {
  // ...
}
```

4. **Avoid too generic names:** Do not use overly generic names that lack context, such as `doSomething`, `process`, or `handler`.

```javascript
// Example bad function name
function process(data) {
  // ...
}
```

5. **Name asynchronous functions with `async` suffix:** To indicate that a function is asynchronous, append the word `async` to the function name. For example, use `fetchDataAsync` or `validateFormAsync`, And it is recommended to use await whenever your are handling promises  and catch the errors with try-catch block instead of then and catch.

```javascript
// Example asynchronous function name
async function fetchUserDataAsync(userId) {
  try {
    const response = await fetch(`https://api.example.com/users/${userId}`);
    if (!response.ok) {
      throw new Error("Failed to fetch user data");
    }
    const userData = await response.json();
    return userData;
  } catch (error) {
    console.error("Failed to fetch user data:", error);
    return null;
  }
}
```

## 3. Variables and State

1. **Name variables based on their content and use camelCase:** The variable name should reflect the data it holds. For example, use `completedTasks` instead of `array1`, or `userEmail` instead of `string1`.

```javascript
// Example variable name
const completedTasks = [
  /* ... */
];
```

2. **Use plural names for arrays or lists:** When naming arrays or lists, use plural nouns to indicate that the variable holds multiple items. For example, use `usernames` or `taskList`.

```javascript
// Example array variable name
const usernames = [
  /* ... */
];
```

3. **Use clear and concise names for Booleans:** For boolean variables, use a name that clearly indicates the true/false nature of the variable. For example, use `isLoading`, `isAuthenticated`, or `hasAccess`.

```javascript
// Example Boolean variable name
const isAuthenticated = false;
```

4. **Prefix global variables or constants with context:** If a variable or constant is globally accessible, prefix it with a context to avoid naming conflicts. For example, use `APP_API_URL` or `REACT_APP_AUTH_SECRET`.

```javascript
// Example global constant with context prefix
const APP_API_URL = "https://api.example.com";
```

5. **Name iterators and loop indices meaningfully:** Instead of using generic names like `i`, `j`, or `k` for iterators or loop indices, use meaningful names. For example, use `taskIndex` or `userIdx`.

```javascript
// Example iterator variable name
for (let taskIndex = 0; taskIndex < tasks.length; taskIndex++) {
  // ...
}

const numbers = [1, 2, 3, 4, 5];

const numberStrings = numbers.map((number, index) => {
  return `Number ${index + 1}: ${number}`;
});
```

## 4. Constants

- Use UPPERCASE_SNAKE_CASE for constant variable names (e.g., const API_URL = "https://api.example.com").

- Group related constants in a single constants.js file (e.g., src/constants.js).

### 4.1. Enums

- Declare enums as objects in the constants.js file.

- Use PascalCase for enum names.

- Use UPPERCASE_SNAKE_CASE for enum keys.

#### Example:

```javascript
// src/constants.js

export const UserRole = {
  ADMIN: "admin",
  USER: "user",
  GUEST: "guest",
};

export const FriendRequestActionType = {
  ADD: "add",
  CANCEL: "cancel",
  ACCEPT: "accept",
  REJECT: "reject",
  PENDING: "pending",
};
```

## 5. React Components

1. **Use PascalCase for component names:** Component names should use PascalCase (e.g., UserProfile).

2. **Use functional components with React hooks:** Prefer functional components and React hooks over class components.

3. **Break down large components into smaller, reusable components:** Divide complex components into smaller, reusable parts for better maintainability.

4. **Export components as the default export:** When exporting a single component from a file, use the default export (e.g., `export default UserProfile`).

#### Example:

```javascript
import React from "react";

const UserProfile = ({ name, email }) => {
  return (
    <div>
      <h2>{name}</h2>
      <p>{email}</p>
    </div>
  );
};

export default UserProfile;
```

```javascript
// Example functional component with props
import React from "react";
import PropTypes from "prop-types";

const UserProfile = ({ name, email }) => {
  return (
    <div>
      <h2>{name}</h2>
      <p>{email}</p>
    </div>
  );
};

UserProfile.propTypes = {
  name: PropTypes.string.isRequired,
  email: PropTypes.string.isRequired,
};

export default UserProfile;
```


## 6. Other Best Practices

- It is recomended to use funtional components for any new components.
- Use PropTypes to validate component props(optional).
- Use the useState and useEffect hooks for state management and side effects.
- Use the useReducer hook for complex state management.
- Use a consistent code formatting tool (e.g., Prettier) to enforce coding style across the team.
- Write modular and reusable code.
- Add comments to explain complex logic or decisions.
- Keep dependencies up to date.

# Styling

When writing SCSS, make sure that what you are adding does not affect other elements in the application. Since React does not have built-in style isolation, styles defined in SCSS files can have a global scope by default. To prevent unintended style conflicts and overrides, it is important to follow these guidelines:

1. **Avoid global styles:** Be cautious about adding styles with global scope. In React applications, styles defined in SCSS files can affect the entire app if not properly contained. It is recommended to avoid global styles as much as possible.

2. **Wrap styles in a parent class:** To prevent unintended style overrides and conflicts, wrap your component's styles within a parent class. Add a unique class name to the top-level element of the component and use it as a selector for the component's styles.

   ```scss
   // Example of wrapping styles in a parent class
   .parentClass {
     /* Component-specific styles */
   }
3. **Avoid using global selectors:** It is crucial to avoid using global selectors like `body`, `html`, or `*` in your SCSS files. Global selectors can unintentionally affect other components and lead to unexpected style changes. Instead, scope your styles to the specific component or module.

4.**Follow naming conventions:** Adhere to consistent naming conventions for classes, variables, and mixins in your SCSS files. Consistent naming promotes clarity, readability, and maintainability of the stylesheets. Consider using BEM (Block, Element, Modifier) or a similar naming convention for improved organization.

## Naming Conventions for Class Names and IDs

Consistent and meaningful naming conventions for class names and IDs in your HTML and CSS help improve the maintainability and clarity of your code. Consider the following conventions:

- Use lowercase letters and hyphens for class names: Use lowercase letters and hyphens to separate words in class names. This convention, also known as kebab case, promotes readability and consistency.

  ```html
  <div class="my-component"></div>
  ```
- Use lowercase letters and underscores for IDs: Similar to class names, use lowercase letters and underscores to separate words in IDs. This convention, known as snake case, helps differentiate IDs from class names.
 ```html
  <div class="my_component"></div>
  ```
# Committing to Git, Resolving ESLint Issues, and Git Pre-Commit Hook

When committing your code to Git, it's important to ensure that you resolve any ESLint issues before making the commit. This practice helps maintain code quality and avoids burdening other developers with fixing your issues later. Follow these guidelines when dealing with ESLint issues and Git pre-commit hooks:

1. **Run `npm run lint` to check for lint issues:** Before making a commit, run the command `npm run lint` to check your code for any ESLint issues. This command will analyze your code and report any violations of the established linting rules and coding standards.

2. **Resolve ESLint issues reported by `npm run lint`:** If the `npm run lint` command reports any ESLint issues, carefully review the reported problems and fix them in your code. Take the necessary steps to address the reported issues, such as adjusting coding style, refactoring code, or addressing potential bugs or vulnerabilities.

3. **Ensure resolved issues are verified:** After making the necessary changes to address the ESLint issues, re-run `npm run lint` to ensure that the reported problems are resolved. Verify that the command executes without any reported issues or violations.

4. **Commit only after resolving ESLint issues:** Once you have resolved all the ESLint issues and verified the changes, proceed with making the commit. By committing code that has resolved ESLint issues, you contribute to maintaining a high level of code quality and readability.

5. **Git pre-commit hook:** A Git pre-commit hook has been implemented to prevent bad code from being committed. This hook runs automatically before each commit and checks for any issues that violate the established coding standards and best practices.

6. **Fix issues instead of bypassing them:** If the pre-commit hook fails due to detected issues, do not force the commit or disable ESLint to bypass the problem. Instead, review the reported issues and make the necessary fixes in your code. This ensures that the code adheres to the coding standards and maintains high quality.

7. **Contact for assistance:** If you encounter difficulties or need guidance in fixing the reported issues, feel free to reach out to Manikanta at **manikanta@blockoville.com**. He is available to provide assistance and support, helping you overcome any challenges you may face during the code review process.

By following these guidelines and taking the necessary steps to fix reported issues, you contribute to maintaining a clean and high-quality codebase. Your attention to detail and commitment to resolving problems ensure that the code remains consistent, readable, and maintainable.

Please make sure to follow these guidelines and best practices when working on the this project. If you have any questions or need clarification, don't hesitate to ask at **manikanta@blockoville.com**