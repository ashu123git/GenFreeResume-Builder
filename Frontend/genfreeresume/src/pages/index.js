// This index.js file is only used to import its respective jsx files. For example it's respective jsx file is Authscreen.jsx and HomeScreen so let's say if there were 5 .jsx files then to import those files into our main js file, we have to import all one by one but now since we are importing all these jsx file into this index file. So now we have to import only this js file into our main js file.
export { default as AuthScreen } from "./AuthScreen";
export { default as HomeScreen } from "./HomeScreen";
